import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config(); // Load .env variables

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
}));

app.use(express.json());

// Test route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// API routes
app.use('/auth', authRouter);
app.use('/store', storeRoutes); 
app.use('/admin', adminRoutes);

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
