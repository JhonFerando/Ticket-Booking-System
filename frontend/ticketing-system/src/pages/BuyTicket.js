import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardActions, Button, Snackbar, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation } from "react-router-dom";

// Styled components for modern UI
const RootBox = styled(Box)(({ theme }) => ({
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'Roboto, sans-serif',
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontSize: '2rem',
}));

const CardContainer = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
}));

const CustomCard = styled(Card)(({ theme }) => ({
    width: 'calc(25% - 20px)',
    minWidth: '220px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
    },
}));

const CardImage = styled('img')({
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
});

const CardContentStyled = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    paddingBottom: theme.spacing(3),
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const PurchaseButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#ff7043',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    width: '100%',
    '&:hover': {
        backgroundColor: '#f4511e',
    },
}));

const RetrieveTicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tickets');
                setTickets(response.data);
            } catch (error) {
                setSnackbarMessage('Failed to fetch tickets. Please try again later.');
                setOpenSnackbar(true);
            }
        };
        fetchTickets();
    }, []);

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

            setSnackbarMessage(response.data.message || 'Ticket retrieved successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred while retrieving the ticket.';
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
                            </CardContentStyled>
                            <CardActionsStyled>
                                <PurchaseButton
                                    variant="contained"
                                    disabled={isLoading}
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bottom: 50 }}
            />
        </RootBox>
    );
};

export default RetrieveTicketPage;
