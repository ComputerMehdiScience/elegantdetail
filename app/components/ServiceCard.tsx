"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { MagneticButton } from "./MagneticButton";

type Price = {
  vehicle: string;
  price: string;
};

export type ServiceCardProps = {
  name: string;
  detail: string;
  image: string;
  serviceKey: string;
  prices: Price[];
  featured?: boolean;
};

export function ServiceCard({ name, detail, image, serviceKey, prices, featured }: ServiceCardProps) {
  const bookingHref = `/book?service=${encodeURIComponent(serviceKey)}`;

  function openModal(e: MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service: serviceKey } }));
  }

  return (
    <div className={`service-card${featured ? " service-card-featured" : ""}`}>
      <a
        href={bookingHref}
        onClick={openModal}
        draggable={false}
        className="relative block aspect-[16/10] overflow-hidden bg-[#0f1110]"
      >
        <Image
          src={image}
          alt={`${name} detailing service`}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          draggable={false}
          className="select-none object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1110]/50 via-transparent to-transparent" />
        {featured && (
          <span className="absolute right-3 top-3 bg-[#c8ccd4] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#07100f]">
            Most Popular
          </span>
        )}
      </a>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold leading-tight text-white">{name}</h3>
          <MagneticButton
            href={bookingHref}
            onClick={openModal}
            size="card"
            className="shrink-0 self-start"
          >
            Book Now
          </MagneticButton>
        </div>

        <p className="mt-3 min-h-[3.5rem] text-sm leading-6 text-white/55">{detail}</p>

        <div className="mt-4 grid grid-cols-3 overflow-hidden border border-white/8">
          {prices.map((price, i) => (
            <div
              key={price.vehicle}
              className={`flex flex-col items-center justify-center gap-1.5 bg-white/[0.025] px-1 py-3 text-center${
                i < prices.length - 1 ? " border-r border-white/8" : ""
              }`}
            >
              <span className="text-[0.58rem] font-normal uppercase leading-tight tracking-[0.08em] text-white/36">
                {price.vehicle}
              </span>
              <span className={`font-bold leading-none text-white${featured ? " text-xl" : " text-lg"}`}>
                {price.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
