"use client";

import { useEffect } from "react";
import { MagneticButton } from "../components/MagneticButton";

const SERVICES = [
  {
    key: "full-exterior-detail",
    title: "Exterior Detail",
    description: "Crisp exterior polish, brighter wheels, and glossier drive.",
  },
  {
    key: "full-interior-detail",
    title: "Interior Detail",
    description: "Deep cabin care for seats, panels, glass, carpets, trim, and touch points.",
  },
  {
    key: "fbd",
    title: "Full Detail",
    description: "Best all-around detail for a full vehicle reset with interior and exterior care.",
  },
];

export default function BookingPage({ searchParams }: { searchParams?: { service?: string } }) {
  const initialService = searchParams?.service || undefined;

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service: initialService } }));
  }, [initialService]);

  return (
    <main className="min-h-screen bg-[#101312] px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <h1 className="text-3xl font-bold uppercase tracking-[0.08em] text-[#c8ccd4]">Book Your Detail</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/62">
            Choose a service to open the website booking calendar.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {SERVICES.map((service) => (
            <button
              key={service.key}
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-booking-modal", { detail: { service: service.key } }));
              }}
              className="rounded-none border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-[#c8ccd4]/70 hover:bg-[#c8ccd4]/10"
            >
              <h2 className="text-xl font-bold text-white">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{service.description}</p>
            </button>
          ))}
        </section>

        <div className="mt-8 flex justify-center">
          <MagneticButton href="/" size="card" variant="outline">
            Back Home
          </MagneticButton>
        </div>
      </div>
    </main>
  );
}
