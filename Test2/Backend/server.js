const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/Task2";

// Allow browser access from the React dev server / other origins.
app.use(cors());

// Log every incoming request so we can see what the browser is calling.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  course: String,
});

const Student = mongoose.model("Student", studentSchema);

// Return all students from the database.
app.get("/students", async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// Return one student by id.
app.get("/students/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// Create a new student record.
app.post("/students", async (req, res, next) => {
  try {
    const { name, course } = req.body;
    if (!name || !course) {
      return res.status(400).json({ error: "Name and course are required." });
    }

    const student = await Student.create({ name, course });
    res.status(201).json({ message: "Student created.", student });
  } catch (err) {
    next(err);
  }
});

// Update an existing student record.
app.put("/students/:id", async (req, res, next) => {
  try {
    const { name, course } = req.body;
    if (!name || !course) {
      return res.status(400).json({ error: "Name and course are required." });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, course },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json({ message: "Student updated.", student });
  } catch (err) {
    next(err);
  }
});

// Delete a student record.
app.delete("/students/:id", async (req, res, next) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json({ message: "Student deleted." });
  } catch (err) {
    next(err);
  }
});

// Serve the front-end page.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle missing routes.
app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Error handler.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
