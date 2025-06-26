import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Validators


const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (pw) => /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(pw);
const isValidName = (name) => name.length >= 20 && name.length <= 60;
const isValidAddress = (addr) => addr.length <= 400;

// POST /admin/register — Admin signup (with detailed errors)


router.post('/register', async (req, res) => {
  const { username, email, password, address, role_id } = req.body;

  if (!username) return res.status(400).json({ message: 'Name is required.' });
  if (!email) return res.status(400).json({ message: 'Email is required.' });
  if (!password) return res.status(400).json({ message: 'Password is required.' });
  if (!address) return res.status(400).json({ message: 'Address is required.' });
  if (!role_id) return res.status(400).json({ message: 'Role is required.' });

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: 'Password must be 8–16 characters long, include one uppercase letter and one special character.'
    });
  }
  if (!isValidName(username)) {
    return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
  }
  if (!isValidAddress(address)) {
    return res.status(400).json({ message: 'Address must be 400 characters or fewer.' });
  }

  try {
    const db = await connectToDatabase();
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, email, password, address, role_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, address, role_id]
    );

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET /admin/dashboard




router.get('/dashboard', verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  try {
    const [[users]] = await db.query('SELECT COUNT(*) AS count FROM users WHERE role_id = 102');
    const [[stores]] = await db.query('SELECT COUNT(*) AS count FROM users WHERE role_id = 103');
    const [[ratings]] = await db.query('SELECT COUNT(*) AS count FROM ratings');

    res.status(200).json({
      totalUsers: users.count,
      totalStores: stores.count,
      totalRatings: ratings.count,
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /admin/add-user



router.post('/add-user', verifyToken, async (req, res) => {
  const { username, email, password, address, role_id } = req.body;

  if (!username || !email || !password || !address || !role_id) {
    return res.status(400).json({ message: 'All fields required.' });
  }
  if (!isValidEmail(email)) return res.status(400).json({ message: 'Invalid email.' });
  if (!isValidPassword(password)) return res.status(400).json({ message: 'Invalid password.' });
  if (!isValidName(username)) return res.status(400).json({ message: 'Name must be 20–60 characters.' });
  if (!isValidAddress(address)) return res.status(400).json({ message: 'Address too long.' });

  try {
    const db = await connectToDatabase();
    const [exists] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (exists.length > 0) return res.status(409).json({ message: 'User already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, email, password, address, role_id) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashed, address, role_id]
    );

    res.status(201).json({ message: 'User added successfully.' });
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /admin/update-password



router.put('/update-password', verifyToken, async (req, res) => {
  const { newPassword } = req.body;
  const adminId = req.userId;

  if (!newPassword || !isValidPassword(newPassword)) {
    return res.status(400).json({ message: 'Invalid or missing password.' });
  }

  try {
    const db = await connectToDatabase();
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, adminId]);

    res.status(200).json({ message: 'Password updated.' });
  } catch (err) {
    console.error(' Admin password update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/users



router.get('/users', verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  const { name = '', email = '', address = '', role = '' } = req.query;

  try {
    const [users] = await db.query(
      `
      SELECT 
        u.id, u.username, u.email, u.address, u.role_id,
        CASE WHEN u.role_id = 103 THEN (
          SELECT ROUND(AVG(r.rating), 1) FROM ratings r WHERE r.store_id = u.id
        ) ELSE NULL END AS average_rating
      FROM users u
      WHERE u.username LIKE ? AND u.email LIKE ? AND u.address LIKE ? AND
            (? = '' OR u.role_id = ?)
      `,
      [`%${name}%`, `%${email}%`, `%${address}%`, role, role]
    );

    res.status(200).json({ users });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
