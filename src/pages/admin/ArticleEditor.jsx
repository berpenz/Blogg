import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';

const CATEGORIES = [
  { value: 'alltag', label: 'Alltag' },
  { value: 'familie', label: 'Familie' },
  { value: 'kreativitaet', label: 'Kreativität' },
  { value: 'fotografie', label: 'Fotografie' },
  { value: 'film', label: 'Film' },
  { value: 'musik', label: 'Musik' },
  { value: 'ki', label: 'Künstliche Intelligenz' },
  { value: 'arbeit', label: 'Arbeit' },
  { value: 'gesellschaft', label: 'Gesellschaft' },
  { value: 'philosophie', label: 'Philosophie' },
  { value: 'technologie', label: 'Technologie' },
  { value: 'persoenliche-entwicklung', label: 'Persönliche Entwicklung' },
];

function calculateReadingTime(html) {
  const text = html?.replace(/<[^>]*>/g, '') || '';
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'neu';

  const [form, setForm] = useState({
    title: '', subtitle: '', content: '', excerpt: '',
    cover_image: '', category: 'alltag', tags: '',
    status: 'draft', is_featured: false, publish_date: '',
    meta_title: '', meta_description: '',
  });
  const [saving, setSaving] = useState(false);

  const { data: article } = useQuery({
    queryKey: ['article-edit', id],
    queryFn: async () => {
      const articles = await base44.entities.Article.filter({ id });
      return articles[0];
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || '',
        subtitle: article.subtitle || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        cover_image: article.cover_image || '',
        category: article.category || 'alltag',
        tags: article.tags?.join(', ') || '',
        status: article.status || 'draft',
        is_featured: article.is_featured || false,
        publish_date: article.publish_date ? article.publish_date.slice(0, 16) : '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
      });
    }
  }, [article]);

  const handleSave = async (status) => {
    setSaving(true);
    const data = {
      ...form,
      status: status || form.status,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      reading_time: calculateReadingTime(form.content),
      publish_date: status === 'published' && !form.publish_date
        ? new Date().toISOString()
        : form.publish_date || undefined,
      slug: form.title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, ''),
    };

    if (isNew) {
      const created = await base44.entities.Article.create(data);
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      navigate(`/admin/artikel/${created.id}`);
    } else {
      await base44.entities.Article.update(id, data);
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['article-edit', id] });
    }
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, cover_image: file_url }));
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/artikel" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-2xl font-semibold">
            {isNew ? 'Neuer Artikel' : 'Artikel bearbeiten'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-border text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Entwurf speichern
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Veröffentlichen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Titel des Artikels"
              className="text-2xl font-heading border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div>
            <Input
              value={form.subtitle}
              onChange={(e) => update('subtitle', e.target.value)}
              placeholder="Untertitel (optional)"
              className="text-lg border-0 border-b border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary text-muted-foreground"
            />
          </div>
          <div>
            <Input
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              placeholder="Kurzer Teaser für die Vorschau..."
              className="border-0 border-b border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary text-sm"
            />
          </div>
          <div className="min-h-[400px]">
            <ReactQuill
              value={form.content}
              onChange={(val) => update('content', val)}
              placeholder="Schreibe deinen Artikel..."
              className="h-[350px]"
              modules={{
                toolbar: [
                  [{ header: [2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover image */}
          <div className="border border-border p-4">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Titelbild</Label>
            {form.cover_image ? (
              <div className="mt-3 relative">
                <img src={form.cover_image} alt="Cover" className="w-full aspect-[16/9] object-cover" />
                <button
                  onClick={() => update('cover_image', '')}
                  className="absolute top-2 right-2 px-2 py-1 bg-background/80 text-xs hover:bg-background"
                >
                  Entfernen
                </button>
              </div>
            ) : (
              <label className="mt-3 flex flex-col items-center justify-center aspect-[16/9] border border-dashed border-border cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Bild hochladen</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="border border-border p-4">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Kategorie</Label>
            <Select value={form.category} onValueChange={(v) => update('category', v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="border border-border p-4">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tags</Label>
            <Input
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="mt-2"
            />
          </div>

          {/* Publish date */}
          <div className="border border-border p-4">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Veröffentlichungsdatum</Label>
            <Input
              type="datetime-local"
              value={form.publish_date}
              onChange={(e) => update('publish_date', e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Featured */}
          <div className="border border-border p-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => update('is_featured', e.target.checked)}
              className="accent-primary"
            />
            <Label className="text-sm">Als Featured markieren</Label>
          </div>

          {/* SEO */}
          <div className="border border-border p-4 space-y-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">SEO</Label>
            <Input
              value={form.meta_title}
              onChange={(e) => update('meta_title', e.target.value)}
              placeholder="Meta Titel"
            />
            <textarea
              value={form.meta_description}
              onChange={(e) => update('meta_description', e.target.value)}
              placeholder="Meta Beschreibung"
              rows={3}
              className="w-full px-3 py-2 border border-input bg-transparent text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}