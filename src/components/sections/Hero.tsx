import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { HeroContent } from "@/types/content";

export default function Hero({ headline, subheadline, primaryCta, secondaryCta }: HeroContent) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 sm:py-32">
      <Container className="text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl" data-field="hero.headline">
          {headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600" data-field="hero.subheadline">
          {subheadline}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="outline" size="lg">
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </Container>

      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-100 opacity-40 blur-3xl" />
    </section>
  );
}
