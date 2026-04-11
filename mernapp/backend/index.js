require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db");

// ✅ Middleware to ensure MongoDB is connected before handling requests (Crucial for Serverless)
app.use(async (req, res, next) => {
  try {
    await mongoDB();
    next();
  } catch (err) {
    res.status(500).send("Database connection error");
  }
});

app.get('/', (req, res) => {
  res.send('Hello World from backend!');
});

// ✅ Must be before routes
app.use(express.json());

// ✅ Enable CORS (Robust management)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const serverless = require('serverless-http');

app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));
app.use('/api', require("./Routes/UserActions"));

// Serve static images from uploads folder
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Local Server (Only runs locally, not in Netlify)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running locally on port ${port}`);
  });
}

// ✅ Correct Exports for Netlify
module.exports = app;
module.exports.handler = serverless(app);


