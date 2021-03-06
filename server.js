const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./Routes/authRoute/auth.js");
const feedRoute = require("./Routes/feedRoutes/feed");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());

//Database Connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log("err:  ", err);
  });

//test home route
app.get("/", (req, res) => {
  res.json({ test: "tested OK" });
});

//route middleware
app.use("/auth", authRoute);
app.use("/discover", feedRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Page Not Foun" });
});

app.listen(8080, () => {
  console.log("server running at PORT 8080");
});
