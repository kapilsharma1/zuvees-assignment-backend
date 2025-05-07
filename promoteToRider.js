require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-store')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // List all users
      const users = await User.find({}).select('email name role isApproved');
      
      console.log('Current users in the database:');
      users.forEach((user, index) => {
        console.log(`[${index + 1}] ${user.email} (${user.name}) - Role: ${user.role}, Approved: ${user.isApproved}`);
      });
      
      rl.question('\nEnter the email address of the user to promote to rider role: ', async (email) => {
        const userToUpdate = await User.findOne({ email: email.trim() });
        
        if (!userToUpdate) {
          console.log(`No user found with email: ${email}`);
        } else {
          userToUpdate.role = 'rider';
          userToUpdate.isApproved = true;
          await userToUpdate.save();
          
          console.log(`\nUser ${userToUpdate.name} (${userToUpdate.email}) updated:`);
          console.log(`- Role: ${userToUpdate.role}`);
          console.log(`- Approved: ${userToUpdate.isApproved}`);
          console.log(`\nYou can now log in as a rider at http://localhost:3000/login`);
          console.log(`After logging in, you will be redirected to http://localhost:3000/rider`);
        }
        
        rl.close();
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
      });
      
    } catch (error) {
      console.error('Error:', error);
      rl.close();
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    rl.close();
  }); 