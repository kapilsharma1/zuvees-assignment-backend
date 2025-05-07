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

// New image URLs for Xbox consoles using Wikipedia/Wikimedia public images
const xboxSeriesXImages = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Xbox_Series_X_2.jpg/1200px-Xbox_Series_X_2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Xbox_Series_X_1.jpg/1200px-Xbox_Series_X_1.jpg'
];

const xboxSeriesSImages = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Xbox_Series_S_with_controller.jpg/1200px-Xbox_Series_S_with_controller.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Xbox-Series-S-Console-wController.jpg/1200px-Xbox-Series-S-Console-wController.jpg'
];

const finalXboxFix = async () => {
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
finalXboxFix(); 