import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sun, Heart, Lightbulb, Camera, Film, Music,
  Cpu, Briefcase, Users
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'alltag', label: 'Alltag', icon: Sun, description: 'Das Gewöhnliche im Ungewöhnlichen' },
  { slug: 'familie', label: 'Familie', icon: Heart, description: 'Vatersein und Verbundenheit' },
  { slug: 'kreativitaet', label: 'Kreativität', icon: Lightbulb, description: 'Der kreative Prozess' },
  { slug: 'fotografie', label: 'Fotografie', icon: Camera, description: 'Momente einfangen' },
  { slug: 'film', label: 'Film', icon: Film, description: 'Geschichten in Bewegung' },
  { slug: 'musik', label: 'Musik', icon: Music, description: 'Klang und Emotion' },
  { slug: 'ki', label: 'KI', icon: Cpu, description: 'Künstliche Intelligenz verstehen' },
  { slug: 'arbeit', label: 'Arbeit', icon: Briefcase, description: 'Moderne Arbeitswelten' },
  { slug: 'gesellschaft', label: 'Gesellschaft', icon: Users, description: 'Zusammenleben und Wandel' },
];

export default function CategoryGrid() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Themenwelten</span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mt-2">Welten erkunden</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/blog?category=${cat.slug}`}
                className="group block p-6 md:p-8 border border-border/50 bg-background hover:border-primary/30 transition-all duration-500 hover:shadow-lg"
              >
                <cat.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-300 mb-4" />
                <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                  {cat.label}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}