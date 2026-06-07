"use client";

import type { AnchorHTMLAttributes, FocusEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { useRef } from "react";

export type MagneticButtonVariant = "gold" | "outline";
export type MagneticButtonSize = "nav" | "hero" | "card" | "cta";

type MagneticButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
  children: ReactNode;
  className?: string;
  size?: MagneticButtonSize;
  variant?: MagneticButtonVariant;
};

const variantClasses: Record<MagneticButtonVariant, string> = {
  gold:
    "btn-chrome border-white/55 text-[#0d0f12]",
  outline:
    "border-white/38 bg-black/30 text-white shadow-none backdrop-blur-2xl hover:border-white/85",
};

const sizeClasses: Record<MagneticButtonSize, string> = {
  nav: "min-h-10 px-3 py-2 text-xs tracking-[0.12em] sm:px-4 sm:text-base sm:tracking-[0.16em]",
  hero: "min-h-16 px-8 py-4 text-base tracking-[0.14em] sm:px-10 sm:text-lg sm:tracking-[0.16em]",
  card:
    "min-h-11 w-full px-4 py-2.5 text-xs tracking-[0.12em] min-[430px]:w-auto sm:min-h-12 sm:px-6 sm:py-3 sm:text-base sm:tracking-[0.16em]",
  cta: "min-h-16 px-8 py-4 text-base tracking-[0.14em] sm:px-10 sm:text-lg sm:tracking-[0.16em]",
};

export function MagneticButton({
  children,
  className = "",
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onPointerCancel,
  onPointerDown,
  onPointerUp,
  size = "hero",
  variant = "gold",
  ...anchorProps
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const isHoveringRef = useRef(false);

  function setButtonVars(x: number, y: number, scale: number) {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    button.style.setProperty("--button-x", `${x}px`);
    button.style.setProperty("--button-y", `${y}px`);
    button.style.setProperty("--button-scale", `${scale}`);
  }

  function resetButton() {
    const button = buttonRef.current;
    const content = contentRef.current;

    if (!button || !content) {
      return;
    }

    isHoveringRef.current = false;
    setButtonVars(0, 0, 1);
    button.style.setProperty("--magnet-x", "50%");
    button.style.setProperty("--magnet-y", "50%");
    button.style.setProperty("--button-shine", "0");
    content.style.transform = "translate3d(0, 0, 0)";
  }

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const button = buttonRef.current;
    const content = contentRef.current;

    if (!button || !content) {
      onMouseMove?.(event);
      return;
    }

    const rect = button.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    const offsetX = relativeX / rect.width - 0.5;
    const offsetY = relativeY / rect.height - 0.5;
    const translateX = offsetX * 5;
    const translateY = offsetY * 4;

    isHoveringRef.current = true;
    button.style.setProperty("--magnet-x", `${relativeX}px`);
    button.style.setProperty("--magnet-y", `${relativeY}px`);
    button.style.setProperty("--button-shine", "0.45");
    setButtonVars(translateX, translateY, 1.025);
    content.style.transform = `translate3d(${offsetX * 2}px, ${offsetY * 2}px, 0)`;
    onMouseMove?.(event);
  }

  function enterButton(event: MouseEvent<HTMLAnchorElement>) {
    const button = buttonRef.current;

    isHoveringRef.current = true;
    setButtonVars(0, 0, 1.025);

    if (button) {
      button.style.setProperty("--button-shine", "0.45");
    }

    onMouseEnter?.(event);
  }

  function focusButton(event: FocusEvent<HTMLAnchorElement>) {
    const button = buttonRef.current;

    setButtonVars(0, 0, 1.025);

    if (button) {
      button.style.setProperty("--magnet-x", "50%");
      button.style.setProperty("--magnet-y", "50%");
      button.style.setProperty("--button-shine", "0.45");
    }

    onFocus?.(event);
  }

  function pressButton(event: PointerEvent<HTMLAnchorElement>) {
    const button = buttonRef.current;

    if (button) {
      button.style.setProperty("--button-scale", "1.01");
    }

    onPointerDown?.(event);
  }

  function releaseButton(event: PointerEvent<HTMLAnchorElement>) {
    const button = buttonRef.current;

    if (button) {
      button.style.setProperty("--button-scale", isHoveringRef.current ? "1.025" : "1");
    }

    onPointerUp?.(event);
  }

  function cancelPress(event: PointerEvent<HTMLAnchorElement>) {
    resetButton();
    onPointerCancel?.(event);
  }

  return (
    <a
      {...anchorProps}
      ref={buttonRef}
      className={`magnetic-button magnetic-button-${variant} font-display group relative inline-flex items-center justify-center overflow-hidden rounded-none border text-center font-bold uppercase will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8ccd4] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onBlur={(event) => {
        resetButton();
        onBlur?.(event);
      }}
      onFocus={focusButton}
      onMouseEnter={enterButton}
      onMouseLeave={(event) => {
        resetButton();
        onMouseLeave?.(event);
      }}
      onMouseMove={handleMouseMove}
      onPointerCancel={cancelPress}
      onPointerDown={pressButton}
      onPointerUp={releaseButton}
    >
      <span ref={contentRef} className="relative z-10 transition-transform duration-300 ease-out will-change-transform">
        {children}
      </span>
    </a>
  );
}
