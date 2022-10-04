import { OrbitControls, Plane, Sphere, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Suspense, useState } from "react";

import Scene from "~/components/Scene";

export const loader = async ({ request, context }: LoaderArgs) => {
  return json({
    position: {
      latitude: context.cf.latitude,
      longitude: context.cf.longitude,
    },
    location: {
      city: context.cf.city,
      country: context.cf.country,
    },
  });
};

export default function Index() {
  const { location, position } = useLoaderData<typeof loader>();

  const [debug, setDebug] = useState(false);
  return (
    <div className="h-screen w-screen">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Stars factor={4} speed={0} />
          <color attach="background" args={["black"]} />

          <directionalLight intensity={1} position={[1, 0, 0]} />
          <ambientLight intensity={0.05} />

          <Scene />

          <Sphere scale={0.1} position={[1, 1, 2]}></Sphere>

          {debug && (
            <>
              <axesHelper />
              <Plane rotation-x={Math.PI / 2} args={[100, 100, 100, 100]}>
                <meshBasicMaterial color="white" wireframe />
              </Plane>
            </>
          )}

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.1}
          />
        </Suspense>
      </Canvas>

      <div className="fixed bottom-4 left-4 flex flex-row gap-8">
        <button
          className="bg-white px-4 py-2 rounded"
          onClick={() => setDebug(!debug)}
        >
          Debug
        </button>

        <pre className="text-white">
          {JSON.stringify({ location, position }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
