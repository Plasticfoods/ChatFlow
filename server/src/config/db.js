const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('Error connecting to MongoDB:');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;