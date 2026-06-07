"use client";

const contactEmail = "elegantautodetailing@gmail.com";
const contactPhone = "+1 (604) 726-5855";
const googleReviewUrl = "https://www.google.com/maps";

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/#book" },
];

const services = [
  { label: "Interior Detail", key: "full-interior-detail" },
  { label: "Full Detail", key: "fbd" },
  { label: "Exterior Detail", key: "full-exterior-detail" },
];

function openModal(serviceKey?: string) {
  window.dispatchEvent(new CustomEvent("open-booking-modal", serviceKey ? { detail: { service: serviceKey } } : undefined));
}

export function SiteFooter() {
  return (
    <footer className="bg-[#101312] px-4 py-12 text-white sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr_0.85fr_0.9fr]">
          <div>
            <a href="/" className="font-display inline-flex flex-col leading-none text-[#c8ccd4]">
              <span className="text-2xl font-extrabold uppercase tracking-[0.14em]">Elegant Auto</span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-[0.48em]">Detailing</span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/62">
              Premium mobile detailing in Surrey, BC. Clean interiors, glossy exteriors, and a booking process that makes the next step simple.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => openModal()}
                className="rounded-none bg-[#c8ccd4] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#07100f]"
              >
                Book Your Detail
              </button>
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
              {footerNav.map((link) => (
                <a key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#c8ccd4]">Services</h2>
            <div className="mt-5 grid gap-3 text-sm text-white/64">
              {services.map((s) => (
                <button
                  key={s.label}
                  onClick={() => openModal(s.key)}
                  className="text-left transition hover:text-white"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-[#c8ccd4]">Contact</h2>
            <div className="mt-5 grid gap-3 text-sm text-white/64">
              <a href={`mailto:${contactEmail}`} className="break-all transition hover:text-white">
                {contactEmail}
              </a>
              <a href="tel:+16047265855" className="transition hover:text-white">
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
  );
}
