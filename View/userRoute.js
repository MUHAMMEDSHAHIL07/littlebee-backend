const express = require("express")
const router = express.Router()

const {userRegister, userLogin, resetPassword} = require("../Controller/User-side/userController")
const {allProduct, productId, productCategory} = require("../Controller/User-side/productController")
const { jwtMiddleware } = require("../middleware/authMiddleware")
const { addTocart, getCart } = require("../Controller/User-side/cartController")
const { Order, getOrder } = require("../Controller/User-side/orderContoller")
const checkBlock = require("../middleware/checkBlocked")

router.post("/register",userRegister)
router.post("/login",checkBlock,userLogin)
router.patch("/resetpassword",resetPassword)
router.get("/product",allProduct)
router.get("/product/:id",productId)
router.get("/category/:categoryName",productCategory)
router.post("/addtocart",jwtMiddleware,addTocart)
router.get("/getCart",jwtMiddleware,getCart)
router.post("/order",jwtMiddleware,Order)
router.get("/getOrder",jwtMiddleware,getOrder)

module.exports=router