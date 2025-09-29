const mongoose = require('mongoose');

const connectDB = async () => {
  const DB_MONGO = process.env.DB_MONGO;

  try {
    await mongoose.connect(DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
