const Ticket = require("../models/Ticket");
const TicketPool = require("./TicketPool");
const amqp = require("amqplib");
const express = require("express");

// configuration of RabbitMQ
const rabbitMQUrl = "amqp://localhost";

// Create a queue for ticket-related tasks (Producer-Consumer Pattern)
let channel, connection;

// Object to hold active simulations by ticketId
const simulations = {};

// Utility function to establish RabbitMQ connection
const establishRabbitMQConnection = async () => {
    try {
        const conn = await amqp.connect(rabbitMQUrl);
        const ch = await conn.createChannel();
        await ch.assertQueue("ticket-retrieval-queue", { durable: true });
        return { conn, ch };
    } catch (error) {
        throw new Error(`Failed to connect to RabbitMQ: ${error.message}`);
    }
};

// Connect to RabbitMQ
async function connectRabbitMQ() {
    try {
        ({ conn: connection, ch: channel } = await establishRabbitMQConnection());
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error(error.message);
    }
}

// Job processor function for ticket retrieval (Consumer)
const processTicketRetrieval = async () => {
    try {
        channel.consume("ticket-retrieval-queue", async (msg) => {
            const { ticketId, quantity } = JSON.parse(msg.content.toString());

            console.log(`Processing ticket retrieval for ticketId: ${ticketId}, quantity: ${quantity}`);

            try {
                // Retrieve the ticket and check availability
                const ticket = await Ticket.findById(ticketId);
                if (!ticket) {
                    throw new Error("Ticket not found");
                }

                // Ensure there are enough tickets available
                if (ticket.totalTickets < quantity) {
                    throw new Error("Not enough tickets available");
                }

                // Deduct tickets from the total available
                ticket.totalTickets -= quantity;
                await ticket.save();

                console.log(`Successfully processed ticket retrieval for ${quantity} tickets.`);
                channel.ack(msg); // Acknowledge the message
            } catch (error) {
                console.error("Error processing ticket retrieval:", error.message);
                channel.nack(msg); // Negative acknowledgment in case of failure
            }
        }, { noAck: false });
    } catch (error) {
        console.error("Error in ticket processing:", error.message);
    }
};


// Controller for creating a ticket (Producer)
const createTicket = async (req, res) => {
    const { vendor, title, description, totalTickets, ticketReleaseRate, customerRetrievalRate, maxTicketCapacity, price, imageUrl } = req.body;

    try {
        // Create a new ticket in the database (Producer's job)
        const ticket = await Ticket.create({ vendor, title, description, totalTickets, ticketReleaseRate, customerRetrievalRate, maxTicketCapacity, price, imageUrl });

        // Respond with the created ticket
        res.status(201).json(ticket);
    } catch (error) {
        // Handle errors and send an appropriate response
        res.status(500).json({ error: error.message });
    }
};


// Controller for getting all tickets
const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();  // Fetch all tickets from the database
        if (!tickets.length) {
            return res.status(404).json({ error: "No tickets found" });
        }
        res.status(200).json(tickets);  // Respond with the tickets
    } catch (error) {
        res.status(500).json({ error: error.message });  // Handle any server errors
    }
};


// Controller for ticket retrieval (Asynchronous Consumer processing through RabbitMQ)
const retrieveTickets = async (req, res) => {
    const { ticketId, quantity } = req.body;

    // Validate input
    if (!ticketId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Invalid input data. Ticket ID and quantity are required, and quantity must be greater than 0." });
    }

    try {
        // Prepare job data to be sent to the RabbitMQ queue
        const jobData = { ticketId, quantity };

        // Send the job to the RabbitMQ queue for processing by the Consumer
        channel.sendToQueue("ticket-retrieval-queue", Buffer.from(JSON.stringify(jobData)), {
            persistent: true,  // Ensure the message is not lost if RabbitMQ crashes
        });

        return res.status(200).json({
            success: true,
            message: `Ticket retrieval job for ${quantity} tickets added to the queue for ticket ID ${ticketId}.`,
        });
    } catch (error) {
        console.error("Error while adding job to queue:", error.message);  // Log detailed error message
        return res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
    }
};



