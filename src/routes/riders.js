const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all riders (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('-__v');
    res.json(riders);
  } catch (error) {
    console.error('Get riders error:', error);
    res.status(500).json({ message: 'Error fetching riders' });
  }
});

// Create rider (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { email, name, firebaseUid } = req.body;

    // Check if rider already exists
    const existingRider = await User.findOne({ email });
    if (existingRider) {
      return res.status(400).json({ message: 'Rider already exists' });
    }

    // Make sure email is in the approved emails list
    let approvedEmail = await ApprovedEmail.findOne({ email });
    if (!approvedEmail) {
      // Create an approved email entry for this rider
      approvedEmail = new ApprovedEmail({
        email,
        role: 'rider'
      });
      await approvedEmail.save();
    } else {
      // Update role to rider if different
      if (approvedEmail.role !== 'rider') {
        approvedEmail.role = 'rider';
        await approvedEmail.save();
      }
    }

    const rider = new User({
      email,
      name,
      role: 'rider',
      firebaseUid
    });

    await rider.save();
    res.status(201).json(rider);
  } catch (error) {
    console.error('Create rider error:', error);
    res.status(500).json({ message: 'Error creating rider' });
  }
});

// Update rider (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const rider = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'rider' },
      req.body,
      { new: true }
    ).select('-__v');

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    res.json(rider);
  } catch (error) {
    console.error('Update rider error:', error);
    res.status(500).json({ message: 'Error updating rider' });
  }
});

// Delete rider (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const rider = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'rider',
    });

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    res.json({ message: 'Rider deleted successfully' });
  } catch (error) {
    console.error('Delete rider error:', error);
    res.status(500).json({ message: 'Error deleting rider' });
  }
});

module.exports = router; 