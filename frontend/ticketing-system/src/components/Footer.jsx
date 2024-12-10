import React from "react";
import "../css/Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Social media icons

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2024 Ticketing System. All rights reserved.</p>
            <p>Contact us: <a href="mailto:support@ticketingsystem.com">support@ticketingsystem.com</a></p>

            <div className="footer-links">
                <a href="/about">About Us</a>
                <a href="/terms">Terms of Service</a>
                <a href="/privacy">Privacy Policy</a>
            </div>

            <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
