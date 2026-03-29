const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    const email = 'rihhaaaa@gmail.com';
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      console.log('--- User Found ---');
      console.log('Email:', user.email);
      console.log('Password (in DB):', `"${user.password}"`); // Use quotes to see spaces
      console.log('---');
    } else {
      console.log(`❌ User with email ${email} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking user:', error.message);
    process.exit(1);
  }
};

checkUser();
