import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddConfiguration from "./pages/AddConfiguration";
import ViewAllTickets from "./pages/ViewAllTickets";
import UpdateSingleTicket from "./pages/UpdateSingleTicket";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import BuyTicket from "./pages/BuyTicket";
import TicketLogs from "./pages/TicketLogs";
import TicketReport from './pages/TicketReport';

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-ticket" element={<AddConfiguration />} />
                <Route path="/view-tickets" element={<ViewAllTickets />} />
                <Route path="/avilable-tickets" element={<BuyTicket />} />
                <Route path="/update-ticket/:id" element={<UpdateSingleTicket />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/logs" element={<TicketLogs />} />
                <Route path="/report" element={<TicketReport />} />
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
