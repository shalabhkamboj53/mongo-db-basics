const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  await mongoose.connect(mongoUri, {
    dbName: 'trainingDB',
  });

  return mongoose.connection;
}

module.exports = { connectDB };
