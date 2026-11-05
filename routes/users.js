const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// ==========================
// Register
// ==========================
router.post("/register", async (req, res) => {

    const { name, email, password, phone } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length > 0) {
                return res.json({
                    message: "Email Already Exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users(name,email,password,phone) VALUES(?,?,?,?)",
                [name, email, hashedPassword, phone],
                (err, result) => {

                    if (err) return res.status(500).json(err);

                    res.json({
                        message: "Registration Successful"
                    });

                }
            );

        }
    );

});

// ==========================
// Login
// ==========================
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid Email"
                });
            }

            const valid = await bcrypt.compare(password, result[0].password);

            if (!valid) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

            req.session.user = {
                id: result[0].user_id,
                name: result[0].name,
                email: result[0].email
            };

            res.json({
                message: "Login Successful"
            });

        }
    );

});

// ==========================
// Logout
// ==========================
router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Logged Out Successfully"
        });

    });

});

// ==========================
// Check Login
// ==========================
router.get("/check-login", (req, res) => {

    if (req.session.user) {

        res.json({
            loggedIn: true,
            user: req.session.user
        });

    } else {

        res.json({
            loggedIn: false
        });

    }

});

// ==========================
// Get All Users
// ==========================
router.get("/", (req, res) => {

    db.query("SELECT * FROM users", (err, result) => {

        if (err) return res.status(500).json(err);

        res.json(result);

    });

});

// ==========================
// Add User
// ==========================
router.post("/", (req, res) => {

    const { name, email, password, phone } = req.body;

    db.query(
        "INSERT INTO users(name,email,password,phone) VALUES(?,?,?,?)",
        [name, email, password, phone],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "User Added Successfully",
                id: result.insertId
            });

        }
    );

});

// ==========================
// Get User By ID
// ==========================
router.get("/:id", (req, res) => {

    db.query(
        "SELECT * FROM users WHERE user_id=?",
        [req.params.id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result);

        }
    );

});

// ==========================
// Update User
// ==========================
router.put("/:id", (req, res) => {

    const { name, email, password, phone } = req.body;

    db.query(
        "UPDATE users SET name=?,email=?,password=?,phone=? WHERE user_id=?",
        [name, email, password, phone, req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "User Updated Successfully"
            });

        }
    );

});

// ==========================
// Delete User
// ==========================
router.delete("/:id", (req, res) => {

    db.query(
        "DELETE FROM users WHERE user_id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "User Deleted Successfully"
            });

        }
    );

});

module.exports = router;