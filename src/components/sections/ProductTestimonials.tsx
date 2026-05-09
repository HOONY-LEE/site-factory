import { TestimonialsContent } from "@/types/content";

/* ── 보다 자세히 들여다보기 + 후기 ── */
export default function ProductTestimonials({
  sectionTitle,
  items,
}: TestimonialsContent) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[980px] px-4">
        <h2 className="pb-10 text-[32px] font-bold tracking-tight text-[#1d1d1f] sm:text-[40px]" data-field="testimonials.sectionTitle">
          {sectionTitle}.
        </h2>
      </div>

      {/* 가이드 동영상 스타일 배너 */}
      <div className="mx-auto mb-16 max-w-[980px] px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600">
          <div className="flex flex-col items-start justify-center p-10 sm:p-14 lg:max-w-[50%]">
            <p className="text-[15px] text-white/80">
              {items[0]?.company ?? "ZENITH"} 가이드 동영상
            </p>
            <h3 className="mt-2 text-[22px] font-bold leading-tight text-white sm:text-[28px]">
              {items[0]?.name ?? "시작하기"} 및
              <br />
              활용 가이드
            </h3>
            <button className="mt-6 rounded-full border-2 border-white/60 px-5 py-2 text-[14px] font-medium text-white transition-colors hover:bg-white/10">
              동영상 보기
            </button>
          </div>
          {/* 장식 요소 */}
          <div className="absolute -right-10 bottom-0 top-0 hidden w-[50%] items-center justify-center lg:flex">
            <div className="h-[70%] w-[60%] rounded-3xl bg-white/15" />
          </div>
        </div>
      </div>

      {/* 후기 카드 */}
      <div className="mx-auto max-w-[980px] px-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#f5f5f7] p-7"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                <span className="text-sm font-bold text-white">{item.name[0]}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#1d1d1f]">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-[#1d1d1f]">{item.name}</p>
                <p className="text-xs text-[#6e6e73]">
                  {item.role} · {item.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
