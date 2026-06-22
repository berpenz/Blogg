import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Clock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import ArticleCard from '../components/blog/ArticleCard';

const CATEGORY_LABELS = {
  alltag: 'Alltag', familie: 'Familie', kreativitaet: 'Kreativität',
  fotografie: 'Fotografie', film: 'Film', musik: 'Musik',
  ki: 'Künstliche Intelligenz', arbeit: 'Arbeit', gesellschaft: 'Gesellschaft',
  philosophie: 'Philosophie', technologie: 'Technologie',
  'persoenliche-entwicklung': 'Persönliche Entwicklung',
};

export default function ArticleView() {
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [focusMode, setFocusMode] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const articles = await base44.entities.Article.filter({ id });
      return articles[0];
    },
  });

  const { data: related = [] } = useQuery({
    queryKey: ['related', article?.category],
    queryFn: () => base44.entities.Article.filter(
      { status: 'published', category: article.category },
      '-publish_date',
      4
    ),
    enabled: !!article?.category,
    initialData: [],
  });

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.classList.toggle('focus-mode', focusMode);
    return () => document.body.classList.remove('focus-mode');
  }, [focusMode]);

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 max-w-3xl mx-auto px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-muted w-32" />
          <div className="h-10 bg-muted w-3/4" />
          <div className="h-4 bg-muted w-48" />
          <div className="aspect-[16/9] bg-muted" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-28 pb-24 text-center">
        <p className="font-heading text-xl text-muted-foreground">Artikel nicht gefunden.</p>
        <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-primary text-sm">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Blog
        </Link>
      </div>
    );
  }

  const relatedFiltered = related.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <>
      {/* Reading progress */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <article className="pt-28 pb-24">
        {/* Header */}
        <header className="max-w-3xl mx-auto px-6 mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Alle Artikel
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
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
                  {article.reading_time} Min. Lesezeit
                </span>
              </>
            )}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl md:text-5xl font-semibold leading-tight"
          >
            {article.title}
          </motion.h1>

          {article.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground font-heading italic"
            >
              {article.subtitle}
            </motion.p>
          )}

          {/* Focus mode toggle */}
          <div className="mt-6">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5"
            >
              {focusMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {focusMode ? 'Fokusmodus beenden' : 'Fokusmodus'}
            </button>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto mb-16"
          >
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full aspect-[21/9] object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto px-6"
        >
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-semibold
              prose-p:text-foreground/85 prose-p:leading-[1.9] prose-p:text-base
              prose-blockquote:font-heading prose-blockquote:text-xl prose-blockquote:italic
              prose-blockquote:border-l-primary prose-blockquote:text-foreground/80
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:w-full prose-img:my-10
              prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/blog?search=${tag}`}
                    className="px-3 py-1.5 text-xs border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Related */}
        {relatedFiltered.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 mt-24">
            <h3 className="font-heading text-2xl font-semibold mb-10">Weitere Artikel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedFiltered.map((a, i) => (
                <ArticleCard key={a.id} article={a} index={i} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}