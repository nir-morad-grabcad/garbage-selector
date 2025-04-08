import React from "react";
import "./PredictionBars.css";

interface PredictionBarsProps {
  predictions: number[];
}

const CLASS_LABELS = [
  { name: "שקיות ואריזות נייר", color: "blue" },
  { name: "שאריות מזון", color: "brown" },
  { name: "אשפה כללית להטמנה", color: "green" },
  { name: "אריזות", color: "orange" },
  { name: "בקבוקים ופחיות לפקדון", color: "yellow" },
];

export function colorFade(color: string): string {
  return `linear-gradient(to right, ${color}, ${color} 10%)`;
}

const PredictionBars: React.FC<PredictionBarsProps> = ({ predictions }) => {
  return (
    <div className="bars-container">
      {predictions.map((value, idx) => {
        const color = CLASS_LABELS[idx].color;

        return (
          <div key={idx} className="bar-row">
            <span className="bar-label">{CLASS_LABELS[idx].name}</span>
            <div className="bar-outer">
              <div
                className="bar-inner"
                style={{
                  width: `${value * 100}%`,
                  background: colorFade(color),
                }}
              />
            </div>
            <span className="bar-percent">{(value * 100).toFixed(1)}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionBars;
