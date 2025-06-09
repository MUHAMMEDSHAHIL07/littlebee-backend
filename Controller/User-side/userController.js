const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../../Model/userModel")

exports.userRegister = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const userExist = await userModel.findOne({ email });
        if (userExist) return res.status(400).json({ message: "user already exist,please try with another account" })

        const saltRounds = 10
        const hashedpass = await bcrypt.hash(password, saltRounds)

        const newuser = new userModel({
            name,
            email,
            password: hashedpass,
            profileImg: "",
        })
        await newuser.save()
        const token = await jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000
        })
        res.json({ success: true, message: "user is registered" })
    }
    catch (error) {
        res.status(400).json({ message: error });
        console.log(error);
    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const getUser = await userModel.findOne({ email })
        if (!getUser) return res.status(404).json({ message: "user not found" })
        const match = await bcrypt.compare(password, getUser.password)
        if (!match) return res.status(400).json({ message: "Invalid details" })
        if (getUser.role == "admin") {
            return res.status(403).json({ message: "use admin login" });
        }
        const token = await jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000
        })
        res.json({ message: "login succesfull", data: getUser })
    }
    catch (error) {
        res.status(500).json({ message: "use admin login" })
        console.log(error)
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: "cannot find the user" })
        const match = await bcrypt.compare(req.body.password, user.password)
        if (match) return res.status(400).json({ message: "password is same" })
        const saltRounds = 10
        const hashpassword = await bcrypt.hash(req.body.password, saltRounds)
        user.password = hashpassword,
            await user.save()
        res.status(200).json({ message: "Reset password is successfull" })
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}
exports.getUserByid = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) return res.status(400).json({ message: "user not found" })
        res.json({ data: user })
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get user" })
    }
}
exports.logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}