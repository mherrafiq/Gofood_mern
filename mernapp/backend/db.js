const mongoose = require('mongoose');
mongoose.set('bufferCommands', false); // Global disable

// Standard Connection String (used to bypass DNS/SRV connection errors)
const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
  console.log("Connecting to MongoDB...");
  console.log("URI being used:", mongoURI);
  try {
    await mongoose.connect(mongoURI, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferTimeoutMS: 1000, // If somehow it buffers, fail in 1s
    });
    console.log('✅ MongoDB connected successfully');

    const db = mongoose.connection.db;
    const food_items = await db.collection("food_items").find({}).toArray();
    const foodCategory = await db.collection("foodCategory").find({}).toArray();

    global.food_items = food_items;
    global.foodCategory = foodCategory;

    console.log("✅ Food items and categories fetched successfully");
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (
      error.message.includes('whitelist') ||
      error.message.includes('IP address') ||
      error.message.includes('Could not connect to any servers') ||
      error.message.includes('timeout')
    ) {
      console.warn('\n' + '!'.repeat(50));
      console.warn('🚨 ACTION REQUIRED: YOUR CONNECTION IS BEING BLOCKED');
      console.warn('This is almost certainly an IP Whitelist issue in MongoDB Atlas.');
      console.warn('\nSTEPS TO FIX:');
      console.warn('1. Log in to: https://cloud.mongodb.com/');
      console.warn('2. Click "Network Access" in the left sidebar.');
      console.warn('3. Click "+ ADD IP ADDRESS".');
      console.warn('4. Select "Allow Access From Anywhere" (0.0.0.0/0).');
      console.warn('5. Click "Confirm" and wait 60 seconds.');
      console.warn('6. Restart your server (node server.js).');
      console.warn('!'.repeat(50) + '\n');
    }
  }
};

module.exports = mongoDB;