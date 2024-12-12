const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    vendor: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    totalTickets: {
        type: Number,
        required: true
    },
    ticketReleaseRate: {
        type: Number,
        required: true
    },
    customerRetrievalRate: {
        type: Number,
        default: 0
    },
    maxTicketCapacity: {
        type: Number,
        required: true
    },
    price: {
        type: Number
    },
    imageUrl: {
        type: String,
        default: ''
    },
    releaseInterval: {
        type: Number,
        required: true,
        min: 0
    },
    retrievalInterval: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
