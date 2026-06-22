import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../blog/ArticleCard';
import { ArrowRight } from 'lucide-react';

export default function LatestArticles({ articles }) {
  if (!articles?.length) return null;

  const featured = articles[0];
  const rest = articles.slice(1, 5);

  return (
    <section id="latest-articles" className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex items-end justify-between mb-16">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Journal</span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mt-2">Aktuelle Artikel</h2>
        </div>
        <Link
          to="/blog"
          className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          Alle Artikel
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Featured */}
        <div>
          <ArticleCard article={featured} featured index={0} />
        </div>

        {/* Rest */}
        <div className="space-y-10">
          {rest.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i + 1} />
          ))}
        </div>
      </div>

      <div className="mt-12 text-center md:hidden">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Alle Artikel
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}