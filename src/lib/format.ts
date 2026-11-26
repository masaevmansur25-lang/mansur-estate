export function formatPrice(price: number | null, currency: string | null): string {
  if (price == null || Number.isNaN(price)) return 'По запросу';
  const formatted = new Intl.NumberFormat('ru-RU').format(price);
  return `${formatted} ${currency || '₽'}`;
}

export function formatArea(area: number | null): string {
  if (area == null) return '';
  return `${new Intl.NumberFormat('ru-RU').format(area)} м²`;
}
