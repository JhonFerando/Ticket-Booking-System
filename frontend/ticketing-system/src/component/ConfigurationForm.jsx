import React, { useState } from 'react';

const ConfigurationForm = ({ onSubmit }) => {
    const [totalTickets, setTotalTickets] = useState(1000);
    const [ticketReleaseRate, setTicketReleaseRate] = useState(10);
    const [customerRetrievalRate, setCustomerRetrievalRate] = useState(5);
    const [maxTicketCapacity, setMaxTicketCapacity] = useState(2000);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            totalTickets,
            ticketReleaseRate,
            customerRetrievalRate,
            maxTicketCapacity,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Configuration</h2>
            <label>Total Tickets: </label>
            <input
                type="number"
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
            />
            <br />
            <label>Ticket Release Rate: </label>
            <input
                type="number"
                value={ticketReleaseRate}
                onChange={(e) => setTicketReleaseRate(e.target.value)}
            />
            <br />
            <label>Customer Retrieval Rate: </label>
            <input
                type="number"
                value={customerRetrievalRate}
                onChange={(e) => setCustomerRetrievalRate(e.target.value)}
            />
            <br />
            <label>Max Ticket Capacity: </label>
            <input
                type="number"
                value={maxTicketCapacity}
                onChange={(e) => setMaxTicketCapacity(e.target.value)}
            />
            <br />
            <button type="submit">Save Configuration</button>
        </form>
    );
};

export default ConfigurationForm;
