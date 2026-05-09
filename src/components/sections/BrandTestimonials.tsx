import { TestimonialsContent } from "@/types/content";

/* "Where We Are Going" — centered text section matching Banksalad style */
export default function BrandTestimonials({ sectionTitle, items }: TestimonialsContent) {
  return (
    <section id="testimonials" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[980px] px-5 text-center">
        {/* Green section label */}
        <p className="mb-5 text-[15px] font-bold italic text-[#06a96c]">
          Where We Are Going
        </p>

        {/* Centered headline */}
        <h2
          className="mx-auto max-w-[700px] text-[28px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30] sm:text-[36px]"
          data-field="testimonials.sectionTitle"
        >
          {sectionTitle}
        </h2>

        {/* Centered description paragraphs from quotes */}
        <div className="mx-auto mt-10 max-w-[700px] space-y-5">
          {items.map((item, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.8] text-[#9fa5b0] sm:text-[16px]"
            >
              {item.quote}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
