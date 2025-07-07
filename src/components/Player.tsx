// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import useGame from "../stores/useGame.jsx";

const Player = () => {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const [smoothedCameraPosition, setSmoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10),
  );
  const [smoothedCameraTarget, setSmoothedCameraTarget] = useState(
    () => new THREE.Vector3(0, 0, 0),
  );

  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blocksCount = useGame((state) => state.blocksCount);
  const playerName = useGame((state) => state.playerName);

  const jump = () => {
    const origin = body.current.translation();
    // console.log(origin);
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);
    // console.log(hit.timeOfImpact);

    if (hit.timeOfImpact < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  const reset = () => {
    // console.log("reset");
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  const lastBlock = useRef(0);

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        // console.log("state changed to ", value);
        if (value === "ready") {
          reset();
          lastBlock.current = 0;
        }
      },
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        // console.log(value);
        if (value) {
          // console.log("Yes jump");
          jump();
        }
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      // console.log("any key down");
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    // CONTROLS
    const { forward, backward, leftward, rightward } = getKeys();
    // console.log(getKeys());

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    // CAMERA
    const bodyPosition = body.current.translation();
    // console.log(bodyPosition);

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;
    // state.camera.position.lerp(cameraPosition, 0.1);

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    // PROGRESS
    const progress = Math.floor((-bodyPosition.z - 2) / 4) + 1;
    if (playerName && progress > lastBlock.current && progress <= blocksCount) {
      lastBlock.current = progress;
      fetch(
        `${import.meta.env.VITE_KV_REST_API_URL}/zadd/session/${progress}/${encodeURIComponent(
          playerName,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_TOKEN}`,
          },
        },
      ).catch((err) => console.error(err));

      // publish progress update
      fetch(
        `${import.meta.env.VITE_KV_REST_API_URL}/publish/session/${progress}:${encodeURIComponent(
          playerName,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_KV_REST_API_TOKEN}`,
          },
        },
      ).catch((err) => console.error(err));
    }

    // PHASES
    if (bodyPosition.z < -(blocksCount * 4 + 2))
      // console.log("We are at the end");
      end();

    if (bodyPosition.y < -4) restart();
  });
  return (
    <RigidBody
      ref={body}
      canSleep={false}
      colliders={"ball"}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};
export default Player;
