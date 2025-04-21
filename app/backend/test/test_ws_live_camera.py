import asyncio
import base64
import cv2
import websockets
import numpy as np
import json

WS_URL = "ws://localhost:8000/ws"  # or your Pi's IP: ws://<pi_ip>:8000/ws
CAM_INDEX = 0       # 0 = default camera
FRAME_INTERVAL = 0.2  # seconds between frames (5 FPS)
class_names = ["blue", "brown", "green", "orange", "yellow"]

async def send_camera_frames():
    cap = cv2.VideoCapture(CAM_INDEX)
    if not cap.isOpened():
        print("❌ Could not open webcam.")
        return

    async with websockets.connect(WS_URL) as websocket:
        print("✅ Connected to server.")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to capture frame.")
                break

            # Encode frame as JPEG → base64
            _, jpeg = cv2.imencode('.jpg', frame)
            b64 = base64.b64encode(jpeg.tobytes()).decode('utf-8')
            # Send and receive
            await websocket.send(b64)
            response = await websocket.recv()
            data = json.loads(response)
            print("📊 ALL Prediction:", data)
            prediction = data["prediction"]
            class_idx = np.argmax(prediction)
            confidence =prediction[class_idx]
            prediction_text = f"{class_names[class_idx]} ({confidence:.2f})"
            print("Best is:", prediction_text)
            await asyncio.sleep(FRAME_INTERVAL)

    cap.release()

asyncio.run(send_camera_frames())
