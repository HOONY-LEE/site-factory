import Container from "@/components/ui/Container";
import { ServicesContent } from "@/types/content";

export default function Services({ sectionTitle, sectionSubtitle, items }: ServicesContent) {
  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" data-field="services.sectionTitle">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="mt-4 text-lg text-gray-600" data-field="services.sectionSubtitle">{sectionSubtitle}</p>
          )}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {items.map((service, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-xl font-bold text-blue-600">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
              <p className="mt-3 text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
