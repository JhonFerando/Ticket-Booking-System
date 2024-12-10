const express = require("express");
const {createTicket,getTickets,retrieveTickets,startSimulation,stopSimulation, getAllTicketLogs,getTicketById,updateTicket,deleteTicket} = require("../controllers/Ticket");
const router = express.Router();

// Route to create a new ticket
router.post("/", createTicket);

router.get("/logs", getAllTicketLogs);

// Route to get all tickets
router.get("/", getTickets);

// Route to get all tickets
router.get("/:ticketId", getTicketById);

// Route for asynchronous ticket retrieval (with queue handling)
router.post("/retrieve", retrieveTickets);

// Route to start ticket simulation
router.post("/simulation/start", startSimulation);

// Route to start ticket simulation
router.post("/simulation/stop", stopSimulation);

// Define route for updating a ticket
router.put("/:ticketId", updateTicket);

// Define route for updating a ticket
router.delete("/:ticketId", deleteTicket);

module.exports = router;
