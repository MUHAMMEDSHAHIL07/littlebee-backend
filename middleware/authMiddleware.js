const jwt = require("jsonwebtoken")
require('dotenv').config()
const secretcode = process.env.JWT_SECRET

exports.jwtMiddleware = async(req,res,next)=>{
    try{
        const token = req.cookies.token
        if(!token) return res.status(401).json({message:"unauthorised access"})
        jwt.verify(token,secretcode,(err,decode)=>{
          if(err){
            res.status(401).json({message:"invalid token"})
          }
          else{
            req.user=decode
            next()
          }
        })
    }
    catch(error){
        res.status(500).json({message:"server error"})
    }
}
exports.isAdmin = (req,res,next)=>{
  const user = req.user?.role
  if(user!=="admin"){
    return res.status(404).json({message:"only acces by admin"})
  }
  next()
}