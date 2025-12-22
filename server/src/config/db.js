import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGODB_DATABASE_NAME}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server running without database connection. Some features may not work.');
  }
};

export default connectDB;
