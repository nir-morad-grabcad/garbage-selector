# 🗒️ Real-Time Garbage Classifier

A full-stack application that uses a trained machine learning model to classify garbage in real-time via webcam feed. The app displays predictions on a responsive dashboard with bar indicators for each category.

**Goal:** Deploy the "Garbage Classifier" on a Raspberry Pi and install it in the company kitchen.

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Docker & Docker Compose installed
- A webcam connected to the host machine

---

### 💠 Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/nir-morad-grabcad/garbage-selector.git
cd garbage-selector/app
```

2. **Start the development environment**

```bash
docker compose up --build
```

- Frontend (React): [http://localhost:3001](http://localhost:3001)  
- Backend (FastAPI): [http://localhost:8000](http://localhost:8000)

---

## 🤖 Machine Learning

- **Model Architecture:** [EfficientNetB3](https://keras.io/api/applications/efficientnet/#efficientnetb3-function) from Keras (TensorFlow).
- **Dataset:** Labeled images for five categories: `blue`, `brown`, `green`, `orange`, `yellow`. Images were resized to 224×224 pixels and augmented with flipping, rotation, and brightness shifts.
- **Preprocessing:** Images were normalized using Keras’s `preprocess_input()` function.
- **Training:** The model was trained using categorical crossentropy loss, the Adam optimizer, and early stopping. Validation accuracy exceeded **X%** (fill in actual value).
- **Export:** Saved in `.keras` format and loaded in FastAPI using `load_model()`.
- **Inference:** Frames are processed every 2 frames (~15–30 FPS). Predictions are sent to the frontend via WebSocket.

### 🧠 Training Tracking

- **Tool:** [MLflow](https://mlflow.org/) was used for experiment tracking, versioning, and metric logging.
- **Tracking Data:** Stored under `ML/mlruns/` with accuracy, loss, learning rate, etc.
- **Launch UI:**  
  ```bash
  mlflow ui --backend-store-uri ./ML/mlruns
  ```
  Visit [http://localhost:5000](http://localhost:5000) to view results.

---

## 📊 Frontend Overview

- React 19 + TypeScript
- Real-time updates via WebSocket
- Visual confidence indicators with animated bar charts
- Mobile-responsive dashboard


---

## 📂 Environment Variables

### Development (`.env.dev`)
```env
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### Production (`.env`)
```env
REACT_APP_WS_URL=ws://backend:8000/ws
```

---

## 📜 NPM Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm start`      | Start the development server             |
| `npm run build`  | Build the production-ready frontend      |
| `npm test`       | Run the test suite                       |
| `npm run eject`  | Eject Create React App config (destructive) |

---

## 🛑 Stop & Clean Containers

```bash
docker compose down --volumes
```

---

## ✍️ Author

- [Nir Morad](https://github.com/nir-morad-grabcad/)

---

## 📄 License

This project is licensed under the MIT License.
