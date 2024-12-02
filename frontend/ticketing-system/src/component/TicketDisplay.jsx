import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const TicketDisplay = () => {
    const [ticketCount, setTicketCount] = useState(0);
    const [maxTicketCapacity, setMaxTicketCapacity] = useState(2000);

    useEffect(() => {
        const socket = io('http://localhost:8080'); // Change to your backend URL

        socket.on('ticketUpdate', (data) => {
            setTicketCount(data.ticketCount);
            setMaxTicketCapacity(data.maxTicketCapacity);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Current Ticket Availability</h2>
            <p>
                Tickets Available: {ticketCount}/{maxTicketCapacity}
            </p>
        </div>
    );
};

export default TicketDisplay;
