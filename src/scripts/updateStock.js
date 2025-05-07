const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const updateStock = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      let updatedCount = 0;
      
      // Update stock for each variant
      for (const variant of product.variants) {
        // Base stock levels based on size
        const baseStock = {
          'Small': 50,
          'Medium': 75,
          'Large': 100,
          'XL': 125
        };

        // Add random variation (0-50)
        const stockVariation = Math.floor(Math.random() * 51);
        const newStock = (baseStock[variant.size] || 50) + stockVariation;

        // Ensure we have a valid number
        if (!isNaN(newStock) && newStock > 0) {
          variant.stock = newStock;
          updatedCount++;
        } else {
          console.log(`Invalid stock calculation for ${product.name} - ${variant.color} ${variant.size}`);
        }
      }

      if (updatedCount > 0) {
        await product.save();
        console.log(`Updated stock for ${updatedCount} variants in ${product.name}`);
      }
    }

    console.log('Finished updating stock levels');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateStock(); 