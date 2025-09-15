import React from "react";

export default function ControlPanel({
  running,
  onToggle,
  mode,
  setMode,
  difficulty,
  setDifficulty,
  nextTarget,
}) {
  return (
    <div
      className="control-panel"
      style={{
        margin: "16px 0",
        display: "flex",
        gap: 16,
        alignItems: "center",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        padding: "12px 16px",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Start/Stop Button */}
      <button
        onClick={onToggle}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "none",
          background: running
            ? "linear-gradient(135deg, #f87171, #dc2626)"
            : "linear-gradient(135deg, #34d399, #059669)",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.85")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        {running ? "⏹ Stop Game" : "▶️ Start Game"}
      </button>

      {/* Mode Selector */}
      <label style={{ color: "#cfe7ff", fontWeight: "500" }}>
        Mode:
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            marginLeft: 8,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "#f1f5f9",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <option value="word">Word</option>
          <option value="sentence">Sentence</option>
        </select>
      </label>

      {/* Difficulty Selector */}
      <label style={{ color: "#cfe7ff", fontWeight: "500" }}>
        Difficulty:
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            marginLeft: 8,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "#f1f5f9",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <option value="easy">🟢 Easy (5 presses)</option>
          <option value="medium">🟡 Medium (2 presses)</option>
          <option value="hard">🔴 Hard (every press)</option>
        </select>
      </label>

      {/* Next Target Button */}
      <button
        onClick={nextTarget}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(135deg, #60a5fa, #2563eb)",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.85")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        🔄 Next Target
      </button>
    </div>
  );
}
