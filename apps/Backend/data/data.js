const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Data = require("../models/data");
const data = require("./jsondata.json");

require("dotenv").config();

const importData = async () => {
  try {
    await connectDB();

    await Data.deleteMany();

    await Data.insertMany(data);

    console.log(`${data.length} records imported successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error.message);
    process.exit(1);
  }
};

importData();