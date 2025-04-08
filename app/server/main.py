from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import tensorflow as tf
from utils import predict_image
import json

app = FastAPI()
model = tf.keras.models.load_model("../../model/waste_classifier_v1.keras")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                # 1. Receive and parse JSON message
                message = await websocket.receive_text()
                data = json.loads(message)
                frame_id = data.get("id")
                base64_image = data.get("image")

                # 2. Validate input
                if not frame_id or not base64_image:
                    print("⚠️ Invalid input")
                    continue

                # 3. Run prediction
                prediction = predict_image(base64_image, model)

                # 4. Return prediction with the same ID
                await websocket.send_json({
                    "id": frame_id,
                    "prediction": prediction
                })

            except RuntimeError as re:
                print("⚠️ RuntimeError (F5 crash?):", re)
                break
            except Exception as e:
                print("❌ Frame processing error:", e)
    except WebSocketDisconnect:
        print("🔌 WebSocket client disconnected (cleanly)")