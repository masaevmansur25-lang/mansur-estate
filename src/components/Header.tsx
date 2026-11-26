import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MessageCircle, Send, Phone } from 'lucide-react';
import Logo from '@/components/Logo';

export const WHATSAPP_URL =
  'https://wa.me/79498207777?text=' +
  encodeURIComponent('Здравствуйте! Хочу уточнить информацию по недвижимости.');
export const TELEGRAM_URL = 'https://t.me/MANSURMASAEV';
export const PHONE_DISPLAY = '+7 (949) 820-77-77';

interface HeaderProps {
  isAuth: boolean;
}

export default function Header({ isAuth }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gold-400/10 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative text-[12px] font-medium uppercase tracking-luxe text-ink-300 transition-colors duration-300 hover:text-gold-300"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-400 transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
          {isAuth && (
            <Link
              to="/admin"
              className="group relative text-[12px] font-medium uppercase tracking-luxe text-gold-300"
            >
              Панель управления
              <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gold-400/60" />
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center border border-ink-700 text-ink-300 transition-all duration-300 hover:border-gold-400/60 hover:text-gold-300"
          >
            <MessageCircle size={15} />
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="flex h-9 w-9 items-center justify-center border border-ink-700 text-ink-300 transition-all duration-300 hover:border-gold-400/60 hover:text-gold-300"
          >
            <Send size={15} />
          </a>
          <a href="tel:+79498207777" className="btn-gold !px-6 !py-2.5">
            <Phone size={13} />
            Связаться
          </a>
        </div>

        <button
          className="border border-ink-700 p-2 text-ink-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gold-400/10 bg-ink-950 px-5 py-5 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-ink-800/70 py-3.5 text-[13px] uppercase tracking-luxe text-ink-200"
              >
                {l.label}
              </Link>
            ))}
            {isAuth && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="border-b border-ink-800/70 py-3.5 text-[13px] uppercase tracking-luxe text-gold-300"
              >
                Панель управления
              </Link>
            )}
            <div className="mt-5 flex gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1 !px-4 !py-3 text-[11px]"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex-1 !px-4 !py-3 text-[11px]"
              >
                <Send size={14} />
                Telegram
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
