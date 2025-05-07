const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const { verifyToken } = require('../middleware/auth');

// Log all routes
router.use((req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

// Initial registration endpoint that doesn't require verification
router.post('/register-initial', async (req, res) => {
  console.log('Received request to /register-initial');
  try {
    // Get the token from the request
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the Firebase token
    console.log('Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified for user:', decodedToken.email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid: decodedToken.uid });
    if (existingUser) {
      console.log('User already exists:', existingUser.email, 'Role:', existingUser.role);
      // Return the user data along with the token for automatic login
      return res.status(200).json({ 
        message: 'User already exists',
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role
        },
        token
      });
    }

    // Check if the email is in the approved list
    const email = decodedToken.email.toLowerCase();
    const approvedEmail = await ApprovedEmail.findOne({ email });
    
    // If email is not in approved list, return error
    if (!approvedEmail) {
      console.log(`Email ${email} is not in the approved list`);

      return res.status(403).json({ message: 'Email not in approved list' });
    }
    
    // Determine role based on pre-approved list
    let role = 'customer';
    
    if (approvedEmail) {
      role = approvedEmail.role;
      console.log(`Email ${email} is pre-approved with role: ${role}`);
    } else {
      console.log(`Email ${email} is not pre-approved, using default settings`);
    }

    // Create new user
    console.log('Creating new user with:', {
      email,
      name: decodedToken.name || 'User',
      role,
      firebaseUid: decodedToken.uid
    });
    
    const user = new User({
      email,
      name: decodedToken.name || 'User',
      role, // Use role from pre-approved list or default
      firebaseUid: decodedToken.uid
    });

    await user.save();
    
    // Create response object
    const responseData = { 
      message: 'User registered successfully',
      isPreApproved: !!approvedEmail,
      role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
    
    console.log('User saved successfully. Sending response:', JSON.stringify(responseData, null, 2));
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Regular register endpoint that requires verification
router.post('/register', verifyToken, async (req, res) => {
  console.log('Received request to /register');
  try {
    const { email, name, role } = req.body;
    const firebaseUid = req.user.firebaseUid;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if the email is in the approved list
    const approvedEmail = await ApprovedEmail.findOne({ email: email.toLowerCase() });
    if (!approvedEmail) {
      
      return res.status(403).json({ message: 'Email not in approved list' });
    }
    
    // Determine role based on pre-approved list
    let userRole = role || 'customer';
    
    if (approvedEmail) {
      userRole = approvedEmail.role;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      name,
      role: userRole,
      firebaseUid
    });

    await user.save();
    res.status(201).json({ 
      message: 'User registered successfully',
      isPreApproved: !!approvedEmail,
      role: userRole,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userRole
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  console.log('Received request to /me');
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Approve user (admin only)
router.post('/approve/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ message: 'Error approving user' });
  }
});

module.exports = router; 