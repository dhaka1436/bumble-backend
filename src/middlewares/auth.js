const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;


        if (!token) throw new Error("Token is not valid");
        const checkToken = await jwt.verify(token, "fbsdjhbf3hj2b2hj23b@#$%^&hjbchjsdb^&*8chjsdbchjdsbhjdb");

        const id = checkToken?._id;

        const user = await User.findById(id);
        if (!user) throw new Error("User does not exist");
        req.user = user; // to avoid checking again and again 
        next();
    }
    catch (error) {
        console.log("Error in verifying the Token", error);
        res.status(400).json({ staus: "failed", data: "Invalid LogIn Token" });
    }
}

module.exports = { userAuth }