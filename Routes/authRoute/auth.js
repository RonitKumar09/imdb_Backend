const router = require("express").Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const { registerValidation, loginValidation } = require("../../validation");

dotenv.config();

//SignUp route
router.post("/signup", async (req, res) => {
  try {
    if (!req.body.name || !req.body.password || !req.body.email) {
      return res
        .status(400)
        .json({ error: "Some field is incorrect or empty" });
    }
    const { name, email, password } = req.body;
    const isValid = registerValidation({ name, email, password });
    if (isValid.hasOwnProperty("error")) {
      return res.status(400).json({ error: isValid.error.details[0].message });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(422).json({
        error: "Email already in use",
        isRegisteredUser: true,
        isAutherizedUser: false,
        userData: {
          _id: emailExists._id,
          name: emailExists.name,
          email: emailExists.email,
          creationData: emailExists.date,
        },
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const userCurrent = new User({
      name: name,
      email: email,
      password: hashPassword,
    });
    const userSaved = await userCurrent.save();
    res.status(201).json({
      id: userSaved._id,
      isRegisteredUser: true,
      isAutherizedUser: false,
    });
  } catch (err) {
    res.status(500).json({ error: "Its an Internal Server Error" });
  }
});

//Login route
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
      return res.status(422).json({
        error: "Please Sign Up First",
        isRegisteredUser: false,
        isAutherizedUser: false,
      });
    }

    const validPass = await bcrypt.compare(password, userData.password);

    if (!validPass) {
      return res.status(422).json({
        error: "wrong Password",
        isRegisteredUser: true,
        isAutherizedUser: false,
      });
    }

    const token = await jwt.sign({ _id: userData._id }, process.env.JWT_TOKEN);
    res.header("auth-token", token);

    res.status(201).json({
      success: "Login Success",
      isRegisteredUser: true,
      isAutherizedUser: true,
      token,
      userData: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        creationData: userData.date,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Its an Internal Server Error" });
  }
});

module.exports = router;
