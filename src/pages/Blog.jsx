import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ArticleCard from '../components/blog/ArticleCard';
import { Search } from 'lucide-react';

const CATEGORY_LABELS = {
  alltag: 'Alltag', familie: 'Familie', kreativitaet: 'Kreativität',
  fotografie: 'Fotografie', film: 'Film', musik: 'Musik',
  ki: 'Künstliche Intelligenz', arbeit: 'Arbeit', gesellschaft: 'Gesellschaft',
  philosophie: 'Philosophie', technologie: 'Technologie',
  'persoenliche-entwicklung': 'Persönliche Entwicklung',
};

const PAGE_SIZE = 9;

export default function Blog() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles-blog'],
    queryFn: () => base44.entities.Article.filter({ status: 'published' }, '-publish_date', 100),
    initialData: [],
  });

  const filtered = useMemo(() => {
    let result = articles;
    if (category !== 'all') {
      result = result.filter(a => a.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.excerpt?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [articles, category, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Journal</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold mt-2">Alle Artikel</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Artikel durchsuchen..."
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategory('all'); setPage(1); }}
              className={`px-4 py-2 text-xs tracking-wide uppercase transition-all duration-300 ${
                category === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              Alle
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setCategory(key); setPage(1); }}
                className={`px-4 py-2 text-xs tracking-wide uppercase transition-all duration-300 ${
                  category === key
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/2] bg-muted mb-5" />
                <div className="h-3 bg-muted w-24 mb-3" />
                <div className="h-5 bg-muted w-3/4 mb-3" />
                <div className="h-3 bg-muted w-full" />
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {paginated.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-heading text-xl text-muted-foreground italic">
              Noch keine Artikel in dieser Kategorie.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-16">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-10 h-10 text-sm transition-all duration-300 ${
                  page === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}