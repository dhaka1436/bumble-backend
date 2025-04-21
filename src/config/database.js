const mongoose = require("mongoose");

const connectToDatabase = async () => {
    await mongoose.connect("mongodb+srv://himanshudhaka:EIFua0vzV2NKJwqU@tinderdev.nq0fmop.mongodb.net/bumbleBackend");
}



module.exports = { connectToDatabase }