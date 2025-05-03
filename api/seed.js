import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';

dotenv.config();

const categories = [
  { category: "Food & Dining" },
  { category: "Transportation" },
  { category: "Entertainment & Leisure" },
  { category: "Home & Utilities" },
  { category: "Health & Medicine" },
  { category: "Shopping" },
  { category: "Education" },
  { category: "Miscellaneous" }
];

const methods = [
  { method: "Cash" },
  { method: "UPI" },
  { method: "Net Banking" },
];

async function seedData() {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log('✅ MongoDB Connected');
  
      // Insert default categories if they don't already exist
      for (const category of categories) {
        await Transaction.updateOne(
          { category: category.category }, // Check if the category exists
          { $setOnInsert: category }, // Insert only if it doesn't exist
          { upsert: true } // Perform upsert
        );
      }
      console.log('✅ Default categories added/verified');
  
      // Insert default methods if they don't already exist
      for (const method of methods) {
        await Transaction.updateOne(
          { method: method.method }, // Check if the method exists
          { $setOnInsert: method }, // Insert only if it doesn't exist
          { upsert: true } // Perform upsert
        );
      }
      console.log('✅ Default methods added/verified');
  
      mongoose.disconnect();
    } catch (error) {
      console.error('❌ Error seeding data:', error);
    }
  }
  
  seedData();