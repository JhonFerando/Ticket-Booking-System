/**
 * Custom pagination component for the ticket table.
 *
 * @param {Object} props - The props for the pagination component.
 * @param {number} props.count - Total number of tickets.
 * @param {number} props.page - The current page number.
 * @param {number} props.rowsPerPage - The number of rows per page.
 * @param {Function} props.onPageChange - Callback to handle page change.
 * @returns {JSX.Element} Pagination component.
 *
 * @author Dharshan
 */

import React, {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material"; // Updated import for MUI v5
import Sidebar from "../components/Sidebar";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles";

const CustomPagination = ({count, page, rowsPerPage, onPageChange}) => {
    return (
        <TablePagination
            component="div"
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            rowsPerPageOptions={[]}
            labelRowsPerPage=""
        />
    );
};

const useStyles = makeStyles((theme) => ({
    searchField: {
        marginBottom: "20px",
        width: "300px",
        borderRadius: "25px",
        "& .MuiOutlinedInput-root": {
            borderRadius: "25px",
            padding: "5px 10px",
        },
        "& .MuiOutlinedInput-input": {
            padding: "8px 14px",
            fontSize: "14px",
        },
    },
    criteriaSelect: {
        marginRight: "45px",
        minWidth: "150px",
        marginBottom: "30px",
    },
    contentContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        flex: 1,
        margin: "15px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "80vh",
    },
    tableContainer: {
        width: "100%",
        overflowX: "auto",
    },
    tableHeadCell: {
        backgroundColor: "#036666",
        color: "#fff",
        fontWeight: "bold",
    },
    tableRow: {
        "&:hover": {
            backgroundColor: "#f1f1f1",
            cursor: "pointer",
        },
    },
    actionButton: {
        margin: "5px",
        fontSize: "14px",
    },
}));

/**
 * The main component for viewing and managing tickets.
 * Displays ticket data, allows for simulation control, search, and pagination.
 *
 * @returns {JSX.Element} ViewTickets component.
 */
