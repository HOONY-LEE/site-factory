import Container from "@/components/ui/Container";
import { FeaturesContent } from "@/types/content";
import {
  Rocket, Shield, BarChart3, Globe, Zap, Heart,
  Star, Settings, Users, Clock, CheckCircle, Lock,
  Link, Target, Layers, TrendingUp, Eye, Cpu,
  Database, Cloud, Sparkles, MessageSquare,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  shield: Shield,
  chart: BarChart3,
  globe: Globe,
  lightning: Zap,
  zap: Zap,
  heart: Heart,
  star: Star,
  gear: Settings,
  users: Users,
  clock: Clock,
  check: CheckCircle,
  lock: Lock,
  link: Link,
  target: Target,
  layers: Layers,
  trending: TrendingUp,
  eye: Eye,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  sparkles: Sparkles,
  message: MessageSquare,
};

export default function Features({ sectionTitle, sectionSubtitle, items }: FeaturesContent) {
  return (
    <section id="features" className="py-24 sm:py-32">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" data-field="features.sectionTitle">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="mt-4 text-lg text-gray-600" data-field="features.sectionSubtitle">{sectionSubtitle}</p>
          )}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {feature.image && (
                  <div className="flex h-40 items-center justify-center bg-gray-50">
                    <img src={feature.image} alt={feature.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {Icon ? <Icon size={24} /> : <Sparkles size={24} />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
