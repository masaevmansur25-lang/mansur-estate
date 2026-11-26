import { Link } from 'react-router-dom';
import { MapPin, Maximize, BedDouble, Layers } from 'lucide-react';
import type { Property } from '@/lib/types';
import { formatPrice, formatArea } from '@/lib/format';

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="80%">
      <stop offset="0%" stop-color="#232219"/>
      <stop offset="100%" stop-color="#10100e"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="24" y="24" width="752" height="552" fill="none" stroke="#c5a66a" stroke-width="1" opacity="0.45"/>
  <rect x="32" y="32" width="736" height="536" fill="none" stroke="#c5a66a" stroke-width="0.5" opacity="0.2"/>
  <g stroke="#c5a66a" stroke-width="1.5" fill="none" opacity="0.85">
    <path d="M330 320 L400 250 L470 320"/>
    <path d="M345 320 L345 380 L455 380 L455 320"/>
    <rect x="385" y="330" width="30" height="50"/>
    <path d="M360 320 L360 355 L378 355 L378 320"/>
    <path d="M422 320 L422 355 L440 355 L440 320"/>
  </g>
  <text x="400" y="440" font-family="Georgia, serif" font-size="20" letter-spacing="10" fill="#c5a66a" text-anchor="middle" opacity="0.9">MANSUR MASAEV</text>
  <text x="400" y="470" font-family="Georgia, serif" font-size="11" font-style="italic" letter-spacing="4" fill="#7c786c" text-anchor="middle">Элитная недвижимость</text>
</svg>`);

export function propertyImage(p: Property): string {
  return p.image_urls && p.image_urls.length > 0
    ? p.image_urls[0]
    : PLACEHOLDER_IMAGE;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const p = property;
  const img = propertyImage(p);

  return (
    <Link
      to={`/property/${p.id}`}
      className="group flex flex-col overflow-hidden border border-ink-800 bg-ink-900 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        {p.status === 'sold' ? (
          <span className="absolute left-4 top-4 border border-ink-700 bg-ink-950/90 px-3 py-1 text-[10px] font-medium uppercase tracking-luxe text-ink-300">
            Продано
          </span>
        ) : p.featured ? (
          <span className="absolute left-4 top-4 bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-luxe text-ink-950">
            Рекомендуем
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-[10px] font-medium uppercase tracking-luxe text-gold-400/90">
          {p.property_type} · {p.deal_type}
        </div>
        <h3 className="mt-2.5 font-display text-[22px] font-medium leading-snug text-white transition-colors duration-300 group-hover:text-gold-200">
          {p.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-[13px] font-light text-ink-400">
          <MapPin size={13} className="shrink-0 text-gold-400/70" />
          <span className="truncate">
            {[p.city, p.district, p.address].filter(Boolean).join(', ')}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] font-light text-ink-300">
          {p.area != null && (
            <span className="flex items-center gap-1.5">
              <Maximize size={13} className="text-gold-400/70" />
              {formatArea(p.area)}
            </span>
          )}
          {p.rooms != null && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={13} className="text-gold-400/70" />
              {p.rooms} комн.
            </span>
          )}
          {p.floor != null && p.floors_total != null && (
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-gold-400/70" />
              {p.floor}/{p.floors_total} эт.
            </span>
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="gold-line mb-4 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="font-display text-[22px] font-semibold text-gold-300">
            {formatPrice(p.price, p.currency)}
          </div>
        </div>
      </div>
    </Link>
  );
}
