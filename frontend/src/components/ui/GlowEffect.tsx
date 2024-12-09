"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export const GlowEffect = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gold/20 blur-[128px] -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
      {children}
    </div>
  );
};
