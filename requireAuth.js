const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_TOKEN;
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === Bearer value in header
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
