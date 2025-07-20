import React, { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { applyWaveAnimation } from "./ui-animations.js";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    applyWaveAnimation("#scoreboard-title");
    applyWaveAnimation("#sessions-title");
    async function loadScores() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_KV_REST_API_URL}/zrange/scoreboard/0/9/withscores`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_READ_ONLY_TOKEN}`,
            },
          },
        );
        const data = await response.json();
        if (Array.isArray(data.result)) {
          const pairs = [];
          for (let i = 0; i < data.result.length; i += 2) {
            pairs.push({ name: data.result[i], time: data.result[i + 1] });
          }
          setScores(pairs);
        }
      } catch (err) {
        console.error(err);
      }
    }
    async function loadSessions() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_KV_REST_API_URL}/zrange/session/0/-1/withscores`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_READ_ONLY_TOKEN}`,
            },
          },
        );
        const data = await response.json();
        if (Array.isArray(data.result)) {
          const pairs = [];
          for (let i = 0; i < data.result.length; i += 2) {
            pairs.push({ name: data.result[i], block: data.result[i + 1] });
          }
          setSessions(pairs);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadScores();
    loadSessions();

    const sessionAbortController = new AbortController();
    fetchEventSource(
      `${import.meta.env.VITE_KV_REST_API_URL}/subscribe/session`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_READ_ONLY_TOKEN}`,
        },
        signal: sessionAbortController.signal,
        onmessage(event) {
          try {
            const [block, name] = event.data.split(":");
            setSessions((prev) => {
              const idx = prev.findIndex((p) => p.name === name);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx].block = block;
                return updated;
              }
              return [...prev, { name, block }];
            });
          } catch (err) {
            console.error(err);
          }
        },
        onerror(err) {
          console.error("EventSource failed:", err);
        },
      },
    );

    const scoreAbortController = new AbortController();
    fetchEventSource(
      `${import.meta.env.VITE_KV_REST_API_URL}/subscribe/scoreboard`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_READ_ONLY_TOKEN}`,
        },
        signal: scoreAbortController.signal,
        onmessage() {
          loadScores();
        },
        onerror(err) {
          console.error("EventSource failed:", err);
        },
      },
    );

    return () => {
      sessionAbortController.abort();
      scoreAbortController.abort();
    };
  }, []);

return (
  <div className="scoreboard">
    <div className="scoreboard-columns">
      <div className="scoreboard-section">
        <h1 id="scoreboard-title">CLASSIFICAÇÃO</h1>
        <ul>
          {scores.map((entry, index) => (
            <li key={index}>
              {entry.name}: {Number(entry.time).toFixed(2)}s
            </li>
          ))}
        </ul>
      </div>

      <div className="scoreboard-section">
        <h1 id="sessions-title">POSIÇÃO</h1>
        <ul>
          {sessions.map((entry, index) => (
            <li key={index}>
              {entry.name}: block {entry.block}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
};

export default Scoreboard;
