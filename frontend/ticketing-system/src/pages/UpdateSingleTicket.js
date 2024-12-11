import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Paper
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';

const UpdateTicket = () => {
    const [ticketData, setTicketData] = useState({
        vendor: '',
        title: '',
        description: '',
        totalTickets: '',
        ticketReleaseRate: '',
        customerRetrievalRate: '',
        maxTicketCapacity: '',
        price: '',
        imageUrl: '',
        releaseInterval: '',
        retrievalInterval: ''
    });

    const [errors, setErrors] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/tickets/${id}`);
                setTicketData(data);
            } catch (error) {
                console.error(error);
                swal('Error', 'Could not fetch ticket data.', 'error');
            }
        };
        fetchTicketData();
    }, [id]);

    const handleChange = (field) => (event) => {
        setTicketData((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!ticketData.vendor) newErrors.vendor = 'Vendor is required.';
        if (!ticketData.title) newErrors.title = 'Title is required.';
        if (!ticketData.description) newErrors.description = 'Description is required.';
        if (!ticketData.totalTickets) newErrors.totalTickets = 'Total tickets are required.';
        if (!ticketData.ticketReleaseRate) newErrors.ticketReleaseRate = 'Ticket release rate is required.';
        if (!ticketData.customerRetrievalRate) newErrors.customerRetrievalRate = 'Customer retrieval rate is required.';
        if (!ticketData.maxTicketCapacity) newErrors.maxTicketCapacity = 'Max ticket capacity is required.';
        if (!ticketData.price) newErrors.price = 'Price is required.';
        if (!ticketData.releaseInterval) newErrors.releaseInterval = 'Release interval is required.';
        if (!ticketData.retrievalInterval) newErrors.retrievalInterval = 'Retrieval interval is required.';
        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}`, ticketData);
            swal('Success', 'Ticket updated successfully!', 'success');
        } catch (error) {
            console.error(error);
            swal('Error', 'Something went wrong. Please try again.', 'error');
        }
    };

    const handleNumericChange = (setter, fieldName, min = 0, max = Infinity) => (event) => {
        const value = event.target.value;

        if (isNaN(value) || parseInt(value, 10) < min || parseInt(value, 10) > max) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: `Please enter a valid number between ${min} and ${max}.`,
            }));
            return;
        }

        setter(value);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
    };

    const handleKeyPress = (event) => {
        const key = event.key;
        if (!/^[0-9]$/.test(key)) {
            event.preventDefault();
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    margin: '1rem',
                }}
            >
                <Paper
                    sx={{
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: 3,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: 'cursive',
                            fontWeight: 'bold',
                            color: 'purple',
                            marginBottom: '2rem',
                        }}
                    >
                        Update Ticket
                    </Typography>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Vendor"
                                    variant="outlined"
                                    value={ticketData.vendor}
                                    onChange={handleChange('vendor')}
                                    helperText={errors.vendor}
                                    error={!!errors.vendor}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Title"
                                    variant="outlined"
                                    value={ticketData.title}
                                    onChange={handleChange('title')}
                                    helperText={errors.title}
                                    error={!!errors.title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Description"
                                    variant="outlined"
                                    value={ticketData.description}
                                    onChange={handleChange('description')}
                                    helperText={errors.description}
                                    error={!!errors.description}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Total Tickets"
                                    variant="outlined"
                                    value={ticketData.totalTickets}
                                    onChange={handleNumericChange(setTicketData, 'totalTickets')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.totalTickets}
                                    error={!!errors.totalTickets}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Ticket Release Rate"
                                    variant="outlined"
                                    value={ticketData.ticketReleaseRate}
                                    onChange={handleNumericChange(setTicketData, 'ticketReleaseRate')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.ticketReleaseRate}
                                    error={!!errors.ticketReleaseRate}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Customer Retrieval Rate"
                                    variant="outlined"
                                    value={ticketData.customerRetrievalRate}
                                    onChange={handleNumericChange(setTicketData, 'customerRetrievalRate')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.customerRetrievalRate}
                                    error={!!errors.customerRetrievalRate}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Max Ticket Capacity"
                                    variant="outlined"
                                    value={ticketData.maxTicketCapacity}
                                    onChange={handleNumericChange(setTicketData, 'maxTicketCapacity')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.maxTicketCapacity}
                                    error={!!errors.maxTicketCapacity}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Price"
                                    variant="outlined"
                                    value={ticketData.price}
                                    onChange={handleNumericChange(setTicketData, 'price')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.price}
                                    error={!!errors.price}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Release Interval"
                                    variant="outlined"
                                    value={ticketData.releaseInterval}
                                    onChange={handleNumericChange(setTicketData, 'releaseInterval')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.releaseInterval}
                                    error={!!errors.releaseInterval}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Retrieval Interval"
                                    variant="outlined"
                                    value={ticketData.retrievalInterval}
                                    onChange={handleNumericChange(setTicketData, 'retrievalInterval')}
                                    onKeyPress={handleKeyPress}
                                    helperText={errors.retrievalInterval}
                                    error={!!errors.retrievalInterval}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            sx={{ marginTop: '2rem' }}
                        >
                            Update Ticket
                        </Button>
                    </form>
                </Paper>

                <Box
                    sx={{
                        marginTop: '2rem',
                        textAlign: 'center',
                        borderRadius: '15px',
                    }}
                >
                    <img
                        src={ticketData.imageUrl || 'https://placeimg.com/640/480/tech'}
                        alt="Ticket Preview"
                        style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default UpdateTicket;
