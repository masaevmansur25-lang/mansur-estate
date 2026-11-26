import type { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = '' }) => (
  <div className={`flex items-center gap-3.5 ${className}`}>
    <div className="relative flex h-11 w-11 items-center justify-center border border-gold-400/50">
      <span className="font-display text-2xl font-medium text-gold-400">M</span>
      <span className="absolute -left-px -top-px h-2 w-2 border-l border-t border-gold-400" />
      <span className="absolute -right-px -top-px h-2 w-2 border-r border-t border-gold-400" />
      <span className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-gold-400" />
      <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-gold-400" />
    </div>
    <div className="leading-none">
      <div className="font-display text-xl font-semibold tracking-[0.14em] text-white">
        MANSUR MASAEV
      </div>
      <div className="mt-1.5 text-[9px] font-normal uppercase tracking-luxe text-gold-400/80">
        Элитная недвижимость · Грозный
      </div>
    </div>
  </div>
);

export default Logo;
