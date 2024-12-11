import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Container,
    styled,
    CardMedia,
    Divider,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../components/Sidebar";

const StyledLetterhead = styled(Box)(({ theme }) => ({
    textAlign: "center",
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    backgroundColor: "#036666",
    borderRadius: "8px",
    color: "#FFF",
    "& h4": {
        fontFamily: "Roboto, sans-serif",
        fontWeight: "700",
        fontSize: "2rem",
        color: "#E0E0E0",
    },
    "& p": {
        margin: "5px 0",
        fontSize: "1rem",
        fontWeight: "300",
    },
}));

const StatsCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: "#FFF",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
}));

const TicketCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2),
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "translateY(-10px)",
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
    },
}));

const TicketCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 140,
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
}));

const TicketReport = () => {
    const [ticketData, setTicketData] = useState([]);
    const [stats, setStats] = useState({
        totalTicketsSold: 0,
        revenueGenerated: 0,
        eventsManaged: 0,
    });

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/tickets");
                setTicketData(response.data);

                // Calculate statistics
                const totalTicketsSold = response.data.reduce((sum, ticket) => sum + ticket.totalTickets, 0);
                const revenueGenerated = response.data.reduce((sum, ticket) => sum + ticket.price * ticket.totalTickets, 0);
                const eventsManaged = response.data.length;

                setStats({
                    totalTicketsSold,
                    revenueGenerated,
                    eventsManaged,
                });
            } catch (error) {
                console.error("There was an error fetching the ticket data!", error);
            }
        };
        fetchTicketData();
    }, []);

    const handleDownloadPDF = () => {
        const input = document.querySelector(".printable-area");
        const buttons = document.querySelectorAll(".no-print-button");
        buttons.forEach((button) => (button.style.display = "none"));

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("ticket_report.pdf");

            buttons.forEach((button) => (button.style.display = ""));
        });
    };

    return (
        <Box>
            <Box display="flex">
                <Sidebar />
                <Box
                    flexDirection="column"
                    p={2}
                    className="printable-area"
                    style={{
                        backgroundColor: "white",
                        borderRadius: 8,
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        flex: 1,
                        margin: "15px",
                    }}
                >
                    <Box display="flex" justifyContent="flex-end" marginBottom={2} className="no-print-button">
                        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                    </Box>

                    <StyledLetterhead>
                        <Typography variant="h4" gutterBottom>
                            Event Ticketing System
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Ticket Management Report
                        </Typography>
                    </StyledLetterhead>

                    <Container>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={4}>
                                <StatsCard>
                                    <Typography variant="h5" gutterBottom>
                                        Total Tickets Sold
                                    </Typography>
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        {stats.totalTicketsSold}
                                    </Typography>
                                    <Divider sx={{ marginBottom: 2 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Overview of total tickets sold across all events.
                                    </Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatsCard>
                                    <Typography variant="h5" gutterBottom>
                                        Revenue Generated
                                    </Typography>
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        ${stats.revenueGenerated.toLocaleString()}
                                    </Typography>
                                    <Divider sx={{ marginBottom: 2 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Total revenue generated from ticket sales.
                                    </Typography>
                                </StatsCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatsCard>
                                    <Typography variant="h5" gutterBottom>
                                        Events Managed
                                    </Typography>
                                    <Typography variant="h3" color="primary" gutterBottom>
                                        {stats.eventsManaged}
                                    </Typography>
                                    <Divider sx={{ marginBottom: 2 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        Total number of events managed in the system.
                                    </Typography>
                                </StatsCard>
                            </Grid>
                        </Grid>
                    </Container>

                    <Container>
                        <Grid container spacing={4}>
                            {ticketData.map((ticket) => (
                                <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                                    <TicketCard>
                                        <TicketCardMedia
                                            image="https://www.eventsindustryforum.co.uk/images/articles/about_the_eif.jpg"
                                            title={ticket.title}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {ticket.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Vendor: {ticket.vendor}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Description: {ticket.description}
                                            </Typography>
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                ${ticket.price.toFixed(2)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Tickets Available: {ticket.totalTickets}
                                            </Typography>
                                        </CardContent>
                                    </TicketCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default TicketReport;
