/**
 * @file SignIn.js
 * @description This file defines the `SignIn` component which allows users to log in to the ticketing system.
 * The component provides an input form for the user's email and password. Upon form submission, it validates the credentials
 * and either redirects the user based on their role (admin or regular user) or displays an error message.
 *
 * The `SignIn` component also includes a registration link for users who do not have an account.
 *
 * @module SignIn
 * @requires react
 * @requires axios
 *
 * @author Dharshan
 */

import React, {useState} from "react";
import axios from "axios";

/**
 * SignIn component that allows users to log in with their credentials.
 * It includes error handling, success message, and navigation based on the role of the user (admin or regular).
 *
 * @component
 * @example
 * return (
 *   <SignIn />
 * )
 */
const SignIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /**
     * Handles form input changes and updates state with new values.
     *
     * @param {object} e - The change event from the form input.
     */
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    /**
     * Handles form submission by sending login credentials to the backend.
     * On success, redirects based on the user's role (admin or regular user).
     *
     * @param {object} e - The submit event from the form.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for admin credentials before making the API call
        if (formData.email === "dharshan@gmail.com" && formData.password === "dharshan") {
            window.location.href = "/view-tickets";
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/customers/signin",
                formData
            );

            if (response.status === 200) {
                const {userId, token, isAdmin} = response.data;

                localStorage.setItem("authToken", token);

                // If the user is an admin, navigate to the 'View Tickets' page
                if (isAdmin) {
                    window.location.href = "/view-tickets";
                } else {
                    window.location.href = "avilable-tickets";
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error || "Something went wrong!");
            } else {
                setErrorMessage("Network error. Please try again.");
            }
            setSuccessMessage("");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Sign In</h2>

                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        style={styles.input}
                    />
                </div>

                <button type="submit" style={styles.submitButton}>
                    Sign In
                </button>

                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

                {/* Register Link */}
                <div style={styles.registerLink}>
                    Don't have an account?{" "}
                    <a href="/signup" style={styles.registerLinkAnchor}>
                        Register
                    </a>
                </div>
            </form>
        </div>
    );
};

// CSS-in-JS styling
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#D1D5DB",  // Changed to a light background color
    },
    form: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    },
    inputGroup: {
        marginBottom: "20px",
        width: "100%",
    },
    label: {
        display: "block",
        fontSize: "14px",
        marginBottom: "5px",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "12px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxSizing: "border-box",
    },
    submitButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "20px",
    },
    errorMessage: {
        marginTop: "20px",
        textAlign: "center",
        color: "red",
        fontSize: "14px",
    },
    successMessage: {
        marginTop: "20px",
        textAlign: "center",
        color: "green",
        fontSize: "14px",
    },
    registerLink: {
        marginTop: "20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#555",
    },
    registerLinkAnchor: {
        color: "#4CAF50",
        textDecoration: "none",
        fontWeight: "bold",
        cursor: "pointer",
    },
};

export default SignIn;
