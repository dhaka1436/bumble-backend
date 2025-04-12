const express = require("express");

const app = express();

app.use("/api", (req, res) => {
    res.send("I Love You Anoushka")
    res.send("I Love You Anoushka")
})

app.get("/testing", (req, res) => {

    res.end("Hellhgo Anoushka")
})


app.listen(8000, () => {
    console.log("Server Running at port 8000");
})