import React, {useState} from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
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
    // State variables for managing form input values
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

    /**
     * Handles changes in the vendor input field.
     * @param {object} event - The event object
     */
    const handleVendorChange = (event) => {
        setVendor(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, vendor: ''}));
    };

    /**
     * Handles changes in the title input field.
     * @param {object} event - The event object
     */
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, title: ''}));
    };

    /**
     * Handles changes in the description input field.
     * @param {object} event - The event object
     */
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, description: ''}));
    };

    /**
     * Handles changes in the total tickets input field.
     * Also updates max ticket capacity to be the same as total tickets.
     * @param {object} event - The event object
     */
    const handleTotalTicketsChange = (event) => {
        const value = event.target.value;
        setTotalTickets(value);
        setMaxTicketCapacity(value);  // Set max ticket capacity to be the same as total tickets
        setErrors((prevErrors) => ({...prevErrors, totalTickets: ''}));
    };

    /**
     * Handles changes in the max ticket capacity input field.
     * Also updates total tickets to be the same as max ticket capacity.
     * @param {object} event - The event object
     */
    const handleMaxTicketCapacityChange = (event) => {
        const value = event.target.value;
        setMaxTicketCapacity(value);
        setTotalTickets(value);  // Set total tickets to be the same as max ticket capacity
        setErrors((prevErrors) => ({...prevErrors, maxTicketCapacity: ''}));
    };

    /**
     * Handles changes in the ticket release rate input field.
     * @param {object} event - The event object
     */
    const handleTicketReleaseRateChange = (event) => {
        setTicketReleaseRate(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, ticketReleaseRate: ''}));
    };

    /**
     * Handles changes in the customer retrieval rate input field.
     * @param {object} event - The event object
     */
    const handleCustomerRetrievalRateChange = (event) => {
        setCustomerRetrievalRate(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, customerRetrievalRate: ''}));
    };

    /**
     * Handles changes in the price input field.
     * @param {object} event - The event object
     */
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, price: ''}));
    };

    /**
     * Handles changes in the status input field.
     * @param {object} event - The event object
     */
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, status: ''}));
    };

    /**
     * Handles changes in the image URL input field.
     * @param {object} event - The event object
     */
    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
        setErrors((prevErrors) => ({...prevErrors, imageUrl: ''}));
    };

    /**
     * Validates the form before submission.
     * @returns {object} - An object containing the validation errors
     */
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
        return newErrors;
    };

    /**
     * Handles the form submission by validating the form and sending the ticket data to the backend.
     * @param {object} event - The event object
     */
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
            created_date: new Date(),
            imageUrl,
        };

        try {
            await axios.post('http://localhost:5000/api/tickets', newTicket);
            swal('Success', 'New ticket added successfully!', 'success');
            setVendor('');
            setTitle('');
            setDescription('');
            setTotalTickets('');
            setTicketReleaseRate('');
            setCustomerRetrievalRate('');
            setMaxTicketCapacity('');
            setPrice('');
            setImageUrl('');
            setErrors({});
        } catch (error) {
            console.error(error);
            swal('Error', 'Something went wrong. Please try again.', 'error');
        }
    };

    /**
     * Handles numeric input validation for fields like total tickets, ticket release rate, etc.
     * @param {function} setter - The setter function to update the state
     * @param {string} fieldName - The name of the field being validated
     * @param {number} min - The minimum valid value
     * @param {number} max - The maximum valid value
     * @returns {function} - A function to handle the numeric input change
     */
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
        setErrors((prevErrors) => ({...prevErrors, [fieldName]: ''}));
    };

    /**
     * Prevents non-numeric input in numeric fields.
     * @param {object} event - The keypress event object
     */
    const handleKeyPress = (event) => {
        const key = event.key;
        if (!/^[0-9]$/.test(key)) {
            event.preventDefault();
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="center">
                <Sidebar/>
                <Box
                    display="flex"
                    p={2}
                    style={{
                        backgroundColor: '#EFEFF1', // Lighter background color
                        borderRadius: '16px', // More rounded corners
                        boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.15)', // Slightly heavier shadow for depth
                        flex: 1,
                        margin: '30px',
                        padding: '30px', // Added padding for better content spacing
                    }}
                >
                    {/* Form Section */}
                    <Box
                        flex={1}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                        style={{marginRight: '30px'}}
                    >
                        <Box alignItems="center" justifyContent="center">
                            <Typography
                                variant="h4"
                                gutterBottom
                                style={{
                                    fontFamily: 'Roboto, sans-serif',
                                    fontWeight: 600,
                                    color: '#1A1A1A', // Darker text for better contrast
                                    textAlign: 'center',
                                    marginBottom: '30px',
                                    marginTop: '10px',
                                }}
                            >
                                Add New Ticket Configuration
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ticket Vendor"
                            variant="outlined"
                            value={vendor}
                            onChange={handleVendorChange}
                            helperText={errors.vendor}
                            error={!!errors.vendor}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px', // Rounded edges for input fields
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Title of the Ticket"
                            variant="outlined"
                            value={title}
                            onChange={handleTitleChange}
                            helperText={errors.title}
                            error={!!errors.title}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ticket Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={description}
                            onChange={handleDescriptionChange}
                            helperText={errors.description}
                            error={!!errors.description}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Total No of Tickets"
                            variant="outlined"
                            value={totalTickets}
                            onChange={handleNumericChange(setTotalTickets, 'totalTickets', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.totalTickets}
                            error={!!errors.totalTickets}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            style={{
                                marginTop: '20px',
                                borderRadius: '12px', // More rounded corners for button
                                backgroundColor: '#4CAF50', // Green primary color
                                fontWeight: '600',
                                padding: '12px',
                                transition: '0.3s',
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#388E3C'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                        >
                            Create Ticket
                        </Button>
                    </Box>

                    {/* Right Section (Additional Inputs) */}
                    <Box
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '20px',
                            marginLeft: '20px',
                            marginTop: '30px',
                        }}
                    >
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ticket Release Rate (milliseconds)"
                            variant="outlined"
                            value={ticketReleaseRate}
                            onChange={handleNumericChange(setTicketReleaseRate, 'ticketReleaseRate', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.ticketReleaseRate}
                            error={!!errors.ticketReleaseRate}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Customer Retrieval Rate (milliseconds)"
                            variant="outlined"
                            value={customerRetrievalRate}
                            onChange={handleNumericChange(setCustomerRetrievalRate, 'customerRetrievalRate', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.customerRetrievalRate}
                            error={!!errors.customerRetrievalRate}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Max Ticket Capacity"
                            variant="outlined"
                            value={maxTicketCapacity}
                            onChange={handleNumericChange(setMaxTicketCapacity, 'maxTicketCapacity', 0, 10000000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.maxTicketCapacity}
                            error={!!errors.maxTicketCapacity}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ticket Price (Rs)"
                            variant="outlined"
                            value={price}
                            onChange={handleNumericChange(setPrice, 'price', 0, 100000)}
                            onKeyPress={handleKeyPress}
                            helperText={errors.price}
                            error={!!errors.price}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="URL of the Image"
                            variant="outlined"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            helperText={errors.imageUrl}
                            error={!!errors.imageUrl}
                            style={{
                                marginBottom: '16px',
                                borderRadius: '12px',
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTicket;
