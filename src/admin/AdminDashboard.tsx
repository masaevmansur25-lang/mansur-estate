import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Loader2,
  Tag,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Property, PropertyStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useAuth } from '@/lib/auth';
import { propertyImage } from '@/components/PropertyCard';
import LoginScreen from '@/admin/LoginScreen';
import PropertyEditor from '@/admin/PropertyEditor';

const STATUS_STYLES: Record<PropertyStatus, string> = {
  published: 'border-emerald-800/70 bg-emerald-950/50 text-emerald-300',
  draft: 'border-ink-700 bg-ink-800 text-ink-300',
  sold: 'border-gold-400/40 bg-gold-400/10 text-gold-300',
};

function AdminDashboardInner() {
  const { signOut } = useAuth();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PropertyStatus>('all');
  const [editing, setEditing] = useState<Property | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Не удалось загрузить объекты. Попробуйте обновить страницу.');
      setItems([]);
    } else {
      setItems((data as Property[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = [p.title, p.city, p.district, p.address]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, statusFilter]);

  const counts = useMemo(
    () => ({
      all: items.length,
      published: items.filter((p) => p.status === 'published').length,
      draft: items.filter((p) => p.status === 'draft').length,
      sold: items.filter((p) => p.status === 'sold').length,
    }),
    [items]
  );

  const setStatus = async (p: Property, status: PropertyStatus) => {
    setBusy(true);
    const { error: err } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', p.id);
    if (!err) {
      setItems((list) => list.map((x) => (x.id === p.id ? { ...x, status } : x)));
    }
    setBusy(false);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const { error: err } = await supabase
      .from('properties')
      .delete()
      .eq('id', deleting.id);
    if (!err) setItems((list) => list.filter((x) => x.id !== deleting.id));
    setBusy(false);
    setDeleting(null);
  };

  if (editing) {
    return (
      <PropertyEditor
        existing={editing === 'new' ? null : editing}
        onDone={() => {
          setEditing(null);
          void load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-5">
            <div className="gold-line" />
            <span className="eyebrow">Управление объектами</span>
          </div>
          <h1 className="font-display text-4xl font-medium text-white">
            Панель управления
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing('new')} className="btn-gold">
            <Plus size={15} />
            Добавить объект
          </button>
          <button
            onClick={() => void signOut()}
            className="btn-outline !px-4 !py-3.5"
            title="Выйти"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {(['all', 'published', 'draft', 'sold'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`border p-5 text-left transition-all duration-300 ${
              statusFilter === key
                ? 'border-gold-400/60 bg-gold-400/[0.07]'
                : 'border-ink-800 bg-ink-900/50 hover:border-ink-600'
            }`}
          >
            <div className="font-display text-3xl font-medium text-white">
              {counts[key]}
            </div>
            <div className="mt-1.5 text-[10px] font-light uppercase tracking-luxe text-ink-400">
              {key === 'all' ? 'Все' : STATUS_LABELS[key]}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3.5 border border-ink-800 bg-ink-900/50 px-5 py-3.5">
        <Search size={15} className="shrink-0 text-ink-500" />
        <input
          className="w-full bg-transparent text-sm font-light text-ink-100 outline-none placeholder:text-ink-500"
          placeholder="Поиск по названию, городу, адресу..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={30} className="animate-spin text-gold-400" />
        </div>
      ) : error ? (
        <p className="py-12 text-center font-light text-ink-400">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="mt-10 border border-gold-400/15 bg-ink-900/40 p-16 text-center">
          <p className="font-display text-3xl font-medium text-white">
            Объектов пока нет
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm font-light text-ink-400">
            Добавьте первый объект — он сразу появится в каталоге на сайте.
          </p>
          <button onClick={() => setEditing('new')} className="btn-gold mt-9">
            <Plus size={15} />
            Добавить объект
          </button>
        </div>
      ) : (
        <div className="mt-7 flex flex-col gap-3.5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-5 border border-ink-800 bg-ink-900/50 p-5 transition-colors duration-300 hover:border-ink-600 sm:flex-row sm:items-center"
            >
              <img
                src={propertyImage(p)}
                alt={p.title}
                className="aspect-[4/3] w-full border border-ink-800 object-cover sm:aspect-auto sm:h-20 sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="truncate font-display text-xl font-medium text-white">
                    {p.title}
                  </h3>
                  <span
                    className={`border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-luxe ${STATUS_STYLES[p.status]}`}
                  >
                    {STATUS_LABELS[p.status]}
                  </span>
                  {p.featured && (
                    <span className="flex items-center gap-1 border border-gold-400/40 bg-gold-400/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-luxe text-gold-300">
                      <Tag size={9} />
                      Рекомендуем
                    </span>
                  )}
                </div>
                <div className="mt-1.5 truncate text-[13px] font-light text-ink-400">
                  {[p.city, p.district].filter(Boolean).join(', ')} ·{' '}
                  {p.property_type} · {p.deal_type}
                </div>
                <div className="mt-1 font-display text-lg font-semibold text-gold-300">
                  {formatPrice(p.price, p.currency)}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={p.status}
                  onChange={(e) =>
                    void setStatus(p, e.target.value as PropertyStatus)
                  }
                  disabled={busy}
                  className="input-dark !w-auto !px-3 !py-2.5 text-xs"
                >
                  {(Object.keys(STATUS_LABELS) as PropertyStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setEditing(p)}
                  className="flex h-10 w-10 items-center justify-center border border-ink-700 text-ink-300 transition-colors duration-300 hover:border-gold-400/60 hover:text-gold-300"
                  title="Редактировать"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleting(p)}
                  className="flex h-10 w-10 items-center justify-center border border-ink-700 text-ink-300 transition-colors duration-300 hover:border-red-500/60 hover:text-red-300"
                  title="Удалить"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-md"
          onClick={() => !busy && setDeleting(null)}
        >
          <div
            className="relative w-full max-w-md border border-gold-400/20 bg-ink-900 p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-gold-400" />
            <span className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-gold-400" />
            <h3 className="font-display text-2xl font-medium text-white">
              Удалить объект?
            </h3>
            <p className="mt-4 text-sm font-light leading-relaxed text-ink-400">
              «{deleting.title}» будет удалён безвозвратно. Это действие нельзя
              отменить.
            </p>
            <div className="mt-9 flex gap-3.5">
              <button
                onClick={() => setDeleting(null)}
                className="btn-outline flex-1"
                disabled={busy}
              >
                Отмена
              </button>
              <button
                onClick={() => void confirmDelete()}
                className="flex-1 border border-red-900/70 bg-red-950/60 px-6 text-[13px] font-medium uppercase tracking-luxe text-red-300 transition-colors duration-300 hover:bg-red-900/60"
                disabled={busy}
              >
                {busy ? (
                  <Loader2 size={15} className="mx-auto animate-spin" />
                ) : (
                  'Удалить'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <LoginScreen>
      <AdminDashboardInner />
    </LoginScreen>
  );
}
