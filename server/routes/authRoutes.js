import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// REGISTER



router.post('/register', async (req, res) => {
  try {
    const { username, email, password, address, role_id } = req.body;

    if (!username || !email || !password || !address || !role_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const db = await connectToDatabase();
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password, address, role_id) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, address, role_id]
    );

    // Custom status codes for roles



    let status = 201; // Normal user for roledb
    if (role_id === 103) status = 301; // Store owner
    else if (role_id === 101) status = 701; // Admin

    console.log("Registered:", { email, role_id });

    return res.status(status).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: "Server error during registration." });
  }
});

// LOGIN



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = await connectToDatabase();
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '3h' });

    let role = 'user';
    if (user.role_id === 101) role = 'admin';
    else if (user.role_id === 103) role = 'store';

    console.log(`Login: ${email} as ${role}`);

    return res.status(201).json({ token, role });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// AUTHENTICATED HOME FETCH



router.get('/home', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [req.userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({ user: users[0] });
  } catch (err) {
    console.error("Home route error:", err.message);
    return res.status(500).json({ message: "Server error fetching user info." });
  }
});

// server/routes/authRoutes.js



router.put('/update-password', verifyToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const db = await connectToDatabase();

    await db.query('UPDATE users SET password = ? WHERE id = ?', [
      hashedPassword,
      req.userId,
    ]);

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error("Update password error:", err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
