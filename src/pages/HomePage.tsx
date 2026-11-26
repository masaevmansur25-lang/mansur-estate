import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Handshake, KeyRound } from 'lucide-react';
import { WHATSAPP_URL, TELEGRAM_URL } from '@/components/Header';
import PropertyCard, { PLACEHOLDER_IMAGE } from '@/components/PropertyCard';
import { usePublishedProperties } from '@/lib/filters';

function HeroVisual() {
  return (
    <div className="relative hidden lg:block">
      <div className="relative border border-gold-400/25 p-3">
        <img
          src={PLACEHOLDER_IMAGE}
          alt="Премиальная недвижимость"
          className="aspect-[4/5] w-full object-cover"
        />
        <span className="absolute -left-px -top-px h-8 w-8 border-l-2 border-t-2 border-gold-400" />
        <span className="absolute -right-px -top-px h-8 w-8 border-r-2 border-t-2 border-gold-400" />
        <span className="absolute -bottom-px -left-px h-8 w-8 border-b-2 border-l-2 border-gold-400" />
        <span className="absolute -bottom-px -right-px h-8 w-8 border-b-2 border-r-2 border-gold-400" />
      </div>
      <div className="absolute -bottom-8 -left-12 w-60 border border-gold-400/25 bg-ink-950/95 p-6 backdrop-blur">
        <div className="font-display text-4xl font-medium text-gold-300">10+</div>
        <div className="mt-2 text-[10px] font-light uppercase tracking-luxe text-ink-400">
          лет на рынке недвижимости
        </div>
      </div>
      <div className="absolute -right-8 top-10 w-56 border border-gold-400/25 bg-ink-950/95 p-6 backdrop-blur">
        <div className="font-display text-4xl font-medium text-gold-300">200+</div>
        <div className="mt-2 text-[10px] font-light uppercase tracking-luxe text-ink-400">
          успешных сделок
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { properties, loading, error } = usePublishedProperties();
  const featured = properties.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-gold-400/10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 75% -10%, rgba(197,166,106,0.1), transparent 60%)',
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-20 px-4 pb-24 pt-16 sm:px-6 md:pt-24 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-up">
            <div className="mb-7 flex items-center gap-5">
              <div className="gold-line" />
              <span className="eyebrow">Грозный · Чеченская Республика</span>
            </div>
            <h1 className="font-display text-5xl font-medium leading-[1.08] text-white sm:text-6xl lg:text-[68px]">
              Элитная
              <br />
              недвижимость
              <span className="mt-3 block font-light italic text-gold-300">
                с безупречным вкусом
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-[17px] font-light leading-relaxed text-ink-400">
              Мансур Масаев — ваш персональный эксперт по премиальной
              недвижимости в Грозном. Квартиры, дома и коммерческие объекты для
              тех, кто ценит совершенство в каждой детали.
            </p>
            <div className="mt-11 flex flex-col gap-4 sm:flex-row">
              <Link to="/catalog" className="btn-gold">
                Смотреть каталог
                <ArrowRight size={15} />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Связаться в WhatsApp
              </a>
            </div>
          </div>
          <div className="animate-fade-in">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="border-b border-gold-400/10 bg-ink-900/50">
        <div className="mx-auto grid max-w-7xl gap-px bg-ink-800/60 px-0 py-0 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Юридическая чистота',
              text: 'Полная проверка документов перед каждой сделкой.',
            },
            {
              icon: Handshake,
              title: 'Личное сопровождение',
              text: 'Вы работаете напрямую с экспертом, без посредников.',
            },
            {
              icon: KeyRound,
              title: 'Под ключ',
              text: 'От подбора объекта до передачи ключей владельцу.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex items-start gap-5 bg-ink-950 p-9 transition-colors duration-500 hover:bg-ink-900"
            >
              <item.icon
                size={26}
                strokeWidth={1.25}
                className="shrink-0 text-gold-400 transition-transform duration-500 group-hover:scale-110"
              />
              <div>
                <h3 className="font-display text-xl font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-ink-400">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-5">
              <div className="gold-line" />
              <span className="eyebrow">Каталог</span>
            </div>
            <h2 className="section-title">Актуальные предложения</h2>
          </div>
          <Link
            to="/catalog"
            className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-luxe text-gold-300 transition-colors hover:text-gold-200"
          >
            Все объекты
            <ArrowRight
              size={15}
              className="transition-transform duration-500 group-hover:translate-x-1.5"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse bg-ink-900" />
            ))}
          </div>
        ) : error ? (
          <p className="text-ink-400">{error}</p>
        ) : featured.length === 0 ? (
          <div className="border border-gold-400/15 bg-ink-900/40 p-16 text-center">
            <Search size={30} strokeWidth={1.25} className="mx-auto text-gold-400/70" />
            <p className="mx-auto mt-6 max-w-md font-display text-2xl font-light text-ink-200">
              Скоро здесь появятся лучшие объекты
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm font-light text-ink-400">
              Напишите напрямую — персональный подбор начнём сегодня.
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-outline mt-8"
            >
              Написать в Telegram
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gold-400/10 bg-ink-900/50">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-5 flex items-center gap-5">
              <div className="gold-line" />
              <span className="eyebrow">О компании</span>
            </div>
            <h2 className="section-title">Эксперт, которому доверяют</h2>
            <p className="mt-7 max-w-xl font-light leading-relaxed text-ink-400">
              Мансур Масаев специализируется на премиальной недвижимости Грозного
              и Чеченской Республики. Глубокое знание рынка, честная оценка и
              внимание к деталям — вот почему клиенты возвращаются и рекомендуют
              его своим близким.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-8 border-t border-ink-800 pt-9">
              <div>
                <div className="font-display text-4xl font-medium text-gold-300">
                  200+
                </div>
                <div className="mt-2 text-[10px] font-light uppercase tracking-luxe text-ink-500">
                  сделок
                </div>
              </div>
              <div>
                <div className="font-display text-4xl font-medium text-gold-300">
                  10+
                </div>
                <div className="mt-2 text-[10px] font-light uppercase tracking-luxe text-ink-500">
                  лет опыта
                </div>
              </div>
              <div>
                <div className="font-display text-4xl font-medium text-gold-300">
                  100%
                </div>
                <div className="mt-2 text-[10px] font-light uppercase tracking-luxe text-ink-500">
                  конфиденциальность
                </div>
              </div>
            </div>
          </div>
          <div className="relative border border-gold-400/20 bg-ink-950 p-10 md:p-12">
            <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-gold-400" />
            <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-gold-400" />
            <h3 className="font-display text-3xl font-medium text-white">
              Персональный подбор
            </h3>
            <p className="mt-4 font-light leading-relaxed text-ink-400">
              Расскажите о задаче в мессенджере — в течение дня вы получите
              подборку объектов, соответствующих вашим требованиям и бюджету.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-gold flex-1"
              >
                Написать в WhatsApp
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1"
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
