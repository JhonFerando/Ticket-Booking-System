import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        contact: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/customers/signup", formData);

            if (response.status === 201) {
                setSuccessMessage("Signup successful! Please log in.");
                setErrorMessage(""); // Reset error message
                setFormData({
                    firstName: "",
                    lastName: "",
                    contact: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
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
                <h2>Create an Account</h2>
                <div style={styles.row}>
                    <div style={styles.leftColumn}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="firstName" style={styles.label}>
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your first name"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label htmlFor="lastName" style={styles.label}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your last name"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label htmlFor="contact" style={styles.label}>
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                placeholder="Enter your contact number"
                                pattern="^[0-9]{10}$"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.rightColumn}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>
                                Email Address
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

                        <div style={styles.inputGroup}>
                            <label htmlFor="confirmPassword" style={styles.label}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Re-enter your password"
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" style={styles.submitButton}>
                    Sign Up
                </button>
                {/* Register Link */}
                <div style={styles.registerLink}>
                    Already created an account?{" "}
                    <a href="/login" style={styles.registerLinkAnchor}>
                        Login
                    </a>
                </div>

                {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
                {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
    },
    form: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "900px",
        alignItems: "center",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
    },
    leftColumn: {
        flex: 1,
        paddingRight: "15px",
    },
    rightColumn: {
        flex: 1,
        paddingLeft: "15px",
    },
    inputGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        marginBottom: "5px",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    submitButton: {
        width: "30%",
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "16px",
        cursor: "pointer",
        justifyContent: "center",
    },
    submitButtonHover: {
        backgroundColor: "#45a049",
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

export default Signup;
