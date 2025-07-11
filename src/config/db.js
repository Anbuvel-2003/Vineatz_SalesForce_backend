import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('====================================');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('====================================');
  } catch (err) {
    console.log(err, "Error Message");
    process.exit(1);
  }
};

export default connectDB;
