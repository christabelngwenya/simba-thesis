const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const shiftmanagementRoutes = require("./routes/shiftmanagementRoutes");
const overtimeRoutes = require('./routes/overtimeRoutes');
const shiftSwapRequestRoutes = require('./routes/shiftSwapRequestRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api', shiftmanagementRoutes);
app.use("/api", overtimeRoutes);
app.use('/api', shiftSwapRequestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});