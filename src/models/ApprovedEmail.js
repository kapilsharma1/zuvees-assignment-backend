const mongoose = require('mongoose');

const approvedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'rider'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ApprovedEmail', approvedEmailSchema); 