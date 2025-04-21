const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");

userRouter.use("/", userAuth);


userRouter.get("/requests/received", async (req, res) => {

    try {

        const loggedInUser = req?.user;
        const response = await ConnectionRequest.find({ toUserId: loggedInUser?._id, status: "interested" }).populate("fromUserId", ["firstName", "gender", "lastName", "skills", "photoUrl", "about", "age"])

        return res.status(200).json({ status: "success", data: response })


    } catch (err) {
        console.log("Error in Getting the Requests", err?.message);
        return res.status(400).json({ status: "failed", data: err?.message });
    }
})

module.exports = { userRouter };