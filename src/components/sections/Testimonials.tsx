import Container from "@/components/ui/Container";
import { TestimonialsContent } from "@/types/content";

export default function Testimonials({ sectionTitle, items }: TestimonialsContent) {
  return (
    <section id="testimonials" className="bg-gray-50 py-24 sm:py-32">
      <Container>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {sectionTitle}
        </h2>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100"
            >
              <p className="text-gray-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
