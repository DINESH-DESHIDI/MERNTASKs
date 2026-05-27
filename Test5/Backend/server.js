const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "admin@gmail.com" &&
    password === "123456"
  ) {
    res.json({
      success: true,
      message: "Login Successful",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});