import { useState, type FormEvent, type ReactNode } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/Logo';

interface LoginScreenProps {
  children: ReactNode;
}

export default function LoginScreen({ children }: LoginScreenProps) {
  const { session, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={30} className="animate-spin text-gold-400" />
      </div>
    );
  }

  if (session) return <>{children}</>;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) setError('Неверный email или пароль.');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="relative w-full max-w-md border border-gold-400/20 bg-ink-900/60 p-9 md:p-11">
        <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-gold-400" />
        <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-gold-400" />

        <div className="mb-9 flex flex-col items-center text-center">
          <Logo />
          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-8 bg-gold-400/50" />
            <span className="eyebrow">Панель управления</span>
            <div className="h-px w-8 bg-gold-400/50" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div>
            <label className="label-dark">Email</label>
            <input
              type="email"
              className="input-dark"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label-dark">Пароль</label>
            <input
              type="password"
              className="input-dark"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm font-light text-red-300">
              {error}
            </p>
          )}

          <button type="submit" className="btn-gold w-full" disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Lock size={14} />
            )}
            {submitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-light leading-relaxed text-ink-500">
          Доступ есть только у администратора сайта. Чтобы получить данные для
          входа, обратитесь к владельцу проекта.
        </p>
      </div>
    </div>
  );
}
