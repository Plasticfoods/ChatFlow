require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const cors = require('cors');
const { Server } = require("socket.io"); // 1. Import Socket.io
const http = require("http");
const socketHandler = require('./socket/socketHandler');
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./config/uploadthing");  

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Env Mode", process.env.NODE_ENV);
let clientUrl;
if (process.env.NODE_ENV === 'development') {
  clientUrl = process.env.CLIENT_URL_LOCAL;
} else {
  clientUrl = process.env.CLIENT_URL;
}
console.log("Client URL: ", clientUrl);

// Middleware to parse JSON bodies (optional but useful)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: clientUrl,
  credentials: true,               // Essential for Cookies/Sessions
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Define a basic route for the root URL ('/')
app.get('/', (req, res) => {
    res.send('Hello, World! Your server is running.');
});

// Use the index router for all '/api' routes
app.use('/api', indexRouter);
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      uploadthingtoken: process.env.UPLOADTHING_TOKEN, 
    },
  })
);

// --- SOCKET SETUP START ---
// 4. Create standard HTTP server wrapping Express
const server = http.createServer(app);

// 5. Initialize Socket.io on that server
const io = new Server(server, {
  pingTimeout: 60000, // Wait 60s before closing connection to save bandwidth
  cors: {
    origin: clientUrl, // Allow Frontend to connect
    credentials: true,
  },
});

// 6. Connect your logic handler
socketHandler(io);

// app.listen() CHANGE TO: server.listen(...) which includes Socket.io
server.listen(PORT, async () => {
    console.log(`Server is running on ${PORT}`);
    // It is often better to connect to DB before starting the server, 
    // but doing it here is also valid.
    await connectDB(); 
});