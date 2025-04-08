import React from "react";
import logo from "./logo.svg";
import "./App.css";
import WebcamStreamer from "./websocket";

function App() {
  return (
    <div className="App">
      <WebcamStreamer></WebcamStreamer>
    </div>
  );
}

export default App;
