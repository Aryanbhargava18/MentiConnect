// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/menticonnect';
        console.log('Connecting to MongoDB:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
        
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected... 🔗');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;