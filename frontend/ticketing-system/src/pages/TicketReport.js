import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../components/Sidebar";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "none",
    border: "none",
}));

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: "white",
    color: "black",
    border: "1px solid #DDD",
    padding: theme.spacing(1),
    textAlign: "center",
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: "#036666",
    color: "white",
    border: "1px solid #DDD",
    textAlign: "center",
    fontWeight: "600",
}));

const TicketReport = () => {
    const [ticketData, setTicketData] = useState([]);

    // Fetch ticket data from API
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/tickets");
                setTicketData(response.data);
            } catch (error) {
                console.error("There was an error fetching the ticket data!", error);
            }
        };
        fetchTicketData();
    }, []);

    // Generate PDF function
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
                    alignItems="center"
                    justifyContent="center"
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
                    {/* PDF Download Button */}
                    <Box display="flex" justifyContent="flex-end" marginBottom={2} className="no-print-button">
                        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                    </Box>

                    {/* Letterhead Section */}
                    <StyledLetterhead>
                        <Typography variant="h4" gutterBottom>
                            Event Ticketing System
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Ticket Management Report
                        </Typography>
                    </StyledLetterhead>

                    {/* Ticket Table */}
                    <StyledTableContainer component={Paper}>
                        <Table aria-label="ticket table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableHeadCell>Vendor</StyledTableHeadCell>
                                    <StyledTableHeadCell>Title</StyledTableHeadCell>
                                    <StyledTableHeadCell>Price</StyledTableHeadCell>
                                    <StyledTableHeadCell>Description</StyledTableHeadCell>
                                    <StyledTableHeadCell>Total Tickets</StyledTableHeadCell>
                                    <StyledTableHeadCell>Release Rate</StyledTableHeadCell>
                                    <StyledTableHeadCell>Retrieval Rate</StyledTableHeadCell>
                                    <StyledTableHeadCell>Max Capacity</StyledTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketData.map((ticket) => (
                                    <TableRow key={ticket._id}>
                                        <StyledTableCell>{ticket.vendor}</StyledTableCell>
                                        <StyledTableCell>{ticket.title}</StyledTableCell>
                                        <StyledTableCell>{ticket.price}</StyledTableCell>
                                        <StyledTableCell>{ticket.description}</StyledTableCell>
                                        <StyledTableCell>{ticket.totalTickets}</StyledTableCell>
                                        <StyledTableCell>{ticket.ticketReleaseRate}</StyledTableCell>
                                        <StyledTableCell>{ticket.customerRetrievalRate}</StyledTableCell>
                                        <StyledTableCell>{ticket.maxTicketCapacity}</StyledTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                </Box>
            </Box>
        </Box>
    );
};

export default TicketReport;
