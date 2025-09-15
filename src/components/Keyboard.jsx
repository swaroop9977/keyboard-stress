import React, { useCallback } from "react";
import Key from "./Key";

const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P","BACKSPACE"],
  ["TAB","A","S","D","F","G","H","J","K","L","ENTER"],
  ["CAPS","Z","X","C","V","B","N","M"],
  ["SHIFT","SPACE"],
];

const SPECIAL_KEYS = new Set(["ENTER","BACKSPACE","SHIFT","CAPS","TAB","SPACE"]);

function keySizeClass(k) {
  if (k === "SPACE") return "key--space";
  if (["SHIFT","CAPS","TAB"].includes(k)) return "key--wide";
  if (["ENTER","BACKSPACE"].includes(k)) return "key--med";
  return "key--normal";
}

export default function Keyboard({ onKeyPress, mapping = {}, activeKey }) {
  // stable press handler
  const handlePress = useCallback(
    (logicalKey) => {
      const out = mapping[logicalKey] || logicalKey;
      onKeyPress && onKeyPress(out);
    },
    [mapping, onKeyPress]
  );

  return (
    <div className="keyboard" role="application" aria-label="Typing keyboard">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="keyboard-row" role="group" aria-label={`Row ${rowIdx + 1}`}>
          {row.map((k) => {
            const label = mapping[k] || k;
            const isSpecial = SPECIAL_KEYS.has(k);
            const sizeClass = keySizeClass(k);
            // Decide if this key should be visually active (physical keydown)
            const isActive =
              activeKey &&
              (activeKey.toUpperCase() === (mapping[k] || k).toUpperCase() ||
               activeKey.toUpperCase() === k.toUpperCase());

            return (
              <Key
                key={k}
                label={label}
                className={`key ${sizeClass} ${isSpecial ? "key--special" : ""}`}
                isActive={isActive}
                isSpecial={isSpecial}
                onPress={() => handlePress(k)}
                data-key={k}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
