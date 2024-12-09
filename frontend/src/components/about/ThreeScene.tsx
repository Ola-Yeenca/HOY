'use client';

import dynamic from 'next/dynamic';
import { SceneLoader } from './SceneLoader';
import { Suspense } from 'react';

// Dynamically import Three.js components with no SSR and proper loading
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <SceneLoader />,
});

const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => <SceneLoader />,
});

export function ThreeHeroScene() {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
      <Suspense fallback={<SceneLoader />}>
        <Scene />
      </Suspense>
    </div>
  );
}

export function ThreeBentoScene() {
  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
      <Suspense fallback={<SceneLoader />}>
        <Scene3D />
      </Suspense>
    </div>
  );
}
