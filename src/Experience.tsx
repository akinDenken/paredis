// @ts-nocheck
import React from "react";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Level } from "./components/Level";
import Lights from "./components/Lights";
import Player from "./components/Player";
import useGame from "./stores/useGame.jsx";

const Experience = () => {
  const blocksCount = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);

  return (
    <>
      <color args={["#bdedfc"]} attach="background" />

      {/*<Perf position={"top-left"} minimal={true} />*/}

      <Physics debug={false}>
        <Lights />
        <Level count={blocksCount} seed={blockSeed} />
        <Player />
      </Physics>
    </>
  );
};
export default Experience;
