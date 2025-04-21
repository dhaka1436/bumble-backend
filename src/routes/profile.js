const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const { User } = require("../models/user");

profileRouter.use("/", userAuth);

profileRouter.get("/view", async (req, res) => {

    try {
        const user = req?.user;
        return res.status(200).json({ status: "success", data: user });
    }
    catch (error) {
        console.log("Error in fetching the profile", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

profileRouter.patch("/edit", async (req, res) => {
    try {

        const isEditAllowed = validateProfileEditData(req);

        if (!isEditAllowed) throw new Error("Update Not Allowed");
        const user = req.user;

        const updateResponse = await User.findByIdAndUpdate(user?._id, req?.body, { returnDocument: "after", runValidators: true });

        return res.status(200).json({ status: "success", data: updateResponse });

    }
    catch (error) {
        console.log("Error while editing the Profile", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

module.exports = { profileRouter };