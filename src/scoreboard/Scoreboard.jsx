import React, { useEffect, useState } from "react";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
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
    loadScores();
  }, []);

  return (
    <div className="scoreboard">
      <h1>Scoreboard</h1>
      <ul>
        {scores.map((entry, index) => (
          <li key={index}>
            {entry.name}: {Number(entry.time).toFixed(2)}s
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
