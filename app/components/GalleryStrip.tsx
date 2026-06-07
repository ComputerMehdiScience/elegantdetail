"use client";

import Image from "next/image";

const images = [
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (1).png", alt: "Detailed vehicle 1" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (2).png", alt: "Detailed vehicle 2" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (3).png", alt: "Detailed vehicle 3" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_38 PM (4).png", alt: "Detailed vehicle 4" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_39 PM (5).png", alt: "Detailed vehicle 5" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_39 PM (6).png", alt: "Detailed vehicle 6" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_39 PM (7).png", alt: "Detailed vehicle 7" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_40 PM (8).png", alt: "Detailed vehicle 8" },
  { src: "/Microyescars/ChatGPT Image Jun 6, 2026, 07_22_40 PM (9).png", alt: "Detailed vehicle 9" },
  { src: "/Microyescars/Bmw i8 fully serviced inside out out.jpg", alt: "BMW i8 fully detailed" },
];

// 4 copies — the animation moves exactly -25% (one full set), so it loops invisibly
const loop = [...images, ...images, ...images, ...images];

function ImageTile({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: 300, height: 300 }}>
      <Image
        src={encodeURI(src)}
        alt={alt}
        fill
        priority={priority}
        sizes="300px"
        className="object-cover transition duration-700 hover:scale-105"
      />
    </div>
  );
}

export function GalleryStrip() {
  return (
    <div className="relative w-full border-y-2 border-[#d7dce3]" style={{ boxShadow: "0 -3px 16px 2px rgba(226,231,238,0.65), 0 3px 16px 2px rgba(226,231,238,0.65)" }}>
      <div
        className="gallery-marquee overflow-hidden py-2"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        {/* 4 copies — animate to -25% for seamless loop */}
        <div
          className="flex w-max gap-1.5"
          style={{ animation: "gallery-scroll-quad 60s linear infinite" }}
        >
          {loop.map((img, i) => (
            <ImageTile key={i} src={img.src} alt={img.alt} priority={i < 10} />
          ))}
        </div>
      </div>
    </div>
  );
}
