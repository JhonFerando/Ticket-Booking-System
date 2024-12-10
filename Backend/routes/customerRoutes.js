const express = require("express");
const { createCustomer, loginCustomer } = require("../controllers/Customer");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

// Route to create a new customer (Signup)
router.post("/signup", createCustomer);

// Route for customer login
router.post("/signin", loginCustomer);

module.exports = router;
