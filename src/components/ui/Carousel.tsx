"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
  className?: string;
}

export default function Carousel({ children, className = "" }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateButtons() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      ro.disconnect();
    };
  }, []);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > *");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }

  /* shift+wheel → 가로 스크롤 (또는 트랙패드 가로 스와이프 자연 지원) */
  function handleWheel(e: React.WheelEvent) {
    const el = scrollRef.current;
    if (!el) return;
    // 가로 스크롤이 있으면 세로 스크롤 방지
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // 트랙패드 가로 스와이프 — 기본 동작 허용
      return;
    }
    if (e.shiftKey && e.deltaY !== 0) {
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-5 overflow-x-auto px-4 pb-2 sm:px-[calc((100%-980px)/2+16px)]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>

      {/* 좌우 버튼 */}
      <div className="mx-auto mt-6 flex max-w-[980px] items-center justify-end gap-3 px-4 sm:px-6">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="이전"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            canScrollLeft
              ? "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              : "border-gray-200 text-gray-300 cursor-default"
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="다음"
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            canScrollRight
              ? "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              : "border-gray-200 text-gray-300 cursor-default"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
