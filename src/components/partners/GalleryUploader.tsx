import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { apiUploadImage } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

const GalleryUploader = ({ images, onChange, max = 5 }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = max - images.length;
    const toUpload = files.slice(0, remaining);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of toUpload) {
        if (!f.type.startsWith('image/')) continue;
        const { url } = await apiUploadImage(f);
        uploaded.push(url);
      }
      onChange([...images, ...uploaded]);
      if (files.length > remaining) {
        toast({ title: `Limite de ${max} fotos atingido`, description: 'Algumas imagens não foram adicionadas.' });
      }
    } catch (err: any) {
      toast({ title: 'Falha no upload', description: err?.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">{uploading ? 'Enviando...' : 'Adicionar'}</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <p className="text-xs text-muted-foreground">Até {max} fotos. {images.length}/{max} usadas.</p>
    </div>
  );
};

export default GalleryUploader;
