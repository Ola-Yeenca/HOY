import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
}

export const GlowEffect = ({ children }: GlowEffectProps) => {
  return (
    <div className="relative">
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700] opacity-20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700] opacity-20 rounded-full filter blur-[128px] animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
