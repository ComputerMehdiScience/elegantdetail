"use client";

import Image from "next/image";
import type { MouseEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "./MagneticButton";

type Price = {
  vehicle: string;
  price: string;
};

export type PricingItem = {
  name: string;
  detail: string;
  image: string;
  bookingUrl: string;
  serviceKey: string;
  prices: Price[];
};

type PricingDeckProps = {
  items: PricingItem[];
};

export function PricingDeck({ items }: PricingDeckProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(1, items.length - 1));
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingDeck, setIsDraggingDeck] = useState(false);
  const lastShiftTimeRef = useRef(0);
  const lastInteractionRef = useRef(0);
  const isHoveredRef = useRef(false);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    isDragging: false,
  });
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveredRef.current && Date.now() - lastInteractionRef.current > 1500) {
        setActiveIndex((current) => (current + 1) % items.length);
        lastShiftTimeRef.current = Date.now();
      }
    }, 6500);
    return () => clearInterval(interval);
  }, [items.length]);

  function shift(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  }

  function openBookingModal(service: string) {
    window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service } }));
  }

  function triggerShift(direction: -1 | 1) {
    const now = Date.now();
    if (now - lastShiftTimeRef.current < 180) return;
    lastShiftTimeRef.current = now;
    lastInteractionRef.current = now;
    shift(direction);
  }

  function getPosition(index: number) {
    let position = index - activeIndex;
    if (position > items.length / 2) position -= items.length;
    if (position < -items.length / 2) position += items.length;
    return position;
  }

  function moveArrow(event: MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    const offsetX = relativeX / rect.width - 0.5;
    const offsetY = relativeY / rect.height - 0.5;
    button.style.setProperty("--arrow-x", `${offsetX * 4}px`);
    button.style.setProperty("--arrow-y", `${offsetY * 3}px`);
    button.style.setProperty("--arrow-scale", "1.025");
    button.style.setProperty("--arrow-shine-x", `${relativeX}px`);
    button.style.setProperty("--arrow-shine-y", `${relativeY}px`);
    button.style.setProperty("--arrow-shine", "0.55");
  }

  function resetArrow(event: MouseEvent<HTMLButtonElement> | PointerEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    button.style.setProperty("--arrow-x", "0px");
    button.style.setProperty("--arrow-y", "0px");
    button.style.setProperty("--arrow-scale", "1");
    button.style.setProperty("--arrow-shine-x", "50%");
    button.style.setProperty("--arrow-shine-y", "50%");
    button.style.setProperty("--arrow-shine", "0");
  }

  function pressArrow(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty("--arrow-scale", "1.02");
  }

  function releaseArrow(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty("--arrow-scale", "1.025");
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      isDragging: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      dragState.isDragging = true;
      suppressClickRef.current = true;
      setIsDraggingDeck(true);
    }
    if (dragState.isDragging) {
      const elasticOffset = Math.sign(deltaX) * Math.pow(Math.min(Math.abs(deltaX), 180), 0.88) * 1.42;
      setDragOffset(elasticOffset);
    }
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const shouldShift = dragState.isDragging && Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY);
    if (shouldShift) {
      lastInteractionRef.current = Date.now();
      triggerShift(deltaX < 0 ? 1 : -1);
    }
    setDragOffset(shouldShift ? (deltaX < 0 ? -56 : 56) : 0);
    setIsDraggingDeck(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = { pointerId: -1, startX: 0, startY: 0, isDragging: false };
    window.setTimeout(() => {
      setDragOffset(0);
      suppressClickRef.current = false;
    }, 80);
  }

  function cancelDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = { pointerId: -1, startX: 0, startY: 0, isDragging: false };
    setDragOffset(0);
    setIsDraggingDeck(false);
    window.setTimeout(() => { suppressClickRef.current = false; }, 80);
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl" data-reveal="apple-panel" data-reveal-delay="240">
      <div
        className="relative h-[700px] overflow-hidden px-0 pb-16 sm:h-[620px] sm:overflow-visible sm:px-16 sm:pb-0"
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        <div
          className="relative h-[620px] cursor-grab select-none touch-pan-y active:cursor-grabbing sm:h-full"
          onClickCapture={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          onPointerCancel={cancelDrag}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={finishDrag}
        >
          {items.map((item, index) => {
            const position = getPosition(index);
            const distance = Math.abs(position);
            const isActive = position === 0;
            const itemDragOffset = dragOffset * (isActive ? 1 : 0.34);
            const dragLift = isDraggingDeck && isActive ? -8 : 0;
            const dragScale = isDraggingDeck && isActive ? 1.025 : isActive ? 1 : 0.95;
            const activeTransition = isDraggingDeck
              ? "transition-[opacity,box-shadow]"
              : "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

            const bookingHref = `/book?service=${encodeURIComponent(item.serviceKey)}`;

            return (
              <article
                key={item.name}
                aria-hidden={!isActive}
                className={`absolute left-1/2 top-0 w-[min(86vw,480px)] overflow-hidden rounded-none border border-black/10 bg-white ${
                  isActive
                    ? "shadow-[0_2px_10px_rgba(0,0,0,0.05),0_34px_80px_-28px_rgba(0,0,0,0.34)]"
                    : "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_22px_54px_-28px_rgba(0,0,0,0.22)]"
                } ${activeTransition} will-change-transform sm:w-[480px] ${
                  isActive ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  opacity: isActive ? 1 : 0.94,
                  transform: `translateX(calc(-50% + ${position * 272 + itemDragOffset}px)) translateY(${
                    distance * 14 + dragLift
                  }px) rotate(${isActive ? dragOffset * 0.018 : dragOffset * 0.006}deg) scale(${dragScale})`,
                  zIndex: 20 - distance,
                }}
              >
                <a
                  href={bookingHref}
                  onClick={(event) => {
                    event.preventDefault();
                    openBookingModal(item.serviceKey);
                  }}
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  className="relative block aspect-[16/10] overflow-hidden bg-[#181818]"
                >
                  <Image
                    src={item.image}
                    alt={`${item.name} service`}
                    fill
                    sizes="(max-width: 1024px) 88vw, 480px"
                    draggable={false}
                    className="select-none object-cover brightness-[0.97] contrast-[1.06] saturate-[0.9] transition duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_38%,rgba(0,0,0,0.42)_100%)]" />
                </a>

                <div className="p-6 sm:p-7">
                  <div className="flex flex-col gap-3 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
                    <a
                      href={bookingHref}
                      onClick={(event) => {
                        event.preventDefault();
                        openBookingModal(item.serviceKey);
                      }}
                      className="min-w-0 text-2xl font-bold leading-tight text-[#111] transition hover:text-[#c8ccd4]"
                    >
                      {item.name}
                    </a>
                    <MagneticButton
                      href={bookingHref}
                      onClick={(event) => {
                        event.preventDefault();
                        openBookingModal(item.serviceKey);
                      }}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      size="card"
                      className="shrink-0 self-start"
                    >
                      Get Quote
                    </MagneticButton>
                  </div>

                  <p className="mt-4 text-[0.95rem] leading-[1.65] text-black/72 sm:min-h-[4rem]">{item.detail}</p>

                  <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-none border border-black/10">
                    {item.prices.map((price, priceIndex) => (
                      <div
                        key={price.vehicle}
                        className={`flex min-h-[5rem] flex-col items-center justify-center gap-2 bg-[#faf9f6] px-1.5 py-4 text-center ${
                          priceIndex === item.prices.length - 1 ? "" : "border-r border-black/10"
                        }`}
                      >
                        <span className="text-[0.6rem] font-bold uppercase leading-tight tracking-[0.08em] text-black/40 sm:text-[0.62rem]">
                          {price.vehicle}
                        </span>
                        <span className="text-xl font-bold leading-none text-[#111] sm:text-[1.4rem]">{price.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Previous package"
          className="deck-arrow-button absolute left-[calc(50%_-_4rem)] top-[calc(100%_-_2rem)] flex h-12 w-12 items-center justify-center rounded-none border border-black/10 bg-white/88 text-3xl leading-none text-[#111] shadow-xl shadow-black/10 backdrop-blur-xl sm:left-2 sm:top-1/2"
          style={{ zIndex: 120 }}
          onClick={() => triggerShift(-1)}
          onPointerDown={pressArrow}
          onPointerUp={releaseArrow}
          onMouseLeave={resetArrow}
          onMouseMove={moveArrow}
          onPointerCancel={resetArrow}
        >
          <span aria-hidden="true" className="relative z-10">&lsaquo;</span>
        </button>

        <button
          type="button"
          aria-label="Next package"
          className="deck-arrow-button absolute right-[calc(50%_-_4rem)] top-[calc(100%_-_2rem)] flex h-12 w-12 items-center justify-center rounded-none border border-black/10 bg-white/88 text-3xl leading-none text-[#111] shadow-xl shadow-black/10 backdrop-blur-xl sm:right-2 sm:top-1/2"
          style={{ zIndex: 120 }}
          onClick={() => triggerShift(1)}
          onPointerDown={pressArrow}
          onPointerUp={releaseArrow}
          onMouseLeave={resetArrow}
          onMouseMove={moveArrow}
          onPointerCancel={resetArrow}
        >
          <span aria-hidden="true" className="relative z-10">&rsaquo;</span>
        </button>
      </div>
    </div>
  );
}
