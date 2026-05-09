"use client";

import { AboutContent } from "@/types/content";
import { Plus } from "lucide-react";
import Carousel from "@/components/ui/Carousel";

/* ── Apple "iPhone, Apple에서 사면 가장 좋은 이유" 스타일 ── */
export default function ProductStats({
  sectionTitle,
  description,
  stats,
}: AboutContent) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[980px] px-4">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between pb-10">
          <h2 className="max-w-lg text-[32px] font-bold leading-tight tracking-tight text-[#1d1d1f] sm:text-[40px]" data-field="about.sectionTitle">
            {sectionTitle}.
          </h2>
          <a href="#" className="hidden text-lg text-[#2997ff] hover:underline sm:block">
            더 알아보기 {">"}
          </a>
        </div>
      </div>

      {/* 혜택 카드 캐러셀 */}
      {stats && stats.length > 0 && (
        <Carousel className="pb-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex w-[280px] shrink-0 flex-col justify-between rounded-2xl bg-[#f5f5f7] p-7 sm:w-[300px] sm:min-h-[380px]"
            >
              <div>
                <p className="text-xs font-semibold text-[#6e6e73]">{stat.label}</p>
                <p className="mt-2 text-[22px] font-bold leading-snug text-[#1d1d1f] sm:text-[26px]">
                  {stat.value}.
                </p>
                {i === 0 && description && (
                  <p className="mt-4 text-[13px] leading-relaxed text-[#6e6e73]">
                    {description.split("\n")[0]?.substring(0, 80)}...
                  </p>
                )}
              </div>

              {/* 이미지 영역 */}
              <div className="mt-6 flex flex-1 items-end justify-center">
                {stat.image ? (
                  <img src={stat.image} alt={stat.label} className="h-[120px] w-[80%] rounded-xl object-contain sm:h-[150px]" />
                ) : (
                  <div className="h-[120px] w-[80%] rounded-xl bg-gray-200/60 sm:h-[150px]" />
                )}
              </div>

              <button className="mt-4 flex h-8 w-8 self-end items-center justify-center rounded-full bg-gray-300/50 text-gray-500 transition-colors hover:bg-gray-300/80">
                <Plus size={16} />
              </button>
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}
