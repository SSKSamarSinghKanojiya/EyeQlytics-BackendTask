const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true,useUnifiedTopology: true,});
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ", process.env.MONGO_URI);
  } catch (error) {
    console.log("MongoDB connection Failed : ", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
