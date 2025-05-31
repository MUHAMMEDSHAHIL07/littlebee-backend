const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../../Model/userModel")
const Product = require("../../Model/productModel")

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

exports.addProduct = async(req,res)=>{
    try{
        const {name,description,price,category,gender,stock} = req.body
        const image = req.file ? req.file.path : null;
        if(!name||!description||!price){
            return res.status(400).json({message:"fill all the field"})
        }
        const newProduct = new Product({
        name,
        description,
        price,
        category,
        gender,
        stock,
        image:image
    })
    await newProduct.save()
    res.status(201).json({
        message:"product added succesfully"
    })
    }
    catch(error){
        res.status(500).json({message:"server error"})
    }
 
}
exports.getAllProduct = async(req,res)=>{
    try{
        const product = await Product.find()
        res.status(200).json({products:product})
    }
    catch(error){
        res.status(500).json({message:"server error"})
    }
}