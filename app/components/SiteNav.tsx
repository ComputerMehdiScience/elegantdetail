"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const serviceDropdown = [
  { label: "Auto Detailing", href: "/services" },
  { label: "Interior Vacuuming", href: "/services" },
  { label: "Car Waxing", href: "/services" },
  { label: "Clay Bar Treatment", href: "/services" },
  { label: "Engine Detailing", href: "/services" },
  { label: "Exhaust Tip Polishing", href: "/services" },
  { label: "Full Body Wash", href: "/services" },
  { label: "Paint Repair", href: "/services" },
  { label: "Seat Shampooing", href: "/services" },
  { label: "Steam Cleaning", href: "/services" },
  { label: "Wheel Washing", href: "/services" },
];

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteNav({ overHero = false }: { overHero?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  function openModal() {
    window.dispatchEvent(new CustomEvent("open-booking-modal"));
  }

  const isServicesActive = pathname.startsWith("/services");
  const transparent = overHero && !scrolled;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        transparent
          ? "border-transparent bg-transparent shadow-none backdrop-blur-none"
          : "border-white/35 bg-[#111514]/90 shadow-[0_8px_28px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-150"
      }`}
    >
      <nav className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-24 sm:gap-6 sm:px-6 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex items-center justify-center">
            <Image
              src="/Microyescars/logo.png"
              alt="Elegant Auto Detailing"
              width={190}
              height={95}
              className="h-12 w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] sm:h-16"
              priority
            />
          </span>
        </a>

        {/* Centered nav links */}
        <div className="hidden items-center gap-1 text-[1.05rem] font-bold text-white md:flex">

          <a href="/" className={`border-b-2 px-4 py-2 tracking-wide transition hover:text-[#c8ccd4] ${pathname === "/" ? "border-[#c8ccd4] text-[#c8ccd4]" : "border-transparent"}`}>
            Home
          </a>

          {/* Services with dropdown */}
          <div className="group relative">
            <a
              href="/services"
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 tracking-wide transition hover:text-[#c8ccd4] ${isServicesActive ? "border-[#c8ccd4] text-[#c8ccd4]" : "border-transparent"}`}
            >
              Services <ChevronDown />
            </a>
            <div className="pointer-events-none absolute left-0 top-full w-[28rem] translate-y-1 overflow-hidden rounded-xl border border-white/10 bg-[#1a1f1d] opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-x-2 p-3">
                {serviceDropdown.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-[#c8ccd4]"
                  >
                    <svg viewBox="0 0 8 8" fill="currentColor" className="h-1.5 w-1.5 shrink-0 text-[#c8ccd4]" aria-hidden="true">
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                    {item.label}
                  </a>
                ))}
              </div>
              <a
                href="/services"
                className="flex items-center justify-center gap-2 border-t border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-[#c8ccd4] transition hover:bg-white/[0.08]"
              >
                View all services
              </a>
            </div>
          </div>

          <a href="/about" className={`border-b-2 px-4 py-2 tracking-wide transition hover:text-[#c8ccd4] ${pathname === "/about" ? "border-[#c8ccd4] text-[#c8ccd4]" : "border-transparent"}`}>
            About
          </a>

          <a href="/gallery" className={`border-b-2 px-4 py-2 tracking-wide transition hover:text-[#c8ccd4] ${pathname === "/gallery" ? "border-[#c8ccd4] text-[#c8ccd4]" : "border-transparent"}`}>
            Gallery
          </a>

          <a href="/#book" className="border-b-2 border-transparent px-4 py-2 tracking-wide transition hover:text-[#c8ccd4]">
            Contact
          </a>

        </div>

        {/* Single solid Book button */}
        <button
          onClick={openModal}
          className="btn-chrome shrink-0 rounded-full px-5 py-3 text-[0.78rem] font-bold uppercase tracking-[0.14em] sm:px-7 sm:text-[0.95rem] sm:tracking-[0.1em]"
        >
          Book Online
        </button>

      </nav>
    </div>
  );
}
