const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "MynameisEndtoEndYoutubeChannel$*"


// CREATE USER
router.post("/createuser", [
    body('email').isEmail().withMessage('Invalid email'),
    body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // Check if email already exists
        let existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered. Please login or use a different email."
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email.toLowerCase(),
            location: req.body.location
        });

        console.log("✅ New user created:", newUser.email);
        return res.json({
            success: true,
            message: "User created successfully! Please login."
        });

    } catch (error) {
        console.error("❌ Error in createuser:", error.message);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already registered. Please use a different email."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});


// LOGIN USER
router.post("/loginuser", [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        let email = req.body.email.toLowerCase();
        let userData = await User.findOne({ email });

        if (!userData) {
            return res.status(400).json({
                success: false,
                message: "User not found. Please create an account first."
            });
        }

        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

        if (!pwdCompare) {
            return res.status(400).json({
                success: false,
                message: "Invalid password. Please try again."
            });
        }

        const data = {
            user: {
                id: userData.id,
                email: userData.email
            }
        };

        const authToken = jwt.sign(data, jwtSecret);

        console.log("✅ User logged in:", email);
        return res.json({
            success: true,
            authToken: authToken,
            userName: userData.name,
            message: "Login successful!"
        });

    } catch (error) {
        console.error("❌ Error in loginuser:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});


module.exports = router;