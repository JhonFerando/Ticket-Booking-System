import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Typography, Button, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

// Styled components for the modern UI design
const LogContainer = styled(Paper)(({ theme }) => ({
    backgroundColor: '#34495e',
    borderRadius: '12px',
    padding: theme.spacing(2),
    overflowY: 'scroll',
    height: '70vh',  // Set the height to create a scrollable area
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    color: '#ecf0f1',
}));

const ControlHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
}));

const ClearButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: '#c0392b',
    },
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
    color: '#e74c3c',
    marginTop: theme.spacing(3),
    alignSelf: 'center',
}));

/**
 * The `Control` component is responsible for displaying logs related to the ticketing system.
 * It fetches logs from the backend at regular intervals and displays them in a user-friendly format.
 */
const Control = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLogsCleared, setIsLogsCleared] = useState(false);
    const logAreaRef = useRef(null);

    // Fetch logs from the backend API
    const fetchLogs = async () => {
        if (isLogsCleared) return;

        try {
            const response = await axios.get('http://localhost:5000/api/tickets/logs');
            if (Array.isArray(response.data.logs)) {
                setLogs(response.data.logs.reverse()); // Display logs in reverse order
            } else {
                setError('Logs data is not in expected format');
            }
        } catch (err) {
            setError('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const intervalId = setInterval(fetchLogs, 3000); // Poll every 3 seconds

        // Cleanup the interval when component is unmounted
        return () => clearInterval(intervalId);
    }, [isLogsCleared]);

    // Clear the logs from the UI
    const clearLogs = () => {
        setLogs([]);
        setIsLogsCleared(true);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ padding: '20px', flex: 1 }}>
                <main>
                    <ControlHeader>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2A2A3C' }}>
                            Ticketing Logs
                        </Typography>
                        <ClearButton onClick={clearLogs}>Clear Logs</ClearButton>
                    </ControlHeader>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <LogContainer ref={logAreaRef}>
                            {logs.length === 0 ? (
                                <Typography variant="body1" align="center" sx={{ color: '#fff' }}>
                                    No logs available
                                </Typography>
                            ) : (
                                logs.map((log, index) => (
                                    <Box key={index} sx={{ marginBottom: '12px' }}>
                                        <Typography variant="body2" sx={{ fontFamily: 'Arial, sans-serif' }}>
                                            {log}
                                        </Typography>
                                    </Box>
                                ))
                            )}
                        </LogContainer>
                    )}
                </main>
            </Box>
        </Box>
    );
};

export default Control;
