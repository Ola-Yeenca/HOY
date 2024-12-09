import { motion } from "framer-motion";
import { AnimatedText } from "../ui/design-system/AnimatedText";
import { BentoGrid, BentoGridItem } from "../ui/design-system/BentoGrid";
import { ThreeDCard } from "../ui/design-system/3DCard";

interface ModernLayoutProps {
  children: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum"
    >
      <header className="container mx-auto py-8">
        <AnimatedText
          text="Welcome to House of Young"
          className="text-4xl md:text-6xl font-bold mb-4"
        />
        <AnimatedText
          text="Experience the Future of Nightlife"
          className="text-xl md:text-2xl opacity-80"
        />
      </header>

      <main className="container mx-auto py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="container mx-auto py-8 mt-auto">
        <div className="border-t border-gold/20 pt-8">
          <AnimatedText
            text="House of Young - Where Luxury Meets Entertainment"
            className="text-sm opacity-60"
          />
        </div>
      </footer>
    </motion.div>
  );
}
