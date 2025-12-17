const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://rajdeep12:rajdeep12@cluster0.j1ja8e1.mongodb.net/ChatFlow`);
    console.log(`Server Started at port: ${PORT}`);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;