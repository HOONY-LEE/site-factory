import { AboutContent } from "@/types/content";

/* "Why We're Here" — narrative mission section, matching Banksalad style */
export default function BrandStats({ sectionTitle, description }: AboutContent) {
  /* Split description into paragraphs; first sentence bold, rest faded */
  const paragraphs = description.split("\n").filter(Boolean);

  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[980px] px-5">
        {/* Green section label */}
        <p className="mb-5 text-[15px] font-bold italic text-[#06a96c]">
          Why We&apos;re Here
        </p>

        {/* Large headline */}
        <h2
          className="max-w-[700px] text-[28px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30] sm:text-[36px]"
          data-field="about.sectionTitle"
        >
          {sectionTitle}
        </h2>

        {/* Body paragraphs */}
        <div className="mt-10 max-w-[860px] space-y-7" data-field="about.description">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-[16px] leading-[1.8] sm:text-[17px] ${
                i === paragraphs.length - 1
                  ? "font-semibold text-[#272a30]"
                  : "text-[#9fa5b0]"
              }`}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-gray-200" />
      </div>
    </section>
  );
}
