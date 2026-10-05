import mongoose from 'mongoose';

/**
 * Connect to local or remote MongoDB instance via Mongoose.
 * Falls back to local MongoDB URL if MONGO_URI is omitted.
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/news_aggregator';

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Builds defined indexes in local development
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};
