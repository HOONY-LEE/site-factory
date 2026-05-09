import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { HeroContent } from "@/types/content";
import { Zap } from "lucide-react";

export default function StartupHero({ headline, subheadline, primaryCta, secondaryCta }: HeroContent) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-900 py-32 sm:py-40">
      <Container className="relative z-10 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
          <Zap size={14} className="text-indigo-400" />
          새로운 방식의 업무 관리
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl" data-field="hero.headline">
          <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            {headline}
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-400" data-field="hero.subheadline">
          {subheadline}
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              {secondaryCta.label}
            </Button>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-500">무료 체험 · 신용카드 불필요</p>
      </Container>

      <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-600/15 blur-3xl" />
    </section>
  );
}
