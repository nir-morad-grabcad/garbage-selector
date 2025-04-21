export class PredictionService {
  private ws: WebSocket;
  private connected: Promise<void>;
  private lastFrameTimestamp: number = 2;
  private onPrediction: (prediction: number[]) => void;

  
  constructor(wsUrl: string, onPrediction: (prediction: number[]) => void) {
    this.ws = new WebSocket(wsUrl);
    this.onPrediction = onPrediction;

    this.connected = new Promise((resolve) => {
      this.ws.onopen = () => {
        console.log("✅ WebSocket connected!!");
        resolve();
      };
    });

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const frameTimestamp = data.id; // using timestamp as ID

        if (
          typeof frameTimestamp !== "number" ||
          !Array.isArray(data.prediction)
        ) {
          console.warn("🚫 Invalid message structure:", data);
          return;
        }

        // if (frameTimestamp < this.lastFrameTimestamp) {
        //   console.warn(
        //     `⏱️ Dropped stale prediction (sent: ${frameTimestamp}, last: ${this.lastFrameTimestamp})`
        //   );
        //   return;
        // }

        this.onPrediction(data.prediction);
      } catch (err) {
        console.error("❌ Failed to parse prediction message:", err);
      }
    };
  }

  async sendFrame(base64Frame: string): Promise<void> {
    await this.connected;

    const timestamp = Date.now();
    this.lastFrameTimestamp = timestamp;

    const message = {
      id: timestamp,
      image: base64Frame,
    };

    this.ws.send(JSON.stringify(message));
  }

  close() {
    this.ws.close();
    console.log("🛑 PredictionService closed");
  }
}
