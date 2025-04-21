import cv2
import numpy as np
import base64
from tensorflow.keras.applications.efficientnet import preprocess_input

# Your image input size for the model
IMG_SIZE = (224, 224)  # or whatever your model expects

def predict_image(base64_image, model):
    # Decode the base64 string to bytes
    image_bytes = base64.b64decode(base64_image)

    # Convert to NumPy array from byte buffer (as image)
    image_np = np.frombuffer(image_bytes, np.uint8)

    # Decode into OpenCV image (BGR)
    frame = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Resize and preprocess just like before
    resized = cv2.resize(frame, IMG_SIZE)
    resized = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    resized = preprocess_input(resized.astype('float32'))

    input_tensor = np.expand_dims(resized, axis=0)
    preds = model.predict(input_tensor)

    return preds[0].tolist()
