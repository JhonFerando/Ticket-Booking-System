/**
 * @file RetrieveTicketPage.js
 * @description This file defines the `RetrieveTicketPage` component that displays available event tickets
 * and allows users to retrieve (purchase) them. The component fetches ticket data from a backend API,
 * displays the tickets in a card layout, and handles user interactions for retrieving tickets.
 *
 * The page includes features such as:
 * - Fetching ticket data from an API.
 * - Displaying ticket information in a responsive grid layout.
 * - Allowing users to click a "Purchase Ticket" button to retrieve tickets.
 * - Displaying success or error messages using a Snackbar.
 *
 * @module RetrieveTicketPage
 * @requires axios
 * @requires @mui/material
 * @requires @mui/system
 * @requires react-router-dom
 *
 * @author Dharshan
 */

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Box, Typography, Card, CardContent, CardActions, Button, Snackbar, Grid} from '@mui/material';
import {styled} from '@mui/system';
import {useLocation} from "react-router-dom";

const RootBox = styled(Box)(({ theme }) => ({
    padding: '20px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    fontSize: '2.5rem',
}));

const CardContainer = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(3),
}));

const CustomCard = styled(Card)(({ theme }) => ({
    width: '280px',
    borderRadius: '12px',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    },
}));

const CardImage = styled('img')({
    width: '100%',
    height: '180px',
    objectFit: 'cover',
});

const CardContentStyled = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    textAlign: 'center',
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
    padding: theme.spacing(2),
    justifyContent: 'center',
}));

const PurchaseButton = styled(Button)(({ theme }) => ({
    backgroundImage: 'linear-gradient(45deg, #4caf50, #81c784)',
    color: '#ffffff',
    fontWeight: 'bold',
    width: '100%',
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #388e3c, #66bb6a)',
    },
}));

const SnackbarIcon = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
});

/**
 * The `RetrieveTicketPage` component fetches and displays available event tickets.
 * It allows users to retrieve (purchase) tickets by clicking the "Purchase Ticket" button.
 *
 * @component
 * @example
 * return (
 *   <RetrieveTicketPage />
 * )
 */
const RetrieveTicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get the userId from the query parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");

    /**
     * Fetches available tickets from the API when the component is mounted.
     * On success, sets the tickets data in the state. On failure, displays an error message.
     *
     * @async
     * @function
     */
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tickets');
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setSnackbarMessage('Failed to fetch tickets. Please try again later.');
                setOpenSnackbar(true);
            }
        };
        fetchTickets();
    }, []);

    useEffect(() => {
        const fetchRemainingTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tickets/remaining');

                const remainingData = response.data?.tickets || [];
                console.log(remainingData);
                setTickets((prevTickets) =>
                    prevTickets.map((ticket) => {
                        const match = remainingData.find((data) => data.ticketId === ticket._id);
                        return match
                            ? {
                                ...ticket,
                                remainingTickets: match.ticketsRemaining,
                                simulationComplete: match.simulationComplete,
                            }
                            : { ...ticket, remainingTickets: ticket.totalTickets };
                    })
                );
            } catch (error) {
                console.error('Error fetching remaining tickets:', error);
                setSnackbarMessage('Failed to fetch remaining tickets.');
                setOpenSnackbar(true);
            }
        };

        // Poll every 5 seconds
        const intervalId = setInterval(fetchRemainingTickets, 1000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    /**
     * Handles the retrieval (purchase) of a ticket. Sends the ticketId and userId to the backend
     * to complete the purchase process. Displays a success or error message based on the result.
     *
     * @async
     * @function
     * @param {string} ticketId - The ID of the ticket to retrieve.
     */
    const handleRetrieveTicket = async (ticketId) => {
        if (!userId) {
            setSnackbarMessage('Please log in to purchase tickets.');
            setOpenSnackbar(true);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/tickets/retrieve", {
                ticketId,
                userId,
            });

            setTickets((prevTickets) =>
                prevTickets.map((ticket) =>
                    ticket._id === ticketId
                        ? {
                            ...ticket,
                            remainingTickets: ticket.remainingTickets - 1,
                        }
                        : ticket
                )
            );

            setSnackbarMessage(response.data.message || 'Ticket retrieved successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            const errorMessage =
                error.response?.data?.error || 'An error occurred while retrieving the ticket.';
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RootBox>
            <TitleTypography variant="h4">
                Available Tickets
            </TitleTypography>

            <CardContainer container spacing={3}>
                {tickets.map((ticket) => (
                    <Grid item key={ticket._id}>
                        <CustomCard>
                            {ticket.imageUrl ? (
                                <CardImage
                                    src={ticket.imageUrl}
                                    alt={ticket.title}
                                />
                            ) : (
                                <CardImage
                                    src="https://images.pexels.com/photos/1860618/pexels-photo-1860618.jpeg?auto=compress&cs=tinysrgb&w=600"
                                    alt="Default image"
                                />
                            )}
                            <CardContentStyled>
                                <Typography variant="h5" gutterBottom>
                                    {ticket.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {ticket.description}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    Rs {ticket.price}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        marginTop: '10px',
                                        fontWeight: 'bold',
                                        color: ticket.simulationComplete ? 'red' : 'green',
                                    }}
                                >
                                    {ticket.simulationComplete
                                        ? 'All Tickets Sold'
                                        : `Remaining Tickets: ${ticket.remainingTickets}`}
                                </Typography>

                            </CardContentStyled>
                            <CardActionsStyled>
                                <PurchaseButton
                                    variant="contained"
                                    disabled={isLoading || ticket.remainingTickets <= 0}
                                    onClick={() => handleRetrieveTicket(ticket._id)}
                                >
                                    {isLoading ? 'Retrieving...' : 'Purchase Ticket'}
                                </PurchaseButton>
                            </CardActionsStyled>
                        </CustomCard>
                    </Grid>
                ))}
            </CardContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                sx={{bottom: 50}}
            />
        </RootBox>
    );
};

export default RetrieveTicketPage;
