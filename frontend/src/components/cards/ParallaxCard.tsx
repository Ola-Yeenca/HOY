import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxCardProps {
  children: ReactNode;
}

export const ParallaxCard = ({ children }: ParallaxCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
};
