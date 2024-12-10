import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Typography, Button, Box, Card, CardContent, Grid } from '@mui/material';
import { styled } from '@mui/system';

// Styled components for modern UI
const LogContainer = styled(Card)(({ theme }) => ({
    backgroundColor: '#036666',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    marginTop: '40px',
    padding: theme.spacing(2),
    height: '100%',
    overflowY: 'auto',
}));

const ClearButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
}));

const Control = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLogsCleared, setIsLogsCleared] = useState(false);

    // Function to fetch logs
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

        const intervalId = setInterval(fetchLogs, 1000);

        return () => clearInterval(intervalId);
    }, [isLogsCleared]);

    // Function to clear logs
    const clearLogs = () => {
        setLogs([]);
        setIsLogsCleared(true);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ padding: '20px', flex: 1 }}>
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
                                <CardContent sx={{ padding: 2 }}>
                                    {logs.length === 0 ? (
                                        <Typography variant="body1" align="center" sx={{ color: '#fff' }}>
                                            No logs available
                                        </Typography>
                                    ) : (
                                        logs.map((log, index) => (
                                            <Box key={index} sx={{ marginBottom: '12px' }}>
                                                <Typography variant="body2" sx={{ fontFamily: 'Arial, sans-serif', color: '#fff' }}>
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
