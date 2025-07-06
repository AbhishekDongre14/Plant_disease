# 🌿 Plant Disease Detection App

A full-stack machine learning-powered application that allows users to predict plant diseases from images using a trained deep learning model hosted on AWS S3. This system works via:

- 🌐 A **FastAPI backend**
- 📱 A **React Native (Expo) Android app**
- 💻 An optional **HTML web interface**

---

## 🚀 Features

- 🔍 Predicts diseases from leaf images of **multiple crops** (Tomato, Potato, Pepper)
- 📷 Capture live photo from camera or upload from device (React Native app)
- ☁️ ML model is securely loaded from AWS S3 on FastAPI startup
- 📡 Mobile and Web clients send images to the backend for prediction
- 🧠 Supports multiple disease classes with high accuracy

---

## 🧱 Tech Stack

| Layer         | Tech                               |
|---------------|-------------------------------------|
| Backend       | FastAPI + TensorFlow + Boto3       |
| ML Model      | CNN/Keras (.h5 format, hosted on S3)|
| Cloud         | AWS S3 for model storage            |
| Mobile App    | React Native with Expo SDK          |
| Web Frontend  | HTML + Tailwind CSS                 |

---

## 🧠 Model Classes

Supports detection of 15 plant disease classes, including:

- `Potato___Early_blight`, `Potato___Late_blight`, `Potato___healthy`
- `Tomato__Tomato_YellowLeaf__Curl_Virus`, `Tomato_Bacterial_spot`, `Tomato_healthy`
- `Pepper__bell___Bacterial_spot`, `Pepper__bell___healthy`

---

## 📦 Folder Structure

plant-disease-app/
├── backend/
│ ├── main.py # FastAPI backend
│ ├── .env # AWS credentials
├── mobile_app/
│ ├── App.tsx # React Native frontend
├── web/
│ └── index.html # Tailwind-based upload page
├── README.md
├──notebook/
│    ├──potato_model_training.ipynb
│    ├──plant-disease.ipynb
│    ├──all_model_prediction.ipynb
│    ├──transfer-learning.ipynb

---

## OUTPUT
📱 Mobile App

![Screenshot_2025-07-05-21-55-01-435_host exp exponent](https://github.com/user-attachments/assets/ac5ad4e0-7d57-441b-a15b-74793c6fd409)

![Screenshot_2025-07-05-21-55-42-425_com google android gms](https://github.com/user-attachments/assets/b60cc66a-5a1a-4963-9562-1d0057224f52)

![Screenshot_2025-07-05-21-55-49-206_host exp exponent(1)](https://github.com/user-attachments/assets/feff1664-79a5-4dca-95a8-2e91a67da49d)

![Screenshot_2025-07-05-21-55-57-744_host exp exponent](https://github.com/user-attachments/assets/9ec63778-bcd7-45dd-b782-be8e7a527a66)



💻 Web Frontend

[Screencast from 2025-07-05 21-57-04.webm](https://github.com/user-attachments/assets/b254c39f-739a-4cea-a600-ef8c80227dce)


## ⚙️ Setup Instructions

### 1. 🌐 FastAPI Backend

```bash
# Create & activate virtualenv
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-multipart boto3 python-dotenv pillow tensorflow

# Add your AWS credentials
touch .env
# Inside .env:
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_REGION=your-region

# Run backend
uvicorn main:app --host 0.0.0.0 --port 8000

2. 📱 React Native App (Expo)

# Install Expo CLI
npm install -g expo-cli

# Initialize and start app
cd mobile_app
npm install
npx expo start

App supports both camera capture and gallery image selection

Change API_URL in App.tsx to your backend IP

3. 💻 Web Frontend

# Open in browser
cd web/
open index.html  # or just double click it

Make sure the backend is running at the same IP/port defined in fetch().


📦 Deploying the Model to AWS S3

    Upload your .h5 model file to an S3 bucket (e.g., Model_0_2.h5)

    Ensure the IAM policy allows read access

    Modify main.py to fetch model using boto3.download_fileobj



