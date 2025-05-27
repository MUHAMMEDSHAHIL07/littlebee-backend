const express = require("express")
const router = express.Router()


const {userRegister, userLogin, resetPassword} = require("../Controller/userController")

router.post("/register",userRegister)
router.post("/login",userLogin)
router.patch("/resetpassword",resetPassword)

module.exports=router