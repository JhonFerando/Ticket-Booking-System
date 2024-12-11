const Ticket = require("../models/Ticket");
const fs = require("fs/promises");
const path = require("path");
const TicketPool = require("./TicketPool");
const amqp = require("amqplib");
const express = require("express");
const mongoose = require("mongoose");

// Object to hold active simulations by ticketId
const simulations = {};


// Controller for creating a ticket (Producer)
const createTicket = async (req, res) => {
    const { vendor, title, description, totalTickets, ticketReleaseRate, customerRetrievalRate, maxTicketCapacity, price, imageUrl, releaseInterval, retrievalInterval  } = req.body;

    try {
        // Create a new ticket in the database (Producer's job)
        const ticket = await Ticket.create({ vendor, title, description, totalTickets, ticketReleaseRate, customerRetrievalRate, maxTicketCapacity, price, imageUrl, releaseInterval, retrievalInterval  });

        // Respond with the created ticket
        res.status(201).json(ticket);
    } catch (error) {
        // Handle errors and send an appropriate response
        res.status(500).json({ error: error.message });
    }
};

const getTickets = async (req, res) => {
    try {
        // Fetch tickets from the database
        const ticketsFromDb = await Ticket.find();

        // Fetch tickets from the JSON file
        const filePath = path.join(__dirname, "../Configurations/ticket-configurations.json");
        const fileData = await fs.readFile(filePath, "utf-8");
        const ticketsFromFile = JSON.parse(fileData);

        // Create a list of existing eventTicketIds from the database
        const existingTicketVendors = ticketsFromDb.map(ticket => ticket.vendor);

        // Filter tickets that are not already in the database
        const newTickets = ticketsFromFile.filter(ticket => !existingTicketVendors.includes(ticket.vendor));

        if (newTickets.length > 0) {
            // Insert new tickets into the database
            await Ticket.insertMany(newTickets);
        }

        // Fetch updated tickets from the database after insertion
        const updatedTicketsFromDb = await Ticket.find();

        // Respond with all tickets
        res.status(200).json(updatedTicketsFromDb);
    } catch (error) {
        console.error("Error in getTickets:", error.message);
        res.status(500).json({ error: error.message });
    }
};



const startSimulation = async (req, res) => {
    let { ticketId } = req.body;

    if (!ticketId) {
        return res.status(400).json({ error: "Ticket ID is required" });
    }

    try {
        // Convert ticketId to a string for consistent handling
        ticketId = ticketId.toString();

        let ticket;

        // Check if the ticketId is a valid ObjectId and try fetching from MongoDB
        if (mongoose.Types.ObjectId.isValid(ticketId)) {
            ticket = await Ticket.findById(ticketId);
        }

        // If not found, assume it might be a numeric or non-ObjectId string
        if (!ticket) {
            ticket = await Ticket.findOne({ eventTicketId: ticketId });
        }

        // If still not found, try fetching from the JSON file
        if (!ticket) {
            const filePath = path.join(
                __dirname,
                "../Configurations/ticket-configurations.json"
            );
            const fileData = await fs.readFile(filePath, "utf-8");
            const ticketsFromFile = JSON.parse(fileData);

            // Search for the ticket in the JSON file
            ticket = ticketsFromFile.find(
                (t) => t._id === ticketId || t.eventTicketId === ticketId
            );
        }

        // If no ticket is found in either source, return a 404
        if (!ticket) {
            console.error("Ticket not found for ID:", ticketId);
            return res.status(404).json({ error: "Ticket not found" });
        }

        console.log(`Simulation started for ticketId: ${ticketId}`);

        // Fallback for vendor
        const vendor = ticket.vendor || ticket.vendorName;

        if (!vendor) {
            console.error("Both vendor and vendorName are missing in the ticket:", ticket);
            return res.status(400).json({ error: "Ticket must have either vendor or vendorName" });
        }

        // Create the ticket pool for the found ticket
        const ticketPool = new TicketPool(
            vendor, // Use fallback logic for vendor
            ticket.maxTicketCapacity,
            ticket.totalTickets,
            ticket.ticketReleaseRate,
            ticket.customerRetrievalRate,
            ticket.title,
            ticket.releaseInterval,
            ticket.retrievalInterval
        );

        // Add the total number of tickets to the pool
        ticketPool.addTickets(ticket.totalTickets);

        // Save reference to the active simulation
        simulations[ticket._id?.toString() || ticket.eventTicketId] = ticketPool;

        // Respond to the client that the simulation has started
        res.status(200).json({
            success: true,
            message: `Simulation started for ticketId: ${
                ticket._id || ticket.eventTicketId
            }`,
        });
    } catch (error) {
        console.error("Error starting simulation:", error.message);
        res.status(500).json({
            error: "An error occurred while starting the simulation. Please try again later.",
        });
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

            console.log(`Simulation for ticket ${ticketId} stopped.`);
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
            const logs = ticketPool.getLogs();
            allLogs = allLogs.concat(logs);
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
    const { ticketId } = req.params;
    const updateData = req.body;

    try {
        // Attempt to find and update the ticket by ticketId
        const ticket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
            new: true,
            runValidators: true,
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
    const { ticketId } = req.params;

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

const getTicketsWithRemaining = async (req, res) => {
    try {

        const ticketsData = Object.entries(simulations).map(([ticketId, ticketPool]) => {
            const { ticketsRemaining, simulationComplete } = ticketPool.getRemainingTickets();
            return {
                ticketId,
                ticketsRemaining,
                simulationComplete
            };
        });

        res.status(200).json({ success: true, tickets: ticketsData });
    } catch (error) {
        console.error("Error retrieving tickets:", error.message); // Log detailed error
        res.status(500).json({
            error: "An error occurred while fetching the tickets. Please try again later.",
        });
    }
};

module.exports = {
    createTicket,
    getTickets,
    startSimulation,
    stopSimulation,
    getAllTicketLogs,
    getTicketById,
    updateTicket,
    deleteTicket,
    getTicketsWithRemaining,
};
