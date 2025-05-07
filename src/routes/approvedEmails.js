const express = require('express');
const router = express.Router();
const ApprovedEmail = require('../models/ApprovedEmail');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all approved emails (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const approvedEmails = await ApprovedEmail.find().sort({ createdAt: -1 });
    res.json(approvedEmails);
  } catch (error) {
    console.error('Get approved emails error:', error);
    res.status(500).json({ message: 'Error fetching approved emails' });
  }
});

// Add a new approved email (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already approved' });
    }
    
    // Create new approved email
    const approvedEmail = new ApprovedEmail({
      email: email.toLowerCase(),
      role: role || 'customer'
    });
    
    await approvedEmail.save();
    res.status(201).json(approvedEmail);
  } catch (error) {
    console.error('Add approved email error:', error);
    res.status(500).json({ message: 'Error adding approved email' });
  }
});

// Update an approved email (admin only)
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const approvedEmail = await ApprovedEmail.findById(req.params.id);
    
    if (!approvedEmail) {
      return res.status(404).json({ message: 'Approved email not found' });
    }
    
    if (role) approvedEmail.role = role;
    
    await approvedEmail.save();
    res.json(approvedEmail);
  } catch (error) {
    console.error('Update approved email error:', error);
    res.status(500).json({ message: 'Error updating approved email' });
  }
});

// Delete an approved email (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const approvedEmail = await ApprovedEmail.findById(req.params.id);
    
    if (!approvedEmail) {
      return res.status(404).json({ message: 'Approved email not found' });
    }
    
    await approvedEmail.remove();
    res.json({ message: 'Approved email removed successfully' });
  } catch (error) {
    console.error('Delete approved email error:', error);
    res.status(500).json({ message: 'Error deleting approved email' });
  }
});

// Check if an email is approved (public)
router.get('/check/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const approvedEmail = await ApprovedEmail.findOne({ email });
    
    if (approvedEmail) {
      res.json({ 
        isApproved: true, 
        role: approvedEmail.role 
      });
    } else {
      res.json({ 
        isApproved: false, 
        role: 'customer' 
      });
    }
  } catch (error) {
    console.error('Check approved email error:', error);
    res.status(500).json({ message: 'Error checking email approval status' });
  }
});

module.exports = router; 