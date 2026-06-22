import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const CATEGORIES = [
  { value: 'beobachtung', label: 'Beobachtung' },
  { value: 'zitat', label: 'Zitat' },
  { value: 'frage', label: 'Frage' },
  { value: 'notiz', label: 'Notiz' },
  { value: 'erinnerung', label: 'Erinnerung' },
  { value: 'idee', label: 'Idee' },
];

const MOODS = [
  { value: 'nachdenklich', label: 'Nachdenklich' },
  { value: 'freudig', label: 'Freudig' },
  { value: 'melancholisch', label: 'Melancholisch' },
  { value: 'neugierig', label: 'Neugierig' },
  { value: 'ruhig', label: 'Ruhig' },
  { value: 'inspiriert', label: 'Inspiriert' },
];

function ThoughtForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'neu';
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    text: '', category: 'notiz', mood: 'ruhig',
    tags: '', is_public: true,
  });

  const { data: thought } = useQuery({
    queryKey: ['thought-edit', id],
    queryFn: async () => {
      const thoughts = await base44.entities.Thought.filter({ id });
      return thoughts[0];
    },
    enabled: !isNew,
  });

  React.useEffect(() => {
    if (thought) {
      setForm({
        text: thought.text || '',
        category: thought.category || 'notiz',
        mood: thought.mood || 'ruhig',
        tags: thought.tags?.join(', ') || '',
        is_public: thought.is_public !== false,
      });
    }
  }, [thought]);

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (isNew) {
      await base44.entities.Thought.create(data);
    } else {
      await base44.entities.Thought.update(id, data);
    }
    queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] });
    setSaving(false);
    navigate('/admin/gedanken');
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/gedanken" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-2xl font-semibold">
          {isNew ? 'Neuer Gedanke' : 'Gedanke bearbeiten'}
        </h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Text</Label>
          <textarea
            value={form.text}
            onChange={(e) => update('text', e.target.value)}
            placeholder="Dein Gedanke..."
            rows={5}
            className="mt-2 w-full px-4 py-3 border border-border bg-transparent font-heading text-lg focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Kategorie</Label>
            <Select value={form.category} onValueChange={(v) => update('category', v)}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Stimmung</Label>
            <Select value={form.mood} onValueChange={(v) => update('mood', v)}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tags</Label>
          <Input
            value={form.tags}
            onChange={(e) => update('tags', e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_public}
            onChange={(e) => update('is_public', e.target.checked)}
            className="accent-primary"
          />
          <Label className="text-sm">Öffentlich sichtbar</Label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.text.trim()}
          className="px-6 py-3 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Speichern...' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}

function ThoughtList() {
  const queryClient = useQueryClient();

  const { data: thoughts = [], isLoading } = useQuery({
    queryKey: ['admin-thoughts'],
    queryFn: () => base44.entities.Thought.list('-created_date', 200),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Thought.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-thoughts'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-semibold">Gedanken</h1>
        <Link
          to="/admin/gedanken/neu"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Gedanke
        </Link>
      </div>

      <div className="border border-border divide-y divide-border">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted w-2/3" />
            </div>
          ))
        ) : thoughts.length > 0 ? thoughts.map(thought => (
          <div key={thought.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <Link to={`/admin/gedanken/${thought.id}`} className="flex-1 min-w-0">
              <p className="text-sm truncate">{thought.text}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{thought.category}</span>
                <span>·</span>
                <span>{format(new Date(thought.created_date), 'd. MMM yyyy', { locale: de })}</span>
              </div>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-destructive ml-4">
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Gedanke löschen?</AlertDialogTitle>
                  <AlertDialogDescription>Dieser Gedanke wird unwiderruflich gelöscht.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMutation.mutate(thought.id)}>Löschen</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Noch keine Gedanken gesammelt.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ThoughtManager() {
  const { id } = useParams();
  if (id) return <ThoughtForm />;
  return <ThoughtList />;
}