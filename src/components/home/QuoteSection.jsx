import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const QUOTES = [
  'Die besten Geschichten beginnen dort, wo man aufhört, nach Perfektion zu suchen.',
  'Vatersein bedeutet, die Welt noch einmal zum ersten Mal zu sehen.',
  'Kreativität ist keine Begabung – sie ist eine Entscheidung.',
  'Die Stille zwischen den Tönen macht die Musik.',
  'Manchmal liegt die tiefste Erkenntnis im Alltäglichen verborgen.',
  'Technologie sollte uns nicht schneller machen, sondern bewusster.',
  'Jeder Moment ist eine Geschichte, die erzählt werden will.',
  'Beobachten heißt, dem Leben Aufmerksamkeit schenken.',
  'Die besten Ideen kommen, wenn man aufhört, sie zu suchen.',
  'Geschichten verbinden uns – über Zeit, Raum und Unterschiede hinweg.',
];

export default function QuoteSection() {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <section className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="text-primary/30 text-6xl font-display leading-none mb-6">„</div>
        <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl italic leading-relaxed text-foreground/90">
          {quote}
        </blockquote>
        <div className="mt-8 text-sm text-muted-foreground tracking-wide">— BERPEN</div>
      </motion.div>
    </section>
  );
}