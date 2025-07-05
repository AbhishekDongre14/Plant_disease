from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os
import boto3
import tempfile
from dotenv import load_dotenv

#Load AWS credentials from .env
load_dotenv('/home/abhishek/Potato_disease/api/.env')

aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region = os.getenv('AWS_REGION')

#S3 bucket and model details
bucket_name = 'potato-model'
model_key = 'Model_0_2.h5'  # S3 object key (not a URL)

#Create boto3 S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=region
)

#Download model to a temporary file and load it
with tempfile.NamedTemporaryFile(suffix=".h5", delete=False) as temp_model_file:
    s3.download_fileobj(bucket_name, model_key, temp_model_file)
    temp_model_path = temp_model_file.name

MODEL = tf.keras.models.load_model(temp_model_path)
CLASS_NAMES = [
    'Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight',
    'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite', 'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

#Create FastAPI app
app = FastAPI()

# Enable CORS for frontend/mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}


def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((224, 224))  # match model input
    return np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image, 0)  # (1, 224, 224, 3)
    predictions = MODEL.predict(image_batch)
    index = np.argmax(predictions[0])
    predicted_class = CLASS_NAMES[index]
    confidence = float(np.max(predictions[0]))
    return {
        "class": predicted_class,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
