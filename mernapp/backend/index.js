require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require("./db");

mongoDB(); // connect MongoDB

app.get('/', (req, res) => {
  res.send('Hello World from backend!');
});

// ✅ Must be before routes
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));
app.use('/api', require("./Routes/OrderData"));

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
