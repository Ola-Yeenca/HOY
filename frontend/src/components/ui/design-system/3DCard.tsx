'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const ThreeDCard = ({
  children,
  className = "",
  containerClassName = "",
}: ThreeDCardProps) => {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mounted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!mounted) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Initial render without animations
  if (!mounted) {
    return (
      <div className={containerClassName}>
        <div className={className}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${containerClassName}`}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      animate={{
        scale: isHovered ? 1.1 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className={`${className} bg-gradient-to-br from-gold/20 to-coffee-bean rounded-xl border border-gold/10 shadow-xl ${
          isHovered ? "shadow-gold/20" : "shadow-black/20"
        } p-6`}
      >
        {children}
      </div>
    </motion.div>
  );
};
