import { HeroContent } from "@/types/content";

export default function BrandHero({ headline, subheadline, backgroundImage }: HeroContent) {
  return (
    <section className="bg-white pb-16 pt-12">
      <div className="mx-auto max-w-[980px] px-5">
        {/* Small subtitle */}
        <p
          className="mb-3 text-[15px] font-medium text-[#272a30]/60"
          data-field="hero.subheadline"
        >
          {subheadline}
        </p>

        {/* Large headline */}
        <h1
          className="max-w-[700px] whitespace-pre-line text-[40px] font-bold leading-[1.25] tracking-[-0.02em] text-[#272a30] sm:text-[56px]"
          data-field="hero.headline"
        >
          {headline}
        </h1>
      </div>

      {/* Hero image */}
      {backgroundImage && (
        <div className="mx-auto mt-10 max-w-[980px] overflow-hidden rounded-2xl px-5">
          <img
            src={backgroundImage}
            alt=""
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      )}
    </section>
  );
}
