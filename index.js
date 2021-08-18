require("dotenv").config();
const express = require("express");
const userRoutes = require("./src/routes/user.route");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hi Thiru",
  });
});

app.use("/user/api", userRoutes);

app.listen(process.env.PORT, function () {
  console.log("Server Start at " + process.env.PORT + " . . .");
});
