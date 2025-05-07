const admin = require('firebase-admin');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!req.originalUrl.includes('/auth/me')) {
      const approvedEmail = await ApprovedEmail.findOne({ email: user.email.toLowerCase() });

     
      if (!approvedEmail) {
        console.log('Email not in approved list@@',approvedEmail, user.email.toLowerCase());
     
        return res.status(403).json({ message: 'Email not in approved list' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const isRider = (req, res, next) => {
  if (req.user.role !== 'rider') {
    return res.status(403).json({ message: 'Rider access required' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isRider,
}; 