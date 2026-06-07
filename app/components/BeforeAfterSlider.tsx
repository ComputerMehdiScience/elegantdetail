"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeSrc?: string;
  afterSrc?: string;
  priority?: boolean;
  sizes?: string;
};

export function BeforeAfterSlider({
  beforeSrc = "/Microyescars/before.png",
  afterSrc = "/Microyescars/after.png",
  priority = true,
  sizes = "(max-width: 768px) 100vw, 55vw",
}: BeforeAfterSliderProps = {}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="group relative w-full select-none overflow-hidden rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06),0_30px_70px_-26px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
      style={{ aspectRatio: "1/1", cursor: "col-resize", touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* After (base layer) */}
      <Image
        src={afterSrc}
        alt="After detailing"
        fill
        sizes={sizes}
        className="object-cover"
        draggable={false}
        priority={priority}
      />

      {/* Before (clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative h-full" style={{ width: `${100 / (position / 100)}%` }}>
          <Image
            src={beforeSrc}
            alt="Before detailing"
            fill
            sizes={sizes}
            className="object-cover"
            draggable={false}
            priority={priority}
          />
        </div>
      </div>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-white/85 shadow-[0_0_10px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/20 shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_6px_22px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
        style={{ left: `${position}%` }}
      >
        <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4 drop-shadow" aria-hidden="true">
          <path d="M6 4l-4 6 4 6V4zm8 0v12l4-6-4-6z" />
        </svg>
      </div>

    </div>
  );
}
