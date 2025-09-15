import React, { useEffect, useRef, useState } from "react";
import Keyboard from "./components/Keyboard";
import ControlPanel from "./components/ControlPanel";
import Overlay from "./components/Overlay";
import useMapping from "./hooks/useMapping";
import { WORDS } from "./utils/words";
import { SENTENCES } from "./utils/sentences";

export default function App() {
  // game states
  const [mode, setMode] = useState("word"); // "word" or "sentence"
  const [difficulty, setDifficulty] = useState("medium"); // easy/medium/hard
  const [running, setRunning] = useState(false);
  const [typed, setTyped] = useState("");
  const [pressCount, setPressCount] = useState(0);
  const [overlay, setOverlay] = useState({ visible: false, results: null });
  const [capsOn, setCapsOn] = useState(false); // track capslock state

  // target
  const [target, setTarget] = useState("");
  // timer/score
  const [time, setTime] = useState(0);
  const [startTs, setStartTs] = useState(null);

  // mapping hook
  const { mapping, reshuffle, reset } = useMapping();

  // refs
  const mappingRef = useRef(mapping);
  useEffect(() => {
    mappingRef.current = mapping;
  }, [mapping]);

  const backspaceTimer = useRef(null);
  const timerRef = useRef(null);

  // derive threshold from difficulty
  function thresholdFromDifficulty(d) {
    if (d === "easy") return 5;
    if (d === "medium") return 2;
    return 1; // hard
  }
  const shuffleThreshold = thresholdFromDifficulty(difficulty);

  // pick a random target
  function pickTarget() {
    if (mode === "word") {
      const pool = Array.isArray(WORDS) ? WORDS : WORDS[difficulty] || WORDS.medium;
      const w = pool[Math.floor(Math.random() * pool.length)];
      setTarget(w);
    } else {
      const s = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
      setTarget(s);
    }
    setTyped("");
    setPressCount(0);
  }

  // next target (manual)
  function nextTarget() {
    pickTarget();
  }

  // start/stop
  function toggleGame() {
  if (running) {
    // stop game and finalize results
    finishRound();
  } else {
    // start new round
    pickTarget();
    setRunning(true);
    setTyped("");
    setPressCount(0);
    reset();
    startTimer();
  }
}


  function restartGame() {
    setRunning(false);
    setTyped("");
    setPressCount(0);
    setOverlay({ visible: false, results: null });
    stopTimer();
    reset();
  }

  // timer management
  function startTimer() {
    const start = Date.now();
    setStartTs(start);
    setTime(0);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setStartTs(null);
  }

  // calculate results when completed
  function finishRound() {
    stopTimer();
    setRunning(false);

    // compute accuracy
    const correctChars = [...Array(Math.max(typed.length, target.length))]
      .map((_, i) => (typed[i] === target[i] ? 1 : 0))
      .reduce((a, b) => a + b, 0);

    const accuracy =
      target.length > 0 ? Math.round((correctChars / target.length) * 100) : 100;
    const minutes = Math.max((time || 1) / 60, 1 / 60);
    const wpm = Math.round((correctChars / 5) / minutes);

    const results = {
  time,
  accuracy,
  wpm,
  target,
  typed,
  score: correctChars,
  total: target.length,
};


    setOverlay({ visible: true, results });
    reset();
  }

  // main handler for clicks & mapping output
  function handleKeyPress(label) {
    if (!running) return;

    if (label === "SPACE") {
      setTyped((t) => t + " ");
    } else if (label === "CLR" || label === "BACKSPACE") {
      setTyped((t) => t.slice(0, -1));
    } else if (label === "CLOSE") {
      setOverlay({
        visible: true,
        results: { message: "Game Over! Window Closed (simulated)" },
      });
    } else if (label === "ENTER") {
      setTyped((t) => t + "\n");
    } else if (label === "TAB") {
      setTyped((t) => t + "    ");
    } else if (label === "CAPS") {
      setCapsOn((prev) => !prev);
    } else if (label === "SHIFT") {
      setCapsOn((prev) => !prev);
      setTimeout(() => setCapsOn((prev) => !prev), 500);
    } else {
      if (/^[A-Z]$/.test(label)) {
        setTyped((t) => t + (capsOn ? label.toUpperCase() : label.toLowerCase()));

        // count only letter presses
        setPressCount((count) => {
          const newCount = count + 1;
          if (newCount >= shuffleThreshold) {
            reshuffle();
            return 0;
          }
          return newCount;
        });
      }
    }
  }

  // physical keyboard support
  useEffect(() => {
    function onKeyDown(e) {
      if (!running) return;

      let key = e.key;

      if (key === " ") key = "SPACE";
      else if (key === "Backspace") key = "BACKSPACE";
      else if (key === "Escape") key = "CLOSE";
      else if (key === "Enter") key = "ENTER";
      else if (key === "Tab") {
        e.preventDefault();
        key = "TAB";
      } else if (key === "CapsLock") key = "CAPS";
      else if (key === "Shift") key = "SHIFT";
      else key = key.toUpperCase();

      const mappedKey = mappingRef.current[key];
      if (mappedKey) {
        handleKeyPress(mappedKey);
      } else if (key.length === 1) {
        handleKeyPress(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [running]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(backspaceTimer.current);
    };
  }, []);

  // compute progress spans
  function renderTargetProgress() {
    const chars = target.split("");
    const typedChars = typed.split("");
    return chars.map((ch, i) => {
      const typedChar = typedChars[i];
      const isCorrect = typedChar === ch;
      const isTyped = typedChar !== undefined;
      const isCursor = i === typedChars.length;

      const style = {
        padding: "2px 4px",
        borderRadius: 4,
        marginRight: 2,
        background: isTyped ? (isCorrect ? "#063" : "#600") : "transparent",
        color: isTyped ? "#fff" : "#cfe7ff",
        borderBottom: isCursor ? "2px solid #4fd1c5" : "none",
      };
      return (
        <span key={i} style={style}>
          {ch}
        </span>
      );
    });
  }

  // initial mount
  useEffect(() => {
    pickTarget();
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        padding: 20,
        color: "#e6eef8",
        minHeight: "100vh",
        background: "#071024",
      }}
    >
      <h1>Keyboard Stress Test — Typing Challenge</h1>

      <ControlPanel
        running={running}
        onToggle={toggleGame}
        mode={mode}
        setMode={setMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        nextTarget={nextTarget}
      />

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "#9fb4d6", marginBottom: 6 }}>Target ({mode})</div>
        <div
          style={{
            background: "#00121b",
            padding: 12,
            borderRadius: 8,
            minHeight: 48,
          }}
        >
          <div style={{ fontSize: 16 }}>{renderTargetProgress()}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, color: "#9fb4d6" }}>
        <div>Typed:</div>
        <div
          style={{
            background: "#00121b",
            padding: 10,
            borderRadius: 8,
            minHeight: 48,
            fontFamily: "monospace",
          }}
        >
          {typed}
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 18 }}>
        <div>
          ⏱ Time: <strong>{time}s</strong>
        </div>
        <div>
          Mode: <strong>{mode}</strong>
        </div>
        <div>
          Difficulty: <strong>{difficulty}</strong>
        </div>
      </div>

      <div style={{ marginTop: 18 }} className="keyboard-container">
        <Keyboard onKeyPress={handleKeyPress} mapping={mapping} />
      </div>

      <Overlay
        visible={overlay.visible}
        results={overlay.results}
        onRestart={restartGame}
      />
    </div>
  );
}
