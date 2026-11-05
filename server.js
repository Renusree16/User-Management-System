const express = require("express");
const cors = require("cors");
const session = require("express-session");

const db = require("./db");
const userRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "user_management_secret",
    resave: false,
    saveUninitialized: true
}));

// Static Files
app.use(express.static("public"));

// Routes
app.use("/users", userRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to User Management System");
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`✅ Server Running at http://localhost:${PORT}`);
});