import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin,
  Maximize,
  BedDouble,
  Layers,
  Tag,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';
import { formatPrice, formatArea } from '@/lib/format';
import { WHATSAPP_URL, TELEGRAM_URL } from '@/components/Header';
import { PLACEHOLDER_IMAGE } from '@/components/PropertyCard';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setActive(0);

    supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setNotFound(true);
        } else {
          setProperty(data as Property);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!lightbox || !property) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight')
        setActive((i) => (i + 1) % property.image_urls.length);
      if (e.key === 'ArrowLeft')
        setActive(
          (i) => (i - 1 + property.image_urls.length) % property.image_urls.length
        );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, property]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="aspect-video w-full animate-pulse bg-ink-900" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-28 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-medium text-white">
          Объект не найден
        </h1>
        <p className="mx-auto mt-4 max-w-md font-light text-ink-400">
          Возможно, объект снят с публикации или ссылка устарела.
        </p>
        <Link to="/catalog" className="btn-gold mt-10">
          <ArrowLeft size={15} />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const p = property;
  const images = p.image_urls.length > 0 ? p.image_urls : [PLACEHOLDER_IMAGE];
  const price = formatPrice(p.price, p.currency);
  const location = [p.city, p.district, p.address].filter(Boolean).join(', ');

  const waLink =
    WHATSAPP_URL.split('?text=')[0] +
    '?text=' +
    encodeURIComponent(
      `Здравствуйте, Мансур! Интересует объект: «${p.title}» (${location}).`
    );

  const charRows: Array<[string, React.ReactNode]> = [
    ['Тип объекта', <span key="t">{p.property_type}</span>],
    ['Тип сделки', <span key="d">{p.deal_type}</span>],
  ];
  if (p.area != null) {
    charRows.push([
      'Площадь',
      <span key="a" className="flex items-center gap-1.5">
        <Maximize size={13} className="text-gold-400" />
        {formatArea(p.area)}
      </span>,
    ]);
  }
  if (p.rooms != null) {
    charRows.push([
      'Комнат',
      <span key="r" className="flex items-center gap-1.5">
        <BedDouble size={13} className="text-gold-400" />
        {p.rooms}
      </span>,
    ]);
  }
  if (p.floor != null && p.floors_total != null) {
    charRows.push([
      'Этаж',
      <span key="f" className="flex items-center gap-1.5">
        <Layers size={13} className="text-gold-400" />
        {p.floor} из {p.floors_total}
      </span>,
    ]);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/catalog"
        className="mb-9 inline-flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-luxe text-ink-400 transition-colors hover:text-gold-300"
      >
        <ArrowLeft size={15} />
        Назад в каталог
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div
            className="group relative cursor-zoom-in overflow-hidden border border-ink-800"
            onClick={() => setLightbox(true)}
          >
            <img
              src={images[active]}
              alt={p.title}
              className="aspect-video w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
            {p.status === 'sold' && (
              <span className="absolute left-5 top-5 border border-ink-700 bg-ink-950/90 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-luxe text-ink-300">
                Продано
              </span>
            )}
            {images.length > 1 && (
              <>
                <button
                  aria-label="Предыдущее фото"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-ink-700 bg-ink-950/70 text-white opacity-0 transition-all duration-300 hover:border-gold-400/60 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((i) => (i - 1 + images.length) % images.length);
                  }}
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  aria-label="Следующее фото"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-ink-700 bg-ink-950/70 text-white opacity-0 transition-all duration-300 hover:border-gold-400/60 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((i) => (i + 1) % images.length);
                  }}
                >
                  <ChevronRight size={19} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`overflow-hidden border transition-all duration-300 ${
                    i === active
                      ? 'border-gold-400 opacity-100'
                      : 'border-ink-800 opacity-50 hover:opacity-90'
                  }`}
                >
                  <img
                    src={src}
                    alt={`${p.title} — фото ${i + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-12">
            <div className="mb-5 flex items-center gap-5">
              <div className="gold-line" />
              <span className="eyebrow">Об объекте</span>
            </div>
            <p className="whitespace-pre-line font-light leading-relaxed text-ink-300">
              {p.description ||
                'Описание появится позже. Свяжитесь со мной, и я расскажу все детали лично.'}
            </p>
          </div>
        </div>

        <aside>
          <div className="relative border border-gold-400/20 bg-ink-900/60 p-7 md:p-9 lg:sticky lg:top-32">
            <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-gold-400" />
            <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-gold-400" />
            <div className="text-[10px] font-medium uppercase tracking-luxe text-gold-400">
              {p.property_type} · {p.deal_type}
            </div>
            <h1 className="mt-3 font-display text-3xl font-medium leading-snug text-white md:text-4xl">
              {p.title}
            </h1>
            <div className="mt-3.5 flex items-center gap-2 text-sm font-light text-ink-400">
              <MapPin size={14} className="shrink-0 text-gold-400" />
              {location}
            </div>

            <div className="mt-7 border-y border-gold-400/15 py-6">
              <div className="font-display text-4xl font-semibold text-gold-300">
                {price}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Tag size={13} className="text-gold-400" />
                <span className="eyebrow">Характеристики</span>
              </div>
              <dl className="grid gap-0 text-sm">
                {charRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-ink-800/80 py-3"
                  >
                    <dt className="font-light text-ink-400">{label}</dt>
                    <dd className="flex items-center gap-1.5 text-ink-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-9 flex flex-col gap-3.5">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="btn-gold w-full"
              >
                <MessageCircle size={16} />
                Записаться на просмотр
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full"
              >
                <Send size={15} />
                Написать в Telegram
              </a>
            </div>
          </div>
        </aside>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/97 p-4 backdrop-blur-md"
          onClick={() => setLightbox(false)}
        >
          <button
            aria-label="Закрыть"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-ink-700 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <img
            src={images[active]}
            alt={p.title}
            className="max-h-full max-w-full animate-fade-in object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                aria-label="Предыдущее фото"
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ink-700 bg-ink-950/80 text-white transition-colors hover:border-gold-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i - 1 + images.length) % images.length);
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                aria-label="Следующее фото"
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ink-700 bg-ink-950/80 text-white transition-colors hover:border-gold-400"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i + 1) % images.length);
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
