"use client";

import { ServicesContent } from "@/types/content";
import { Plus } from "lucide-react";
import Carousel from "@/components/ui/Carousel";

const featureCardColors = [
  { bg: "from-amber-700 to-orange-900", accent: "text-amber-200" },
  { bg: "from-gray-700 to-gray-900", accent: "text-gray-300" },
  { bg: "from-gray-600 to-gray-800", accent: "text-gray-300" },
  { bg: "from-indigo-700 to-purple-900", accent: "text-indigo-200" },
];

const categoryLabels = ["혁신", "첨단 기술", "성능", "생태계"];

export default function ProductServices({
  sectionTitle,
  items,
}: ServicesContent) {
  return (
    <section className="bg-white py-16">
      {/* 섹션 타이틀 */}
      <div className="mx-auto max-w-[980px] px-4 pb-10">
        <h2 className="text-[32px] font-bold tracking-tight text-[#1d1d1f] sm:text-[40px]" data-field="services.sectionTitle">
          {sectionTitle ? `${sectionTitle}.` : "알면 알수록."}
        </h2>
      </div>

      {/* 다크 카드 캐러셀 */}
      <Carousel className="pb-4">
        {items.slice(0, 4).map((item, i) => {
          const theme = featureCardColors[i % featureCardColors.length];
          const cat = categoryLabels[i % categoryLabels.length];
          return (
            <div
              key={i}
              className={`group relative flex w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-b ${theme.bg} p-7 sm:w-[300px] sm:min-h-[460px]`}
            >
              <div>
                <span className={`text-xs font-semibold ${theme.accent}`}>{cat}</span>
                <h3 className="mt-1.5 text-xl font-bold leading-snug text-white sm:text-[22px]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[15px] leading-snug text-white/70">
                  {item.description.length > 30
                    ? item.description.substring(0, 30) + "."
                    : item.description}
                </p>
              </div>

              <div className="mt-8 flex flex-1 items-end justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="h-[180px] w-[70%] rounded-2xl object-contain sm:h-[220px]" />
                ) : (
                  <div className="h-[180px] w-[70%] rounded-2xl bg-white/10 sm:h-[220px]" />
                )}
              </div>

              <button className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                <Plus size={16} />
              </button>
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
