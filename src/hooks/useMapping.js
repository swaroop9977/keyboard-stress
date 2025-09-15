import { useState, useRef } from "react";

// letters to shuffle
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// specials remain fixed
const SPECIAL_KEYS = ["BACKSPACE", "TAB", "ENTER", "CAPS", "SHIFT", "SPACE"];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function useMapping(difficulty = "easy") {
  const [mapping, setMapping] = useState(() => {
    const initial = {};
    LETTERS.forEach((l) => (initial[l] = l));
    SPECIAL_KEYS.forEach((k) => (initial[k] = k));
    return initial;
  });

  const pressCount = useRef(0);

  function reshuffle() {
    const shuffled = shuffleArray(LETTERS);
    const newMap = {};
    LETTERS.forEach((l, i) => {
      newMap[l] = shuffled[i];
    });
    SPECIAL_KEYS.forEach((k) => (newMap[k] = k));
    setMapping(newMap);
  }

  function reset() {
    const resetMap = {};
    LETTERS.forEach((l) => (resetMap[l] = l));
    SPECIAL_KEYS.forEach((k) => (resetMap[k] = k));
    setMapping(resetMap);
    pressCount.current = 0;
  }

  // call this whenever a key is pressed
  function handleKeyPress(key) {
    pressCount.current++;

    if (difficulty === "hard") {
      reshuffle();
    } else if (difficulty === "medium" && pressCount.current % 2 === 0) {
      reshuffle();
    } else if (difficulty === "easy" && pressCount.current % 5 === 0) {
      reshuffle();
    }

    return mapping[key] || key;
  }

  return { mapping, reshuffle, reset, handleKeyPress };
}
