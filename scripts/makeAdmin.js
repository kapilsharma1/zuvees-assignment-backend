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

// Change a user to admin
const makeAdmin = async () => {
  try {
    // Change the email to the user you want to make admin
    const userEmail = 'kapilsharma.8295@gmail.com';
    
    // Find the user
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found`);
      mongoose.disconnect();
      return;
    }
    
    // Update the user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`User ${user.name} (${user.email}) is now an admin`);
    
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
    console.error('Error making user admin:', error);
    process.exit(1);
  }
};

// Run the function
makeAdmin(); 