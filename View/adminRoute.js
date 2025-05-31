const express = require("express")
const { getallUsers, adminLogin, getUserById } = require("../Controller/Admin-side/adminController")

const router = express.Router()

router.get("/users",getallUsers)
router.post("/login",adminLogin)
router.get("/users/:id",getUserById)

module.exports=router