import React from "react";

function getRank(accuracy, wpm) {
  if (accuracy >= 95 && wpm >= 70) return "S";
  if (accuracy >= 85 && wpm >= 50) return "A";
  if (accuracy >= 70 && wpm >= 30) return "B";
  return "C";
}

function getRemark(rank) {
  switch (rank) {
    case "S": return "🔥 Lightning fingers!";
    case "A": return "⚡ Great job!";
    case "B": return "👍 Keep practicing!";
    default: return "🐢 Slow but steady!";
  }
}

export default function Overlay({ visible, results, onRestart }) {
  if (!visible) return null;
  if (!results) return null;

  const {
    time,
    accuracy,
    wpm,
    target,
    typed,
    score,
    total,
  } = results;

  const errors = total - score;
  const completion = Math.round((typed.length / total) * 100);
  const grossWPM = Math.round((typed.length / 5) / Math.max(time / 60, 1/60));
  const rank = getRank(accuracy, wpm);
  const remark = getRemark(rank);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.7)",
      zIndex: 50
    }}>
      <div style={{
        background: "#111827",
        color: "#e5e7eb",
        padding: 24,
        borderRadius: 12,
        width: 540,
        maxWidth: "95%",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>
          🏆 Round Results
        </h2>

        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          <div><strong>⏱ Time:</strong> {time}s</div>
          <div><strong>✅ Correct:</strong> {score} / {total}</div>
          <div><strong>❌ Errors:</strong> {errors}</div>

          <div>
            <strong>🎯 Accuracy:</strong> {accuracy}%
            <div style={{
              height: 8,
              background: "#374151",
              borderRadius: 4,
              marginTop: 4
            }}>
              <div style={{
                width: `${accuracy}%`,
                height: "100%",
                borderRadius: 4,
                background: accuracy > 80 ? "#10b981" : accuracy > 50 ? "#fbbf24" : "#ef4444",
                transition: "width 0.5s ease"
              }} />
            </div>
          </div>

          <div>
            <strong>⌨️ WPM:</strong> {wpm} (Gross: {grossWPM})
            <div style={{
              height: 8,
              background: "#374151",
              borderRadius: 4,
              marginTop: 4
            }}>
              <div style={{
                width: `${Math.min(wpm, 100)}%`,
                height: "100%",
                borderRadius: 4,
                background: wpm > 60 ? "#10b981" : wpm > 30 ? "#fbbf24" : "#ef4444",
                transition: "width 0.5s ease"
              }} />
            </div>
          </div>

          <div><strong>📈 Completion:</strong> {completion}%</div>
          <div><strong>🏅 Rank:</strong> {rank}</div>
          <div style={{ fontStyle: "italic", color: "#93c5fd" }}>{remark}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ color: "#9fb4d6", fontSize: 13 }}>Target</div>
          <div style={{
            background: "#00121b",
            padding: 10,
            borderRadius: 8,
            marginTop: 4
          }}>
            {target}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ color: "#9fb4d6", fontSize: 13 }}>You typed</div>
          <div style={{
            background: "#00121b",
            padding: 10,
            borderRadius: 8,
            marginTop: 4
          }}>
            {typed}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button
            onClick={onRestart}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
