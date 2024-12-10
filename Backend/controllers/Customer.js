const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// Signup: Create a new customer
const createCustomer = async (req, res) => {
    const { firstName, lastName, contact, email, password, confirmPassword } = req.body;

    try {
        console.log("Received data:", req.body);

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if customer already exists by NIC or email
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer with this NIC or email already exists' });
        }

        // Hash the password before saving
        const saltRounds = 10; // Salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);  // Ensure both arguments are passed

        // Create new customer
        const newCustomer = new Customer({
            firstName,
            lastName,
            contact,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword, // Do not save confirmPassword
        });

        await newCustomer.save();
        console.log('Customer details saved inside the database.');
        res.status(201).json({ message: 'Customer created successfully!' });
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ error: error.message });
    }
};

// Login: Authenticate a customer
const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ error: 'Customer not found' });
        }

        // Compare password with hashed password
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back the user ID along with the token
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: customer._id, // Include user ID in response
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = { createCustomer, loginCustomer, authenticateToken };
