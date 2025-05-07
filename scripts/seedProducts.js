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

// Gaming console product data
const products = [
  {
    name: 'PlayStation 5',
    description: 'Experience lightning-fast loading, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.',
    category: 'Console',
    images: [
      'https://media.direct.playstation.com/is/image/sierialto/PS5-front-with-dualsense?$Background_Large$',
      'https://media.direct.playstation.com/is/image/sierialto/ps5-slim-horizon-bundle-front-box?$Background_Large$'
    ],
    variants: [
      {
        color: 'White',
        size: 'Standard',
        price: 499.99,
        stock: 25,
        sku: 'PS5-STD-WHT'
      },
      {
        color: 'White',
        size: 'Digital Edition',
        price: 399.99,
        stock: 30,
        sku: 'PS5-DIG-WHT'
      }
    ],
    isActive: true
  },
  {
    name: 'Xbox Series X',
    description: 'The Xbox Series X delivers sensationally smooth frame rates of up to 120FPS with the visual pop of HDR. Dive into deeper, more immersive gaming experiences through the virtual worlds in Dolby Vision® and Dolby Atmos®.',
    category: 'Console',
    images: [
      'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4mRni',
      'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4mRIq'
    ],
    variants: [
      {
        color: 'Black',
        size: 'Standard',
        price: 499.99,
        stock: 22,
        sku: 'XBOX-SX-BLK'
      }
    ],
    isActive: true
  },
  {
    name: 'Xbox Series S',
    description: 'Experience the speed and performance of a next-gen all-digital console at an accessible price point. Go all digital with the Xbox Series S and enjoy next-gen performance in the smallest Xbox ever.',
    category: 'Console',
    images: [
      'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4nAvE',
      'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4mRIq'
    ],
    variants: [
      {
        color: 'White',
        size: 'Digital Edition',
        price: 299.99,
        stock: 40,
        sku: 'XBOX-SS-WHT'
      }
    ],
    isActive: true
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'The Nintendo Switch OLED model features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64GB of internal storage, and enhanced audio.',
    category: 'Console',
    images: [
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.25/c_scale,w_1200/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-oled-model-white-set/gallery/image01',
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.25/c_scale,w_1200/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-oled-model-white-set/gallery/image03'
    ],
    variants: [
      {
        color: 'White',
        size: 'OLED',
        price: 349.99,
        stock: 35,
        sku: 'NSW-OLED-WHT'
      },
      {
        color: 'Neon',
        size: 'OLED',
        price: 349.99,
        stock: 28,
        sku: 'NSW-OLED-NEO'
      }
    ],
    isActive: true
  },
  {
    name: 'Nintendo Switch Lite',
    description: 'The Nintendo Switch Lite is designed specifically for handheld play, making it easy to bring a diverse gaming system with you on the go.',
    category: 'Console',
    images: [
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.25/c_scale,w_1200/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-lite-yellow/gallery/image01',
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.25/c_scale,w_1200/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-lite-blue/gallery/image01'
    ],
    variants: [
      {
        color: 'Yellow',
        size: 'Lite',
        price: 199.99,
        stock: 45,
        sku: 'NSW-LITE-YLW'
      },
      {
        color: 'Gray',
        size: 'Lite',
        price: 199.99,
        stock: 42,
        sku: 'NSW-LITE-GRY'
      },
      {
        color: 'Turquoise',
        size: 'Lite',
        price: 199.99,
        stock: 38,
        sku: 'NSW-LITE-TRQ'
      }
    ],
    isActive: true
  },
  {
    name: 'Steam Deck',
    description: 'The Steam Deck is a handheld gaming computer developed by Valve Corporation. The Steam Deck allows users to play their Steam games in a portable form factor.',
    category: 'Console',
    images: [
      'https://cdn.cloudflare.steamstatic.com/steamdeck/images/steamdeck_dock_front.png',
      'https://cdn.cloudflare.steamstatic.com/steamdeck/images/device.png'
    ],
    variants: [
      {
        color: 'Black',
        size: '64GB',
        price: 399.99,
        stock: 18,
        sku: 'STM-DK-64GB'
      },
      {
        color: 'Black',
        size: '256GB',
        price: 529.99,
        stock: 15,
        sku: 'STM-DK-256GB'
      },
      {
        color: 'Black',
        size: '512GB',
        price: 649.99,
        stock: 12,
        sku: 'STM-DK-512GB'
      }
    ],
    isActive: true
  },
  {
    name: 'ROG Ally',
    description: 'The ASUS ROG Ally is a handheld gaming PC that lets you bring your entire game library on the go. Powered by Windows 11 and a custom AMD Ryzen processor, the ROG Ally delivers high-performance gaming in a portable form factor.',
    category: 'Console',
    images: [
      'https://dlcdnwebimgs.asus.com/gain/92C66808-EF23-4728-B1D6-3AAB02498376/w1000/h732',
      'https://dlcdnwebimgs.asus.com/gain/F58C38E5-ED37-4175-A4CE-970F3B37EE90/w1000/h732'
    ],
    variants: [
      {
        color: 'White',
        size: 'Z1',
        price: 599.99,
        stock: 20,
        sku: 'ROG-ALY-Z1'
      },
      {
        color: 'White',
        size: 'Z1 Extreme',
        price: 699.99,
        stock: 15,
        sku: 'ROG-ALY-Z1EX'
      }
    ],
    isActive: true
  },
  {
    name: 'PlayStation 4 Pro',
    description: 'The PlayStation 4 Pro supports 4K resolution output and improved PlayStation VR performance. Experience fast, smooth frame rates in blockbuster games, and enjoy enhanced gameplay features.',
    category: 'Console',
    images: [
      'https://gmedia.playstation.com/is/image/SIEPDC/ps4-pro-image-block-01-en-24jul20?$1600px--t$',
      'https://gmedia.playstation.com/is/image/SIEPDC/ps4-pro-image-block-02-en-24jul20?$1600px--t$'
    ],
    variants: [
      {
        color: 'Black',
        size: '1TB',
        price: 349.99,
        stock: 25,
        sku: 'PS4-PRO-1TB'
      }
    ],
    isActive: true
  },
  {
    name: 'Xbox One X',
    description: 'The Xbox One X features 4K gaming and HDR support, making your games look better than ever. Experience immersive gaming with the most powerful console from the previous generation.',
    category: 'Console',
    images: [
      'https://compass-ssl.xbox.com/assets/f7/9f/f79f74fd-ca91-4994-af93-5e26aa470fc2.jpg?n=X1X_Page-Hero-0_767x431.jpg',
      'https://compass-ssl.xbox.com/assets/a0/98/a0986f6e-2af7-4da6-83d0-372dbc030943.jpg?n=X1X_Page-Hero-1_767x431.jpg'
    ],
    variants: [
      {
        color: 'Black',
        size: '1TB',
        price: 329.99,
        stock: 22,
        sku: 'XBOX-ONE-X'
      }
    ],
    isActive: true
  },
  {
    name: 'Nintendo Switch (Standard)',
    description: 'The Nintendo Switch is a versatile gaming console that you can play at home on the TV or on-the-go with its portable screen. Enjoy the best of Nintendo games wherever you are.',
    category: 'Console',
    images: [
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.25/c_scale,w_1200/ncom/My%20Nintendo%20Store/Hardware/Nintendo%20Switch%20Family/Nintendo%20Switch/Nintendo%20Switch%20with%20Neon%20Blue%20and%20Neon%20Red%20Joy-Con/gallery/Switch_redblue_01',
      'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_1.25/c_scale,w_1200/ncom/My%20Nintendo%20Store/Hardware/Nintendo%20Switch%20Family/Nintendo%20Switch/Nintendo%20Switch%20with%20Gray%20Joy-Con/gallery/Switch_gray_01'
    ],
    variants: [
      {
        color: 'Neon',
        size: 'Standard',
        price: 299.99,
        stock: 30,
        sku: 'NSW-STD-NEO'
      },
      {
        color: 'Gray',
        size: 'Standard',
        price: 299.99,
        stock: 28,
        sku: 'NSW-STD-GRY'
      }
    ],
    isActive: true
  }
];

// Function to seed products
const seedProducts = async () => {
  try {
    // Delete existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Added ${insertedProducts.length} products`);

    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts(); 