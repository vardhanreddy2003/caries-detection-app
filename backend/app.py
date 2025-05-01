# import os
# import numpy as np
# from flask import Flask, render_template, request, jsonify
# from PIL import Image
# from tensorflow.keras.models import load_model  
# from huggingface_hub import hf_hub_download
# from flask_cors import CORS
# os.environ["TF_ENABLE_ONEDNN_OPTS"] = '0'

# MODEL_NAME = "vardhan2003/dental-caries-detection"

# model_path = hf_hub_download(repo_id=MODEL_NAME, filename="caries_detection_model.h5")
# model = load_model(model_path, compile=False)

# app = Flask(__name__)
# CORS(app)

# @app.route("/", methods=["GET"])
# def empty():
#     return "Backend is working"
# @app.route("/predict", methods=["POST"])
# def detect_result():
#     dental_image = request.files.get("file") 

#     processed_image = process_uploaded_image(dental_image)

#     prediction = model.predict(processed_image, verbose=0)

#     predicted_class = np.argmax(prediction, axis=1)[0]

#     labels = {0: "caries", 1: "no caries"}  

#     result_message = labels.get(predicted_class, "Unknown")

#     return jsonify({"message": result_message})

# def process_uploaded_image(file_obj):    
#     img = Image.open(file_obj).convert('RGB')
#     img = img.resize((224, 224))
#     img_array = np.array(img) / 255.0
#     img_array = np.expand_dims(img_array, axis=0)
#     return img_array

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
import os
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
from tensorflow.keras.models import load_model  
from huggingface_hub import hf_hub_download
from flask_cors import CORS

# Disable OneDNN optimizations to avoid compatibility issues
os.environ["TF_ENABLE_ONEDNN_OPTS"] = '0'

# Load model from Hugging Face Hub
MODEL_NAME = "vardhan2003/dental-caries-detection"
model_path = hf_hub_download(repo_id=MODEL_NAME, filename="caries_detection_model.h5")
model = load_model(model_path, compile=False)

# Initialize Flask app and configure CORS
app = Flask(__name__)
CORS(app, origins=["https://caries-detection-app-1.onrender.com"])  # Replace with your frontend URL

@app.route("/", methods=["GET"])
def empty():
    return "Backend is working"

@app.route("/predict", methods=["POST"])
def detect_result():
    dental_image = request.files.get("file") 
    if dental_image is None:
        return jsonify({"error": "No file uploaded"}), 400

    processed_image = process_uploaded_image(dental_image)
    prediction = model.predict(processed_image, verbose=0)
    predicted_class = np.argmax(prediction, axis=1)[0]
    labels = {0: "caries", 1: "no caries"}  
    result_message = labels.get(predicted_class, "Unknown")

    return jsonify({"message": result_message})

def process_uploaded_image(file_obj):    
    img = Image.open(file_obj).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

if __name__ == "__main__":
    # Use Render's assigned port, default to 10000 if not set
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
