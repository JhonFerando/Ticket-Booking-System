import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Paper,
    InputAdornment,
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import swal from 'sweetalert';

/**
 * @file CreateTicket.js
 * @description Component for creating new ticket configurations.
 * Allows users to enter ticket details such as vendor, title, description, ticket price, release rate, etc.
 * Upon submission, it sends a POST request to add the new ticket to the backend.
 *
 * @author Dharshan
 */
const CreateTicket = () => {
    const [vendor, setVendor] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [totalTickets, setTotalTickets] = useState('');
    const [ticketReleaseRate, setTicketReleaseRate] = useState('');
    const [customerRetrievalRate, setCustomerRetrievalRate] = useState('');
    const [maxTicketCapacity, setMaxTicketCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [releaseInterval, setReleaseInterval] = useState('');
    const [retrievalInterval, setRetrievalInterval] = useState('');

    const handleNumericChange = (setter, fieldName, min = 0, max = Infinity) => (event) => {
        const value = event.target.value;
        if (isNaN(value) || value.includes('.') || parseInt(value, 10) < min || parseInt(value, 10) > max) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: `Please enter a valid number between ${min} and ${max}.`,
            }));
            return;
        }
        setter(value);
        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newTicket = {
            vendor,
            title,
            description,
            totalTickets,
            ticketReleaseRate,
            customerRetrievalRate,
            maxTicketCapacity,
            price,
            releaseInterval,
            retrievalInterval,
            created_date: new Date(),
            imageUrl,
        };

        try {
            await axios.post('http://localhost:5000/api/tickets', newTicket);
            swal('Success', 'New ticket added successfully!', 'success');
            resetForm();
        } catch (error) {
            swal('Error', 'Something went wrong. Please try again.', 'error');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!vendor) newErrors.vendor = 'Vendor is required.';
        if (!title) newErrors.title = 'Title is required.';
        if (!description) newErrors.description = 'Description is required.';
        if (!totalTickets) newErrors.totalTickets = 'Total tickets are required.';
        if (!ticketReleaseRate) newErrors.ticketReleaseRate = 'Ticket release rate is required.';
        if (!customerRetrievalRate) newErrors.customerRetrievalRate = 'Customer retrieval rate is required.';
        if (!maxTicketCapacity) newErrors.maxTicketCapacity = 'Max ticket capacity is required.';
        if (!price) newErrors.price = 'Price is required.';
        if (!releaseInterval) newErrors.releaseInterval = 'Release interval is required.';
        if (!retrievalInterval) newErrors.retrievalInterval = 'Retrieval interval is required.';
        return newErrors;
    };

    const resetForm = () => {
        setVendor('');
        setTitle('');
        setDescription('');
        setTotalTickets('');
        setTicketReleaseRate('');
        setCustomerRetrievalRate('');
        setMaxTicketCapacity('');
        setPrice('');
        setReleaseInterval('');
        setRetrievalInterval('');
        setImageUrl('');
        setErrors({});
    };

    return (
        <Box>
            <Box display="flex" justifyContent="center" padding={4}>
                <Sidebar />
                <Box
                    component={Paper}
                    display="flex"
                    flexDirection="column"
                    p={5}
                    mx={2}
                    style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '1200px',
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        style={{
                            color: '#2A2A3C',
                            fontWeight: '600',
                        }}
                    >
                        Create Ticket Configuration
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Left Column */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ticket Vendor"
                                    variant="outlined"
                                    value={vendor}
                                    onChange={(e) => setVendor(e.target.value)}
                                    helperText={errors.vendor}
                                    error={!!errors.vendor}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ticket Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    helperText={errors.title}
                                    error={!!errors.title}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ticket Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    helperText={errors.description}
                                    error={!!errors.description}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Total Tickets"
                                    variant="outlined"
                                    value={totalTickets}
                                    onChange={handleNumericChange(setTotalTickets, 'totalTickets')}
                                    helperText={errors.totalTickets}
                                    error={!!errors.totalTickets}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">No</InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ticket Price (Rs)"
                                    variant="outlined"
                                    value={price}
                                    onChange={handleNumericChange(setPrice, 'price')}
                                    helperText={errors.price}
                                    error={!!errors.price}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">Rs</InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Release Rate (ms)"
                                    variant="outlined"
                                    value={ticketReleaseRate}
                                    onChange={handleNumericChange(setTicketReleaseRate, 'ticketReleaseRate')}
                                    helperText={errors.ticketReleaseRate}
                                    error={!!errors.ticketReleaseRate}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Retrieval Rate (ms)"
                                    variant="outlined"
                                    value={customerRetrievalRate}
                                    onChange={handleNumericChange(setCustomerRetrievalRate, 'customerRetrievalRate')}
                                    helperText={errors.customerRetrievalRate}
                                    error={!!errors.customerRetrievalRate}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Max Capacity"
                                    variant="outlined"
                                    value={maxTicketCapacity}
                                    onChange={handleNumericChange(setMaxTicketCapacity, 'maxTicketCapacity')}
                                    helperText={errors.maxTicketCapacity}
                                    error={!!errors.maxTicketCapacity}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Image URL"
                                    variant="outlined"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    helperText={errors.imageUrl}
                                    error={!!errors.imageUrl}
                                    style={{ borderRadius: '16px', backgroundColor: '#f9f9f9' }}
                                />
                            </Grid>
                        </Grid>

                        <Box textAlign="center" mt={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                style={{
                                    backgroundColor: '#414d6b',
                                    fontWeight: '600',
                                    padding: '12px 36px',
                                    borderRadius: '50px',
                                    transition: '0.3s',
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#388E3C'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                            >
                                Create Ticket
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTicket;
