const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    const email = 'rihhaaaa@gmail.com';
    const newPassword = '12345'; // Plain text password

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: newPassword },
      { new: true }
    );

    if (user) {
      console.log(`✅ Password reset successfully for ${email}`);
      console.log(`New password is: ${newPassword}`);
    } else {
      console.log(`❌ User with email ${email} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    process.exit(1);
  }
};

resetPassword();
