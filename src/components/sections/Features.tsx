import Container from "@/components/ui/Container";
import { FeaturesContent } from "@/types/content";

const iconMap: Record<string, string> = {
  rocket: "🚀",
  shield: "🛡️",
  chart: "📊",
  globe: "🌍",
  lightning: "⚡",
  heart: "❤️",
  star: "⭐",
  gear: "⚙️",
  users: "👥",
  clock: "🕐",
  check: "✅",
  lock: "🔒",
};

export default function Features({ sectionTitle, sectionSubtitle, items }: FeaturesContent) {
  return (
    <section id="features" className="py-24 sm:py-32">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="mt-4 text-lg text-gray-600">{sectionSubtitle}</p>
          )}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-4xl">
                {iconMap[feature.icon] || feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
