'use client';

import { useThreeComponents } from '@/hooks/useThreeComponents';
import { SceneLoader } from './SceneLoader';
import dynamic from 'next/dynamic';

// Ensure the component only renders on the client
const Scene = dynamic(() => Promise.resolve(() => {
  const { Canvas, OrbitControls, Text3D, Center, isLoading } = useThreeComponents();

  if (isLoading || !Canvas || !OrbitControls || !Text3D || !Center) {
    return <SceneLoader />;
  }

  return (
    <div className="w-full h-full bg-black/10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={3}
            height={0.2}
            curveSegments={12}
          >
            HOY
            <meshStandardMaterial 
              color="#FFD700" 
              metalness={0.8} 
              roughness={0.2}
              emissive="#FFD700"
              emissiveIntensity={0.2}
            />
          </Text3D>
        </Center>
      </Canvas>
    </div>
  );
}), { ssr: false });

export default Scene;
