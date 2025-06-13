const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const user = new mongoose.Schema(
  {
    userId: Number, // Auto-incremented ID field
    name: {
      type: String,
      required: true,
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
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Attach auto-increment plugin for "id"
user.plugin(AutoIncrement, { inc_field: "userId" });

module.exports = mongoose.model("user", user);
