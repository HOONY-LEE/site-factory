import { CtaContent } from "@/types/content";

/* ── 필수품/액세서리 스타일 CTA ── */
export default function ProductCta({
  headline,
  description,
  buttonLabel,
  buttonHref,
}: CtaContent) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[980px] px-4">
        <h2 className="text-[32px] font-bold tracking-tight text-[#1d1d1f] sm:text-[40px]" data-field="cta.headline">
          {headline}.
        </h2>

        {/* 액세서리 스타일 카드 */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl bg-[#f5f5f7] p-8 sm:min-h-[320px]">
            <div>
              <p className="text-[15px] leading-relaxed text-[#6e6e73]" data-field="cta.description">{description}</p>
            </div>
            <a
              href={buttonHref}
              className="mt-6 inline-flex w-fit items-center gap-1 rounded-full bg-[#2997ff] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#0077ed]"
            >
              {buttonLabel}
            </a>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-[#1d1d1f] p-8 sm:min-h-[320px]">
            <div>
              <p className="text-xs font-semibold text-[#a1a1a6] uppercase tracking-wide">무료 배송</p>
              <p className="mt-2 text-[22px] font-bold text-white leading-snug">
                온라인 주문 시<br />무료 배송.
              </p>
            </div>
            <a
              href="#"
              className="mt-6 text-[14px] text-[#2997ff] hover:underline"
            >
              배송 안내 더 알아보기 {">"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
