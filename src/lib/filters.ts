import { useEffect, useMemo, useState } from 'react';
import type { Property } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function usePublishedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          setError('Не удалось загрузить объекты. Попробуйте позже.');
          setProperties([]);
        } else {
          setProperties((data as Property[]) || []);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { properties, loading, error };
}

export interface Filters {
  query: string;
  propertyType: string;
  dealType: string;
  minPrice: string;
  maxPrice: string;
  rooms: string;
  sort: string;
}

export const emptyFilters: Filters = {
  query: '',
  propertyType: '',
  dealType: '',
  minPrice: '',
  maxPrice: '',
  rooms: '',
  sort: 'new',
};

export function applyFilters(items: Property[], f: Filters): Property[] {
  let result = items.filter((p) => {
    if (f.query) {
      const q = f.query.toLowerCase();
      const haystack = [p.title, p.city, p.district, p.address, p.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.propertyType && p.property_type !== f.propertyType) return false;
    if (f.dealType && p.deal_type !== f.dealType) return false;
    if (f.minPrice && (p.price == null || p.price < Number(f.minPrice))) return false;
    if (f.maxPrice && (p.price == null || p.price > Number(f.maxPrice))) return false;
    if (f.rooms && (p.rooms == null || p.rooms < Number(f.rooms))) return false;
    return true;
  });

  result = [...result];
  switch (f.sort) {
    case 'price-asc':
      result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case 'price-desc':
      result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      break;
    case 'area-desc':
      result.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
      break;
    default:
      break;
  }
  return result;
}

export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useFilters(items: Property[]) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const debouncedQuery = useDebounced(filters.query);
  const effective = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery]
  );
  const filtered = useMemo(() => applyFilters(items, effective), [items, effective]);
  return { filters, setFilters, filtered };
}
