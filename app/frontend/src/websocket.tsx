import React, { useEffect, useRef, useState } from "react";
import PredictionBars from "./components/predictionBars";
import { PredictionService } from "./services/predictionService";

const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws";

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<number[]>([0, 0, 0]);
  const predictionServiceRef = useRef<PredictionService | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Start service + webcam
  useEffect(() => {
    const service = new PredictionService(WS_URL, setPrediction);
    predictionServiceRef.current = service;

    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      videoRef.current = video;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 224;
      canvas.height = 224;

      // Start sending frames every 500ms
      const interval = setInterval(async () => {
        if (!videoRef.current || !ctx) return;

        ctx.drawImage(videoRef.current, 0, 0, 224, 224);

        canvas.toBlob((blob) => {
          if (!blob) return;

          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(",")[1];
            await service.sendFrame(base64); // will trigger onPrediction internally
          };
          reader.readAsDataURL(blob);
        }, "image/jpeg");
      }, 1000);

      return () => {
        clearInterval(interval);
        stream.getTracks().forEach((t) => t.stop());
        service.close();
      };
    });
  }, []);

  return (
    <div>
      <h1>Real-Time Garbage Classifier</h1>
      <PredictionBars predictions={prediction} />
    </div>
  );
};

export default App;
