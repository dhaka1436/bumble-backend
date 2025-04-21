const mongoose = require("mongoose");

const connectionRequestScehma = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "Please Select Valid Request Type"
        }
    }

}, { timestamps: true });

connectionRequestScehma.index({ fromUserId: 1, toUserId: 1 });

connectionRequestScehma.pre("save", function (next) {

    const connectionRequest = this;

    console.log("From Id is", connectionRequest.fromUserId);
    console.log("To User Id is", connectionRequest.toUserId);

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) throw new Error("Cannot Send Request to Own Profile");
    next();
})


const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestScehma);

module.exports = { ConnectionRequest };