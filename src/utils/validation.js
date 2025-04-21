const validator = require("validator");

const validateSignUpData = (req) => {

    const { firstName, lastName, email, password } = req?.body;

    if (!firstName || !lastName) throw new Error("Name is not Valid");
    else if (firstName?.length < 4 || firstName?.length > 50) throw new Error("Minimum Length for First Name should be 4 and Maximum should be 50");
    else if (!validator?.isEmail(email)) throw new Error("Email is not Valid");
    else if (!validator?.isStrongPassword(password)) throw new Error("Please Enter Strong Password" + password);

}

const validateProfileEditData = (req) => {

    const allowedFields = ["firstName", "lastnName", "age", "gender", "photoUrl", "skills", "about"];

    const isEditAllowed = Object.keys(req?.body).every(value => allowedFields.includes(value));

    return isEditAllowed;

}

module.exports = { validateSignUpData, validateProfileEditData }