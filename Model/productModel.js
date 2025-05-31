const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type:String
  },
  price: {
   type: Number
  },
  image: {
   type: String
  },
  category: {
    type:String
  },
  gender: {
    type:String
  },
  stock: {
    type:Number,
    default:1
  },
})
module.exports = mongoose.model("products", productSchema);
