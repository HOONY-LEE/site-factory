"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getTemplate } from "@/lib/templates";
import { getSite, saveSite, generateId, toSlug, type SavedSite } from "@/lib/sites";
import { SiteContent } from "@/types/content";
import {
  FileText, PanelTop, Target, Sparkles, BookOpen,
  Briefcase, MessageSquare, Megaphone, MapPin,
  ImagePlus, X, Globe, Rocket, ExternalLink, Check, Loader2, Link2,
  Download,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

const SECTIONS: readonly { key: string; label: string; Icon: LucideIcon }[] = [
  { key: "meta", label: "기본정보", Icon: FileText },
  { key: "header", label: "헤더", Icon: PanelTop },
  { key: "hero", label: "히어로", Icon: Target },
  { key: "features", label: "특징", Icon: Sparkles },
  { key: "about", label: "소개", Icon: BookOpen },
  { key: "services", label: "서비스", Icon: Briefcase },
  { key: "testimonials", label: "고객후기", Icon: MessageSquare },
  { key: "cta", label: "CTA", Icon: Megaphone },
  { key: "footer", label: "푸터", Icon: MapPin },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

function TextField({ label, value, onChange, multiline, fieldPath, onFieldFocus, onFieldBlur }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  fieldPath?: string;
  onFieldFocus?: (field: string) => void;
  onFieldBlur?: () => void;
}) {
  const cls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
  function handleFocus() { if (fieldPath && onFieldFocus) onFieldFocus(fieldPath); }
  function handleBlur() { if (onFieldBlur) onFieldBlur(); }
  return (
    <label className="block" data-editor-field={fieldPath}>
      <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
      {multiline ? (
        <textarea className={cls + " min-h-[80px] resize-y"} value={value} onChange={(e) => onChange(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
      )}
    </label>
  );
}

function ImageField({ label, value, onChange }: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하만 가능합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-gray-500">{label}</span>
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt={label}
            className="h-28 w-full rounded-lg border border-gray-200 object-cover bg-gray-50"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-white/90 p-1.5 text-gray-700 hover:bg-white"
              title="변경"
            >
              <ImagePlus size={14} />
            </button>
            <button
              onClick={() => onChange("")}
              className="rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-white"
              title="삭제"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-500"
        >
          <div className="flex flex-col items-center gap-1">
            <ImagePlus size={20} />
            <span className="text-[11px]">이미지 업로드</span>
          </div>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ArraySection<T extends Record<string, any>>({ label, items, onUpdate, renderItem, createItem }: {
  label: string;
  items: T[];
  onUpdate: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (field: keyof T, value: T[keyof T]) => void) => React.ReactNode;
  createItem: () => T;
}) {
  function updateItem(index: number, field: keyof T, value: T[keyof T]) {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onUpdate(next);
  }
  function addItem() {
    onUpdate([...items, createItem()]);
  }
  function removeItem(index: number) {
    onUpdate(items.filter((_, i) => i !== index));
  }
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <button onClick={addItem} className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100">
          + 추가
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="relative rounded-lg border border-gray-100 bg-gray-50/50 p-3">
            <button
              onClick={() => removeItem(i)}
              className="absolute top-2 right-2 text-xs text-gray-300 hover:text-red-400"
            >
              ✕
            </button>
            {renderItem(item, i, (field, value) => updateItem(i, field, value))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const templateId = params.templateId as string;
  const siteId = searchParams.get("site");

  const template = getTemplate(templateId);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [siteName, setSiteName] = useState("");
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(siteId);
  const [activeSection, setActiveSection] = useState<SectionKey>("meta");
  const [saved, setSaved] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [showDeployPanel, setShowDeployPanel] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [exporting, setExporting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewReady = useRef(false);

  useEffect(() => {
    if (!template) return;
    if (siteId) {
      const existing = getSite(siteId);
      if (existing) {
        setContent(existing.content);
        setSiteName(existing.name);
        setCurrentSiteId(existing.id);
        return;
      }
    }
    setContent(structuredClone(template.defaultContent));
    setSiteName("");
  }, [template, siteId]);

  /* ── 에디터→프리뷰: 콘텐츠 전송 ── */
  const sendToPreview = useCallback(() => {
    if (!content) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "content-update", content, templateId },
      "*"
    );
  }, [content, templateId]);

  /* ── 에디터→프리뷰: 필드 포커스/블러 ── */
  const focusField = useCallback((field: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "focus-field", field },
      "*"
    );
  }, []);

  const blurField = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "blur-field" },
      "*"
    );
  }, []);

  /* ── 메시지 리스너: preview-ready + click-field ── */
  useEffect(() => {
    function handler(e: MessageEvent) {
      if (e.data?.type === "preview-ready") {
        previewReady.current = true;
        sendToPreview();
      } else if (e.data?.type === "click-field") {
        const field = e.data.field as string;
        const section = field.split(".")[0];

        // 섹션 탭 매핑
        const sectionMap: Record<string, string> = {
          header: "header", hero: "hero", features: "features",
          about: "about", services: "services", testimonials: "testimonials",
          cta: "cta", footer: "footer",
        };
        const tabKey = sectionMap[section];
        if (tabKey) {
          setActiveSection(tabKey);

          // 탭 전환 후 인풋 포커스
          setTimeout(() => {
            const el = document.querySelector(`[data-editor-field="${field}"]`);
            if (el) {
              const input = el.querySelector("input, textarea") as HTMLElement;
              if (input) {
                input.focus();
                input.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }
          }, 100);
        }
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  });

  useEffect(() => {
    if (previewReady.current) sendToPreview();
  }, [sendToPreview]);

  function update<K extends keyof SiteContent>(section: K, partial: Partial<SiteContent[K]>) {
    setContent((prev) => prev ? { ...prev, [section]: { ...prev[section], ...partial } } : prev);
    setSaved(false);
  }

  /** localStorage에 저장하고 사이트 정보를 반환 */
  function doSave(): SavedSite | null {
    if (!content) return null;
    const name = siteName.trim() || "새 프로젝트";
    const id = currentSiteId || generateId();
    const slug = toSlug(name);
    const now = new Date().toISOString();
    const site: SavedSite = {
      id,
      name,
      slug,
      templateId,
      content,
      createdAt: currentSiteId ? (getSite(id)?.createdAt ?? now) : now,
      updatedAt: now,
    };
    saveSite(site);
    setCurrentSiteId(id);
    setSiteName(name);
    return site;
  }

  function handleSave() {
    const site = doSave();
    if (!site) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDeploy() {
    if (!content) return;

    // 먼저 localStorage에 저장 (동기적으로 site 정보 받기)
    const site = doSave();
    if (!site) return;

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setDeploying(true);

    try {
      const res = await fetch("/api/sites/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: site.slug,
          name: site.name,
          templateId,
          content,
          customDomain: customDomain || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeployed(true);
        setDeployedUrl(data.url);

        // localStorage에도 배포 상태 업데이트
        saveSite({
          ...site,
          deployed: true,
          deployedAt: data.deployedAt,
          deployedUrl: data.url,
          customDomain: customDomain || undefined,
        });

        setTimeout(() => setDeployed(false), 4000);
      } else {
        alert("배포에 실패했습니다: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("Deploy failed:", err);
      alert("배포 중 오류가 발생했습니다.");
    } finally {
      setDeploying(false);
    }
  }

  async function handleExport() {
    if (!content) return;
    setExporting(true);
    try {
      const res = await fetch("/api/sites/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          content,
          name: siteName.trim() || "site",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert("내보내기 실패: " + (data.error || "알 수 없는 오류"));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        (siteName.trim() || "site").replace(/[^a-zA-Z0-9가-힣\s\-_]/g, "").replace(/\s+/g, "-") +
        ".zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("내보내기 중 오류가 발생했습니다.");
    } finally {
      setExporting(false);
    }
  }

  if (!template || !content) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        템플릿을 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            SF
          </Link>
          <span className="text-sm text-gray-300">/</span>
          <div className="flex items-center gap-1.5">
            <input
              value={siteName}
              onChange={(e) => { setSiteName(e.target.value); setSaved(false); }}
              placeholder="프로젝트 이름"
              className="w-[200px] border-none bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-300"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {deployedUrl && (
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-700 hover:bg-green-100"
            >
              <ExternalLink size={13} />
              사이트 보기
            </a>
          )}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            title="코드 내보내기 (ZIP)"
          >
            {exporting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            내보내기
          </button>
          <button
            onClick={handleSave}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors ${
              saved ? "bg-green-500" : "bg-gray-700 hover:bg-gray-800"
            }`}
          >
            {saved ? "저장됨 ✓" : "저장"}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDeployPanel(!showDeployPanel)}
              disabled={deploying}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-all ${
                deployed
                  ? "bg-green-500"
                  : deploying
                  ? "bg-indigo-400 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {deploying ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  배포 중...
                </>
              ) : deployed ? (
                <>
                  <Check size={14} />
                  배포 완료!
                </>
              ) : (
                <>
                  <Rocket size={14} />
                  배포하기
                </>
              )}
            </button>

            {/* Deploy dropdown panel */}
            {showDeployPanel && !deploying && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[360px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">사이트 배포</h3>
                  <button
                    onClick={() => setShowDeployPanel(false)}
                    className="rounded-md p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Site URL preview */}
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <label className="mb-1 block text-xs font-medium text-gray-500">배포 URL</label>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Globe size={14} className="shrink-0 text-gray-400" />
                    <span className="truncate">
                      {typeof window !== "undefined" ? window.location.origin : ""}/s/
                      <span className="font-medium text-indigo-600">
                        {toSlug(siteName || content.meta.title) || "my-site"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Custom domain input */}
                <div className="mb-4">
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Link2 size={12} />
                    커스텀 도메인 (선택사항)
                  </label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="www.example.com"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  {customDomain && (
                    <div className="mt-2 rounded-lg bg-amber-50 p-2.5">
                      <p className="text-xs text-amber-700">
                        <span className="font-semibold">DNS 설정 필요:</span> 도메인의 CNAME 레코드를{" "}
                        <code className="rounded bg-amber-100 px-1 py-0.5 text-[11px]">
                          {typeof window !== "undefined" ? window.location.hostname : "your-domain"}
                        </code>
                        {" "}으로 설정해주세요.
                      </p>
                    </div>
                  )}
                </div>

                {/* Deploy button */}
                <button
                  onClick={() => {
                    setShowDeployPanel(false);
                    handleDeploy();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  <Rocket size={14} />
                  지금 배포하기
                </button>

                {deployedUrl && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-2.5 text-xs text-green-700">
                    <Check size={13} />
                    <span>마지막 배포: {new Date().toLocaleString("ko-KR")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section Tabs - Left Sidebar */}
        <nav className="flex w-14 flex-col gap-1 border-r border-gray-200 bg-white p-2">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              title={s.label}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                activeSection === s.key
                  ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
            >
              <s.Icon size={18} />
            </button>
          ))}
        </nav>

        {/* Form Panel */}
        <div className="w-[380px] overflow-y-auto border-r border-gray-200 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            {(() => { const sec = SECTIONS.find((s) => s.key === activeSection); return sec ? <sec.Icon size={16} className="text-indigo-500" /> : null; })()}
            {SECTIONS.find((s) => s.key === activeSection)?.label}
          </h2>
          <div className="space-y-4">
            {activeSection === "meta" && (
              <>
                <TextField label="사이트 제목" value={content.meta.title} onChange={(v) => update("meta", { title: v })} fieldPath="meta.title" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="사이트 설명" value={content.meta.description} onChange={(v) => update("meta", { description: v })} multiline fieldPath="meta.description" onFieldFocus={focusField} onFieldBlur={blurField} />
              </>
            )}

            {activeSection === "header" && (
              <>
                <TextField label="로고 텍스트" value={content.header.logo} onChange={(v) => update("header", { logo: v })} fieldPath="header.logo" onFieldFocus={focusField} onFieldBlur={blurField} />
                <ArraySection
                  label="네비게이션 링크"
                  items={content.header.nav}
                  onUpdate={(nav) => update("header", { nav })}
                  createItem={() => ({ label: "", href: "#" })}
                  renderItem={(item, _i, upd) => (
                    <div className="grid grid-cols-2 gap-2">
                      <TextField label="이름" value={item.label} onChange={(v) => upd("label", v)} fieldPath="header.nav" onFieldFocus={focusField} onFieldBlur={blurField} />
                      <TextField label="URL" value={item.href} onChange={(v) => upd("href", v)} fieldPath="header.nav" onFieldFocus={focusField} onFieldBlur={blurField} />
                    </div>
                  )}
                />
              </>
            )}

            {activeSection === "hero" && (
              <>
                <TextField label="헤드라인" value={content.hero.headline} onChange={(v) => update("hero", { headline: v })} fieldPath="hero.headline" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="서브 헤드라인" value={content.hero.subheadline} onChange={(v) => update("hero", { subheadline: v })} multiline fieldPath="hero.subheadline" onFieldFocus={focusField} onFieldBlur={blurField} />
                <div className="rounded-lg bg-gray-50 p-3">
                  <span className="mb-2 block text-xs font-medium text-gray-500">메인 버튼</span>
                  <div className="grid grid-cols-2 gap-2">
                    <TextField label="텍스트" value={content.hero.primaryCta.label} onChange={(v) => update("hero", { primaryCta: { ...content.hero.primaryCta, label: v } })} fieldPath="hero.primaryCta" onFieldFocus={focusField} onFieldBlur={blurField} />
                    <TextField label="URL" value={content.hero.primaryCta.href} onChange={(v) => update("hero", { primaryCta: { ...content.hero.primaryCta, href: v } })} fieldPath="hero.primaryCta" onFieldFocus={focusField} onFieldBlur={blurField} />
                  </div>
                </div>
                {content.hero.secondaryCta && (
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="mb-2 block text-xs font-medium text-gray-500">보조 버튼</span>
                    <div className="grid grid-cols-2 gap-2">
                      <TextField label="텍스트" value={content.hero.secondaryCta.label} onChange={(v) => update("hero", { secondaryCta: { ...content.hero.secondaryCta!, label: v } })} fieldPath="hero.secondaryCta" onFieldFocus={focusField} onFieldBlur={blurField} />
                      <TextField label="URL" value={content.hero.secondaryCta.href} onChange={(v) => update("hero", { secondaryCta: { ...content.hero.secondaryCta!, href: v } })} fieldPath="hero.secondaryCta" onFieldFocus={focusField} onFieldBlur={blurField} />
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSection === "features" && (
              <>
                <TextField label="섹션 제목" value={content.features.sectionTitle} onChange={(v) => update("features", { sectionTitle: v })} fieldPath="features.sectionTitle" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="섹션 부제목" value={content.features.sectionSubtitle ?? ""} onChange={(v) => update("features", { sectionSubtitle: v })} fieldPath="features.sectionSubtitle" onFieldFocus={focusField} onFieldBlur={blurField} />
                <ArraySection
                  label="특징 목록"
                  items={content.features.items}
                  onUpdate={(items) => update("features", { items })}
                  createItem={() => ({ icon: "rocket", title: "", description: "", image: "" })}
                  renderItem={(item, _i, upd) => (
                    <div className="space-y-2">
                      <ImageField label="이미지" value={item.image} onChange={(v) => upd("image", v)} />
                      <div className="grid grid-cols-3 gap-2">
                        <TextField label="아이콘" value={item.icon} onChange={(v) => upd("icon", v)} fieldPath="features.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                        <div className="col-span-2">
                          <TextField label="제목" value={item.title} onChange={(v) => upd("title", v)} fieldPath="features.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                        </div>
                      </div>
                      <TextField label="설명" value={item.description} onChange={(v) => upd("description", v)} multiline fieldPath="features.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                    </div>
                  )}
                />
              </>
            )}

            {activeSection === "about" && (
              <>
                <TextField label="섹션 제목" value={content.about.sectionTitle} onChange={(v) => update("about", { sectionTitle: v })} fieldPath="about.sectionTitle" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="설명" value={content.about.description} onChange={(v) => update("about", { description: v })} multiline fieldPath="about.description" onFieldFocus={focusField} onFieldBlur={blurField} />
                <ArraySection
                  label="통계"
                  items={content.about.stats ?? []}
                  onUpdate={(stats) => update("about", { stats })}
                  createItem={() => ({ label: "", value: "" })}
                  renderItem={(item, _i, upd) => (
                    <div className="grid grid-cols-2 gap-2">
                      <TextField label="값" value={item.value} onChange={(v) => upd("value", v)} fieldPath="about.stats" onFieldFocus={focusField} onFieldBlur={blurField} />
                      <TextField label="라벨" value={item.label} onChange={(v) => upd("label", v)} fieldPath="about.stats" onFieldFocus={focusField} onFieldBlur={blurField} />
                    </div>
                  )}
                />
              </>
            )}

            {activeSection === "services" && (
              <>
                <TextField label="섹션 제목" value={content.services.sectionTitle} onChange={(v) => update("services", { sectionTitle: v })} fieldPath="services.sectionTitle" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="섹션 부제목" value={content.services.sectionSubtitle ?? ""} onChange={(v) => update("services", { sectionSubtitle: v })} fieldPath="services.sectionSubtitle" onFieldFocus={focusField} onFieldBlur={blurField} />
                <ArraySection
                  label="서비스 목록"
                  items={content.services.items}
                  onUpdate={(items) => update("services", { items })}
                  createItem={() => ({ title: "", description: "", image: "" })}
                  renderItem={(item, _i, upd) => (
                    <div className="space-y-2">
                      <ImageField label="이미지" value={item.image} onChange={(v) => upd("image", v)} />
                      <TextField label="제목" value={item.title} onChange={(v) => upd("title", v)} fieldPath="services.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                      <TextField label="설명" value={item.description} onChange={(v) => upd("description", v)} multiline fieldPath="services.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                    </div>
                  )}
                />
              </>
            )}

            {activeSection === "testimonials" && (
              <>
                <TextField label="섹션 제목" value={content.testimonials.sectionTitle} onChange={(v) => update("testimonials", { sectionTitle: v })} fieldPath="testimonials.sectionTitle" onFieldFocus={focusField} onFieldBlur={blurField} />
                <ArraySection
                  label="고객 후기"
                  items={content.testimonials.items}
                  onUpdate={(items) => update("testimonials", { items })}
                  createItem={() => ({ name: "", role: "", company: "", quote: "" })}
                  renderItem={(item, _i, upd) => (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <TextField label="이름" value={item.name} onChange={(v) => upd("name", v)} fieldPath="testimonials.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                        <TextField label="직함" value={item.role} onChange={(v) => upd("role", v)} fieldPath="testimonials.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                        <TextField label="회사" value={item.company} onChange={(v) => upd("company", v)} fieldPath="testimonials.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                      </div>
                      <TextField label="후기 내용" value={item.quote} onChange={(v) => upd("quote", v)} multiline fieldPath="testimonials.items" onFieldFocus={focusField} onFieldBlur={blurField} />
                    </div>
                  )}
                />
              </>
            )}

            {activeSection === "cta" && (
              <>
                <TextField label="헤드라인" value={content.cta.headline} onChange={(v) => update("cta", { headline: v })} fieldPath="cta.headline" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="설명" value={content.cta.description} onChange={(v) => update("cta", { description: v })} multiline fieldPath="cta.description" onFieldFocus={focusField} onFieldBlur={blurField} />
                <div className="grid grid-cols-2 gap-2">
                  <TextField label="버튼 텍스트" value={content.cta.buttonLabel} onChange={(v) => update("cta", { buttonLabel: v })} fieldPath="cta.buttonLabel" onFieldFocus={focusField} onFieldBlur={blurField} />
                  <TextField label="버튼 URL" value={content.cta.buttonHref} onChange={(v) => update("cta", { buttonHref: v })} fieldPath="cta.buttonHref" onFieldFocus={focusField} onFieldBlur={blurField} />
                </div>
              </>
            )}

            {activeSection === "footer" && (
              <>
                <TextField label="회사명" value={content.footer.companyName} onChange={(v) => update("footer", { companyName: v })} fieldPath="footer.companyName" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="설명" value={content.footer.description ?? ""} onChange={(v) => update("footer", { description: v })} multiline fieldPath="footer.description" onFieldFocus={focusField} onFieldBlur={blurField} />
                <TextField label="저작권" value={content.footer.copyright} onChange={(v) => update("footer", { copyright: v })} fieldPath="footer.copyright" onFieldFocus={focusField} onFieldBlur={blurField} />
                <div className="rounded-lg bg-gray-50 p-3">
                  <span className="mb-2 block text-xs font-medium text-gray-500">연락처</span>
                  <div className="space-y-2">
                    <TextField label="이메일" value={content.footer.contact?.email ?? ""} onChange={(v) => update("footer", { contact: { ...content.footer.contact, email: v } })} fieldPath="footer.contact" onFieldFocus={focusField} onFieldBlur={blurField} />
                    <TextField label="전화번호" value={content.footer.contact?.phone ?? ""} onChange={(v) => update("footer", { contact: { ...content.footer.contact, phone: v } })} fieldPath="footer.contact" onFieldFocus={focusField} onFieldBlur={blurField} />
                    <TextField label="주소" value={content.footer.contact?.address ?? ""} onChange={(v) => update("footer", { contact: { ...content.footer.contact, address: v } })} fieldPath="footer.contact" onFieldFocus={focusField} onFieldBlur={blurField} />
                  </div>
                </div>
                <ArraySection
                  label="링크 그룹"
                  items={content.footer.links}
                  onUpdate={(links) => update("footer", { links })}
                  createItem={() => ({ title: "", items: [] })}
                  renderItem={(group, _i, upd) => (
                    <div className="space-y-2">
                      <TextField label="그룹 제목" value={group.title} onChange={(v) => upd("title", v)} fieldPath="footer.links" onFieldFocus={focusField} onFieldBlur={blurField} />
                      <div className="ml-2 space-y-1">
                        {(group.items as unknown as { label: string; href: string }[]).map((link, li) => (
                          <div key={li} className="grid grid-cols-5 gap-1 items-center">
                            <input
                              className="col-span-2 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:border-indigo-400"
                              value={link.label}
                              placeholder="이름"
                              onFocus={() => focusField("footer.links")}
                              onBlur={blurField}
                              onChange={(e) => {
                                const newItems = [...(group.items as unknown as { label: string; href: string }[])];
                                newItems[li] = { ...newItems[li], label: e.target.value };
                                upd("items" as keyof typeof group, newItems as unknown as string);
                              }}
                            />
                            <input
                              className="col-span-2 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:border-indigo-400"
                              value={link.href}
                              placeholder="URL"
                              onFocus={() => focusField("footer.links")}
                              onBlur={blurField}
                              onChange={(e) => {
                                const newItems = [...(group.items as unknown as { label: string; href: string }[])];
                                newItems[li] = { ...newItems[li], href: e.target.value };
                                upd("items" as keyof typeof group, newItems as unknown as string);
                              }}
                            />
                            <button
                              onClick={() => {
                                const newItems = (group.items as unknown as { label: string; href: string }[]).filter((_, idx) => idx !== li);
                                upd("items" as keyof typeof group, newItems as unknown as string);
                              }}
                              className="text-xs text-gray-300 hover:text-red-400"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newItems = [...(group.items as unknown as { label: string; href: string }[]), { label: "", href: "#" }];
                            upd("items" as keyof typeof group, newItems as unknown as string);
                          }}
                          className="text-xs text-indigo-500 hover:text-indigo-700"
                        >
                          + 링크 추가
                        </button>
                      </div>
                    </div>
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-1 flex-col bg-gray-200">
          <div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 px-4 py-2">
            <span className="text-xs font-medium text-gray-500">미리보기</span>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe
              ref={iframeRef}
              src="/preview"
              className="h-full w-full rounded-lg border border-gray-300 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
