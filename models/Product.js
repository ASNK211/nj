const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    article: {type: String, required: true},
    title: { type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
