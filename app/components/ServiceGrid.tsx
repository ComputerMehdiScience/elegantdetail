"use client";

import Image from "next/image";
import { MagneticButton } from "./MagneticButton";

type Price = {
  vehicle: string;
  price: string;
};

export type ServiceItem = {
  name: string;
  slug: string;
  detail: string;
  image: string;
  bookingUrl: string;
  serviceKey: string;
  prices: Price[];
  featured?: boolean;
};

type ServiceGridProps = {
  items: ServiceItem[];
};

function openBookingModal(service: string) {
  window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service } }));
}

export function ServiceGrid({ items }: ServiceGridProps) {
  return (
    <div className="mx-auto mt-12 grid max-w-6xl items-center gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-7">
      {items.map((item, index) => {
        const bookingHref = `/book?service=${encodeURIComponent(item.serviceKey)}`;
        const serviceHref = `/services/${item.slug}`;
        const fromPrice = item.prices[0]?.price;
        const featured = item.featured ?? false;

        return (
          <article
            key={item.name}
            data-reveal="apple-card"
            data-reveal-delay={120 + index * 120}
            className={[
              "group flex flex-col overflow-hidden rounded-2xl transition-all duration-500",
              featured
                ? "border-2 border-[#c8ccd4]/70 bg-white shadow-[0_4px_24px_rgba(247,216,75,0.12),0_32px_72px_-28px_rgba(0,0,0,0.42)] hover:-translate-y-1 hover:border-[#c8ccd4] hover:shadow-[0_6px_28px_rgba(247,216,75,0.18),0_44px_88px_-28px_rgba(0,0,0,0.5)] lg:scale-[1.08]"
                : "border border-black/[0.08] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05),0_28px_60px_-32px_rgba(0,0,0,0.32)] hover:-translate-y-1 hover:border-black/[0.14] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_40px_80px_-36px_rgba(0,0,0,0.42)]",
            ].join(" ")}
          >
            {/* Image — links to service detail page */}
            <a
              href={serviceHref}
              className={`relative block overflow-hidden bg-[#181818] ${featured ? "aspect-[16/10]" : "aspect-[16/11]"}`}
            >
              <Image
                src={item.image}
                alt={`${item.name} service`}
                fill
                sizes="(max-width: 1024px) 92vw, 400px"
                className="object-cover brightness-[0.97] contrast-[1.05] saturate-[0.92] transition duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0)_40%,rgba(0,0,0,0.46)_100%)]" />
              {fromPrice ? (
                <span className="font-display absolute left-4 top-4 rounded-full bg-[#c8ccd4] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#111]">
                  From {fromPrice}
                </span>
              ) : null}
            </a>

            {/* Most Popular banner */}
            {featured && (
              <div className="flex items-center justify-center gap-1.5 bg-[#c8ccd4] py-2">
                <svg viewBox="0 0 16 16" className="h-3 w-3 text-[#111]" fill="currentColor" aria-hidden="true">
                  <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.2l4-.6z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest text-[#111]">Most Popular</span>
              </div>
            )}

            {/* Body */}
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              {/* Title links to service page */}
              <a href={serviceHref} className="group/title">
                <h3 className={`font-bold leading-tight tracking-tight text-[#111] transition group-hover/title:text-[#5b6470] ${featured ? "text-2xl sm:text-3xl" : "text-2xl"}`}>
                  {item.name}
                </h3>
              </a>
              <p className="mt-3 text-[0.98rem] leading-[1.65] text-black/65">{item.detail}</p>

              {/* "What's included" link */}
              <a
                href={serviceHref}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#5b6470] transition hover:text-[#111]"
              >
                See what is included
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              {/* Price row */}
              <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-black/[0.08]">
                {item.prices.map((price, priceIndex) => (
                  <div
                    key={price.vehicle}
                    className={`flex min-h-[5.25rem] flex-col items-center justify-center gap-2 px-1.5 py-4 text-center ${
                      featured ? "bg-[#c8ccd4]/[0.06]" : "bg-[#faf9f6]"
                    } ${priceIndex === item.prices.length - 1 ? "" : "border-r border-black/[0.08]"}`}
                  >
                    <span className="font-display text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.08em] text-black/45 sm:text-[0.64rem]">
                      {price.vehicle}
                    </span>
                    <span className="text-xl font-bold leading-none text-[#111] sm:text-[1.4rem]">{price.price}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <MagneticButton
                href={bookingHref}
                onClick={(event) => {
                  event.preventDefault();
                  openBookingModal(item.serviceKey);
                }}
                size="card"
                variant={featured ? "gold" : undefined}
                className="mt-6 w-full"
              >
                Book {item.name}
              </MagneticButton>
            </div>
          </article>
        );
      })}
    </div>
  );
}
