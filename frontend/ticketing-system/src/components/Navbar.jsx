import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import {Button} from "@mui/material";

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <a href="/">
                    <img
                        src="/favicon-32x32.png"
                        alt="Logo"
                    />
                </a>
            </div>
            <div className="title">
                <h1>TicketTrack: Real-Time Event Booking System</h1>
            </div>
            <div className="login">
                <Button className="login-button" variant="contained" color="primary">
                    <Link to="/login" className="login-link">Login</Link>
                </Button>
            </div>
        </header>
    );
};

export default Header;
