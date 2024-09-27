import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import axios from 'axios'; // Import axios
import authRoutes from './routes/authRoutes.js';
import './passportConfig.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Set to false for better security
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true, // Helps mitigate XSS attacks
    maxAge: 1000 * 60 * 60 * 24 // Session lasts for 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend's origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Allow cookies for cross-origin requests
  }
});

// Routes
app.use('/api', authRoutes);

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.post('/api/ai-chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post('https://api.pawan.krd/v1/chat/completions', {
      messages: [
        {
          role: 'system',
          content:
            'Provide code in proper format that can be displayed within a div tag with proper formatting, using new lines and tab spaces for indentation. Do not include comments or HTML code.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'pai-001',
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GPT_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});



// MongoDB connection with options
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of the default 30s
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
