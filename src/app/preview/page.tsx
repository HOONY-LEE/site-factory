"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SiteContent } from "@/types/content";
import CorporateTemplate from "@/templates/corporate";
import StartupTemplate from "@/templates/startup";
import BrandTemplate from "@/templates/brand";
import ProductTemplate from "@/templates/product";

const templateComponents: Record<string, React.ComponentType<{ content: SiteContent }>> = {
  corporate: CorporateTemplate,
  startup: StartupTemplate,
  brand: BrandTemplate,
  product: ProductTemplate,
};

export default function PreviewPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [templateId, setTemplateId] = useState<string>("corporate");
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── 하이라이트 유틸 ── */
  const clearHighlights = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll("[data-highlight]").forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.outline = "";
      htmlEl.style.outlineOffset = "";
      htmlEl.style.borderRadius = "";
      htmlEl.style.transition = "";
      el.removeAttribute("data-highlight");
    });
  }, []);

  const highlightElement = useCallback((field: string) => {
    if (!containerRef.current) return;
    clearHighlights();

    // 1) 정확한 data-field 매칭
    let target = containerRef.current.querySelector(`[data-field="${field}"]`);

    // 2) data-section 폴백
    if (!target) {
      const section = field.split(".")[0];
      target = containerRef.current.querySelector(`[data-section="${section}"]`);
    }

    if (target) {
      const htmlEl = target as HTMLElement;
      htmlEl.style.outline = "2px solid #6366f1";
      htmlEl.style.outlineOffset = "3px";
      htmlEl.style.borderRadius = "6px";
      htmlEl.style.transition = "outline 0.2s ease";
      target.setAttribute("data-highlight", "true");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [clearHighlights]);

  /* ── 메시지 리스너 ── */
  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.type === "content-update") {
        setContent(e.data.content);
        if (e.data.templateId) setTemplateId(e.data.templateId);
      } else if (e.data?.type === "focus-field") {
        highlightElement(e.data.field);
      } else if (e.data?.type === "blur-field") {
        clearHighlights();
      }
    }
    window.addEventListener("message", handler);

    if (window.parent !== window) {
      window.parent.postMessage({ type: "preview-ready" }, "*");
    }

    return () => window.removeEventListener("message", handler);
  }, [highlightElement, clearHighlights]);

  /* ── 프리뷰 클릭 → 에디터로 필드 전달 ── */
  useEffect(() => {
    if (!containerRef.current) return;
    // 에디터 iframe에서만 동작 (부모가 있을 때)
    if (window.parent === window) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // data-field가 있는 가장 가까운 조상
      const fieldEl = target.closest("[data-field]");
      // data-section이 있는 가장 가까운 조상
      const sectionEl = target.closest("[data-section]");

      if (fieldEl) {
        e.preventDefault();
        const field = fieldEl.getAttribute("data-field")!;
        window.parent.postMessage({ type: "click-field", field }, "*");

        // 클릭한 요소 하이라이트
        clearHighlights();
        const htmlEl = fieldEl as HTMLElement;
        htmlEl.style.outline = "2px solid #6366f1";
        htmlEl.style.outlineOffset = "3px";
        htmlEl.style.borderRadius = "6px";
        htmlEl.style.transition = "outline 0.2s ease";
        fieldEl.setAttribute("data-highlight", "true");
      } else if (sectionEl) {
        e.preventDefault();
        const section = sectionEl.getAttribute("data-section")!;
        window.parent.postMessage({ type: "click-field", field: section }, "*");

        // 클릭한 섹션 하이라이트
        clearHighlights();
        const htmlEl = sectionEl as HTMLElement;
        htmlEl.style.outline = "2px solid #6366f1";
        htmlEl.style.outlineOffset = "3px";
        htmlEl.style.borderRadius = "6px";
        htmlEl.style.transition = "outline 0.2s ease";
        sectionEl.setAttribute("data-highlight", "true");
      }
    }

    const container = containerRef.current;
    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [content, clearHighlights]);

  /* ── 커서 스타일: data-field/data-section 요소에 포인터 커서 ── */
  useEffect(() => {
    if (window.parent === window) return;
    // 에디터 iframe에서만 커서 스타일 추가
    const style = document.createElement("style");
    style.textContent = `
      [data-field], [data-section] { cursor: pointer; }
      [data-field]:hover { outline: 1px dashed #a5b4fc !important; outline-offset: 2px !important; border-radius: 4px; }
      [data-section]:hover > :first-child { outline: 1px dashed #a5b4fc; outline-offset: 2px; border-radius: 4px; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400">
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 mx-auto" />
          <p className="mt-3">콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const Template = templateComponents[templateId] ?? templateComponents.corporate;
  return (
    <div ref={containerRef}>
      <Template content={content} />
    </div>
  );
}
