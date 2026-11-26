import { useState, type FormEvent } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Property, PropertyInput, PropertyStatus } from '@/lib/types';
import { PROPERTY_TYPES, DEAL_TYPES, STATUS_LABELS } from '@/lib/types';
import PhotoUploader from '@/admin/PhotoUploader';

interface PropertyEditorProps {
  existing: Property | null;
  onDone: () => void;
  onCancel: () => void;
}

const emptyForm = {
  title: '',
  description: '',
  price: '',
  city: 'Грозный',
  district: '',
  address: '',
  property_type: 'Квартира',
  deal_type: 'Продажа',
  status: 'published' as PropertyStatus,
  area: '',
  rooms: '',
  floor: '',
  floors_total: '',
  featured: false,
};

export default function PropertyEditor({
  existing,
  onDone,
  onCancel,
}: PropertyEditorProps) {
  const isEdit = existing !== null;
  const [form, setForm] = useState(() => ({
    ...(existing
      ? {
          title: existing.title,
          description: existing.description || '',
          price: existing.price != null ? String(existing.price) : '',
          city: existing.city,
          district: existing.district || '',
          address: existing.address || '',
          property_type: existing.property_type,
          deal_type: existing.deal_type,
          status: existing.status,
          area: existing.area != null ? String(existing.area) : '',
          rooms: existing.rooms != null ? String(existing.rooms) : '',
          floor: existing.floor != null ? String(existing.floor) : '',
          floors_total:
            existing.floors_total != null ? String(existing.floors_total) : '',
          featured: existing.featured,
        }
      : emptyForm),
  }));
  const [images, setImages] = useState<string[]>(
    existing ? existing.image_urls || [] : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<typeof emptyForm>) =>
    setForm((f) => ({ ...f, ...patch }));

  const numOrNull = (v: string): number | null => {
    const t = v.trim();
    if (!t) return null;
    const n = Number(t.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Укажите название объекта.');
      return;
    }

    const payload: PropertyInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: numOrNull(form.price),
      city: form.city.trim() || 'Грозный',
      district: form.district.trim(),
      address: form.address.trim(),
      property_type: form.property_type,
      deal_type: form.deal_type,
      status: form.status,
      area: numOrNull(form.area),
      rooms: numOrNull(form.rooms),
      floor: numOrNull(form.floor),
      floors_total: numOrNull(form.floors_total),
      image_urls: images,
      featured: form.featured,
    };

    setSaving(true);
    let err;
    if (isEdit) {
      ({ error: err } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', existing.id));
    } else {
      ({ error: err } = await supabase.from('properties').insert(payload));
    }
    setSaving(false);

    if (err) {
      setError('Не удалось сохранить. Проверьте поля и подключение к базе данных.');
      return;
    }
    onDone();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={onCancel}
        className="mb-9 inline-flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-luxe text-ink-400 transition-colors hover:text-gold-300"
      >
        <ArrowLeft size={15} />
        Назад к списку
      </button>

      <div className="mb-5 flex items-center gap-5">
        <div className="gold-line" />
        <span className="eyebrow">{isEdit ? 'Редактирование' : 'Новый объект'}</span>
      </div>
      <h1 className="font-display text-4xl font-medium text-white">
        {isEdit ? 'Редактирование объекта' : 'Добавление объекта'}
      </h1>

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-7">
        <section className="border border-ink-800 bg-ink-900/50 p-7">
          <h2 className="eyebrow mb-6">Основное</h2>
          <div className="grid gap-6">
            <div>
              <label className="label-dark">Название *</label>
              <input
                className="input-dark"
                placeholder="Например: 3-к квартира в ЖК «Грозный-Сити»"
                value={form.title}
                onChange={(e) => set({ title: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Описание</label>
              <textarea
                className="input-dark min-h-36 resize-y"
                placeholder="Подробное описание объекта..."
                value={form.description}
                onChange={(e) => set({ description: e.target.value })}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="label-dark">Цена (₽)</label>
                <input
                  className="input-dark"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Пусто — «По запросу»"
                  value={form.price}
                  onChange={(e) => set({ price: e.target.value })}
                />
              </div>
              <div>
                <label className="label-dark">Статус</label>
                <select
                  className="input-dark"
                  value={form.status}
                  onChange={(e) => set({ status: e.target.value as PropertyStatus })}
                >
                  {(Object.keys(STATUS_LABELS) as PropertyStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-dark">Рекомендуем</label>
                <button
                  type="button"
                  onClick={() => set({ featured: !form.featured })}
                  className={`input-dark flex items-center justify-between ${
                    form.featured ? 'border-gold-400/60' : ''
                  }`}
                >
                  <span className="text-sm font-light">
                    {form.featured ? 'Да' : 'Нет'}
                  </span>
                  <span
                    className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${
                      form.featured ? 'bg-gold-400' : 'bg-ink-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                        form.featured ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-ink-800 bg-ink-900/50 p-7">
          <h2 className="eyebrow mb-6">Расположение и параметры</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="label-dark">Город</label>
              <input
                className="input-dark"
                value={form.city}
                onChange={(e) => set({ city: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Район</label>
              <input
                className="input-dark"
                placeholder="Например: Центральный"
                value={form.district}
                onChange={(e) => set({ district: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Адрес</label>
              <input
                className="input-dark"
                placeholder="Улица, дом"
                value={form.address}
                onChange={(e) => set({ address: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Тип объекта</label>
              <select
                className="input-dark"
                value={form.property_type}
                onChange={(e) => set({ property_type: e.target.value })}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-dark">Тип сделки</label>
              <select
                className="input-dark"
                value={form.deal_type}
                onChange={(e) => set({ deal_type: e.target.value })}
              >
                {DEAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-dark">Площадь (м²)</label>
              <input
                className="input-dark"
                type="number"
                min="0"
                step="any"
                value={form.area}
                onChange={(e) => set({ area: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Комнат</label>
              <input
                className="input-dark"
                type="number"
                min="0"
                value={form.rooms}
                onChange={(e) => set({ rooms: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Этаж</label>
              <input
                className="input-dark"
                type="number"
                min="0"
                value={form.floor}
                onChange={(e) => set({ floor: e.target.value })}
              />
            </div>
            <div>
              <label className="label-dark">Этажей всего</label>
              <input
                className="input-dark"
                type="number"
                min="0"
                value={form.floors_total}
                onChange={(e) => set({ floors_total: e.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="border border-ink-800 bg-ink-900/50 p-7">
          <h2 className="eyebrow mb-6">Фотографии</h2>
          <PhotoUploader images={images} onChange={setImages} />
        </section>

        {error && (
          <p className="border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm font-light text-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3.5 sm:flex-row">
          <button type="submit" className="btn-gold flex-1" disabled={saving}>
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать объект'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline flex-1 sm:flex-none sm:px-12"
            disabled={saving}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
