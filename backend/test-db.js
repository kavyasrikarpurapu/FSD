require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing connection to MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
}

testConnection();
