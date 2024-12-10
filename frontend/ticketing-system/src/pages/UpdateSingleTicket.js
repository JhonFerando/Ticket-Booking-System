import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography
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
                        <Box alignItems="center" justifyContent="center">
                            <Typography
                                variant="h4"
                                gutterBottom
                                style={{
                                    fontFamily: 'cursive',
                                    fontWeight: 'bold',
                                    color: 'purple',
                                    textAlign: 'center',
                                    marginTop: '40px',
                                }}
                            >
                                Update Ticket
                            </Typography>
                        </Box>

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
                            onChange={handleNumericChange((value) => setTicketData((prevData) => ({ ...prevData, totalTickets: value })), 'totalTickets', 0, 10000000)} // Apply validation for totalTickets
                            onKeyPress={handleKeyPress}
                            helperText={errors.totalTickets}
                            error={!!errors.totalTickets}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ticket Release Rate (milliseconds)"
                            variant="outlined"
                            value={ticketData.ticketReleaseRate}
                            onChange={handleNumericChange((value) => setTicketData((prevData) => ({ ...prevData, ticketReleaseRate: value })), 'ticketReleaseRate', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.ticketReleaseRate}
                            error={!!errors.ticketReleaseRate}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Customer Retrieval Rate (milliseconds)"
                            variant="outlined"
                            value={ticketData.customerRetrievalRate}
                            onChange={handleNumericChange((value) => setTicketData((prevData) => ({ ...prevData, customerRetrievalRate: value })), 'customerRetrievalRate', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.customerRetrievalRate}
                            error={!!errors.customerRetrievalRate}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Max Ticket Capacity"
                            variant="outlined"
                            value={ticketData.maxTicketCapacity}
                            onChange={handleNumericChange((value) => setTicketData((prevData) => ({ ...prevData, maxTicketCapacity: value })), 'maxTicketCapacity', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.maxTicketCapacity}
                            error={!!errors.maxTicketCapacity}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Price"
                            variant="outlined"
                            value={ticketData.price}
                            onChange={handleNumericChange((value) => setTicketData((prevData) => ({ ...prevData, price: value })), 'price', 0, 100000)}
                            onKeyPress={handleKeyPress}
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

                    <Box
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            borderRadius: '15px',
                            paddingTop: '50px',
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
        </Box>
    );
};

export default UpdateTicket;
