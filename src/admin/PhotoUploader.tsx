import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PhotoUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function PhotoUploader({ images, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (files: FileList) => {
    setError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('property-photos')
          .upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { data } = supabase.storage
          .from('property-photos')
          .getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError('Не удалось загрузить фото. Проверьте подключение и попробуйте ещё раз.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const makeCover = (idx: number) => {
    if (idx === 0) return;
    const next = [...images];
    const [item] = next.splice(idx, 1);
    onChange([item, ...next]);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, i) => (
          <div
            key={url + i}
            className="group relative overflow-hidden border border-ink-700"
          >
            <img
              src={url}
              alt={`Фото ${i + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />
            {i === 0 ? (
              <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 bg-gold-gradient px-2.5 py-1 text-[9px] font-semibold uppercase tracking-luxe text-ink-950">
                <Star size={9} />
                Обложка
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(i)}
                title="Сделать обложкой"
                className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center border border-ink-600 bg-ink-950/85 text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <Star size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              title="Удалить"
              className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center border border-ink-600 bg-ink-950/85 text-red-300 opacity-0 transition-all duration-300 hover:bg-red-950/90 hover:text-white group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2.5 border border-dashed border-ink-600 text-ink-400 transition-colors duration-300 hover:border-gold-400/60 hover:text-gold-300"
        >
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-gold-400" />
          ) : (
            <ImagePlus size={22} strokeWidth={1.25} />
          )}
          <span className="text-[11px] font-light uppercase tracking-[0.15em]">
            {uploading ? 'Загрузка...' : 'Добавить фото'}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && upload(e.target.files)}
      />

      {images.length === 0 && (
        <p className="mt-3 text-xs font-light text-ink-500">
          Пока фото нет — в объявлении будет отображаться фирменная заглушка.
        </p>
      )}
      {error && <p className="mt-3 text-sm font-light text-red-300">{error}</p>}
    </div>
  );
}
