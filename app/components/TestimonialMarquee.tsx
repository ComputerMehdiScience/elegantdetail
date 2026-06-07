"use client";

import { useRef } from "react";

const reviews = [
  {
    text: "This was my first time using Elegant Auto Detailing and I could not be happier with the results. They did an incredible job, my car looks brand new inside and out. They paid attention to every detail and went above and beyond what I expected. Highly recommend!",
    name: "Aaron Muller",
  },
  {
    text: "Absolutely amazing experience! Armaan was professional, punctual, and paid incredible attention to detail. My car looks spotless inside and out. You can tell he genuinely cares about his work. Highly recommend to anyone looking for top quality detailing!",
    name: "Kirat Brar",
  },
  {
    text: "Very very good. Top car detailing service company in all of Surrey, BC. I got my car detailed and also got my headlights restored, they look so much more visible now. Thank you for your service.",
    name: "Chandeep Dhaliwal",
  },
  {
    text: "Booked a full detail and the car came back looking better than the day I bought it. The clay bar and wax made the paint feel like glass. Will be going monthly from now on.",
    name: "Jaspreet S.",
  },
  {
    text: "They came right to my driveway in Surrey and handled everything. No drop off, no waiting around. The interior steam clean got out stains I thought were permanent.",
    name: "Marcus L.",
  },
  {
    text: "Easily the best detailing I have had in the Lower Mainland. On time, professional, and the engine bay cleaning was a nice touch. Already recommended them to my whole family.",
    name: "Priya K.",
  },
];

function GoldStars() {
  return (
    <div className="flex gap-[3px]" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 13 13" fill="#f7d84b" aria-hidden="true">
          <path d="M6.5 1.1l1.44 2.91 3.21.47-2.32 2.26.55 3.2L6.5 8.27 3.62 9.94l.55-3.2L1.85 4.48l3.21-.47z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6 shrink-0" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#4285F4" />
      <path d="M7 12.4l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      {direction === "left" ? (
        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function ReviewCard({ text, name }: { text: string; name: string }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <article
      data-review-card
      className="flex w-[330px] shrink-0 snap-start flex-col gap-5 rounded-2xl border border-black/[0.08] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.05),0_22px_46px_-32px_rgba(0,0,0,0.28)] transition duration-300 ease-out hover:-translate-y-2 hover:border-[#c8ccd4]/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05),0_28px_58px_-30px_rgba(0,0,0,0.4)] sm:w-[400px] sm:p-8"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8ccd4] text-lg font-bold text-[#111]">
            {initial}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[0.95rem] font-bold text-[#111]">{name}</p>
              <VerifiedBadge />
            </div>
            <p className="text-xs text-black/45">Recently</p>
          </div>
        </div>
        <GoogleGlyph />
      </div>
      <GoldStars />
      <p className="text-[1.02rem] leading-[1.72] text-black/68">{text}</p>
      <div className="mt-auto border-t border-black/[0.07] pt-4">
        <a
          href="https://g.page/r/review"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-black/40 transition hover:text-[#111]"
        >
          <span>Read on Google</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="ml-auto h-3.5 w-3.5" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  );
}

const btnClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white text-[#111] transition duration-300 hover:border-[#5b6470] hover:bg-[#c8ccd4] hover:text-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b6470]";

function AggregateRating() {
  return (
    <div className="mb-10 flex items-center justify-center gap-3">
      <span className="text-5xl font-extrabold leading-none tracking-tight text-[#111]">5.0</span>
      <div className="flex flex-col gap-1">
        <GoldStars />
        <p className="text-sm text-black/45">Based on 200+ Google reviews</p>
      </div>
    </div>
  );
}

export function TestimonialMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.getBoundingClientRect().width + 28 : 408;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div>
      <AggregateRating />
      <div className="mx-auto max-w-[1256px] overflow-hidden">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-7 overflow-x-auto pb-12 pt-3"
        >
          {reviews.map((r, i) => (
            <ReviewCard key={i} text={r.text} name={r.name} />
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button type="button" onClick={() => scrollByCards(-1)} aria-label="Previous reviews" className={btnClass}>
          <ArrowIcon direction="left" />
        </button>
        <button type="button" onClick={() => scrollByCards(1)} aria-label="Next reviews" className={btnClass}>
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
}
