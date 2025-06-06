const userModel = require("../Model/userModel")

const checkBlock = async (req,res,next)=>{
     const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(!user.isActive){
        return res.status(403).json({message:"user is blocked"})
    }
    next()
}
module.exports=checkBlock
