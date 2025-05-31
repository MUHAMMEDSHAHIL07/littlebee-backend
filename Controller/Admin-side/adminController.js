const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../../Model/userModel")

exports.getallUsers = async(req,res)=>{
    try{
        const usersData = await userModel.find()
        res.status(200).json({data:usersData})
    }
    catch(error){
        res.status(500).json({message:"cant get users",error})
    }
}
exports.adminLogin  = async(req,res)=>{
    try{
        const email=req.body.email
        const password = req.body.password
        const adminCheck = await userModel.findOne({email:email,role:"admin"})

        if(!adminCheck) return res.status(400).json({message:"invalid details"})
            const match = await bcrypt.compare(password,adminCheck.password)
            if(!match) return res.status(400).json({message:"password doesnot match"})

                const token = jwt.sign({id:adminCheck._id},process.env.JWT_SECRET,{expiresIn: '24h'})
                res.cookie("token",token,{
                        httpOnly: true,
                        secure: false,
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000
                })
                res.status(200).json({message:"login succesfull"})
    }
    catch(error){
        res.status(500).json({message:"internal server error"})
    }
}
exports.getUserById = async(req,res)=>{
    try{
        const userId = req.params.id
        const getuser = await userModel.findById(userId)
        if(!getuser) return res.status(404).json({message:"user not found"})
            res.status(200).json({userData:getuser})
    }
    catch(error){
        res.status(500).json({message:"internal server error",error})
    }
}