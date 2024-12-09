'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export function useThreeComponents() {
  const [components, setComponents] = useState<{
    Canvas?: any;
    OrbitControls?: any;
    Text3D?: any;
    Center?: any;
    Box?: any;
    isLoading: boolean;
  }>({
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const loadComponents = async () => {
      try {
        // Dynamically import components with SSR disabled
        const [fiber, drei] = await Promise.all([
          import('@react-three/fiber').then(module => ({
            Canvas: dynamic(() => Promise.resolve(module.Canvas), { ssr: false })
          })),
          import('@react-three/drei').then(module => ({
            OrbitControls: dynamic(() => Promise.resolve(module.OrbitControls), { ssr: false }),
            Text3D: dynamic(() => Promise.resolve(module.Text3D), { ssr: false }),
            Center: dynamic(() => Promise.resolve(module.Center), { ssr: false }),
            Box: dynamic(() => Promise.resolve(module.Box), { ssr: false })
          }))
        ]);

        if (!mounted) return;

        setComponents({
          Canvas: fiber.Canvas,
          OrbitControls: drei.OrbitControls,
          Text3D: drei.Text3D,
          Center: drei.Center,
          Box: drei.Box,
          isLoading: false,
        });
      } catch (error) {
        if (mounted) {
          console.warn('Failed to load Three.js components:', error);
          setComponents(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    loadComponents();

    return () => {
      mounted = false;
    };
  }, []);

  return components;
}
