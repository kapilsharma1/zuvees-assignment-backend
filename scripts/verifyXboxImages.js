require('dotenv').config();
const axios = require('axios');

const verifyImages = async () => {
  try {
    console.log('Fetching products from the API...');
    const response = await axios.get(`${process.env.API_URL || 'http://localhost:5000/api'}/products`);
    const products = response.data;
    
    console.log(`Received ${products.length} products from the API`);
    
    // Find the Xbox products
    const xboxSeriesX = products.find(p => p.name === 'Xbox Series X');
    const xboxSeriesS = products.find(p => p.name === 'Xbox Series S');
    
    if (xboxSeriesX) {
      console.log('Xbox Series X found:');
      console.log('- Name:', xboxSeriesX.name);
      console.log('- ID:', xboxSeriesX._id);
      console.log('- Images:', xboxSeriesX.images);
      // Test the image URLs
      console.log('Testing image URLs...');
      for (const imageUrl of xboxSeriesX.images) {
        try {
          const imgResponse = await axios.head(imageUrl);
          console.log(`Image URL ${imageUrl} is accessible (status: ${imgResponse.status})`);
        } catch (error) {
          console.error(`Image URL ${imageUrl} is NOT accessible: ${error.message}`);
        }
      }
    } else {
      console.log('Xbox Series X product not found');
    }
    
    if (xboxSeriesS) {
      console.log('\nXbox Series S found:');
      console.log('- Name:', xboxSeriesS.name);
      console.log('- ID:', xboxSeriesS._id);
      console.log('- Images:', xboxSeriesS.images);
      // Test the image URLs
      console.log('Testing image URLs...');
      for (const imageUrl of xboxSeriesS.images) {
        try {
          const imgResponse = await axios.head(imageUrl);
          console.log(`Image URL ${imageUrl} is accessible (status: ${imgResponse.status})`);
        } catch (error) {
          console.error(`Image URL ${imageUrl} is NOT accessible: ${error.message}`);
        }
      }
    } else {
      console.log('Xbox Series S product not found');
    }
    
  } catch (error) {
    console.error('Error verifying Xbox images:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

verifyImages(); 