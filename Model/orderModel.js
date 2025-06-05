const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true,
    ref: "users"
  },
  orders: [
    {
      items: [
        {
          productId: { type: String },
          quantity: { type: Number },
          price: { type: Number },
          name: { type: String },      
          image: { type: String },
        }
      ],
      total: { type: Number },
      paymentMethod: {
        type: String,
        enum: ["cod", "Razorpay"]
      },
      status: {
        type: String,
        enum: ["confirmed", "pending", "shipped", "delivered"],
        default: "pending"
      },
      createdAt: {
        type: String
      }
    }
  ]
})
const ordermodel = mongoose.model("orders",orderSchema)
module.exports = ordermodel