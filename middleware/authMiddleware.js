const jwt = require("jsonwebtoken")
const usermodel = require("../Model/userModel")
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
exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, admin unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not an admin" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.getUserFromToken = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies); // 👀 check if token cookie is there

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // 👀 check the id inside token

    const user = await usermodel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ data: user });
  } catch (error) {
    console.log("Auth error:", error);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};
