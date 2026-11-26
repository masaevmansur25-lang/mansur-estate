import { Link } from 'react-router-dom';
import { MessageCircle, Send, Phone } from 'lucide-react';
import Logo from '@/components/Logo';
import { WHATSAPP_URL, TELEGRAM_URL, PHONE_DISPLAY } from '@/components/Header';

export default function Footer() {
  return (
    <footer className="border-t border-gold-400/15 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-6 text-sm font-light leading-relaxed text-ink-400">
              Премиальная недвижимость в Грозном и по всей Чеченской Республике.
              Безупречный сервис, конфиденциальность и индивидуальный подход к
              каждой сделке.
            </p>
          </div>

          <div>
            <h4 className="eyebrow">Навигация</h4>
            <div className="mt-5 flex flex-col gap-3 text-sm font-light text-ink-300">
              <Link
                to="/"
                className="w-fit transition-colors duration-300 hover:text-gold-300"
              >
                Главная
              </Link>
              <Link
                to="/catalog"
                className="w-fit transition-colors duration-300 hover:text-gold-300"
              >
                Каталог недвижимости
              </Link>
            </div>
          </div>

          <div>
            <h4 className="eyebrow">Контакты</h4>
            <div className="mt-5 flex flex-col gap-3.5 text-sm font-light text-ink-300">
              <a
                href="tel:+79498207777"
                className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold-300"
              >
                <Phone size={14} className="text-gold-400" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold-300"
              >
                <MessageCircle size={14} className="text-gold-400" />
                WhatsApp
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 transition-colors duration-300 hover:text-gold-300"
              >
                <Send size={14} className="text-gold-400" />
                @MANSURMASAEV
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-ink-800/70 pt-7 text-[11px] font-light uppercase tracking-[0.18em] text-ink-500 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} Мансур Масаев
          </span>
          <span>Элитная недвижимость Грозного</span>
        </div>
      </div>
    </footer>
  );
}
