import React from "react";
import Scoreboard from "./Scoreboard";

export default function Overlay({ visible, results, onRestart }) {
  if (!visible) return null;

  // results: { time, accuracy, wpm, target, typed }
  const { time, accuracy, wpm, target, typed } = results || {};

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#071024",
          color: "#e6eef8",
          padding: 24,
          borderRadius: 12,
          width: 560,
          maxWidth: "90%",
        }}
      >
        <h2 style={{ marginTop: 0, textAlign: "center" }}>🏆 Round Results</h2>

        {/* 🎯 Scoreboard */}
        <Scoreboard
          time={time}
          score={typed.length}
          total={target.length}
          accuracy={accuracy}
          wpm={wpm}
        />

        {/* Target vs Typed */}
        <div style={{ marginTop: 20 }}>
          <div style={{ color: "#9fb4d6", fontSize: 13 }}>Target</div>
          <div
            style={{
              background: "#00121b",
              padding: 10,
              borderRadius: 8,
              marginTop: 6,
            }}
          >
            {target}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ color: "#9fb4d6", fontSize: 13 }}>You typed</div>
          <div
            style={{
              background: "#00121b",
              padding: 10,
              borderRadius: 8,
              marginTop: 6,
            }}
          >
            {typed}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 20,
          }}
        >
          <button
            onClick={onRestart}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
            }}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
