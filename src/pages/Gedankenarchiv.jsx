import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const CATEGORY_LABELS = {
  beobachtung: 'Beobachtung',
  zitat: 'Zitat',
  frage: 'Frage',
  notiz: 'Notiz',
  erinnerung: 'Erinnerung',
  idee: 'Idee',
};

const MOOD_LABELS = {
  nachdenklich: 'Nachdenklich',
  freudig: 'Freudig',
  melancholisch: 'Melancholisch',
  neugierig: 'Neugierig',
  ruhig: 'Ruhig',
  inspiriert: 'Inspiriert',
};

export default function Gedankenarchiv() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: thoughts = [], isLoading } = useQuery({
    queryKey: ['thoughts-public'],
    queryFn: () => base44.entities.Thought.filter({ is_public: true }, '-created_date', 200),
    initialData: [],
  });

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return thoughts;
    return thoughts.filter(t => t.category === activeCategory);
  }, [thoughts, activeCategory]);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Notizbuch</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mt-2">Gedankenarchiv</h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Kurze Notizen, Zitate und Beobachtungen. Fragmente aus dem Strom der Gedanken – 
            gesammelt, nicht sortiert. Wie ein Notizbuch, das man immer bei sich trägt.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs tracking-wide uppercase transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:border-primary'
            }`}
          >
            Alle
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 text-xs tracking-wide uppercase transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Thought Cards */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-6 animate-pulse">
                <div className="border border-border p-6">
                  <div className="h-4 bg-muted w-3/4 mb-3" />
                  <div className="h-3 bg-muted w-full mb-2" />
                  <div className="h-3 bg-muted w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {filtered.map((thought, i) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="break-inside-avoid mb-6"
              >
                <div className="group border border-border/60 p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-sm bg-background">
                  {/* Category & mood */}
                  <div className="flex items-center gap-2 mb-4">
                    {thought.category && (
                      <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-medium">
                        {CATEGORY_LABELS[thought.category]}
                      </span>
                    )}
                    {thought.mood && (
                      <>
                        <span className="text-border text-xs">·</span>
                        <span className="text-[10px] text-muted-foreground italic">
                          {MOOD_LABELS[thought.mood]}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Text */}
                  <p className={`leading-relaxed ${
                    thought.category === 'zitat'
                      ? 'font-heading text-lg italic text-foreground/90'
                      : 'text-sm text-foreground/85'
                  }`}>
                    {thought.category === 'zitat' ? `„${thought.text}"` : thought.text}
                  </p>

                  {/* Tags & date */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {thought.tags?.map(tag => (
                        <span key={tag} className="text-[10px] text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(thought.created_date), 'd. MMM yyyy', { locale: de })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-xl text-muted-foreground italic">
              Noch keine Gedanken gesammelt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}