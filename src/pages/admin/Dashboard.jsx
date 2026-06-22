import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Users, PenLine, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Dashboard() {
  const { data: articles = [] } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 200),
    initialData: [],
  });

  const { data: thoughts = [] } = useQuery({
    queryKey: ['admin-thoughts'],
    queryFn: () => base44.entities.Thought.list('-created_date', 200),
    initialData: [],
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: () => base44.entities.NewsletterSubscriber.list('-created_date', 200),
    initialData: [],
  });

  const published = articles.filter(a => a.status === 'published');
  const drafts = articles.filter(a => a.status === 'draft');
  const recent = articles.slice(0, 5);

  const stats = [
    { label: 'Veröffentlicht', value: published.length, icon: FileText, color: 'text-primary' },
    { label: 'Entwürfe', value: drafts.length, icon: PenLine, color: 'text-muted-foreground' },
    { label: 'Gedanken', value: thoughts.length, icon: MessageSquare, color: 'text-primary' },
    { label: 'Newsletter', value: subscribers.length, icon: Users, color: 'text-muted-foreground' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            to="/admin/artikel/neu"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Neuer Artikel
          </Link>
          <Link
            to="/admin/gedanken/neu"
            className="flex items-center gap-2 px-4 py-2 border border-border text-sm hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" /> Neuer Gedanke
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map(stat => (
          <div key={stat.label} className="border border-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-3xl font-heading font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Letzte Artikel</h2>
        <div className="border border-border divide-y divide-border">
          {recent.length > 0 ? recent.map(article => (
            <Link
              key={article.id}
              to={`/admin/artikel/${article.id}`}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{article.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {article.category} · {format(new Date(article.created_date), 'd. MMM yyyy', { locale: de })}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 ${
                article.status === 'published'
                  ? 'bg-primary/10 text-primary'
                  : article.status === 'draft'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {article.status === 'published' ? 'Veröffentlicht' : article.status === 'draft' ? 'Entwurf' : 'Geplant'}
              </span>
            </Link>
          )) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Noch keine Artikel erstellt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}