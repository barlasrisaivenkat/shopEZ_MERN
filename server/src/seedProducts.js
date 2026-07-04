import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

const seedProducts = async () => {
  await connectDB();

  const seller = await User.findOne().sort({ createdAt: 1 });
  if (!seller) {
    console.log('No user found. Create a user first.');
    process.exit(1);
  }

  const categories = [
    { name: 'Electronics', description: 'Smart devices and gadgets' },
    { name: 'Fashion', description: 'Trendy apparel and accessories' },
    { name: 'Home', description: 'Comfort and daily essentials' },
  ];

  const createdCategories = {};
  for (const category of categories) {
    const doc = await Category.findOneAndUpdate(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true, new: true }
    );
    createdCategories[category.name] = doc._id;
  }

  const products = [
    {
      title: 'Wireless Noise Cancelling Headphones',
      description: 'Immersive sound with long battery life.',
      price: 2499,
      discount: 20,
      stock: 18,
      brand: 'SoundMax',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
      category: createdCategories.Electronics,
      seller: seller._id,
      rating: 4.7,
      numReviews: 12,
    },
    {
      title: 'Smart Watch Pro',
      description: 'Track fitness, messages and health metrics.',
      price: 1899,
      discount: 15,
      stock: 22,
      brand: 'PulseTech',
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80'],
      category: createdCategories.Electronics,
      seller: seller._id,
      rating: 4.5,
      numReviews: 8,
    },
    {
      title: 'Premium Cotton T-Shirt',
      description: 'Soft, breathable and stylish for everyday wear.',
      price: 799,
      discount: 10,
      stock: 35,
      brand: 'UrbanStyle',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
      category: createdCategories.Fashion,
      seller: seller._id,
      rating: 4.3,
      numReviews: 6,
    },
    {
      title: 'Modern Desk Lamp',
      description: 'Adjustable brightness for study and work.',
      price: 1299,
      discount: 12,
      stock: 14,
      brand: 'LumaHome',
      images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80'],
      category: createdCategories.Home,
      seller: seller._id,
      rating: 4.6,
      numReviews: 10,
    },
    {
      title: 'Leather Travel Backpack',
      description: 'Space-savvy bag with premium finish.',
      price: 1599,
      discount: 18,
      stock: 20,
      brand: 'TripPack',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
      category: createdCategories.Fashion,
      seller: seller._id,
      rating: 4.4,
      numReviews: 9,
    },
  ];

  for (const product of products) {
    const existing = await Product.findOne({ title: product.title });
    if (!existing) {
      await Product.create(product);
      console.log(`Created product: ${product.title}`);
    } else {
      console.log(`Product exists: ${product.title}`);
    }
  }

  console.log('Seed completed.');
  process.exit(0);
};

seedProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});

