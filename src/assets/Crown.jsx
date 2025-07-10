import React from "react";
import { useGLTF } from "@react-three/drei";

export function Crown(props) {
  const { nodes, materials } = useGLTF("/fall_guys_crown.glb");

  return (
    <group {...props} dispose={null}>
      <group scale={[1.347, 1, 1.347]} position={[0, 0, -0.5]}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials["Material.004"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/fall_guys_crown.glb");
