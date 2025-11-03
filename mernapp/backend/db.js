const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://mherrafiq:mheru@cluster0.uto9mgk.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');

    const db = mongoose.connection.db;

    // Fetch food_items
    const foodItemsCollection = db.collection("food_items");
    const food_items = await foodItemsCollection.find({}).toArray();

    // Fetch foodCategory
    const foodCategoryCollection = db.collection("foodCategory");
    const foodCategory = await foodCategoryCollection.find({}).toArray();

    // Make them global
    global.food_items = food_items;
    global.foodCategory = foodCategory;

    console.log("Food items and categories fetched successfully");
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

module.exports = mongoDB;
