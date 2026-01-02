/**
 * Admin Seeder Script
 * Creates an admin user if it doesn't exist
 * 
 * Usage: npm run seed:admin
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = `${process.env.MONGO_URI}/${process.env.MONGODB_DATABASE_NAME}`;
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB Connected');

        // Admin credentials from environment variables
        const adminEmail = process.env.AUTH_EMAIL || 'admin@krishak.com';
        const adminPassword = process.env.AUTH_PASSWORD || 'Admin@123';
        const adminName = 'Admin';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`⚠️ Admin user already exists with email: ${adminEmail}`);
            console.log('Skipping creation...');
        } else {
            // Create admin user
            const admin = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isActive: true,
                permissions: ['*'], // All permissions
            });

            console.log('✅ Admin user created successfully!');
            console.log(`   Email: ${admin.email}`);
            console.log(`   Role: ${admin.role}`);
        }

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('✅ MongoDB Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

// Run the seeder
seedAdmin();
