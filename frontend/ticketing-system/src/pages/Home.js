import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css";

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
                </div>
            </div>

            {/* Call-to-Action Section */}
            <section className="call-to-action">
                <h2>Ready to Get Started?</h2>
                <p>Sign up now and take control of your ticketing process today!</p>
                <Link to="/signup" className="btn-primary">
                    Sign Up
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
