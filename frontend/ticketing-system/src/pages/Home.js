/**
 * @file HomePage.js
 * @description This file defines the `HomePage` component which renders the homepage of the ticketing system application.
 * The homepage features two main sections:
 * - A hero section with a welcome message and a call-to-action button that redirects users to the available tickets page.
 * - A call-to-action section encouraging users to sign up for the ticketing system.
 *
 * The `HomePage` component serves as the entry point to the ticketing system, providing navigation to the primary functionalities.
 *
 * @module HomePage
 * @requires react
 * @requires react-router-dom
 *
 * @author Dharshan
 */

import React from "react";
import {Link} from "react-router-dom";
import "../css/HomePage.css";

/**
 * The `HomePage` component is the landing page of the ticketing system. It includes a hero section
 * with a welcome message and a link to view available tickets, as well as a call-to-action section
 * encouraging users to sign up for the system.
 *
 * @component
 * @example
 * return (
 *   <HomePage />
 * )
 */
const HomePage = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="hero">
                <h1>Welcome to the Ticketing System</h1>
                <p>Effortlessly manage your tasks and streamline operations with our efficient ticketing system.</p>
                <div className="cta">
                    <Link to="/avilable-tickets" className="btn-primary">
                        Available Tickets
                    </Link>
                    <p className="blue">Sign up now and take control of your ticketing process today!</p>
                    <Link to="/signup" className="btn-primary">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
