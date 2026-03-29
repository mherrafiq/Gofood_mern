const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const restoreHash = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    const email = 'rihhaaaa@gmail.com';
    const originalHash = '$2b$10$cGWZh7tMO.odG/SatnWsneKv.4qE5fC64Zr6ryPP/xeY1gXjBUs8C';

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: originalHash },
      { new: true }
    );

    if (user) {
      console.log(`✅ Original hash restored successfully for ${email}`);
    } else {
      console.log(`❌ User with email ${email} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring hash:', error.message);
    process.exit(1);
  }
};

restoreHash();
