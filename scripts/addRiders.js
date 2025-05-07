const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env file in the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import User model
const User = require('../src/models/User');

// Sample rider data
const riders = [
  {
    name: 'John Rider',
    email: 'john.rider@example.com',
    role: 'rider',
    isApproved: true,
    firebaseUid: uuidv4() // Generate a unique ID for each rider
  },
  {
    name: 'Sarah Delivery',
    email: 'sarah.delivery@example.com',
    role: 'rider',
    isApproved: true,
    firebaseUid: uuidv4()
  },
  {
    name: 'Mike Express',
    email: 'mike.express@example.com',
    role: 'rider',
    isApproved: true,
    firebaseUid: uuidv4()
  },
  {
    name: 'Lisa Swift',
    email: 'lisa.swift@example.com',
    role: 'rider',
    isApproved: true,
    firebaseUid: uuidv4()
  },
  {
    name: 'David Rush',
    email: 'david.rush@example.com',
    role: 'rider',
    isApproved: true,
    firebaseUid: uuidv4()
  }
];

// Function to add riders
const addRiders = async () => {
  try {
    // Check if riders already exist
    const existingRiders = await User.find({ role: 'rider' });
    if (existingRiders.length > 0) {
      console.log(`There are already ${existingRiders.length} riders in the system:`);
      existingRiders.forEach(rider => {
        console.log(`- ${rider.name} (${rider.email})`);
      });
      
      // Ask if we should still add more riders
      console.log('\nDo you want to add more riders anyway? (Adding more riders...)');
    }

    // Insert riders
    const insertedRiders = await User.insertMany(riders);
    console.log(`Added ${insertedRiders.length} riders`);
    
    // List all users
    const allUsers = await User.find({}).select('email name role isApproved');
    console.log('\nAll users in the system:');
    
    // Group users by role
    const usersByRole = {};
    allUsers.forEach(user => {
      if (!usersByRole[user.role]) {
        usersByRole[user.role] = [];
      }
      usersByRole[user.role].push(user);
    });
    
    // Print users by role
    for (const role in usersByRole) {
      console.log(`\n${role.charAt(0).toUpperCase() + role.slice(1)}s (${usersByRole[role].length}):`);
      usersByRole[role].forEach(user => {
        console.log(`- ${user.name} (${user.email})`);
      });
    }

    // Disconnect from database
    mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error adding riders:', error);
    process.exit(1);
  }
};

// Run the function
addRiders(); 