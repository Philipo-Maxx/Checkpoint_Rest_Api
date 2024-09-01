//Importing Mongoose to help connect to the Local MongoDB database
import mongoose from "mongoose";

//Setting up network connection
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected to ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to DB: ${error}`);
  }
};

//Exporting DB connection
export default connectDB;
