"use client";

import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-[#111]">
      <SiteNav />

      <section className="flex flex-1 flex-col items-center justify-center bg-[#0c0f0e] px-4 py-40 text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[#c8ccd4]">
          About Us
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Coming Soon
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/55">
          Our story page is on the way. In the meantime, you can book a detail directly or give us a call.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal"))}
            className="btn-chrome rounded-md px-7 py-3 text-sm font-bold uppercase tracking-[0.1em]"
          >
            Book a Detail
          </button>
          <a
            href="tel:+16047265855"
            className="rounded-md border border-white/25 px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:border-white/60"
          >
            Call Us
          </a>
        </div>
        <a href="/" className="mt-8 text-sm font-semibold text-white/50 underline underline-offset-4 transition hover:text-white">
          Back to home
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}
