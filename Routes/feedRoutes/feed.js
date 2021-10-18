const requireAuth = require("../../requireAuth");
const dotenv = require("dotenv");
const router = require("express").Router();

dotenv.config();

router.get("/popular", requireAuth, (req, res) => {
  res.status(200).json({ auth: "authorised" });
});

module.exports = router;
