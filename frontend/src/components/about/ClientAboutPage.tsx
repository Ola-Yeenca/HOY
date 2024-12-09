'use client';

import dynamic from 'next/dynamic';
import { ThreeHeroScene, ThreeBentoScene } from './ThreeScene';

const AboutHero = dynamic(() => import('./AboutHero'));
const VisionSection = dynamic(() => import('./VisionSection'));
const BentoGrid = dynamic(() => import('./BentoGrid'));
const TeamSection = dynamic(() => import('./TeamSection'));

export default function ClientAboutPage() {
  return (
    <>
      <section className="relative h-screen">
        <ThreeHeroScene />
        <AboutHero />
      </section>
      
      <VisionSection />
      
      <section className="relative h-[600px]">
        <ThreeBentoScene />
        <BentoGrid />
      </section>
      
      <TeamSection />
    </>
  );
}
