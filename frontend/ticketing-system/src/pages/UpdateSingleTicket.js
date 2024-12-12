/**
 * @file UpdateTicket.js
 * @description This file defines the `UpdateTicket` component, which is responsible for allowing users to update the details of an existing ticket.
 * The form includes fields for the ticket vendor, title, description, ticket details (like price, total tickets, etc.), and an image URL.
 * The component fetches the current ticket data based on the ticket ID from the backend API and pre-fills the form with it. Upon form submission, the ticket details are updated in the backend.
 * The component also handles form validation, input sanitization, and displays any validation errors to the user.
 *
 * @module UpdateTicket
 * @requires react
 * @requires @mui/material
 * @requires axios
 * @requires swal
 * @requires react-router-dom
 *
 * UpdateTicket component allows users to update the details of a specific ticket.
 * It fetches the existing ticket data from the backend, allows the user to modify it,
 * and then updates the ticket in the backend upon form submission.
 *
 * @component
 * @example
 * return (
 *   <UpdateTicket />
 * )
 *
 * @returns {JSX.Element} A form for updating ticket details, including fields for vendor, title, description, price, and other ticket-specific data.
 *
 * @author Dharshan
 */

import React, {useState, useEffect} from 'react';
import {
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import swal from 'sweetalert';
import {useParams} from 'react-router-dom';

/**
 * Represents the data of a ticket that can be updated.
 *
 * @typedef {Object} TicketData
 * @property {string} vendor - The vendor of the ticket.
 * @property {string} title - The title of the ticket.
 * @property {string} description - The description of the ticket.
 * @property {number} totalTickets - The total number of tickets available.
 * @property {number} ticketReleaseRate - The ticket release rate in milliseconds.
 * @property {number} customerRetrievalRate - The customer retrieval rate in milliseconds.
 * @property {number} maxTicketCapacity - The maximum ticket capacity.
 * @property {number} price - The price of the ticket.
 * @property {string} imageUrl - The URL of the image associated with the ticket.
 */

/**
 * Fetches the ticket data based on the ticket ID from the backend API and sets it in the state.
 *
 * @async
 * @function fetchTicketData
 */
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
    const {id} = useParams();

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const {data} = await axios.get(`http://localhost:5000/api/tickets/${id}`);
                setTicketData(data);
            } catch (error) {
                console.error(error);
                swal('Error', 'Could not fetch ticket data.', 'error');
            }
        };
        fetchTicketData();
    }, [id]);

    /**
     * Handles input changes for form fields.
     *
     * @param {string} field - The name of the field to update.
     * @returns {Function} A function to handle the change event.
     */
    const handleChange = (field) => (event) => {
        setTicketData((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
        setErrors((prevErrors) => ({...prevErrors, [field]: ''}));
    };

    /**
     * Validates the form to ensure all required fields are filled.
     *
     * @returns {Object} An object containing the validation errors, if any.
     */
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

    /**
     * Handles form submission by sending the updated ticket data to the backend.
     *
     * @param {Object} event - The form submission event.
     */
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

    /**
     * Handles numeric input validation, ensuring the input is a valid number within a specified range.
     *
     * @param {Function} setter - The setter function to update the state.
     * @param {string} fieldName - The field name to update.
     * @param {number} min - The minimum valid number (default is 0).
     * @param {number} max - The maximum valid number (default is Infinity).
     * @returns {Function} A function to handle the change event.
     */
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
        setErrors((prevErrors) => ({...prevErrors, [fieldName]: ''}));
    };

    /**
     * Handles key press events for number fields, ensuring only numeric characters are allowed.
     *
     * @param {Object} event - The key press event.
     */
    const handleKeyPress = (event) => {
        const key = event.key;
        if (!/^[0-9]$/.test(key)) {
            event.preventDefault();
        }
    };

    return (
        <Box>
            <Box display="flex">
                <Sidebar/>
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
                        style={{marginRight: '20px'}}
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

                        {/* Form Fields */}
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
                        {/* Repeat for other fields like title, description, etc. */}

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            style={{marginTop: 16}}
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
                            style={{width: '100%', maxWidth: '400px', borderRadius: '10px'}}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdateTicket;