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
        'relative aspect-[16/10] overflow-hidden rounded-2xl cursor-ew-resize select-none touch-none',
        className,
      )}
    >
      <img src={afterImage} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold glass text-white">{afterLabel}</span>

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${containerRef.current?.clientWidth ?? 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold glass text-white">{beforeLabel}</span>
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 gold-gradient pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full gold-gradient text-black shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
