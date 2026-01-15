const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const app = express(); // ✅ app HARUS dibuat dulu

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// protected test route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have access",
    user: req.user
  });
});

// auth routes
app.use("/auth", authRoutes);

// post routes
app.use("/posts", postRoutes);

//comment routes
app.use("/comments", commentRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error(err));
