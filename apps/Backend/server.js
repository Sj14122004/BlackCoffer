require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
const errorMiddleware = require("./middleware/errorMiddleware");
const dataRoutes = require("./routes/dataRoutes");


// Middleware
app.use(cors());
app.use(express.json());



// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blackcoffer Backend is running",
  });
});

app.use("/api/data", dataRoutes);

app.use(errorMiddleware);//error middleware

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();