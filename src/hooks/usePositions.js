import { useState, useEffect, useCallback } from "react";

const LETTER_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FIXED_KEYS = ["SPACE", "CLR", "CLOSE"];

export default function usePositions(interval = 4000, difficulty = "normal") {
  const [positions, setPositions] = useState({});

  const range = difficulty === "easy" ? 15 : difficulty === "hard" ? 80 : 40;

  const randomPositions = useCallback(() => {
    const pos = {};

    // movable letters
    LETTER_KEYS.forEach((k) => {
      pos[k] = {
        top: Math.floor(Math.random() * range + 10) + "%",
        left: Math.floor(Math.random() * (90 - range) + 5) + "%",
      };
    });

    // fixed keys at bottom
    pos["SPACE"] = { top: "85%", left: "40%" };
    pos["CLR"] = { top: "85%", left: "10%" };
    pos["CLOSE"] = { top: "85%", left: "75%" };

    return pos;
  }, [range]);

  const reshuffle = useCallback(() => {
    setPositions(randomPositions());
  }, [randomPositions]);

  useEffect(() => {
    reshuffle(); // initial placement
    const id = setInterval(() => {
      reshuffle();
    }, interval);
    return () => clearInterval(id);
  }, [interval, reshuffle]);

  return { positions, reshuffle };
}
