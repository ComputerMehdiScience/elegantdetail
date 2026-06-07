"use client";

import Image from "next/image";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ScrollReveal } from "../components/ScrollReveal";

const photos = [
  { src: "/Microyescars/Bmw i8 fully serviced inside out out.jpg", alt: "BMW i8 detailed exterior", aspect: "aspect-square" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (1).png", alt: "Detailed vehicle 1", aspect: "aspect-[3/4]" },
  { src: "/Microyescars/Lexus RX350 came in for a full service..jpg", alt: "Lexus RX350 full service", aspect: "aspect-[4/3]" },
  { src: "/Microyescars/Bmw i8 fully serviced inside out. interior.jpg", alt: "BMW i8 detailed interior", aspect: "aspect-[3/4]" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (2).png", alt: "Detailed vehicle 2", aspect: "aspect-square" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (3).png", alt: "Detailed vehicle 3", aspect: "aspect-[4/3]" },
  { src: "/Microyescars/Bmw i8 fully serviced inside out..jpg", alt: "BMW i8 detail", aspect: "aspect-[3/4]" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (4).png", alt: "Detailed vehicle 4", aspect: "aspect-[4/3]" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_39 PM (5).png", alt: "Detailed vehicle 5", aspect: "aspect-square" },
  { src: "/Microyescars/Bmw i8 fully serviced inside out.2.jpg", alt: "BMW i8 detail 2", aspect: "aspect-[3/4]" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_39 PM (6).png", alt: "Detailed vehicle 6", aspect: "aspect-[4/3]" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_39 PM (7).png", alt: "Detailed vehicle 7", aspect: "aspect-[4/5]" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_40 PM (8).png", alt: "Detailed vehicle 8", aspect: "aspect-square" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_40 PM (9).png", alt: "Detailed vehicle 9", aspect: "aspect-[3/4]" },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white text-[#111]">
      <ScrollReveal />
      <SiteNav />

      {/* Hero */}
      <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden bg-[#0c0f0e] px-6 pt-24 sm:px-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Microyescars/gallery hero photo.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-black/55" style={{ zIndex: 1 }} />

        <div className="relative w-full text-center" style={{ zIndex: 2 }}>
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/60">
            <a href="/" className="transition hover:text-white">Home</a>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M6 3l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white">Gallery</span>
          </div>
          <h1 className="text-center font-extrabold uppercase leading-[1.02] tracking-tight text-white" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            Photos of Our Work
          </h1>
        </div>
      </section>

      {/* Masonry photo grid */}
      <section className="px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
            {photos.map((photo, i) => (
              <div
                key={i}
                className={`mb-4 break-inside-avoid overflow-hidden rounded-xl lg:mb-5 ${photo.aspect} relative`}
                data-reveal="apple-card"
                data-reveal-delay={Math.min(i * 60, 400)}
              >
                <Image
                  src={encodeURI(photo.src)}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-500 hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/[0.06] bg-[#0c0f0e] px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Want results like these?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/55">
            Book your detail online in under 2 minutes. We come to you.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
            className="mt-8 inline-flex items-center bg-[#c8ccd4] px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[#111] transition hover:bg-[#aeb4c0]"
          >
            Book Your Detail
          </button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
