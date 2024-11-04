import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
