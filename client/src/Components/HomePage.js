import { useState } from "react";
import "./HomePage.css";

function HomePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("https://caries-detection-app.onrender.com/predict", {
          method: "POST",
          body: formData,
        });

        const predicted_value = await response.json();
        setMessage(predicted_value.message);
      } catch (error) {
        console.error("Error during prediction:", error);
        setMessage("Error occurred. Please try again.");
      }
    } else {
      alert("Please select an image first!");
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>Dental Caries Detection</h1>
  
        <form onSubmit={handleSubmit} className="form">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Predict</button>
        </form>
      </div>
  
      <div className="right-section">
        {previewUrl && (
          <div className="result-section">
            <h2>Preview Image:</h2>
            <img src={previewUrl} alt="Uploaded preview" className="preview-image" />
          </div>
        )}
  
        {message && (
          <div className="result-section">
            <h2>Prediction Result:</h2>
            <p className="message">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default HomePage;
