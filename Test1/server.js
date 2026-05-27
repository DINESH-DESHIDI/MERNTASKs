const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/MernExam")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const Schema = new mongoose.Schema({
  title: String,
  content: String
});

const Exam = mongoose.model("Exam", Schema);

app.post("/exams", async (req, res) => {
  const exam = await Exam.create(req.body);
  res.json(exam);
});

app.get("/exams", async (req, res) => {
  const exams = await Exam.find();
  res.json(exams);
});

app.put("/exams/:id", async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(exam);
});

app.delete("/exams/:id", async (req, res) => {
  await Exam.findByIdAndDelete(req.params.id);

  res.json({
    message: "Exam Deleted"
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});