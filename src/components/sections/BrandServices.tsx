import { ServicesContent } from "@/types/content";

/* "What We Do" — 2-column text layout matching Banksalad style */
export default function BrandServices({ sectionTitle, sectionSubtitle, items }: ServicesContent) {
  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[980px] px-5">
        {/* Green section label */}
        <p className="mb-5 text-[15px] font-bold italic text-[#06a96c]">
          What We Do
        </p>

        {/* 2-column layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left: Large headline */}
          <div>
            <h2
              className="text-[28px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30] sm:text-[36px]"
              data-field="services.sectionTitle"
            >
              {sectionTitle}
            </h2>
          </div>

          {/* Right: Description text */}
          <div className="space-y-7">
            {sectionSubtitle && (
              <p
                className="text-[15px] leading-[1.8] text-[#9fa5b0] sm:text-[16px]"
                data-field="services.sectionSubtitle"
              >
                {sectionSubtitle}
              </p>
            )}
            {items.map((item, i) => (
              <div key={i}>
                <p className="text-[15px] leading-[1.8] text-[#9fa5b0] sm:text-[16px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-gray-200" />
      </div>
    </section>
  );
}
