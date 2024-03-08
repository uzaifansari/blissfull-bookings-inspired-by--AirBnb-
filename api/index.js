const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const UserRoutes = require("./Routes/UserRoutes.js");
const PlaceRoutes = require("./Routes/PlaceRoutes.js");
const BookingRoutes = require("./Routes/BookingRoutes.js");
const UploadRoutes = require("./Routes/UploadRoutes.js");

dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB CONNECTED!");
  })
  .catch(() => {
    console.log("DB DISCONNECTED!");
  });

// Routes
app.use("/", UserRoutes);
app.use("/", UploadRoutes);
app.use("/", PlaceRoutes);
app.use("/", BookingRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
