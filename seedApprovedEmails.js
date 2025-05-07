require('dotenv').config();
const mongoose = require('mongoose');
const ApprovedEmail = require('./src/models/ApprovedEmail');

const approvedEmails = [
  {
    email: 'admin@example.com',
    role: 'admin',
    isApproved: true
  },
  {
    email: 'rider1@example.com',
    role: 'rider',
    isApproved: true
  },
  {
    email: 'rider2@example.com',
    role: 'rider',
    isApproved: true
  },
  {
    email: 'customer@example.com',
    role: 'customer',
    isApproved: true
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-store')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Remove all existing approved emails
      await ApprovedEmail.deleteMany({});
      console.log('Cleared existing approved emails');
      
      // Add new pre-approved emails
      const result = await ApprovedEmail.insertMany(approvedEmails);
      console.log(`Added ${result.length} pre-approved emails:`);
      
      result.forEach(email => {
        console.log(`- ${email.email} (${email.role})`);
      });
      
      // Add custom email if provided as command line argument
      const customEmail = process.argv[2];
      const customRole = process.argv[3] || 'customer';
      
      if (customEmail && customEmail.includes('@')) {
        const existingEmail = await ApprovedEmail.findOne({ email: customEmail.toLowerCase() });
        
        if (existingEmail) {
          console.log(`\nEmail ${customEmail} already exists with role ${existingEmail.role}`);
        } else {
          const newEmail = new ApprovedEmail({
            email: customEmail.toLowerCase(),
            role: customRole,
            isApproved: true
          });
          
          await newEmail.save();
          console.log(`\nAdded custom email: ${newEmail.email} (${newEmail.role})`);
        }
      }
      
      console.log('\nYou can now log in with any of these pre-approved emails to get automatic role assignment.');
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