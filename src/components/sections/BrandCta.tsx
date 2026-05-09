"use client";

import { CtaContent } from "@/types/content";
import Carousel from "@/components/ui/Carousel";

/* Photo gallery + CTA section matching Banksalad style */
export default function BrandCta({ headline, description, buttonLabel, buttonHref }: CtaContent) {
  /* Placeholder gallery images — users can replace via editor */
  const galleryImages = [
    { src: "/images/defaults/feature-placeholder.svg", alt: "Office 1" },
    { src: "/images/defaults/feature-placeholder.svg", alt: "Office 2" },
    { src: "/images/defaults/feature-placeholder.svg", alt: "Office 3" },
    { src: "/images/defaults/feature-placeholder.svg", alt: "Office 4" },
    { src: "/images/defaults/feature-placeholder.svg", alt: "Office 5" },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      {/* Photo gallery */}
      <Carousel className="mb-20">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="h-[240px] w-[320px] shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-[300px] sm:w-[400px]"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* CTA text */}
      <div className="mx-auto max-w-[980px] px-5 text-center">
        <h2
          className="mx-auto max-w-[700px] text-[28px] font-bold leading-[1.3] tracking-[-0.01em] text-[#272a30] sm:text-[36px]"
          data-field="cta.headline"
        >
          {headline}
        </h2>
        <p
          className="mx-auto mt-4 max-w-[500px] text-[15px] leading-[1.7] text-[#9fa5b0] sm:text-[16px]"
          data-field="cta.description"
        >
          {description}
        </p>
        <a
          href={buttonHref}
          className="mt-8 inline-flex items-center rounded-full bg-[#06a96c] px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#058a58]"
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  );
}
