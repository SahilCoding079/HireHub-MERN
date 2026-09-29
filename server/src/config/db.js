import mongoose from 'mongoose'

const connectDb = async() => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Host : ${db.connection.host}`);
    console.log(`Database : ${db.connection.name}`);
  } catch (error) {
    console.error("MongoDB Connection failed : ", error.message);
  }
}

export default connectDb;