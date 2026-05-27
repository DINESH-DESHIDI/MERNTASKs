const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Task3");
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();

const imageSchema = new mongoose.Schema({
  imageName: String,
  imagePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model("Image", imageSchema);

const upload = multer({
  dest: path.join(__dirname, "uploads"),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  }
});

app.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please attach an image file." });
    }

    const image = await Image.create({
      imageName: req.file.originalname,
      imagePath: req.file.filename
    });

    res.status(201).json({
      message: "Image uploaded successfully.",
      image
    });
  } catch (error) {
    next(error);
  }
});

app.get("/images", async (req, res, next) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    const formattedImages = images.map((image) => ({
      id: image._id,
      imageName: image.imageName,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${image.imagePath}`,
      uploadedAt: image.uploadedAt
    }));

    res.json(formattedImages);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  const statusCode = error instanceof multer.MulterError ? 400 : 500;
  res.status(statusCode).json({
    error: error.message || "An unexpected error occurred."
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
