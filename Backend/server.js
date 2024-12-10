const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/database");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
