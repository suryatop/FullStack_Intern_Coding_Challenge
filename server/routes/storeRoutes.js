import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Store Owner Ratings Dashboard



router.get('/ratings', verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  const storeId = req.userId;

  try {
    const [[store]] = await db.query('SELECT role_id FROM users WHERE id = ?', [storeId]);
    if (!store || store.role_id !== 103) {
      return res.status(403).json({ message: 'Not authorized as store owner.' });
    }

    const [ratings] = await db.query(
      `SELECT u.username, u.email, r.rating, r.comment
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    const [[avg]] = await db.query(
      'SELECT ROUND(AVG(rating), 1) AS average FROM ratings WHERE store_id = ?',
      [storeId]
    );

    res.status(200).json({ ratings, average: avg.average || null });

  } catch (err) {
    console.error('Failed to fetch ratings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List all stores for users (with average and personal rating/comment)
router.get('/stores', verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  const userId = req.userId;

  try {
    const [stores] = await db.query(
      `SELECT 
         u.id AS store_id,
         u.username,
         u.address,
         ROUND(AVG(r.rating), 1) AS average_rating,
         (
           SELECT rating FROM ratings ur 
           WHERE ur.user_id = ? AND ur.store_id = u.id 
           LIMIT 1
         ) AS user_rating,
         (
           SELECT comment FROM ratings ur 
           WHERE ur.user_id = ? AND ur.store_id = u.id 
           LIMIT 1
         ) AS user_comment
       FROM users u
       LEFT JOIN ratings r ON r.store_id = u.id
       WHERE u.role_id = 103
       GROUP BY u.id, u.username, u.address`,
      [userId, userId] // used twice for rating + comment
    );

    res.status(200).json({ stores });

  } catch (err) {
    console.error('Store fetch error:', err);
    res.status(500).json({ message: 'Server error fetching stores' });
  }
});

// Submit or update a rating



router.post('/ratings', verifyToken, async (req, res) => {
  const db = await connectToDatabase();
  const { store_id, rating, comment } = req.body;
  const user_id = req.userId;

  if (!store_id || !rating) {
    return res.status(400).json({ message: 'Store ID and rating required.' });
  }

  try {
    const [[store]] = await db.query('SELECT role_id FROM users WHERE id = ?', [store_id]);
    if (!store || store.role_id !== 103) {
      return res.status(400).json({ message: 'Invalid store ID.' });
    }

    const [existing] = await db.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE ratings SET rating = ?, comment = ? WHERE user_id = ? AND store_id = ?',
        [rating, comment || null, user_id, store_id]
      );
      console.log('✏️ Rating updated');
    } else {
      await db.query(
        'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
        [user_id, store_id, rating, comment || null]
      );
      console.log(' Rating inserted');
    }

    res.status(201).json({ message: 'Rating submitted.' });

  } catch (err) {
    console.error(' Rating submission error:', err);
    res.status(500).json({ message: 'Server error submitting rating.' });
  }
});

export default router;
