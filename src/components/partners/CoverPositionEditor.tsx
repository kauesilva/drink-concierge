import { useRef, useState, useEffect } from 'react';
import { Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  imageUrl: string;
  value?: string; // e.g. "50% 30%"
  onChange: (value: string) => void;
  /** aspect ratio of the public banner (w/h). Default mirrors h-56/h-80 hero. */
  aspectRatio?: number;
}

function parsePos(value?: string): { x: number; y: number } {
  if (!value) return { x: 50, y: 50 };
  const m = value.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!m) return { x: 50, y: 50 };
  return { x: Math.min(100, Math.max(0, parseFloat(m[1]))), y: Math.min(100, Math.max(0, parseFloat(m[2]))) };
}

const CoverPositionEditor = ({ imageUrl, value, onChange, aspectRatio = 16 / 6 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(parsePos(value));
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setPos(parsePos(value));
  }, [value]);

  const updateFromEvent = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    const next = { x: Math.round(x), y: Math.round(y) };
    setPos(next);
    onChange(`${next.x}% ${next.y}%`);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    updateFromEvent(e.clientX, e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromEvent(e.clientX, e.clientY);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const reset = () => {
    setPos({ x: 50, y: 50 });
    onChange('50% 50%');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Move className="w-3.5 h-3.5" />
        <span>Arraste para escolher a parte da imagem que ficará centralizada na capa.</span>
      </div>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full rounded-lg overflow-hidden border border-border bg-muted cursor-crosshair select-none touch-none"
        style={{ aspectRatio: `${aspectRatio}` }}
      >
        <img
          src={imageUrl}
          alt="Capa"
          draggable={false}
          className="w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
        />
        <div
          className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary/80 shadow-lg pointer-events-none flex items-center justify-center"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <Move className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          {pos.x}% / {pos.y}%
        </span>
        <Button type="button" variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Centralizar
        </Button>
      </div>
    </div>
  );
};

export default CoverPositionEditor;
