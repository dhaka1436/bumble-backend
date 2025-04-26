const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");


requestRouter.use("/", userAuth);

requestRouter.post("/send/:status/:toUserId", async (req, res) => {

    try {
        const { toUserId, status } = req?.params;
        const user = req?.user;

        const fromUserId = user?._id;

        const allowedStatuses = ["ignored", "interested"];

        if (!allowedStatuses.includes(status)) throw new Error("Invalid Status Type");

        const toUser = await User.findById(toUserId);

        if (!toUser) throw new Error("Invalid User");

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{
                fromUserId, toUserId
            },
            { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) throw new Error("Connection Request already exists");

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const response = await connectionRequest.save();

        return res.status(200).json({ status: "success", data: response });


    } catch (err) {
        console.log("Error in sending the Request", err?.message);
        return res.status(400).json({ status: "failed", data: err?.message });
    }
})

requestRouter.patch("/review/:status/:requestId", async (req, res) => {

    try {

        const { status, requestId } = req?.params;
        console.log("staus", status);
        console.log("requestId", requestId);
        const allowedStatuses = ["accepted", "rejected"];
        const user = req.user;

        if (!allowedStatuses.includes(status)) throw new Error("Invalid Status");

        const requestDetails = await ConnectionRequest.findById(requestId);
        console.log("details are", requestDetails);

        if (!requestDetails?.toUserId.equals(user.id) || requestDetails?.status !== "interested") throw new Error("Invalid Request");

        requestDetails.status = status;
        const response = await requestDetails.save();

        return res.json({ status: "success", data: response })

    } catch (err) {
        console.log("Error in Reviewing the Request", err?.message);
        return res.status(400).json({ status: "failed", data: err?.message });
    }
});


module.exports = { requestRouter };