import { HeroContent } from "@/types/content";

export default function ProductHero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
}: HeroContent) {
  return (
    <section className="bg-[#f5f5f7] pt-11">
      {/* 프로모 배너 */}
      <div className="bg-[#f5f5f7] py-3 text-center text-sm text-[#1d1d1f]">
        <span className="text-[#6e6e73]" data-field="hero.subheadline">{subheadline} </span>
        <a href={primaryCta.href} className="text-[#2997ff] hover:underline">
          더 알아보기 {">"}
        </a>
      </div>

      {/* 메인 타이틀 */}
      <div className="mx-auto max-w-[980px] px-4 pb-8 pt-12">
        <h1 className="text-[56px] font-bold tracking-tight text-[#1d1d1f] sm:text-[72px] lg:text-[80px]" data-field="hero.headline">
          {headline}
        </h1>
      </div>
    </section>
  );
}
