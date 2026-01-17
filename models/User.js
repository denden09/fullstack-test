const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 🖼️ PROFILE IMAGE
    avatar: {
      type: String,
      default: "", // contoh: /uploads/12345.png
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
