export default function Key({ label, onPress, style }) {
  return (
    <button
      onClick={onPress}
      style={{
        background: "linear-gradient(145deg, #1e1e2e, #2d2d44)", // dark base
        color: "#f8fafc",
        border: "1px solid #3b3b5c",
        borderRadius: 10,
        fontSize: 16,
        fontWeight: "600",
        padding: "14px 20px",
        minWidth: 52,
        cursor: "pointer",
        boxShadow:
          "0 3px 8px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.05)",
        transition: "all 0.2s ease",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        ...style,
      }}
      onMouseOver={(e) => {
        e.target.style.background = "linear-gradient(145deg, #3a0ca3, #4361ee)";
        e.target.style.boxShadow =
          "0 0 12px rgba(67,97,238,0.7), 0 0 20px rgba(67,97,238,0.5)";
        e.target.style.transform = "translateY(-3px)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "linear-gradient(145deg, #1e1e2e, #2d2d44)";
        e.target.style.boxShadow =
          "0 3px 8px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.05)";
        e.target.style.transform = "translateY(0)";
      }}
      onMouseDown={(e) => {
        e.target.style.background = "linear-gradient(145deg, #240046, #3a0ca3)";
        e.target.style.transform = "translateY(2px)";
        e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.6)";
      }}
      onMouseUp={(e) => {
        e.target.style.background = "linear-gradient(145deg, #3a0ca3, #4361ee)";
        e.target.style.boxShadow =
          "0 0 12px rgba(67,97,238,0.7), 0 0 20px rgba(67,97,238,0.5)";
        e.target.style.transform = "translateY(-2px)";
      }}
    >
      {label}
    </button>
  );
}
