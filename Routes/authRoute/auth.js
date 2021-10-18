const router = require("express").Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const { registerValidation, loginValidation } = require("../../validation");

dotenv.config();

router.post("/signup", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res
        .status(400)
        .json({ error: "Some field is incorrect or empty" });
    }
    const { username, email, password } = req.body;

    const isValid = registerValidation({ name: username, email, password });
    if (isValid.hasOwnProperty("error")) {
      return res.status(400).json({ error: isValid.error.details[0].message });
    }

    const emailExists = await User.findOne({ email });
    console.log("mongo Email", emailExists);
    if (emailExists) {
      return res.status(422).json({ error: "Email already in Use" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const userCurrent = new User({
      name: username,
      email: email,
      password: hashPassword,
    });
    const userSaved = await userCurrent.save();
    res.status(201).json({ id: userSaved._id });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ error: "Its an Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.password || !req.body.email) {
      return res
        .status(400)
        .json({ error: "Some field is incorrect or empty" });
    }
    const { email, password } = req.body;

    const isValid = loginValidation({ email, password });
    if (isValid.hasOwnProperty("error")) {
      return res.status(400).json({ error: isValid.error.details[0].message });
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      //   res.redirect("/auth/signup/");
      return res.status(422).json({ error: "Registration Required" });
    }

    const validPass = await bcrypt.compare(password, userData.password);
    console.log(validPass);
    if (!validPass) {
      return res.status(422).json({ error: "wrong Password" });
    }

    const token = await jwt.sign({ _id: userData._id }, process.env.JWT_TOKEN);
    res.header("auth-token", token);

    res.status(201).json({ success: "Login Success" });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ error: "Its an Internal Server Error" });
  }
});

module.exports = router;
