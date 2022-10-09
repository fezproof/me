import { Sphere } from "@react-three/drei";

const Scene = () => {
  return (
    <Sphere args={[0.5, 32, 32]} castShadow receiveShadow>
      <meshPhysicalMaterial color="blue" />
    </Sphere>
  );
};

export default Scene;
