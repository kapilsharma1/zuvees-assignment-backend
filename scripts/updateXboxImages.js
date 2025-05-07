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

// Import Product model
const Product = require('../src/models/Product');

// New image URLs for Xbox consoles
const xboxSeriesXImages = [
  'https://assets.xboxservices.com/assets/fb/d2/fbd2cb56-5c25-414d-9f46-e6a164cdf5be.jpg?n=XBX_A-BuyBoxBGImage01-D.jpg',
  'https://assets.xboxservices.com/assets/b3/fa/b3fa6608-7b3c-4472-9a77-c348bd3da8d3.jpg?n=XBX_A-Hero-D.jpg'
];

const xboxSeriesSImages = [
  'https://assets.xboxservices.com/assets/f3/19/f3199b25-e21c-4956-b235-0e5295e68c99.jpg?n=XBS_A-BuyBoxBGImage01-D.jpg',
  'https://assets.xboxservices.com/assets/06/91/0691acbe-01b2-4e44-b6df-fe94d6da0052.jpg?n=XBS_A-Hero-D.jpg'
];

const updateXboxImages = async () => {
  try {
    // Update Xbox Series X images
    const xboxSeriesX = await Product.findOneAndUpdate(
      { name: 'Xbox Series X' },
      { images: xboxSeriesXImages },
      { new: true }
    );
    
    if (xboxSeriesX) {
      console.log('Updated Xbox Series X images successfully');
    } else {
      console.log('Xbox Series X product not found');
    }

    // Update Xbox Series S images
    const xboxSeriesS = await Product.findOneAndUpdate(
      { name: 'Xbox Series S' },
      { images: xboxSeriesSImages },
      { new: true }
    );
    
    if (xboxSeriesS) {
      console.log('Updated Xbox Series S images successfully');
    } else {
      console.log('Xbox Series S product not found');
    }

    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating Xbox images:', error);
    process.exit(1);
  }
};

// Run the update function
updateXboxImages(); 