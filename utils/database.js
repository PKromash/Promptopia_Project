import mongoose from "mongoose";

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState !== 0) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "share_prompts",
    });
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
