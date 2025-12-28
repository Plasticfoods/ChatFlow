require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies (optional but useful)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // The exact URL of your React App
  credentials: true,               // Essential for Cookies/Sessions
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Define a basic route for the root URL ('/')
app.get('/', (req, res) => {
    res.send('Hello, World! Your server is running.');
});

app.use('/api', indexRouter);

// Start the server and listen on the defined port
app.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}`);
    await connectDB();
});