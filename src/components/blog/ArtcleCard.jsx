import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const CATEGORY_LABELS = {
  alltag: 'Alltag',
  familie: 'Familie',
  kreativitaet: 'Kreativität',
  fotografie: 'Fotografie',
  film: 'Film',
  musik: 'Musik',
  ki: 'Künstliche Intelligenz',
  arbeit: 'Arbeit',
  gesellschaft: 'Gesellschaft',
  philosophie: 'Philosophie',
  technologie: 'Technologie',
  'persoenliche-entwicklung': 'Persönliche Entwicklung',
};

export default function ArticleCard({ article, index = 0, featured = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`/artikel/${article.id}`}
        className={`group block ${featured ? '' : ''}`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[3/2]'} mb-5`}>
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="font-display text-4xl text-muted-foreground/30 tracking-[0.2em]">B</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {article.category && (
            <span className="uppercase tracking-[0.15em] text-primary font-medium">
              {CATEGORY_LABELS[article.category] || article.category}
            </span>
          )}
          {article.publish_date && (
            <>
              <span className="text-border">·</span>
              <span>{format(new Date(article.publish_date), 'd. MMMM yyyy', { locale: de })}</span>
            </>
          )}
          {article.reading_time && (
            <>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.reading_time} Min.
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-heading font-semibold leading-tight group-hover:text-primary transition-colors duration-300 ${
          featured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}>
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </Link>
    </motion.article>
  );
}