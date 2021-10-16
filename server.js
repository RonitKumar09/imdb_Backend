const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ test: "tested OK" });
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!req.body.username || !req.body.password) {
      return res.status(422).send("Some field is incorrect or empty");
    }
    console.log(username);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = { name: username, password: hashPassword };
    res.status(200).json(user);
  } catch {
    res.status(500).send("Internal Server Error");
  }
  // res.json({ ok: "ok" });
});

app.listen(8080, () => {
  console.log("server running at PORT 8080");
});
