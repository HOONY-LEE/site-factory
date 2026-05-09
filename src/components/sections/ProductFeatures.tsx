"use client";

import { FeaturesContent } from "@/types/content";
import Carousel from "@/components/ui/Carousel";

const cardThemes = [
  { gradient: "from-amber-600 via-orange-400 to-yellow-300", dots: ["#c2742e", "#1d1d1f", "#e8e1d5"], label: "Pro" },
  { gradient: "from-sky-200 via-sky-100 to-blue-50", dots: ["#d4e8f0", "#8bc4df", "#1d1d1f"], label: "" },
  { gradient: "from-violet-300 via-purple-200 to-pink-100", dots: ["#e8dff0", "#c5b0d8", "#a8d5ba", "#1d1d1f"], label: "" },
  { gradient: "from-pink-200 via-rose-100 to-orange-50", dots: ["#f0dfe4", "#1d1d1f"], label: "New" },
  { gradient: "from-gray-300 via-gray-200 to-gray-100", dots: ["#c8c8c8", "#1d1d1f"], label: "" },
  { gradient: "from-indigo-400 via-blue-300 to-cyan-200", dots: ["#8ba8e0", "#1d1d1f"], label: "" },
];

export default function ProductFeatures({
  sectionTitle,
  items,
}: FeaturesContent) {
  return (
    <section className="bg-white">
      {/* 섹션 헤더 */}
      <div className="mx-auto max-w-[980px] px-4 pt-16 pb-10">
        <div className="flex items-end justify-between">
          <h2 className="text-[32px] font-bold tracking-tight text-[#1d1d1f] sm:text-[40px]" data-field="features.sectionTitle">
            {sectionTitle || "라인업 살펴보기"}.
          </h2>
          <a href="#" className="hidden text-lg text-[#2997ff] hover:underline sm:block">
            모든 모델 비교하기 {">"}
          </a>
        </div>
      </div>

      {/* 캐러셀 */}
      <Carousel className="pb-12">
        {items.map((item, i) => {
          const theme = cardThemes[i % cardThemes.length];
          return (
            <div key={i} className="flex w-[280px] shrink-0 flex-col sm:w-[300px]">
              {/* 카드 이미지 */}
              <div
                className={`relative flex h-[340px] items-end justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} sm:h-[400px]`}
              >
                {item.image ? (
                  <img src={item.image} alt={item.title} className="mb-6 h-[60%] w-[45%] rounded-[28px] object-contain drop-shadow-lg" />
                ) : (
                  <div className="mb-6 h-[60%] w-[45%] rounded-[28px] bg-white/20 backdrop-blur-sm shadow-lg" />
                )}
                {theme.label === "New" && (
                  <span className="absolute top-4 left-4 rounded-full bg-[#bf4800] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    New
                  </span>
                )}
              </div>

              {/* 색상 닷 */}
              <div className="mt-4 flex justify-center gap-1.5">
                {theme.dots.map((color, di) => (
                  <div
                    key={di}
                    className="h-3 w-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* 이름/설명 */}
              <div className="mt-4 text-center">
                {theme.label === "New" && (
                  <span className="text-[13px] font-medium text-[#bf4800]">New</span>
                )}
                <h3 className="text-xl font-bold text-[#1d1d1f]">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-[240px] text-[14px] leading-snug text-[#6e6e73]">
                  {item.description.length > 40
                    ? item.description.substring(0, 40) + "."
                    : item.description}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <a
                  href="#"
                  className="rounded-full bg-[#2997ff] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#0077ed]"
                >
                  더 알아보기
                </a>
                <a href="#" className="text-[14px] text-[#2997ff] hover:underline">
                  구입하기 {">"}
                </a>
              </div>
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
