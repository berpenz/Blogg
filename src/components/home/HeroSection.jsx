import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/6a2438b35375c5ad1ef3314a/1d64695d2_generated_d717d3ea.png',
  'https://media.base44.com/images/public/6a2438b35375c5ad1ef3314a/430e0ea19_generated_e83e9c52.png',
  'https://media.base44.com/images/public/6a2438b35375c5ad1ef3314a/2bc5ba78d_generated_3e17f9e9.png',
];

export default function HeroSection({ heroImages }) {
  const [current, setCurrent] = useState(0);
  const images = heroImages?.length ? heroImages : HERO_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [images.length]);

  const scrollToArticles = () => {
    document.getElementById('latest-articles')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={images[current]}
            alt=""
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl text-white tracking-[0.3em] font-semibold"
        >
          BERPEN
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-6 md:mt-8 text-white/80 text-base md:text-lg max-w-xl leading-relaxed font-body font-light tracking-wide"
        >
          Gedanken über mein Leben, Menschen, Beziehungen, Kreativität, Technik, Freundschaft und die kleinen Dinge, die manchmal übersehen werden.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          onClick={scrollToArticles}
          className="mt-10 px-8 py-3 border border-white/40 text-white text-sm tracking-[0.15em] uppercase hover:bg-white/10 transition-all duration-500"
        >
          Artikel entdecken
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}