'use client';

import { useThreeComponents } from '@/hooks/useThreeComponents';
import { SceneLoader } from './SceneLoader';
import dynamic from 'next/dynamic';

// Ensure the component only renders on the client
const Scene3D = dynamic(() => Promise.resolve(() => {
  const { Canvas, OrbitControls, Box, isLoading } = useThreeComponents();

  if (isLoading || !Canvas || !OrbitControls || !Box) {
    return <SceneLoader />;
  }

  return (
    <div className="w-full h-full bg-black/10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1}
          enablePan={false}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#FFD700"
            emissiveIntensity={0.2}
          />
        </Box>
      </Canvas>
    </div>
  );
}), { ssr: false });

export default Scene3D;
