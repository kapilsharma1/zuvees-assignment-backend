const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const colors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green'];
const sizes = ['Small', 'Medium', 'Large', 'XL'];
const basePrices = {
  'Small': 299.99,
  'Medium': 399.99,
  'Large': 499.99,
  'XL': 599.99
};

const generateSKU = (productName, color, size) => {
  const prefix = productName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
  return `${prefix}-${color.slice(0, 3).toUpperCase()}-${size.slice(0, 2).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
};

const addVariants = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      const newVariants = [];
      
      // Generate all possible color and size combinations
      for (const color of colors) {
        for (const size of sizes) {
          // Check if this variant already exists
          const existingVariant = product.variants.find(
            v => v.color === color && v.size === size
          );

          if (!existingVariant) {
            const basePrice = basePrices[size];
            const priceVariation = Math.random() * 20 - 10; // Random variation of ±$10
            const price = Math.round((basePrice + priceVariation) * 100) / 100;
            
            // Increased stock levels:
            // - Small: 50-100 units
            // - Medium: 75-150 units
            // - Large: 100-200 units
            // - XL: 125-250 units
            const baseStock = {
              'Small': 50,
              'Medium': 75,
              'Large': 100,
              'XL': 125
            };
            const stockVariation = Math.floor(Math.random() * 50); // Random variation of 0-50
            const stock = baseStock[size] + stockVariation;

            newVariants.push({
              color,
              size,
              price,
              stock,
              sku: generateSKU(product.name, color, size)
            });
          }
        }
      }

      if (newVariants.length > 0) {
        product.variants.push(...newVariants);
        await product.save();
        console.log(`Added ${newVariants.length} new variants to ${product.name}`);
      } else {
        console.log(`No new variants needed for ${product.name}`);
      }
    }

    console.log('Finished adding variants');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addVariants(); 