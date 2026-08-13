const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync';
    await mongoose.connect(mongoUri);
    console.log(`[Admin Seeder] Connected to MongoDB at ${mongoUri}`);

    const adminEmail = 'admin@skillsync.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`[Admin Seeder] Admin user already exists: ${adminEmail} (Role: ${existingAdmin.role})`);
      process.exit(0);
    }

    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: adminEmail,
      password: 'Admin@123456',
      role: 'admin',
      isActive: true
    });

    console.log(`[Admin Seeder] Successfully created Admin user:`);
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Role:  ${adminUser.role}`);
    console.log(`  Password: Admin@123456`);

    process.exit(0);
  } catch (error) {
    console.error(`[Admin Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
