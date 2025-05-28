const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./View/userRoute");
const cookieparser = require("cookie-parser")

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())
app.use(cors());
app.use("/api/user", userRouter);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(` Server is running on port ${port}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection error:", err);
});
