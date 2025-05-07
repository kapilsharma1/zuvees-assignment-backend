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

// New image URLs for Xbox consoles using Amazon product images which should be reliable
const xboxSeriesXImages = [
  'https://m.media-amazon.com/images/I/61-jjE67eQL._AC_SL1500_.jpg',
  'https://m.media-amazon.com/images/I/71NBQ2a52CL._SL1500_.jpg'
];

const xboxSeriesSImages = [
  'https://m.media-amazon.com/images/I/71NBq2ft9lL._SL1500_.jpg',
  'https://m.media-amazon.com/images/I/61vE7AtrHcL._SL1500_.jpg'
];

const amazonXboxFix = async () => {
  try {
    console.log('Searching for Xbox Series X product...');
    // Update Xbox Series X images
    const xboxSeriesX = await Product.findOneAndUpdate(
      { name: 'Xbox Series X' },
      { images: xboxSeriesXImages },
      { new: true }
    );
    
    if (xboxSeriesX) {
      console.log('Updated Xbox Series X images successfully with:', xboxSeriesXImages);
      console.log('Product details:', xboxSeriesX.name, xboxSeriesX._id);
    } else {
      console.log('Xbox Series X product not found');
    }

    console.log('Searching for Xbox Series S product...');
    // Update Xbox Series S images
    const xboxSeriesS = await Product.findOneAndUpdate(
      { name: 'Xbox Series S' },
      { images: xboxSeriesSImages },
      { new: true }
    );
    
    if (xboxSeriesS) {
      console.log('Updated Xbox Series S images successfully with:', xboxSeriesSImages);
      console.log('Product details:', xboxSeriesS.name, xboxSeriesS._id);
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
amazonXboxFix(); 