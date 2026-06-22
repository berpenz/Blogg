import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Galerie() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['galerie-articles'],
    queryFn: () => base44.entities.Article.filter(
      { status: 'published' },
      '-publish_date',
      50
    ),
    initialData: [],
  });

  const withImages = articles.filter(a => a.cover_image);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const prev = () => setLightboxIndex(i => (i - 1 + withImages.length) % withImages.length);
  const next = () => setLightboxIndex(i => (i + 1) % withImages.length);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeLightbox();
  };

  // Masonry-style column distribution
  const col1 = withImages.filter((_, i) => i % 3 === 0);
  const col2 = withImages.filter((_, i) => i % 3 === 1);
  const col3 = withImages.filter((_, i) => i % 3 === 2);

  return (
    <div className="pt-28 pb-24" onKeyDown={handleKeyDown} tabIndex={-1}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Visuelles Archiv</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mt-2">Galerie</h1>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Bilder aus meiner Arbeit als Filmemacher und Kommunikationsdesigner — Momentaufnahmen, die Geschichten erzählen.
          </p>
        </div>

        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className={`animate-pulse bg-muted w-full break-inside-avoid ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
            ))}
          </div>
        ) : withImages.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-xl text-muted-foreground italic">Noch keine Bilder vorhanden.</p>
          </div>
        ) : (
          /* Masonry Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[col1, col2, col3].map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-3">
                {col.map((article) => {
                  const globalIndex = withImages.findIndex(a => a.id === article.id);
                  return (
                    <GalerieItem
                      key={article.id}
                      article={article}
                      index={globalIndex}
                      onClick={() => openLightbox(globalIndex)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-10 p-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={withImages[lightboxIndex].cover_image}
                alt={withImages[lightboxIndex].title}
                className="max-h-[75vh] max-w-full object-contain"
              />
              <div className="mt-4 text-center">
                <p className="text-white/90 font-heading text-lg">{withImages[lightboxIndex].title}</p>
                {withImages[lightboxIndex].subtitle && (
                  <p className="text-white/50 text-sm mt-1 italic font-heading">{withImages[lightboxIndex].subtitle}</p>
                )}
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 p-2"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">
              {lightboxIndex + 1} / {withImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalerieItem({ article, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative overflow-hidden cursor-pointer bg-muted"
      onClick={onClick}
    >
      <img
        src={article.cover_image}
        alt={article.title}
        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-end">
        <div className="p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
          <p className="text-white font-heading text-base font-semibold leading-tight">{article.title}</p>
          {article.category && (
            <p className="text-white/60 text-xs uppercase tracking-[0.15em] mt-1">{article.category}</p>
          )}
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn className="w-5 h-5 text-white/80" />
        </div>
      </div>
    </motion.div>
  );
}