const ViewTickets = () => {
    const classes = useStyles();
    const [ticketData, setTicketData] = useState([]);
    const [buttonStates, setButtonStates] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCriteria, setSearchCriteria] = useState("title");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    /**
     * Fetches ticket data from the backend API.
     */
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/tickets");
                setTicketData(response.data);

                // Initialize button states for each ticket
                const initialStates = {};
                response.data.forEach((ticket) => {
                    initialStates[ticket._id] = {start: false, stop: false};
                });
                setButtonStates(initialStates);
            } catch (error) {
                console.error("There was an error fetching the ticket data!", error);
            }
        };

        fetchTicketData();
    }, []);

    /**
     * Handles the update of a ticket by navigating to the update page.
     *
     * @param {string} ticketId - The ID of the ticket to be updated.
     */
    const handleUpdate = (ticketId) => {
        navigate(`/update-ticket/${ticketId}`);
    };

    /**
     * Handles the deletion of a ticket from the system.
     *
     * @param {string} id - The ID of the ticket to be deleted.
     */
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tickets/${id}`);
            setTicketData(ticketData.filter((ticket) => ticket._id !== id));

            Swal.fire("Deleted!", "Ticket has been deleted successfully.", "success");
        } catch (error) {
            console.error("There was an error deleting the ticket!", error);
            Swal.fire("Error!", "Failed to delete the ticket.", "error");
        }
    };

    /**
     * Starts the simulation for a ticket.
     *
     * @param {string} ticketId - The ID of the ticket to start simulation.
     */
    const handleStartSimulation = async (ticketId) => {
        try {
            await axios.post(`http://localhost:5000/api/tickets/simulation/start`, {
                ticketId,
            });

            Swal.fire("Simulation Started", "success");

            setButtonStates((prevStates) => ({
                ...prevStates,
                [ticketId]: {start: true, stop: false},
            }));
        } catch (error) {
            console.error("Error starting simulation", error);
            Swal.fire("Error!", "Failed to start the simulation.", "error");
        }
    };

    /**
     * Stops the simulation for a ticket.
     *
     * @param {string} ticketId - The ID of the ticket to stop simulation.
     */
    const handleStopSimulation = async (ticketId) => {
        try {
            await axios.post(`http://localhost:5000/api/tickets/simulation/stop`, {
                ticketId,
            });

            Swal.fire("Simulation Stopped", "success");

            setButtonStates((prevStates) => ({
                ...prevStates,
                [ticketId]: {start: false, stop: true},
            }));
        } catch (error) {
            console.error("Error stopping simulation", error);
            Swal.fire("Error!", "Failed to stop the simulation.", "error");
        }
    };

    /**
     * Handles the change of the search query for ticket filtering.
     *
     * @param {Object} event - The change event from the search input.
     */
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    /**
     * Handles the change of the search criteria (field to search by).
     *
     * @param {Object} event - The change event from the select dropdown.
     */
    const handleCriteriaChange = (event) => {
        setSearchCriteria(event.target.value);
    };

    /**
     * Handles the change of the current page in the ticket table pagination.
     *
     * @param {Object} event - The change event.
     * @param {number} newPage - The new page number.
     */
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Filter tickets based on the search query and criteria
    const filteredTickets = ticketData.filter((ticket) => {
        if (!searchQuery) return true;
        const field = ticket[searchCriteria]?.toString().toLowerCase();
        return field?.startsWith(searchQuery.toLowerCase());
    });

    // Paginate filtered tickets
    const paginatedTickets = filteredTickets.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box display="flex">
            <Sidebar/>
            <Box className={classes.contentContainer}>
                <Typography variant="h4" gutterBottom align="center" style={{color: "#036666", fontWeight: "bold"}}>
                    Tickets In the System
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <TextField
                        label="Search Tickets"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        fullWidth
                        className={classes.searchField}
                    />

                    <FormControl variant="outlined" className={classes.criteriaSelect}>
                        <InputLabel>Search Criteria</InputLabel>
                        <Select value={searchCriteria} onChange={handleCriteriaChange} label="Search Criteria">
                            <MenuItem value="title">Title</MenuItem>
                            <MenuItem value="vendor">Vendor</MenuItem>
                            <MenuItem value="maxTicketCapacity">Max Capacity</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.tableHeadCell}>
                                <TableCell>ID</TableCell>
                                <TableCell>Vendor</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Total Tickets</TableCell>
                                <TableCell>Max Capacity</TableCell>
                                <TableCell>Release Rate</TableCell>
                                <TableCell>Retrieval Rate</TableCell>
                                <TableCell>Simulation Start</TableCell>
                                <TableCell>Simulation Stop</TableCell>
                                <TableCell>Update</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedTickets.map((ticket) => (
                                <TableRow key={ticket._id} className={classes.tableRow}>
                                    <TableCell>{ticket._id?.slice(-5)}</TableCell>
                                    <TableCell>{ticket.vendor}</TableCell>
                                    <TableCell>{ticket.title}</TableCell>
                                    <TableCell>{ticket.totalTickets}</TableCell>
                                    <TableCell>{ticket.maxTicketCapacity}...</TableCell>
                                    <TableCell>{ticket.ticketReleaseRate}</TableCell>
                                    <TableCell>{ticket.customerRetrievalRate}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleStartSimulation(ticket._id)}
                                            disabled={buttonStates[ticket._id]?.start}
                                            variant="contained"
                                            color="primary"
                                            className={classes.actionButton}
                                        >
                                            Start
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleStopSimulation(ticket._id)}
                                            disabled={buttonStates[ticket._id]?.stop}
                                            variant="contained"
                                            color="secondary"
                                            className={classes.actionButton}
                                        >
                                            Stop
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            style={{backgroundColor: "#d4ac0d", color: "white"}}
                                            onClick={() => handleUpdate(ticket._id)}
                                            className={classes.actionButton}
                                        >
                                            Update
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            style={{backgroundColor: "#e74c3c", color: "white"}}
                                            onClick={() => handleDelete(ticket._id)}
                                            className={classes.actionButton}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <CustomPagination
                    count={filteredTickets.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                />
            </Box>
        </Box>
    );
};

export default ViewTickets;
