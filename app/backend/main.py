from fastapi import  FastAPI,WebSocket, WebSocketDisconnect
from utils import predict_image
import json
import tensorflow as tf
model = tf.keras.models.load_model("waste_classifier_v2")
app = FastAPI()

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