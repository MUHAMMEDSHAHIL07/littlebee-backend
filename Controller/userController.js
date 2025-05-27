const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../Model/userModel")
const moment = require("moment-timezone");
const productModel = require("../Model/productModel");


exports.userRegister = async(req,res)=>{
    const {name,email,password} = req.body
    try{
        const userExist = await userModel.findOne({ email });
        if(userExist) return res.status(400).json({message:"user already exist,please try with another password"})

        const salt = 10 
        const hashedpass = await bcrypt.hash(password,salt)

        const newuser =  new userModel({
            name,
            email,
            password:hashedpass,
            profileImg: "",
            createdAt: moment(userModel.createdAt).tz("Asia/Kolkata").format(),
            updatedAt: moment(userModel.updatedAt).tz("Asia/Kolkata").format()

        })
        const savedata = await newuser.save()
        const token = await jwt.sign({id:newuser._id},process.env.JWT_SECRET,{ expiresIn: '1h' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })
        res.json({ success: true, message: "user is registered" })
    }
    catch(error){
         res.status(400).json({ message: error });
         console.log(error);  
    }
}

exports.userLogin =  async(req,res)=>{
    const {email,password} = req.body
    try{
     const getUser = await userModel.findOne({email})
     if(!getUser) return res.status(404).json({message:"user not found"})
     const match = await bcrypt.compare(password,getUser.password)
     if(!match) return res.status(400).json({message:"Invalid details"})
         const token = await jwt.sign({id:getUser._id},process.env.JWT_SECRET,{ expiresIn: '1h' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })
        res.json({ success: true, message: "login succesfull" })
    }
     catch(error){
        res.status(500).json({message:"internal server errror"})
        console.log(error)
    }
}

exports.resetPassword = async(req,res)=>{
    try{
        const user = await userModel.findOne({email:req.body.email})
        if(!user) return res.status(400).json({message:"cannot find the user"})
            const match = await bcrypt.compare(req.body.password,user.password)
        if(match) return res.status(400).json({message:"password is same"})
            const salt = 10
            const hashpassword = await bcrypt.hash(req.body.password,salt)
            user.password= hashpassword,
            await user.save()
            res.status(200).json({message:"Reset password is successfull"})
    }
    catch(error){
      res.status(500).json({message:"internal server error"}) 
    }
}


exports.allProduct = async(req,res)=>{
    try{
        const product = await productModel.find()
        res.json(product)
    }
    catch(error){
        res.status(400).json({message:"failed to get product"})
    }
}

exports.productId = async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id)
        if(!product) return res.status(400).json({message:"product not found"})
        res.json(product)
    }
    catch(error){
        res.status(500).json({message:"Failed to get product"})
    }
}

exports.productCategory = async(req,res)=>{
    try{
    const categoryname = req.params.categoryName
    const getproduct = await productModel.find({category:categoryname})
    if(getproduct==null) return res.status(404).json({message:"product not found"})
        res.json(getproduct)
    }
    catch(error){
        res.status(500).json({message:"error to get product category"})
    }
}
