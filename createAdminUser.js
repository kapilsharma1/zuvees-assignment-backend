require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-store')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ role: 'admin' });
      
      if (existingAdmin) {
        console.log('Admin already exists:');
        console.log({
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role,
          isApproved: existingAdmin.isApproved,
          firebaseUid: existingAdmin.firebaseUid
        });
        
        // Make sure admin is approved
        if (!existingAdmin.isApproved) {
          existingAdmin.isApproved = true;
          await existingAdmin.save();
          console.log('Admin approval status updated to true');
        }
      } else {
        // Create a new admin account
        const newAdmin = new User({
          name: 'Admin User',
          email: 'admin@test.com',
          role: 'admin',
          firebaseUid: 'manual-admin-account', // Note: this won't work with Firebase auth
          isApproved: true
        });
        
        await newAdmin.save();
        console.log('Admin created successfully:');
        console.log({
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          isApproved: newAdmin.isApproved
        });
      }
      
      console.log('\nImportant: Since this is using a dummy Firebase UID, you need to:');
      console.log('1. Login with your Google account at http://localhost:3000/login');
      console.log('2. Find your account in the database and update its role to "admin"');
      console.log('3. To do this, run the following command with your email:');
      console.log('   node -e "require(\'dotenv\').config(); const mongoose = require(\'mongoose\'); const User = require(\'./src/models/User\'); mongoose.connect(process.env.MONGODB_URI || \'mongodb://localhost:27017/gaming-store\').then(async () => { const result = await User.updateOne({email: \'YOUR_EMAIL@example.com\'}, {$set: {role: \'admin\', isApproved: true}}); console.log(result); mongoose.disconnect(); });"');
      
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