import { SlidersHorizontal, SearchX, MessageCircle } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { usePublishedProperties, useFilters } from '@/lib/filters';
import { PROPERTY_TYPES, DEAL_TYPES } from '@/lib/types';

export default function CatalogPage() {
  const { properties, loading, error } = usePublishedProperties();
  const { filters, setFilters, filtered } = useFilters(properties);

  const update = (patch: Partial<typeof filters>) =>
    setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="mb-5 flex items-center gap-5">
          <div className="gold-line" />
          <span className="eyebrow">Каталог недвижимости</span>
        </div>
        <h1 className="font-display text-5xl font-medium text-white">
          Все объекты
        </h1>
      </div>

      <div className="mb-10 border border-ink-800 bg-ink-900/50 p-6 md:p-7">
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={14} className="text-gold-400" />
          <span className="eyebrow">Поиск и фильтры</span>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="label-dark">Поиск</label>
            <input
              className="input-dark"
              placeholder="Название, район, адрес..."
              value={filters.query}
              onChange={(e) => update({ query: e.target.value })}
            />
          </div>
          <div>
            <label className="label-dark">Тип</label>
            <select
              className="input-dark"
              value={filters.propertyType}
              onChange={(e) => update({ propertyType: e.target.value })}
            >
              <option value="">Любой</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-dark">Сделка</label>
            <select
              className="input-dark"
              value={filters.dealType}
              onChange={(e) => update({ dealType: e.target.value })}
            >
              <option value="">Любая</option>
              {DEAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-dark">Цена от</label>
            <input
              className="input-dark"
              type="number"
              min="0"
              placeholder="₽"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="label-dark">Цена до</label>
            <input
              className="input-dark"
              type="number"
              min="0"
              placeholder="₽"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-48">
            <label className="label-dark">Комнат от</label>
            <select
              className="input-dark"
              value={filters.rooms}
              onChange={(e) => update({ rooms: e.target.value })}
            >
              <option value="">Любое</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-60">
            <label className="label-dark">Сортировка</label>
            <select
              className="input-dark"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
            >
              <option value="new">Сначала новые</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="area-desc">Площадь: больше</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mb-7 text-[12px] font-light uppercase tracking-[0.18em] text-ink-500">
        Найдено объектов: {filtered.length}
      </p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse bg-ink-900" />
          ))}
        </div>
      ) : error ? (
        <p className="text-ink-400">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="border border-gold-400/15 bg-ink-900/40 p-16 text-center">
          <SearchX
            size={34}
            strokeWidth={1.25}
            className="mx-auto text-gold-400/70"
          />
          <p className="mt-6 font-display text-3xl font-medium text-white">
            Ничего не найдено
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-ink-400">
            Попробуйте изменить параметры поиска — или напишите мне, и я подберу
            объект лично.
          </p>
          <a
            href="https://wa.me/79498207777"
            target="_blank"
            rel="noreferrer"
            className="btn-outline mt-9"
          >
            <MessageCircle size={15} />
            Написать в WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
