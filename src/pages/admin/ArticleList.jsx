import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ArticleList() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => base44.entities.Article.list('-created_date', 200),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }),
  });

  const filtered = filter === 'all' ? articles : articles.filter(a => a.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-semibold">Artikel</h1>
        <Link
          to="/admin/artikel/neu"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Artikel
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'published', 'draft', 'scheduled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'Alle' : f === 'published' ? 'Veröffentlicht' : f === 'draft' ? 'Entwürfe' : 'Geplant'}
          </button>
        ))}
      </div>

      {/* Articles table */}
      <div className="border border-border divide-y divide-border">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted w-1/3 mb-2" />
              <div className="h-3 bg-muted w-1/4" />
            </div>
          ))
        ) : filtered.length > 0 ? filtered.map(article => (
          <div key={article.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{article.title}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{article.category}</span>
                <span>·</span>
                <span>{format(new Date(article.created_date), 'd. MMM yyyy', { locale: de })}</span>
                {article.reading_time && (
                  <>
                    <span>·</span>
                    <span>{article.reading_time} Min.</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className={`text-xs px-2 py-1 ${
                article.status === 'published' ? 'bg-primary/10 text-primary'
                : article.status === 'draft' ? 'bg-muted text-muted-foreground'
                : 'bg-secondary text-secondary-foreground'
              }`}>
                {article.status === 'published' ? 'Live' : article.status === 'draft' ? 'Entwurf' : 'Geplant'}
              </span>
              {article.status === 'published' && (
                <Link to={`/artikel/${article.id}`} className="p-2 text-muted-foreground hover:text-foreground">
                  <Eye className="w-4 h-4" />
                </Link>
              )}
              <Link to={`/admin/artikel/${article.id}`} className="p-2 text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-2 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Artikel löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      „{article.title}" wird unwiderruflich gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)}>
                      Löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Keine Artikel gefunden.
          </div>
        )}
      </div>
    </div>
  );
}