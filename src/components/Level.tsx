// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useGLTF } from "@react-three/drei";
import { Crown } from "../assets/Crown";
import { applyWaveAnimation } from "./ui-animations.js";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "#02DB07" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "#00A100" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "#CA0C2E" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "#6E0031" });

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.5} rotationIntensity={0.5}>
        <Text
          font={"./Nougat ExtraBlack.ttf"}
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign={"right"}
          position={[0.35, 0.65, 0]}
          rotation-y={-0.25}
          outlineWidth={0.02}    
          outlineColor="#000000" 
          outlineOpacity={1}     
          outlineBlur={0}        
          fillOpacity={1}        
        >
          PA
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <Text
          font={"./Nougat ExtraBlack.ttf"}
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign={"left"}
          position={[1.30, 0.65, 0]}
          color="#E6311F"
          outlineWidth={0.02}    
          outlineColor="#000000" 
          outlineOpacity={1}     
          outlineBlur={0}        
          fillOpacity={1}   
          
        >
          REDIS
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {
  /*const hamburger = useGLTF("./hamburger.glb");
  // console.log(hamburger);

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = false;
  });*/
  const crown = useRef();
  const [speed, setSpeed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // console.log(rotation);

    crown.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <Text
        font={"./Nougat ExtraBlack.ttf"}
        scale={1}
        position={[0, 2.25, 2]}
        color="white"
        fillOpacity={0.5}
      >
        CHEGADA
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={crown}
        type={"kinematicPosition"}
        colliders={"trimesh"}
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        {/*<primitive object={hamburger.scene} scale={0.2} />*/}
        <Crown scale={0.8} />
      </RigidBody>
    </group>
  );
}

export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed, setSpeed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1),
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    // console.log(rotation);

    obstacle.current.setNextKinematicRotation(rotation);
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}
export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset, setTimeOffset] = useState(
    () => Math.random() * Math.PI * 2,
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;

    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset, setTimeOffset] = useState(
    () => Math.random() * Math.PI * 2,
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type={"kinematicPosition"}
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type={"fixed"} restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          position={[2.15, 0.75, -(length * 2) + 2]}
          castShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          position={[-2.15, 0.75, -(length * 2) + 2]}
          receiveShadow
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          position={[0, 0.75, -(length * 4) + 2]}
          receiveShadow
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export const Level = ({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);
  // console.log(blocks);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, i) => (
        <Block key={i} position={[0, 0, -(i + 1) * 4]} />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};
