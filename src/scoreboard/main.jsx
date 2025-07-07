import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Scoreboard from "./Scoreboard.jsx";
import "../index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Scoreboard />
    </StrictMode>,
);