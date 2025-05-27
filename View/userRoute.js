const express = require("express")
const router = express.Router()


const {userRegister, userLogin, resetPassword, allProduct, productId, productCategory} = require("../Controller/userController")

router.post("/register",userRegister)
router.post("/login",userLogin)
router.patch("/resetpassword",resetPassword)
router.get("/product",allProduct)
router.get("/product/:id",productId)
router.get("/category/:categoryName",productCategory)
module.exports=router