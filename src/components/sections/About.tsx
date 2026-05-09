import Container from "@/components/ui/Container";
import { AboutContent } from "@/types/content";

export default function About({ sectionTitle, description, stats }: AboutContent) {
  return (
    <section id="about" className="bg-gray-50 py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" data-field="about.sectionTitle">
            {sectionTitle}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 whitespace-pre-line" data-field="about.description">
            {description}
          </p>
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
