"use client";

import Image from "next/image";
import { type ReactNode, useEffect } from "react";
import { TestimonialMarquee } from "./components/TestimonialMarquee";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { MagneticButton } from "./components/MagneticButton";
import { ServiceGrid } from "./components/ServiceGrid";
import { ScrollReveal } from "./components/ScrollReveal";
import { GalleryStrip } from "./components/GalleryStrip";
import { SiteNav } from "./components/SiteNav";
import { FAQAccordionBlock } from "@/components/ui/faq-accordion-block-shadcnui";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "#book" },
];

const bookingUrl = "https://cal.com/elegant-auto-detailing";
const contactEmail = "elegantautodetailing@gmail.com";
const contactPhone = "+1 (604) 726-5855";
const googleReviewUrl = "https://www.google.com/maps";

const pricingSections = [
  {
    name: "Interior Detail",
    slug: "interior-detail",
    detail:
      "Deep interior vacuuming, seat shampooing, steam cleaning, and panel care. Ideal when the cabin needs a full reset.",
    image:
      "/Microyescars/interior.png",
    bookingUrl: `${bookingUrl}/full-interior-detail`,
    serviceKey: "full-interior-detail",
    prices: [
      { vehicle: "Sedan", price: "$129" },
      { vehicle: "2 Row SUV / Truck", price: "$159" },
      { vehicle: "3 Row SUV / Minivan", price: "$189" },
    ],
  },
  {
    name: "Full Detail",
    slug: "full-detail",
    featured: true,
    detail:
      "A complete reset inside and out. Full body wash, wax, clay bar treatment, interior shampoo, and steam clean in one visit.",
    image:
      "/Microyescars/exterior.png",
    bookingUrl: `${bookingUrl}/fbd`,
    serviceKey: "fbd",
    prices: [
      { vehicle: "Sedan", price: "$199" },
      { vehicle: "2 Row SUV / Truck", price: "$239" },
      { vehicle: "3 Row SUV / Minivan", price: "$279" },
    ],
  },
  {
    name: "Exterior Detail",
    slug: "exterior-detail",
    detail:
      "Full body wash, car waxing, wheel washing, and exhaust tip polishing for a clean, glossy finish that turns heads.",
    image:
      "/Microyescars/fulldetail new.png",
    bookingUrl: `${bookingUrl}/full-exterior-detail`,
    serviceKey: "full-exterior-detail",
    prices: [
      { vehicle: "Sedan", price: "$99" },
      { vehicle: "2 Row SUV / Truck", price: "$119" },
      { vehicle: "3 Row SUV / Minivan", price: "$139" },
    ],
  },
];

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("book=true")) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-booking-modal"));
      }, 150);

      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("book");
        window.history.replaceState({}, document.title, url.pathname + url.search);
      } catch {}
    }
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#111]">
      <ScrollReveal />
      <SiteNav overHero />

      <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-24 pb-12 sm:min-h-screen sm:px-8 sm:pt-32 sm:pb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Microyescars/herophoto.png"
          alt=""
          aria-hidden="true"
          className="hero-bg-motion absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] sm:object-[60%_center]"
        />
        {/* Light, even scrim for text readability */}
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="mx-auto w-full max-w-[96rem]">
          <div className="mx-auto max-w-3xl text-center sm:mx-0 sm:max-w-4xl sm:text-left">
            <h1
              className="font-extrabold leading-[1.04] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              style={{ fontSize: "clamp(2.55rem, 12vw, 5.5rem)" }}
              data-reveal="hero"
            >
              Surrey Mobile Car Detailing
            </h1>
            <p
              className="mx-auto mt-5 max-w-xl text-base font-bold leading-7 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:mx-0 sm:mt-6 sm:text-xl"
              data-reveal="fade-up"
              data-reveal-delay="140"
            >
              Professional Mobile Auto Detailing, serving Surrey, Vancouver, Burnaby, and more!
            </p>
            <div
              className="mx-auto mt-7 flex w-full max-w-sm flex-col gap-3 sm:mx-0 sm:max-w-none sm:flex-row sm:gap-4"
              data-reveal="zoom-in"
              data-reveal-delay="260"
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
                className="btn-chrome font-display flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] sm:w-auto"
              >
                Book Your Detail
              </button>
              <a
                href="tel:+16047265855"
                className="font-display flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#111] transition hover:bg-white/90 sm:w-auto"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                  <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.764a.5.5 0 0 1 .49.395l.833 4.167a.5.5 0 0 1-.27.534L5.5 8a11.03 11.03 0 0 0 6.5 6.5l.904-1.817a.5.5 0 0 1 .534-.27l4.167.833a.5.5 0 0 1 .395.49V16.5A1.5 1.5 0 0 1 16.5 18C8.492 18 2 11.508 2 3.5Z" />
                </svg>
                Call Now
              </a>
            </div>

            {/* Google reviews badge */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start" data-reveal="fade-up" data-reveal-delay="360">
              <span className="font-display flex items-center text-lg font-bold [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]" aria-label="Google">
                <span style={{ color: "#5B9BFF" }}>G</span>
                <span style={{ color: "#FF6B5E" }}>o</span>
                <span style={{ color: "#FFD13B" }}>o</span>
                <span style={{ color: "#5B9BFF" }}>g</span>
                <span style={{ color: "#4FC56F" }}>l</span>
                <span style={{ color: "#FF6B5E" }}>e</span>
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 13 13" fill="#f7d84b" aria-hidden="true">
                    <path d="M6.5 1.1l1.44 2.91 3.21.47-2.32 2.26.55 3.2L6.5 8.27 3.62 9.94l.55-3.2L1.85 4.48l3.21-.47z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">5.0</span>
              <span className="text-sm font-semibold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">| 200+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="bg-white px-4 py-16 text-[#121212] sm:px-8 sm:py-28"
        data-reveal="page-fade"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight text-[#111] sm:text-5xl" data-reveal="apple">
              Select the right detail for your car
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-black/60 sm:mt-5 sm:text-xl sm:leading-8" data-reveal="apple" data-reveal-delay="120">
              Every package is priced by vehicle size, so you always know where to start. No calls, no guessing.
            </p>
          </div>

          <ServiceGrid items={pricingSections} />
        </div>
      </section>

      {/* Before / After */}
      <section id="results" className="border-t border-black/[0.06] bg-[#faf9f6] px-4 py-16 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">

            {/* Left side copy */}
            <div data-reveal="apple">
              <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-[#111] sm:text-5xl">
                Real results you can see
              </h2>
              <p className="mt-6 text-lg leading-8 text-black/65 sm:text-xl sm:leading-9">
                A good detail should be obvious. From cleaner paint to fresher interiors, every service is built to make your car feel better the moment you get back in.
              </p>
              <p className="mt-4 text-lg leading-8 text-black/65 sm:text-xl sm:leading-9">
                Not sure what your car needs? Choose a package or send your vehicle details and we will point you in the right direction.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <MagneticButton
                  href="/book"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-booking-modal"));
                  }}
                  size="card"
                >
                  Book Your Detail
                </MagneticButton>
                <a
                  href="tel:+16047265855"
                  className="font-display flex min-h-12 items-center gap-2 rounded-none border border-[#111]/15 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#111] transition hover:border-[#111]/40 hover:bg-[#f7f6f2]"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.764a.5.5 0 0 1 .49.395l.833 4.167a.5.5 0 0 1-.27.534L5.5 8a11.03 11.03 0 0 0 6.5 6.5l.904-1.817a.5.5 0 0 1 .534-.27l4.167.833a.5.5 0 0 1 .395.49V16.5A1.5 1.5 0 0 1 16.5 18C8.492 18 2 11.508 2 3.5Z" />
                  </svg>
                  Call Us
                </a>
              </div>
            </div>

            {/* Right side slider */}
            <div className="w-full" data-reveal="apple" data-reveal-delay="120">
              <BeforeAfterSlider />
              <div className="mt-4 flex items-center justify-center gap-2 text-black/40">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                  <path d="M6 4l-4 6 4 6V4zm8 0v12l4-6-4-6z" />
                </svg>
                <span className="text-sm font-medium">Drag to compare</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ceramic coating upsell */}
      <section className="bg-white px-4 py-16 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 lg:order-1" data-reveal="apple" data-reveal-delay="120">
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_30px_70px_-26px_rgba(0,0,0,0.4)]">
                <Image
                  src="/Microyescars/ceramic coating section.png"
                  alt="Vehicle with a deep, protected gloss finish"
                  width={1100}
                  height={825}
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: "1/1" }}
                />
              </div>
            </div>
            <div className="order-1 lg:order-2" data-reveal="apple">
              <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-[#111] sm:text-5xl">
                Seal your detail with<br />
                <span className="underline decoration-[#9aa1ad] decoration-[3px] underline-offset-4">ceramic coating</span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-black/65 sm:text-xl sm:leading-9">
                Ceramic coating adds a protective layer over your paint to help maintain gloss, make cleaning easier, and reduce the impact of everyday dirt, water, and road grime.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  "Helps protect paint from UV, dirt, water, and road grime",
                  "Keeps the finish glossier for longer",
                  "Makes routine washes easier to maintain",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4 text-[1.05rem] leading-7 text-black/72">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c8ccd4]">
                      <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5 text-[#111]" aria-hidden="true">
                        <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <MagneticButton
                  href="/book"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service: "fbd" } }));
                  }}
                  size="card"
                >
                  Ask About Coating
                </MagneticButton>
                <a
                  href={`mailto:${contactEmail}?subject=Ceramic%20Coating%20Quote`}
                  className="font-display flex min-h-12 items-center gap-2 rounded-none border border-[#111]/15 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#111] transition hover:border-[#111]/40 hover:bg-[#f7f6f2]"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <rect x="2.5" y="4" width="15" height="12" rx="2" />
                    <path d="M3 5l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Request a Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="overflow-hidden border-t border-black/[0.06] bg-[#faf9f6] py-16 sm:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-8" data-reveal="apple">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight text-[#111] sm:text-5xl lg:text-[3.5rem]">
            Detailing people trust and talk about
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-black/60 sm:text-xl">
            Here is what customers across Surrey are saying about their detail.
          </p>
        </div>
        <div className="mt-12 sm:mt-14" data-reveal="apple" data-reveal-delay="120">
          <TestimonialMarquee />
        </div>
      </section>

      <section id="gallery" className="overflow-hidden border-t border-black/[0.06] bg-white pt-16 pb-12 sm:pt-20 sm:pb-14">
        <div className="px-4 text-center sm:px-8" data-reveal="apple">
          <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-[#111] sm:text-5xl lg:text-[3.5rem]">
            We called it Elegant for a reason
          </h2>
        </div>
        <div className="mt-6 sm:mt-8" data-reveal="apple" data-reveal-delay="80">
          <GalleryStrip />
        </div>
        <div className="mt-8 flex justify-center px-4" data-reveal="apple" data-reveal-delay="220">
          <MagneticButton href="/gallery" size="hero">
            View Gallery
          </MagneticButton>
        </div>
      </section>

      <section className="border-t border-black/[0.06] bg-white">
        <FAQAccordionBlock />
      </section>

      <section id="book" className="bg-white px-3 py-16 sm:px-8 sm:py-28">
        <div
          className="yellow-motion-panel relative isolate mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-2xl border border-white/15 px-4 py-10 text-center shadow-[0_42px_110px_-34px_rgba(0,0,0,0.62)] sm:rounded-3xl sm:px-14 sm:py-16"
        >
          <h2 className="booking-copy-shadow mx-auto max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]" data-reveal="apple" data-reveal-delay="120">
            Ready to get your car looking right again?
          </h2>
          <p className="booking-copy-shadow mx-auto mt-4 max-w-2xl text-base leading-7 text-white/90 sm:mt-5 sm:text-xl sm:leading-9" data-reveal="apple" data-reveal-delay="220">
            Book in under 2 minutes. Choose your package, send your vehicle details, or reach out with questions before booking. We will make the next step simple.
          </p>
          <div className="mx-auto mt-7 grid w-full max-w-3xl gap-3 text-left sm:mt-9 sm:grid-cols-2" data-reveal="apple" data-reveal-delay="360">
            <a
              href={`mailto:${contactEmail}`}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-4 backdrop-blur-md transition hover:border-[#c8ccd4]/50 hover:bg-white/[0.12] sm:gap-3.5 sm:rounded-2xl sm:px-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c8ccd4]/15 text-[#c8ccd4]">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
                  <rect x="2.5" y="4" width="15" height="12" rx="2" />
                  <path d="M3 5l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/55">Email</span>
                <span className="mt-0.5 block break-all text-[0.9rem] font-medium leading-snug text-white sm:text-[0.95rem]">{contactEmail}</span>
              </span>
            </a>
            <a
              href="tel:+16047265855"
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-4 backdrop-blur-md transition hover:border-[#c8ccd4]/50 hover:bg-white/[0.12] sm:gap-3.5 sm:rounded-2xl sm:px-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c8ccd4]/15 text-[#c8ccd4]">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.764a.5.5 0 0 1 .49.395l.833 4.167a.5.5 0 0 1-.27.534L5.5 8a11.03 11.03 0 0 0 6.5 6.5l.904-1.817a.5.5 0 0 1 .534-.27l4.167.833a.5.5 0 0 1 .395.49V16.5A1.5 1.5 0 0 1 16.5 18C8.492 18 2 11.508 2 3.5Z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/55">Phone</span>
                <span className="mt-0.5 block whitespace-nowrap text-[0.9rem] font-medium text-white sm:text-[0.95rem]">{contactPhone}</span>
              </span>
            </a>
          </div>
          <div data-reveal="apple" data-reveal-delay="460">
            <MagneticButton
              href="/book"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("open-booking-modal"));
              }}
              size="cta"
              className="mt-7 w-full max-w-xs sm:mt-8"
            >
              Book Your Detail
            </MagneticButton>
          </div>
        </div>
      </section>

      <footer className="bg-[#101312] px-4 py-12 text-white sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr_0.85fr_0.9fr]">
            <div>
              <a href="#top" className="font-display inline-flex flex-col leading-none text-[#c8ccd4]">
                <span className="text-2xl font-extrabold uppercase tracking-[0.14em]">Elegant Auto</span>
                <span className="mt-1 text-sm font-semibold uppercase tracking-[0.48em]">Detailing</span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/62">
                Premium mobile detailing in Surrey, BC. Clean interiors, glossy exteriors, and a booking process that makes the next step simple.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/book"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-booking-modal"));
                  }}
                  className="rounded-none bg-[#c8ccd4] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#07100f]"
                >
                  Book Your Detail
                </a>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-none border border-white/18 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-white"
                >
                  Google Review
                </a>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#c8ccd4]">Navigate</h2>
              <div className="mt-5 grid gap-3 text-sm text-white/64">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#c8ccd4]">Services</h2>
              <div className="mt-5 grid gap-3 text-sm text-white/64">
                {pricingSections.map((item) => {
                  const bookingHref = `/book?service=${encodeURIComponent(item.serviceKey)}`;
                  return (
                    <a
                      key={item.name}
                      href={bookingHref}
                      onClick={(event) => {
                        event.preventDefault();
                        window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service: item.serviceKey } }));
                      }}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#c8ccd4]">Contact</h2>
              <div className="mt-5 grid gap-3 text-sm text-white/64">
                <a href={`mailto:${contactEmail}`} className="break-all">
                  {contactEmail}
                </a>
                <a href="tel:+16047265855">
                  {contactPhone}
                </a>
                <span>14079 66A Ave, Surrey, BC</span>
                <span>Mobile detailing by appointment</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/44 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Elegant Auto Detailing. All rights reserved.</p>
            <p>Cleaner car. Clearer booking. Better drive.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-white/[0.05] text-[#c8ccd4]">
        {icon}
      </div>
      <div>
        <p className="font-bold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-white/52">{desc}</p>
        <div className="mt-4 h-px bg-white/8" />
      </div>
    </div>
  );
}

function SectionIntro({ label, title }: { label?: string; title: string }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {label ? (
          <p className="text-xs font-normal uppercase tracking-[0.22em] text-[#12d8b7] sm:text-sm sm:tracking-[0.28em]">{label}</p>
        ) : null}
        <h2 className={`${label ? "mt-3 sm:mt-4" : ""} max-w-3xl text-2xl font-bold leading-tight text-[#111] sm:text-5xl`}>{title}</h2>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-[#c8ccd4]/0 via-[#c8ccd4]/55 to-[#5b6470]/0 md:max-w-sm" />
    </div>
  );
}
