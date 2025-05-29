const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
   orderBy:{
      type:String
   },
   items:[
       {
        productId:{
            type:String,
        },
        quantity:{
            type:Number
        },
        price:{
            type:Number
        }
       }
   ],
   total:{
    type:Number
   },
   status:{
    type:String,
    enum:["confirmed","pending","shipped","delivered"],
    default:"pending"
   },
   paymentMethod:{
    type:String,
    enum:["cod","Razorpay"]
   },
      createdAt:{
        type:String
    }
})
const ordermodel = mongoose.model("orders",orderSchema)
module.exports = ordermodel