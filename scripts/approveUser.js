const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

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

// Approve all users
const approveAllUsers = async () => {
  try {
    // Find all unapproved users
    const unapprovedUsers = await User.find({ isApproved: false });
    console.log(`Found ${unapprovedUsers.length} unapproved users`);

    if (unapprovedUsers.length === 0) {
      console.log('No users to approve');
      mongoose.disconnect();
      return;
    }

    // Update all users to be approved
    const result = await User.updateMany(
      { isApproved: false },
      { $set: { isApproved: true } }
    );

    console.log(`Approved ${result.modifiedCount} users`);

    // List all users
    const allUsers = await User.find({}).select('email name role isApproved');
    console.log('\nAll users in the system:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.role}, Approved: ${user.isApproved}`);
    });

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error approving users:', error);
    process.exit(1);
  }
};

// Run the approval function
approveAllUsers(); 