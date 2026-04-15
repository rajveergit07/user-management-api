const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(express.json()); // JSON data read karne ke liye

// --- 1. Database Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- 2. Security (Basic Auth Middleware) ---
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'mysecrettoken') {
        next(); 
    } else {
        res.status(401).json({ message: "Unauthorized: Access Denied" });
    }
};

// --- 3. API Endpoints (CRUD) ---

// CREATE: Naya user banane ke liye
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ: Saare users dekhne ke liye (Protected with Auth)
app.get('/api/users', basicAuth, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// DELETE: User delete karne ke liye
app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
});

// Server Start
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));