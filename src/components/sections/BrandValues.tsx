import { FeaturesContent } from "@/types/content";

/* "Who We Are" — 2-column text layout matching Banksalad style */
export default function BrandValues({ sectionTitle, items }: FeaturesContent) {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[980px] px-5">
        {/* Green section label */}
        <p className="mb-5 text-[15px] font-bold italic text-[#06a96c]">
          Who We Are
        </p>

        {/* 2-column layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left: Large headline */}
          <h2
            className="text-[28px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30] sm:text-[36px]"
            data-field="features.sectionTitle"
          >
            {sectionTitle}
          </h2>

          {/* Right: Description paragraphs from items */}
          <div className="space-y-7">
            {items.map((item, i) => (
              <p
                key={i}
                className="text-[15px] leading-[1.8] text-[#9fa5b0] sm:text-[16px]"
              >
                {item.description}
              </p>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-gray-200" />
      </div>
    </section>
  );
}
