const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  gender: String,
  stock: Number,
}, { timestamps: true });

module.exports = mongoose.model("products", productSchema);
