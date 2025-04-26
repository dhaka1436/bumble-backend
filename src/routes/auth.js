
const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");


authRouter.post("/signUp", async (req, res) => {

    try {

        validateSignUpData(req);

        const { firstName, lastName, email, password, age, gender, skills = [], photoUrl = "https://images.bhaskarassets.com/web2images/521/2022/04/19/1_1650366848.jpg" } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword, age, gender, skills, photoUrl });

        const response = await user.save();

        const token = await user.getJWT();
        res.cookie("token", token);

        return res.status(200).json({ status: "success", data: response });
    }

    catch (err) {

        console.log("Error in Creating the New user", err?.message);
        return res.status(404).json({ status: "failed", data: err?.message });
    }

})

authRouter.post("/seed-users", async (req, res) => {
    try {
        console.log("Starting to seed 30 users...");
        const usersCreated = [];

        // Define gender options allowed by schema
        const genders = ["male", "female"];

        // Define possible skills
        const skillsList = [
            "JavaScript", "Node.js", "React", "MongoDB", "Express",
            "Python", "Java", "C++", "AWS", "Docker",
            "GraphQL", "TypeScript", "Vue.js", "CSS", "HTML"
        ];

        // Use the image URL provided
        const photoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Federer_WM16_%2837%29_%2828136155830%29.jpg/960px-Federer_WM16_%2837%29_%2828136155830%29.jpg";

        // Create 30 users
        for (let i = 1; i <= 30; i++) {
            // Generate a strong password that meets validator requirements
            const password = `abcd1234@A`;
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate random age between 18 and 60
            const age = Math.floor(Math.random() * (60 - 18 + 1)) + 18;

            // Randomly select gender
            const gender = genders[Math.floor(Math.random() * genders.length)];

            // Randomly select 1-5 skills
            const numSkills = Math.floor(Math.random() * 5) + 1;
            const shuffledSkills = [...skillsList].sort(() => 0.5 - Math.random());
            const skills = shuffledSkills.slice(0, 5);

            // Create first and last names
            const firstName = `TestUser${i}`;  // At least 4 chars as required
            const lastName = `LastName${i}`;

            // Create unique email
            const email = `testuser${i}@example.com`;

            // Create new user object
            const user = new User({
                firstName,
                lastName,
                age,
                gender,
                email,
                password: hashedPassword,
                photoUrl,
                about: "This is My Profile", // Default value from schema
                skills
            });

            // Save user to database
            const savedUser = await user.save();

            // Add user to created list (without password)
            const { password: _, ...userWithoutPassword } = savedUser.toObject();
            usersCreated.push(userWithoutPassword);

            console.log(`Created user ${i}: ${firstName} (${email})`);
        }

        // Return success response with created users
        return res.status(200).json({
            status: "success",
            message: `Successfully created ${usersCreated.length} users`,
            count: usersCreated.length,
            data: usersCreated
        });
    }
    catch (err) {
        console.log("Error in seeding users:", err?.message);
        return res.status(500).json({ status: "failed", data: err?.message });
    }
});

authRouter.post("/logIn", async (req, res) => {

    try {

        const { email, password } = req?.body;

        if (!validator?.isEmail(email)) throw new Error("Please enter the valid Email Id");

        const user = await User.findOne({ email });

        if (!user) throw new Error("Email not Registered");

        const hashedPassword = user?.password;

        const isPasswordValid = await user.validatePassword(password, hashedPassword);

        if (!isPasswordValid) throw new Error("Invalid Credentials");

        const jwtToken = await user?.getJWT();


        res.cookie("token", jwtToken);
        return res.status(200).json({ status: "success", data: user, message: "Successfully Logged In" });

    }
    catch (error) {

        console.log("Error while Loggin in", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

authRouter.post("/logOut", async (req, res) => {

    try {

        res.clearCookie("token");
        return res.status(200).json({ status: "success", data: "Logged Out Successfully" });
    }
    catch (error) {
        console.log("Error while logging out", error?.message);
        return res.status(400).json({ status: "failed", data: error?.message });
    }
})

module.exports = { authRouter };


