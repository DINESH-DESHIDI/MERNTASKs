import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Ready to upload an image.");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      setStatusMessage("No file selected.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Please choose a valid image file.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setStatusMessage(`Selected file: ${file.name}`);
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/images`);
      setUploadedImages(response.data);
      setStatusMessage("Loaded uploaded images.");
    } catch (error) {
      setStatusMessage("Unable to load uploaded images. Please make sure the backend is running.");
      console.error(error);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      setStatusMessage("Select an image before uploading.");
      return;
    }

    setIsUploading(true);
    setStatusMessage("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setStatusMessage(response.data.message || "Upload completed.");
      setSelectedFile(null);
      fetchImages();
    } catch (error) {
      setStatusMessage(error.response?.data?.error || "Upload failed. Try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Image Upload</h1>
      <p>Choose an image and upload it to the backend. Uploaded files are shown below.</p>

      <div style={{ display: "grid", gap: 12 }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={uploadImage} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
          <button type="button" onClick={fetchImages}>
            Refresh Gallery
          </button>
        </div>

        <p style={{ color: "#333", marginTop: 4 }}>{statusMessage}</p>

        {selectedFile && (
          <div style={{ padding: 12, background: "#f8f8f8", borderRadius: 8 }}>
            <strong>Ready to upload:</strong> {selectedFile.name}
          </div>
        )}

        {uploadedImages.length > 0 && (
          <section>
            <h2>Uploaded Images</h2>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              {uploadedImages.map((image) => (
                <article key={image.id} style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
                  <img
                    src={image.imageUrl}
                    alt={image.imageName}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                  <div style={{ padding: 10 }}>
                    <div style={{ fontWeight: 600 }}>{image.imageName}</div>
                    <div style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
                      {new Date(image.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;