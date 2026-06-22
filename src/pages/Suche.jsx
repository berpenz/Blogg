import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '../components/blog/ArticleCard';
import { Search as SearchIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Suche() {
  const [query, setQuery] = useState('');

  const { data: articles = [] } = useQuery({
    queryKey: ['articles-search'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-publish_date', 200),
    initialData: [],
  });

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.subtitle?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.content?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q) ||
      a.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [articles, query]);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Suche</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mt-2">Finden</h1>
        </div>

        {/* Search Input */}
        <div className="relative mb-16">
          <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titel, Thema, Kategorie, Schlagwort..."
            autoFocus
            className="w-full pl-8 pr-10 py-4 bg-transparent border-b border-border text-xl font-heading focus:outline-none focus:border-primary transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() ? (
          <>
            <p className="text-sm text-muted-foreground mb-8">
              {results.length} {results.length === 1 ? 'Ergebnis' : 'Ergebnisse'} für „{query}"
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {results.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <p className="font-heading text-xl text-muted-foreground italic">
                  Keine Artikel gefunden. Versuche einen anderen Suchbegriff.
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-lg text-muted-foreground italic">
              Beginne zu tippen, um Artikel zu finden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}