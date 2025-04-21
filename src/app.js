const express = require("express");
const { connectToDatabase } = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");




const app = express();

app.use(express.json()) // middleware to parse the body of the requests into the readable format properly
app.use(cookieParser()); // to read the cookies 

app.get("/testing", (req, res) => res.send("I Love You Anoushka Singh"));
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);



connectToDatabase().then(() => {
    console.log("Connected to DB");
    app.listen(8000, () => {
        console.log("Server running at Port 8000");
    })
}).catch(error => {
    console.log("Unable to Connect to DB : ", error);
})