#!/bin/bash

echo "🗄️  Setting up MentiConnect Database"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if MongoDB is running
print_info "Checking MongoDB connection..."

# Try to connect to MongoDB
if command -v mongosh &> /dev/null; then
    # Use mongosh (newer MongoDB shell)
    if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        print_status "MongoDB is running and accessible"
    else
        print_warning "MongoDB is not running. Please start MongoDB first."
        print_info "To start MongoDB:"
        print_info "  • On macOS: brew services start mongodb-community"
        print_info "  • On Linux: sudo systemctl start mongod"
        print_info "  • On Windows: net start MongoDB"
        exit 1
    fi
elif command -v mongo &> /dev/null; then
    # Use mongo (older MongoDB shell)
    if mongo --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        print_status "MongoDB is running and accessible"
    else
        print_warning "MongoDB is not running. Please start MongoDB first."
        exit 1
    fi
else
    print_warning "MongoDB shell not found. Please install MongoDB first."
    print_info "Install MongoDB: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

# Create database and collections
print_info "Creating database and collections..."

# Create the database and collections using Node.js
cd menti-connect-backend

node -e "
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/menticonnect');
    console.log('✅ Connected to MongoDB');

    // Create collections by importing models
    const User = require('./models/User');
    const Goal = require('./models/Goal');
    const Message = require('./models/Message');
    const Conversation = require('./models/Conversation');
    const Notification = require('./models/Notification');
    const Feedback = require('./models/Feedback');

    console.log('✅ All models loaded successfully');

    // Create indexes for better performance
    console.log('Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ githubId: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ skills: 1 });
    
    // Goal indexes
    await Goal.collection.createIndex({ userId: 1 });
    await Goal.collection.createIndex({ status: 1 });
    await Goal.collection.createIndex({ priority: 1 });
    
    // Message indexes
    await Message.collection.createIndex({ conversation: 1 });
    await Message.collection.createIndex({ sender: 1 });
    await Message.collection.createIndex({ createdAt: -1 });
    
    // Conversation indexes
    await Conversation.collection.createIndex({ participants: 1 }, { unique: true });
    await Conversation.collection.createIndex({ lastMessageAt: -1 });
    
    // Notification indexes
    await Notification.collection.createIndex({ recipient: 1 });
    await Notification.collection.createIndex({ read: 1 });
    await Notification.collection.createIndex({ createdAt: -1 });
    
    console.log('✅ Database indexes created');

    // Insert sample data
    console.log('Inserting sample data...');
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      // Create sample users
      const sampleUsers = [
        {
          githubId: '12345678',
          username: 'johndoe',
          email: 'john@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/12345678?v=4',
          role: 'mentor',
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
          mentoringCapacity: 3,
          availability: ['Mon 6-8pm', 'Wed 7-9pm', 'Fri 5-7pm'],
          githubAccessToken: 'sample_token_1'
        },
        {
          githubId: '87654321',
          username: 'janedoe',
          email: 'jane@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/87654321?v=4',
          role: 'mentee',
          skills: ['Python', 'Django', 'PostgreSQL'],
          availability: ['Tue 6-8pm', 'Thu 7-9pm'],
          githubAccessToken: 'sample_token_2'
        },
        {
          githubId: '11223344',
          username: 'alexsmith',
          email: 'alex@example.com',
          avatarUrl: 'https://avatars.githubusercontent.com/u/11223344?v=4',
          role: 'both',
          skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
          mentoringCapacity: 2,
          availability: ['Mon 5-7pm', 'Wed 6-8pm', 'Sat 10am-12pm'],
          githubAccessToken: 'sample_token_3'
        }
      ];

      await User.insertMany(sampleUsers);
      console.log('✅ Sample users created');
    } else {
      console.log('✅ Users already exist, skipping sample data');
    }

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
"

if [ $? -eq 0 ]; then
    print_status "Database setup completed successfully!"
    print_info "Database: menticonnect"
    print_info "Collections: users, goals, messages, conversations, notifications, feedback"
    print_info "Sample users created for testing"
else
    print_error "Database setup failed"
    exit 1
fi

cd ..

echo ""
echo "🎉 MentiConnect Database is ready!"
echo "=================================="
echo ""
echo "📊 Database Features:"
echo "  • User management with GitHub integration"
echo "  • Goals tracking with milestones"
echo "  • Real-time messaging system"
echo "  • Notification system"
echo "  • Feedback and rating system"
echo "  • Advanced indexing for performance"
echo ""
echo "🚀 You can now start the complete platform with:"
echo "  ./start-complete.sh"
echo ""
