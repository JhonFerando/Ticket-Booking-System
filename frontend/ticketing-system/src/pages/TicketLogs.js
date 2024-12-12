/**
 * @file Control.js
 * @description This file defines the `Control` component that is responsible for displaying logs from the ticketing system.
 * It fetches logs from the backend API and displays them in a list format. The component also includes a "Clear Logs" button
 * to clear the logs from the UI.
 *
 * The `Control` component uses Material UI components for layout and design, and it updates the logs in real-time with polling.
 *
 * @module Control
 * @requires react
 * @requires axios
 * @requires @mui/material
 * @requires @mui/system
 *
 * @author Dharshan
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import {Typography, Button, Box, Card, CardContent, Grid} from '@mui/material';
import {styled} from '@mui/system';

// Styled components for modern UI
const LogContainer = styled(Card)(({theme}) => ({
    backgroundColor: '#036666',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    marginTop: '40px',
    padding: theme.spacing(2),
    height: '100%',
    overflowY: 'auto',
}));

const ClearButtonContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
}));

/**
 * The `Control` component is responsible for displaying logs related to the ticketing system.
 * It fetches logs from the backend at regular intervals and displays them in a user-friendly format. The component also allows
 * users to clear the logs with the "Clear Logs" button.
 *
 * @component
 * @example
 * return (
 *   <Control />
 * )
 */
const Control = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLogsCleared, setIsLogsCleared] = useState(false);

    /**
     * Fetches logs from the backend API.
     * This function is called initially and periodically every second to refresh the logs.
     * It checks if the logs have been cleared and stops fetching if cleared.
     */
    const fetchLogs = async () => {
        if (isLogsCleared) {
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/tickets/logs');

            if (Array.isArray(response.data.logs)) {
                setLogs(response.data.logs.reverse());
            } else {
                setError('Logs data is not in expected format');
            }
        } catch (err) {
            setError('Failed to fetch logs');
        }
    };

    useEffect(() => {
        fetchLogs();

        // Set up polling every second to refresh the logs
        const intervalId = setInterval(fetchLogs, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [isLogsCleared]);

    /**
     * Clears the logs from the UI.
     * Sets the state `isLogsCleared` to `true` and clears the logs.
     */
    const clearLogs = () => {
        setLogs([]);
        setIsLogsCleared(true);
    };

    return (
        <Box sx={{display: 'flex'}}>
            <Sidebar/>
            <Box sx={{padding: '20px', flex: 1}}>
                <main>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: '#2A2A3C',
                            textAlign: 'center',
                            marginTop: '40px',
                        }}
                    >
                        Ticketing Summary
                    </Typography>

                    <ClearButtonContainer>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={clearLogs}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                backgroundColor: '#FF5733',
                                '&:hover': {
                                    backgroundColor: '#D84F2C',
                                },
                            }}
                        >
                            Clear Logs
                        </Button>
                    </ClearButtonContainer>

                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={8}>
                            <LogContainer>
                                <CardContent sx={{padding: 2}}>
                                    {logs.length === 0 ? (
                                        <Typography variant="body1" align="center" sx={{color: '#fff'}}>
                                            No logs available
                                        </Typography>
                                    ) : (
                                        logs.map((log, index) => (
                                            <Box key={index} sx={{marginBottom: '12px'}}>
                                                <Typography variant="body2"
                                                            sx={{fontFamily: 'Arial, sans-serif', color: '#fff'}}>
                                                    {log}
                                                </Typography>
                                            </Box>
                                        ))
                                    )}
                                </CardContent>
                            </LogContainer>
                        </Grid>
                    </Grid>
                </main>
            </Box>
        </Box>
    );
};

export default Control;