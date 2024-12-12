import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
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
        const value = event.target.value;

        // Validate numeric fields between 0 and 1,000,000
        if (['totalTickets', 'ticketReleaseRate', 'customerRetrievalRate', 'maxTicketCapacity', 'price', 'releaseInterval', 'retrievalInterval'].includes(field)) {
            if (!/^\d+$/.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [field]: 'Please enter a valid number.'
                }));
                return;
            }
            const numValue = parseInt(value, 10);
            if (numValue < 0 || numValue > 1000000) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [field]: 'Value must be between 0 and 1,000,000.'
                }));
                return;
            }
        }

        setTicketData((prevData) => ({
            ...prevData,
            [field]: value,
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



    const handleKeyPress = (event) => {
        const key = event.key;
        if (!/^[0-9]$/.test(key)) {
            event.preventDefault();
        }
    };

    return (
        <Box>
            <Box display="flex">
                <Sidebar />
                <Box
                    display="flex"
                    p={2}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                        flex: 1,
                        margin: '15px',
                    }}
                >
                    <Box
                        flex={1}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                        style={{ marginRight: '20px' }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            style={{
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                color: 'orange',
                                textAlign: 'center',
                                marginTop: '40px',
                            }}
                        >
                            Update Ticket
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Left Column */}
                            <Grid item xs={12} sm={6}>
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
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={ticketData.description}
                                    onChange={handleChange('description')}
                                    helperText={errors.description}
                                    error={!!errors.description}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Total Tickets"
                                    variant="outlined"
                                    value={ticketData.totalTickets}
                                    onChange={handleChange('totalTickets')}
                                    helperText={errors.totalTickets}
                                    error={!!errors.totalTickets}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Ticket Release Rate (ms)"
                                    variant="outlined"
                                    value={ticketData.ticketReleaseRate}
                                    onChange={handleChange('ticketReleaseRate')}
                                    helperText={errors.ticketReleaseRate}
                                    error={!!errors.ticketReleaseRate}
                                />
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Customer Retrieval Rate (ms)"
                                    variant="outlined"
                                    value={ticketData.customerRetrievalRate}
                                    onChange={handleChange('customerRetrievalRate')}
                                    helperText={errors.customerRetrievalRate}
                                    error={!!errors.customerRetrievalRate}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Max Ticket Capacity"
                                    variant="outlined"
                                    value={ticketData.maxTicketCapacity}
                                    onChange={handleChange('maxTicketCapacity')}
                                    helperText={errors.maxTicketCapacity}
                                    error={!!errors.maxTicketCapacity}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Price"
                                    variant="outlined"
                                    value={ticketData.price}
                                    onChange={handleChange('price')}
                                    helperText={errors.price}
                                    error={!!errors.price}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Image URL"
                                    variant="outlined"
                                    value={ticketData.imageUrl}
                                    onChange={handleChange('imageUrl')}
                                    helperText={errors.imageUrl}
                                    error={!!errors.imageUrl}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Release Interval (ms)"
                                    variant="outlined"
                                    value={ticketData.releaseInterval}
                                    onChange={handleChange('releaseInterval')}
                                    helperText={errors.releaseInterval}
                                    error={!!errors.releaseInterval}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Retrieval Interval (ms)"
                                    variant="outlined"
                                    value={ticketData.retrievalInterval}
                                    onChange={handleChange('retrievalInterval')}
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
                            style={{ marginTop: 16 }}
                        >
                            Update Ticket
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdateTicket;