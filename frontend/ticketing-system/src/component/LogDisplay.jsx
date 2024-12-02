import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const LogDisplay = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:8080'); // Change to your backend URL

        socket.on('logUpdate', (log) => {
            setLogs((prevLogs) => [...prevLogs, log]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>System Logs</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
};

export default LogDisplay;