const startSimulation = async (req, res) => {
    const { ticketId } = req.body;

    if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }

    try {
        // Find the ticket by ID
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        // Create the ticket pool for the found ticket
        const ticketPool = new TicketPool(
            ticket.vendor,
            ticket.maxTicketCapacity,
            ticket.totalTickets,
            ticket.ticketReleaseRate,
            ticket.customerRetrievalRate,
            ticket.title
        );

        // Add the total number of tickets to the pool
        ticketPool.addTickets(ticket.totalTickets);

        // Save reference to the active simulation
        simulations[ticket._id.toString()] = ticketPool;

        console.log(`Simulation started for ticketId: ${ticket._id}`);

        // Respond to the client that the simulation has started
        res.status(200).json({
            success: true,
            message: `Simulation started for ticketId: ${ticket._id}`,
        });
    } catch (error) {
        console.error("Error starting simulation:", error.message); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while starting the simulation. Please try again later." });
    }
};


const stopSimulation = async (req, res) => {
    const { ticketId } = req.body;

    if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }

    try {
        // Ensure ticketId is a string for comparison
        const ticketPool = simulations[ticketId.toString()];

        if (ticketPool) {
            // Stop the active simulation
            ticketPool.interruptSimulation();

            // Remove the simulation reference from the active simulations
            delete simulations[ticketId.toString()];

            console.log(`Simulation for ticket ${ticketId} stopped.`); // Log the stop action
            res.status(200).json({
                success: true,
                message: `Simulation for ticket ${ticketId} stopped successfully.`,
            });
        } else {
            // Simulation not found
            res.status(404).json({
                error: `No active simulation found for ticket ${ticketId}.`,
            });
        }
    } catch (error) {
        console.error("Error stopping simulation:", error.message); // Log the error for debugging
        res.status(500).json({
            error: "An error occurred while stopping the simulation. Please try again later.",
        });
    }
};


// Controller for retrieving all ticket logs (not specific ticketId)
const getAllTicketLogs = async (req, res) => {
    try {
        // Check if there are any active simulations
        if (Object.keys(simulations).length === 0) {
            return res.status(404).json({ error: "No active ticket simulations found." });
        }

        // Collect logs from all active simulations
        let allLogs = [];

        for (const ticketId in simulations) {
            const ticketPool = simulations[ticketId];
            const logs = ticketPool.getLogs(); // Retrieve logs from each simulation
            allLogs = allLogs.concat(logs); // Combine all logs into a single array
        }

        // Return the collected logs
        if (allLogs.length > 0) {
            res.status(200).json({ logs: allLogs });
        } else {
            res.status(404).json({ error: "No logs available." });
        }
    } catch (error) {
        console.error("Error retrieving ticket logs:", error.message); // Log error for debugging
        res.status(500).json({ error: "An error occurred while retrieving logs." });
    }
};


// Controller for getting a ticket by ticketId
const getTicketById = async (req, res) => {
    const { ticketId } = req.params;  // Get the ticketId from URL parameters

    try {
        // Attempt to find the ticket by ID
        const ticket = await Ticket.findById(ticketId);

        // Handle case where ticket is not found
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        // Return the ticket if found
        res.status(200).json(ticket);
    } catch (error) {
        // Handle errors such as invalid ticketId format or database issues
        res.status(500).json({ error: "An error occurred while fetching the ticket" });
    }
};

// Controller for updating a ticket by ticketId
const updateTicket = async (req, res) => {
    const { ticketId } = req.params;  // Extract ticketId from URL parameters
    const updateData = req.body;      // Extract update data from request body

    try {
        // Attempt to find and update the ticket by ticketId
        const ticket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
            new: true,        // Return the updated ticket
            runValidators: true, // Run validation on the update
        });

        // Handle case when ticket is not found
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        // Return the updated ticket details on success
        res.status(200).json({
            success: true,
            message: "Ticket updated successfully.",
            ticket,
        });
    } catch (error) {
        // Handle unexpected errors, such as invalid data or database issues
        res.status(500).json({ error: "An error occurred while updating the ticket" });
    }
};



// Controller for deleting a ticket by ticketId
const deleteTicket = async (req, res) => {
    const { ticketId } = req.params;  // Extract ticketId from URL parameters

    try {
        // Attempt to find and delete the ticket by ticketId
        const ticket = await Ticket.findByIdAndDelete(ticketId);

        // Handle case when ticket is not found
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        // Return success message when ticket is deleted
        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully.",
        });
    } catch (error) {
        // Handle unexpected errors, such as database issues
        res.status(500).json({ error: "An error occurred while deleting the ticket" });
    }
};


// Initialize the RabbitMQ connection and start processing
connectRabbitMQ().then(() => processTicketRetrieval());

module.exports = {
    createTicket,
    getTickets,
    retrieveTickets,
    startSimulation,
    stopSimulation,
    getAllTicketLogs,
    getTicketById,
    updateTicket,
    deleteTicket
};
