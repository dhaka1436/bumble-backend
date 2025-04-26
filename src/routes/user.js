const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

userRouter.use("/", userAuth);


userRouter.get("/requests/received", async (req, res) => {

    try {

        const loggedInUser = req?.user;
        const response = await ConnectionRequest.find({ toUserId: loggedInUser?._id, status: "interested" }).populate("fromUserId", ["firstName", "email", "gender", "lastName", "skills", "photoUrl", "about", "age"])

        return res.status(200).json({ status: "success", data: response })


    } catch (err) {
        console.log("Error in Getting the Requests", err?.message);
        return res.status(400).json({ status: "failed", data: err?.message });
    }
})

userRouter.get("/connections", async (req, res) => {

    try {

        const loggedInUser = req?.user;
        const response = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser?._id, status: "accepted" },
                { fromUserId: loggedInUser?._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "gender", "lastName", "skills", "photoUrl", "about", "age", "email"]).populate("toUserId", ["firstName", "gender", "lastName", "skills", "photoUrl", "about", "age", "email"])

        const data = response?.map((row) => row?.fromUserId?._id.equals(loggedInUser?._id) ? row?.toUserId : row?.fromUserId)

        return res.status(200).json({ status: "success", data: data })


    } catch (err) {
        console.log("Error in Getting the Connections", err?.message);
        return res.status(400).json({ status: "failed", data: err?.message });
    }
})

userRouter.get("/feed", async (req, res) => {

    try {

        const loggedInUser = req?.user;
        const loggedInUserId = loggedInUser?._id;

        let { page = 1, limit = 10 } = req?.query;
        page = parseInt(page); limit = parseInt(limit);


        const allConnectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        allConnectionRequests.forEach(request => {
            hideUsersFromFeed.add(request?.fromUserId.toString());
            hideUsersFromFeed.add(request?.toUserId.toString());
        })


        const allFeedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUserId } }
            ]
        }).select("firstName lastName photoUrl age gender about skills");

        return res.status(200).json({ status: "success", length: allFeedUsers?.length, data: allFeedUsers })

    } catch (error) {
        console.log("Error in getting the Feed", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

module.exports = { userRouter };