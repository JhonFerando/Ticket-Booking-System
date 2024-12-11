import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
    Pagination,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    contentContainer: {
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        padding: "20px",
        margin: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "80vh",
    },
    searchField: {
        marginBottom: "20px",
        width: "100%",
        maxWidth: "300px",
    },
    criteriaSelect: {
        marginBottom: "20px",
        width: "100%",
        maxWidth: "300px",
    },
    ticketCard: {
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        margin: "15px",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
        },
    },
    ticketHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    chip: {
        fontWeight: "bold",
    },
    pagination: {
        marginTop: "20px",
    },
    button: {
        fontWeight: "bold",
        borderRadius: "8px",
        padding: "8px 20px",
    },
    updateButton: {
        background: "linear-gradient(to right, #4caf50, #81c784)",
        color: "#fff",
        "&:hover": {
            background: "linear-gradient(to right, #388e3c, #66bb6a)",
        },
    },
    deleteButton: {
        background: "linear-gradient(to right, #e57373, #f44336)",
        color: "#fff",
        "&:hover": {
            background: "linear-gradient(to right, #c62828, #f44336)",
        },
    },
    startButton: {
        background: "linear-gradient(to right, #1976d2, #42a5f5)",
        color: "#fff",
        "&:hover": {
            background: "linear-gradient(to right, #1565c0, #1e88e5)",
        },
    },
    stopButton: {
        background: " #800000",
        color: "#fff",
        "&:hover": {
            background: "#ff4d4d",
        },
    },
}));

const ViewTickets = () => {
    const classes = useStyles();
    const [ticketData, setTicketData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCriteria, setSearchCriteria] = useState("title");
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/tickets");
                setTicketData(response.data);
            } catch (error) {
                console.error("Error fetching ticket data:", error);
            }
        };

        fetchTicketData();
    }, []);

    const handleUpdate = (ticketId) => {
        navigate(`/update-ticket/${ticketId}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tickets/${id}`);
            setTicketData(ticketData.filter((ticket) => ticket._id !== id));
            Swal.fire("Deleted!", "Ticket has been deleted successfully.", "success");
        } catch (error) {
            Swal.fire("Error!", "Failed to delete the ticket.", "error");
        }
    };

    const handleStartSimulation = async (ticketId) => {
        try {
            await axios.post(`http://localhost:5000/api/tickets/simulation/start`, { ticketId });
            Swal.fire("Simulation Started!", "Simulation started successfully.", "success");
        } catch (error) {
            Swal.fire("Error!", "Failed to start the simulation.", "error");
        }
    };

    const handleStopSimulation = async (ticketId) => {
        try {
            await axios.post(`http://localhost:5000/api/tickets/simulation/stop`, { ticketId });
            Swal.fire("Simulation Stopped!", "Simulation stopped successfully.", "success");
        } catch (error) {
            Swal.fire("Error!", "Failed to stop the simulation.", "error");
        }
    };

    const filteredTickets = ticketData.filter((ticket) => {
        if (!searchQuery) return true;
        const field = ticket[searchCriteria]?.toString().toLowerCase();
        return field?.includes(searchQuery.toLowerCase());
    });

    // Pagination Logic
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Box display="flex">
            <Sidebar />
            <Box className={classes.contentContainer} width="100%">
                <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", color: "#036666" }}>
                    Manage Tickets
                </Typography>
                <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                    <TextField
                        label="Search Tickets"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={classes.searchField}
                    />
                    <FormControl variant="outlined" className={classes.criteriaSelect}>
                        <InputLabel>Search Criteria</InputLabel>
                        <Select
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                            label="Search Criteria"
                        >
                            <MenuItem value="title">Title</MenuItem>
                            <MenuItem value="vendor">Vendor</MenuItem>
                            <MenuItem value="maxTicketCapacity">Max Capacity</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Grid container spacing={3}>
                    {currentTickets.map((ticket) => (
                        <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                            <Card className={classes.ticketCard}>
                                <CardContent>
                                    <Box className={classes.ticketHeader} display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" style={{ fontWeight: "bold", color: "#2A2A3C" }}>
                                            {ticket.title}
                                        </Typography>
                                        <Chip
                                            label={`${ticket.maxTicketCapacity} Max Capacity`}
                                            color="primary"
                                            className={classes.chip}
                                            style={{ fontWeight: "bold", fontSize: "14px" }}
                                        />
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="body2" style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
                                            <strong>Vendor:</strong> {ticket.vendor}
                                        </Typography>
                                        <Typography variant="body2" style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginTop: "8px" }}>
                                            <strong>Total Tickets:</strong> {ticket.totalTickets}
                                        </Typography>
                                        <Typography variant="body2" style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginTop: "8px" }}>
                                            <strong>Release Rate:</strong> {ticket.ticketReleaseRate}
                                        </Typography>
                                        <Typography variant="body2" style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginTop: "8px" }}>
                                            <strong>Retrieval Rate:</strong> {ticket.customerRetrievalRate}
                                        </Typography>
                                    </Box>
                                </CardContent>

                                <CardActions>
                                    <Button
                                        className={`${classes.button} ${classes.startButton}`}
                                        onClick={() => handleStartSimulation(ticket._id)}
                                    >
                                        Start Simulation
                                    </Button>
                                    <Button
                                        className={`${classes.button} ${classes.stopButton}`}
                                        onClick={() => handleStopSimulation(ticket._id)}
                                    >
                                        Stop Simulation
                                    </Button>
                                    <Button
                                        className={`${classes.button} ${classes.updateButton}`}
                                        onClick={() => handleUpdate(ticket._id)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        className={`${classes.button} ${classes.deleteButton}`}
                                        onClick={() => handleDelete(ticket._id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box className={classes.pagination} display="flex" justifyContent="center">
                    <Pagination
                        count={Math.ceil(filteredTickets.length / ticketsPerPage)}
                        page={currentPage}
                        onChange={(e, page) => paginate(page)}
                        variant="outlined"
                        shape="rounded"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ViewTickets;
