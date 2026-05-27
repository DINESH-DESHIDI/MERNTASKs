const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const students = [
  {
    id: 1,
    name: "Dinesh",
    course: "MERN"
  },
  {
    id: 2,
    name: "Rahul",
    course: "React"
  },
  {
    id: 3,
    name: "Kiran",
    course: "NodeJS"
  }
];

app.get("/students", (req, res) => {
  res.json(students);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});