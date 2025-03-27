require('dotenv').config();
const express = require('express');
const db = require('./Config/db');
const cors = require('cors');
const User = require('./models/userModel');
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating authentication tokens
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('hello google cloud');
})
app.post("/userscreate", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // **Check if user already exists**
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // **Hash the password before saving**
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Store hashed password
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});



app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));