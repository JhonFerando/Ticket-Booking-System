const express = require("express");
const { createCustomer, loginCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require("../controllers/Customer");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

// Route to create a new customer (Signup)
router.post("/signup", createCustomer);

// Route for customer login
router.post("/signin", loginCustomer);

// Route to get all customers (GET request)
router.get("/", authenticateToken, getCustomers);

// Route to get a specific customer by ID (GET request)
router.get("/customers/:id", authenticateToken, getCustomerById);

// Route to update a customer (PUT request)
router.put("/customers/:id", authenticateToken, updateCustomer);

// Route to delete a customer (DELETE request)
router.delete("/customers/:id", authenticateToken, deleteCustomer);

module.exports = router;
