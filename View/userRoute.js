const express = require("express")
const router = express.Router()

const {userRegister, userLogin, resetPassword} = require("../Controller/User-side/userController")
const {allProduct, productId, productCategory} = require("../Controller/User-side/productController")
const { jwtMiddleware } = require("../middleware/authMiddleware")
const { addTocart, getCart } = require("../Controller/User-side/cartController")
const { Order } = require("../Controller/User-side/orderContoller")

router.post("/register",userRegister)
router.post("/login",userLogin)
router.patch("/resetpassword",resetPassword)
router.get("/product",allProduct)
router.get("/product/:id",productId)
router.get("/category/:categoryName",productCategory)
router.post("/addtocart",jwtMiddleware,addTocart)
router.get("/getCart",jwtMiddleware,getCart)
router.post("/order",jwtMiddleware,Order)

module.exports=router