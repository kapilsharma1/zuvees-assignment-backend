require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-store')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if a test rider already exists
      const existingRider = await User.findOne({ email: 'rider@test.com' });
      
      if (existingRider) {
        console.log('Test rider already exists:');
        console.log(existingRider);
        
        // Make sure the rider is approved
        if (!existingRider.isApproved) {
          existingRider.isApproved = true;
          await existingRider.save();
          console.log('Rider approval status updated to true');
        }
      } else {
        // Create a new test rider account
        const newRider = new User({
          name: 'Test Rider',
          email: 'rider@test.com',
          role: 'rider',
          firebaseUid: 'manual-rider-test-account', // Note: this won't work with Firebase auth
          isApproved: true
        });
        
        await newRider.save();
        console.log('Test rider created successfully:');
        console.log(newRider);
      }
      
      console.log('\nTo log in as this rider:');
      console.log('1. Go to http://localhost:3000/login');
      console.log('2. Sign in with Google');
      console.log('3. Since this is a test account without a real Firebase UID, you will need to:');
      console.log('   - Update the Firebase UID for this account after a real login');
      console.log('   - Or use the admin panel to create a proper rider account');
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 