import mongoose from 'mongoose'

const connectDb = async() => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Host : ${db.connection.host}`);
    console.log(`Database : ${db.connection.name}`);
    return db.connection;
  } catch (error) {
    console.error("MongoDB Connection failed : ", error.message);
    throw error
  }
}

export default connectDb;