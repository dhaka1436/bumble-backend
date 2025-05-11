const mongoose = require("mongoose");

const connectToDatabase = async () => {
    await mongoose.connect(process.env.DB_URL);
}



module.exports = { connectToDatabase }