const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    profileImg:{
        type:String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
})
module.exports=mongoose.model("users",userSchema)