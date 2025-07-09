import React, { useEffect, useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import useGame from "./stores/useGame.jsx";

const Interface = () => {
  const time = useRef();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  const playerName = useGame((state) => state.playerName);
  const setPlayerName = useGame((state) => state.setPlayerName);

  const endTime = useGame((state) => state.endTime);
  const startTime = useGame((state) => state.startTime);

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  const saveScore = async () => {
    const finalTime = ((endTime - startTime) / 1000).toFixed(2);
    try {
      await fetch(
        `${import.meta.env.VITE_KV_REST_API_URL}/zadd/scoreboard/${finalTime}/${encodeURIComponent(
          name,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_TOKEN}`,
          },
        },
      );
      fetch(
        `${import.meta.env.VITE_KV_REST_API_URL}/publish/scoreboard/${finalTime}:${encodeURIComponent(
          name,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_TOKEN}`,
          },
        },
      ).catch((err) => console.error(err));
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setName(playerName);
  }, [playerName]);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      // console.log("tick");
      const state = useGame.getState();
      // console.log(state);

      let elapsedTime = 0;

      if (state.phase === "playing") elapsedTime = Date.now() - state.startTime;
      else if (state.phase === "ended")
        elapsedTime = state.endTime - state.startTime;

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);
      // console.log(elapsedTime);

      if (time.current) time.current.textContent = elapsedTime;
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  useEffect(() => {
    if (phase === "ready") setSaved(false);
  }, [phase]);
  return (
    <div className="interface">
      <div ref={time} className="time">
        0.00
      </div>
      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}

      {phase === "ready" && (
        <div
          className="score-entry"
          style={{
            position: "absolute",
            top: "40%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <input
            style={{ fontSize: "2rem" }}
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPlayerName(e.target.value);
            }}
          />
        </div>
      )}

      {phase === "ended" && !saved && (
        <div
          className="score-entry"
          style={{
            position: "absolute",
            top: "60%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <input
            style={{ fontSize: "2rem" }}
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPlayerName(e.target.value);
            }}
          />
          <button
            style={{ fontSize: "2rem", marginLeft: "1rem" }}
            onClick={saveScore}
          >
            Save Score
          </button>
        </div>
      )}

      {/*
      {phase === "ended" && saved && (
        <div
          style={{
            pointerEvents: "auto",
            position: "absolute",
            top: "60%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <a style={{ fontSize: "2rem" }} href="/scoreboard.html">
            View Scoreboard
          </a>
        </div>
      )}
*/}

      <div className="controls">
        <div className="key-wrapper">
          <div className="raw">
            <div className={`key ${forward ? "active" : ""}`}></div>
          </div>
          <div className="raw">
            <div className={`key ${leftward ? "active" : ""}`}></div>
            <div className={`key ${backward ? "active" : ""}`}></div>
            <div className={`key ${rightward ? "active" : ""}`}></div>
          </div>
          <div className="raw">
            <div className={`key ${jump ? "active" : ""} large`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Interface;
