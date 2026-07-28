import { useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  className,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  };

  const onPointerDown = (e: PointerEvent) => {
    dragging.current = true;
    updateFromClientX(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className={cn(
        'group relative aspect-[16/10] cursor-ew-resize select-none touch-none overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/70 p-2 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <img src={afterImage} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
          {beforeLabel}
        </span>
        <span className="rounded-full border border-gold/30 bg-gold/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-md">
          {afterLabel}
        </span>
      </div>

      <div className="absolute inset-0 overflow-hidden rounded-[24px]" style={{ width: `${position}%` }}>
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
        Drag to compare
      </div>

      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/90 to-transparent"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white shadow-2xl backdrop-blur-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
