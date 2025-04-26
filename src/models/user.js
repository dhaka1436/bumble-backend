const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");


const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true, minLength: 4, maxLength: 40 },
    lastName: { type: String },
    age: { type: Number, required: true, min: 18, max: 60 },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) throw new Error("Gender is not Valid")
        }
    },
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true, validate(value) {
            if (!validator?.isEmail(value)) throw new Error("Email is not Valid");
        }
    },
    password: {
        type: String, required: true, validate(value) {
            if (!validator?.isStrongPassword(value)) throw new Error("Please enter the Strong Password")
        }
    },
    photoUrl: {
        type: String, validate(value) {
            if (!validator?.isURL(value)) throw new Error("Photo URL is not Valid");
        }
    },
    about: {
        type: String, default: "I Love You Anoushka Singh",
    },
    skills: {
        type: [String], validate(value) {
            if (value?.length > 5) throw new Error("Cannot add more than 5 skills")
        }
    }
}, { timestamps: true })


userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({ _id: user?._id }, "fbsdjhbf3hj2b2hj23b@#$%^&hjbchjsdb^&*8chjsdbchjdsbhjdb");

    return token;
}

userSchema.methods.validatePassword = async function (inputPassword) {

    const user = this;

    const isPasswordValid = await bcrypt.compare(inputPassword, user?.password);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
