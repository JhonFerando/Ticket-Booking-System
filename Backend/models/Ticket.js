const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    vendor: {
        type: String,
        required: true
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
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
