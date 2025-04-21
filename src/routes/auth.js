
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");


authRouter.post("/signUp", async (req, res) => {

    try {

        validateSignUpData(req);

        const { firstName, lastName, email, password, age, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword, age, gender });

        const response = await user.save();

        return res.status(200).json({ status: "success", data: response });
    }

    catch (err) {

        console.log("Error in Creating the New user", err?.message);
        return res.status(404).json({ status: "failed", data: err?.message });
    }

})

authRouter.post("/logIn", async (req, res) => {

    try {

        const { email, password } = req?.body;

        if (!validator?.isEmail(email)) throw new Error("Please enter the valid Email Id");

        const user = await User.findOne({ email });

        if (!user) throw new Error("Invalid Credentails");

        const hashedPassword = user?.password;

        const isPasswordValid = await user.validatePassword(password, hashedPassword);

        if (!isPasswordValid) throw new Error("Invalid Credentials");

        const jwtToken = await user?.getJWT();

        res.cookie("token", jwtToken);
        return res.status(200).json({ status: "success", data: "Successfully Logged In" });

    }
    catch (error) {

        console.log("Error while Loggin in", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

authRouter.post("/logOut", async (req, res) => {

    try {

        res.clearCookie("token");
        return res.status(200).json({ status: "success", data: "Logged Out Successfully" });
    }
    catch (error) {
        console.log("Error while logging out", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

module.exports = { authRouter };


