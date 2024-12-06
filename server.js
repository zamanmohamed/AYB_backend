require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Add the path module

const capitalRoutes = require("./routes/capitalRoutes");
const customerRoutes = require("./routes/customerRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use("/api/capital", capitalRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/transaction", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
