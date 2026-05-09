"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { templates, categories } from "@/lib/templates";
import { getSites, deleteSite, saveSite, type SavedSite } from "@/lib/sites";
import {
  Layers,
  FolderKanban,
  ExternalLink,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  Monitor,
  Clock,
  Search,
  MoreVertical,
  Rocket,
  Globe,
  Loader2,
  Download,
  X,
} from "lucide-react";

/* ── 템플릿 썸네일 목업 ── */
function TemplateMockup({ template }: { template: (typeof templates)[number] }) {
  const isDark = template.preview.style === "dark";
  const bg = template.preview.bgColor;
  const accent = template.preview.accentColor;

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* 미니 네비 */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div
          className="h-2 w-12 rounded-full"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)" }}
        />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 w-6 rounded-full"
              style={{ backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }}
            />
          ))}
        </div>
      </div>

      {/* 히어로 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div
          className="mb-3 h-2.5 w-28 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div
          className="mb-1.5 h-2 w-36 rounded-full"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}
        />
        <div
          className="mb-4 h-2 w-24 rounded-full"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)" }}
        />
        <div
          className="h-5 w-16 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      {/* 하단 컨텐츠 블록 */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 flex-1 rounded"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 상태 뱃지 ── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    진행중: "bg-blue-50 text-blue-600",
    배포됨: "bg-green-50 text-green-600",
    완료: "bg-green-50 text-green-600",
    대기: "bg-amber-50 text-amber-600",
  };
  const icons: Record<string, React.ReactNode> = {
    배포됨: <Globe size={10} className="mr-0.5" />,
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status] ?? "bg-gray-100 text-gray-500"}`}>
      {icons[status]}
      {status}
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<SavedSite[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"templates" | "projects">("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectView, setProjectView] = useState<"grid" | "list">("grid");
  const [deployStatus, setDeployStatus] = useState<Record<string, { deployedAt: string; customDomain?: string }>>({});
  const [deployingId, setDeployingId] = useState<string | null>(null);

  /* ── 프로젝트 이름 모달 ── */
  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showNameModal) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [showNameModal]);

  function openNameModal(templateId: string) {
    setPendingTemplateId(templateId);
    setNewProjectName("");
    setShowNameModal(true);
  }

  function handleNameConfirm() {
    if (!pendingTemplateId) return;
    const name = newProjectName.trim();
    if (!name) {
      nameInputRef.current?.focus();
      return;
    }
    router.push(`/editor/${pendingTemplateId}?name=${encodeURIComponent(name)}`);
    setShowNameModal(false);
  }

  // Fetch deploy status from server
  useEffect(() => {
    setMounted(true);
    setSites(getSites());
    fetch("/api/sites/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.sites) setDeployStatus(data.sites);
      })
      .catch(() => {});
  }, []);

  function getDeployState(site: SavedSite): "배포됨" | "진행중" {
    return deployStatus[site.slug] ? "배포됨" : "진행중";
  }

  const [exportingId, setExportingId] = useState<string | null>(null);

  async function handleExport(site: SavedSite) {
    setExportingId(site.id);
    try {
      const res = await fetch("/api/sites/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: site.templateId,
          content: site.content,
          name: site.name,
        }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = site.name.replace(/[^a-zA-Z0-9가-힣\s\-_]/g, "").replace(/\s+/g, "-") + ".zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("내보내기에 실패했습니다.");
    } finally {
      setExportingId(null);
    }
  }

  async function handleQuickDeploy(site: SavedSite) {
    setDeployingId(site.id);
    try {
      const res = await fetch("/api/sites/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: site.slug,
          name: site.name,
          templateId: site.templateId,
          content: site.content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeployStatus((prev) => ({
          ...prev,
          [site.slug]: { deployedAt: data.deployedAt },
        }));
        // Update localStorage
        saveSite({
          ...site,
          deployed: true,
          deployedAt: data.deployedAt,
          deployedUrl: data.url,
        });
        setSites(getSites());
      }
    } catch {
      alert("배포에 실패했습니다.");
    } finally {
      setDeployingId(null);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("이 프로젝트를 삭제하시겠습니까?")) return;
    deleteSite(id);
    setSites(getSites());
  }

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const filteredSites = mounted
    ? sites.filter((s) =>
        searchQuery ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
    : [];

  const projectCount = mounted ? sites.length : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900 text-[10px] font-bold text-white">
                SF
              </div>
              <span className="text-[15px] font-semibold text-gray-900">Site Factory</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  activeTab === "templates"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Layers size={14} />
                템플릿
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  activeTab === "projects"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <FolderKanban size={14} />
                프로젝트
                {projectCount > 0 && (
                  <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {projectCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6">
        {/* ── 템플릿 탭 ── */}
        {activeTab === "templates" && (
          <>
            {/* 히어로 */}
            <section className="pb-8 pt-10 sm:pt-14">
              <h1 className="text-[28px] font-bold tracking-tight text-gray-900 sm:text-4xl">
                템플릿 선택
              </h1>
              <p className="mt-2 text-[15px] text-gray-400">
                프로젝트에 맞는 템플릿을 선택하고 콘텐츠를 입력하세요
              </p>
            </section>

            {/* 카테고리 필터 */}
            <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 템플릿 그리드 */}
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTemplates.map((t) => (
                <div key={t.id} className="group cursor-pointer">
                  {/* 썸네일 */}
                  <div className="relative mb-3.5 aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-gray-200/60 group-hover:-translate-y-1">
                    <TemplateMockup template={t} />

                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                      <Link
                        href={`/preview/${t.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
                      >
                        <Monitor size={14} />
                        미리보기
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openNameModal(t.id);
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                      >
                        시작하기
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 정보 */}
                  <div
                    onClick={() => openNameModal(t.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-gray-900">{t.name}</h3>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                        {t.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-gray-400 line-clamp-1">{t.description}</p>
                  </div>
                </div>
              ))}

              {/* 준비중 카드 */}
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 aspect-[4/3]">
                <Plus size={28} className="mb-2 text-gray-300" />
                <p className="text-[13px] font-medium text-gray-400">더 많은 템플릿</p>
                <p className="mt-0.5 text-xs text-gray-300">곧 추가됩니다</p>
              </div>
            </div>

            <div className="pb-20" />
          </>
        )}

        {/* ── 프로젝트 관리 탭 ── */}
        {activeTab === "projects" && (
          <>
            {/* 헤더 영역 */}
            <section className="pb-6 pt-10 sm:pt-14">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-[28px] font-bold tracking-tight text-gray-900">프로젝트</h1>
                  <p className="mt-1 text-[15px] text-gray-400">
                    {projectCount > 0
                      ? `${projectCount}개의 프로젝트를 관리 중`
                      : "진행 중인 프로젝트가 없습니다"}
                  </p>
                </div>
              </div>

              {/* 검색 + 뷰 토글 */}
              {projectCount > 0 && (
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="relative max-w-xs flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="프로젝트 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-[13px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-300 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
                    <button
                      onClick={() => setProjectView("grid")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        projectView === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      그리드
                    </button>
                    <button
                      onClick={() => setProjectView("list")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        projectView === "list" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      리스트
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* 빈 상태 */}
            {mounted && sites.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <FolderKanban size={24} className="text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900">진행 중인 프로젝트가 없습니다</p>
                <p className="mt-1 text-[13px] text-gray-400">
                  템플릿을 선택해서 새 프로젝트를 시작하세요
                </p>
                <button
                  onClick={() => setActiveTab("templates")}
                  className="mt-5 flex items-center gap-1.5 rounded-lg bg-gray-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  새 프로젝트 시작
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* 그리드 뷰 */}
            {mounted && filteredSites.length > 0 && projectView === "grid" && (
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSites.map((site) => {
                  const tmpl = templates.find((t) => t.id === site.templateId);
                  return (
                    <div key={site.id} className="group">
                      <div className="relative mb-3.5 aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {tmpl ? (
                          <TemplateMockup template={tmpl} />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-300">
                            <Layers size={32} />
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                          <Link
                            href={`/editor/${site.templateId}?site=${site.id}`}
                            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
                          >
                            <Pencil size={13} />
                            편집
                          </Link>
                          {getDeployState(site) === "배포됨" ? (
                            <Link
                              href={`/s/${site.slug}`}
                              target="_blank"
                              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                            >
                              <ExternalLink size={13} />
                              보기
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleQuickDeploy(site)}
                              disabled={deployingId === site.id}
                              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-60"
                            >
                              {deployingId === site.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Rocket size={13} />
                              )}
                              배포
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-[15px] font-semibold text-gray-900">
                              {site.name}
                            </h3>
                            <StatusBadge status={getDeployState(site)} />
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                            <span>{tmpl?.name ?? site.templateId}</span>
                            <span>·</span>
                            <span>{new Date(site.updatedAt).toLocaleDateString("ko-KR")}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(site.id)}
                          className="ml-2 rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="삭제"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 리스트 뷰 */}
            {mounted && filteredSites.length > 0 && projectView === "list" && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">프로젝트명</th>
                      <th className="hidden px-4 py-3 text-xs font-semibold text-gray-500 sm:table-cell">템플릿</th>
                      <th className="hidden px-4 py-3 text-xs font-semibold text-gray-500 md:table-cell">카테고리</th>
                      <th className="hidden px-4 py-3 text-xs font-semibold text-gray-500 lg:table-cell">수정일</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSites.map((site) => {
                      const tmpl = templates.find((t) => t.id === site.templateId);
                      return (
                        <tr key={site.id} className="transition-colors hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: tmpl?.preview.bgColor ?? "#f3f4f6" }}
                              >
                                {tmpl && (
                                  <tmpl.Icon
                                    size={14}
                                    color={tmpl.preview.style === "dark" ? "#fff" : "#374151"}
                                  />
                                )}
                              </div>
                              <span className="text-[13px] font-semibold text-gray-900 truncate">
                                {site.name}
                              </span>
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-[13px] text-gray-500 sm:table-cell">
                            {tmpl?.name ?? site.templateId}
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                              {tmpl?.category ?? "-"}
                            </span>
                          </td>
                          <td className="hidden px-4 py-3 text-[13px] text-gray-400 lg:table-cell">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(site.updatedAt).toLocaleDateString("ko-KR")}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={getDeployState(site)} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/editor/${site.templateId}?site=${site.id}`}
                                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                title="편집"
                              >
                                <Pencil size={14} />
                              </Link>
                              {getDeployState(site) === "배포됨" ? (
                                <Link
                                  href={`/s/${site.slug}`}
                                  target="_blank"
                                  className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                  title="보기"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                              ) : (
                                <button
                                  onClick={() => handleQuickDeploy(site)}
                                  disabled={deployingId === site.id}
                                  className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                  title="배포"
                                >
                                  {deployingId === site.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Rocket size={14} />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handleExport(site)}
                                disabled={exportingId === site.id}
                                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                title="내보내기"
                              >
                                {exportingId === site.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Download size={14} />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(site.id)}
                                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                title="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pb-20" />
          </>
        )}
      </main>

      {/* ── 프로젝트 이름 입력 모달 ── */}
      {showNameModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNameModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X size={16} />
            </button>
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
              <Layers size={18} className="text-white" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-900">
              새 프로젝트
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              프로젝트 이름을 입력하고 시작하세요
            </p>
            <div className="mt-5">
              <input
                ref={nameInputRef}
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameConfirm();
                  if (e.key === "Escape") setShowNameModal(false);
                }}
                placeholder="예: 우리회사 홈페이지"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleNameConfirm}
                disabled={!newProjectName.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                시작하기
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모바일 하단 네비 */}
      <div className="fixed bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white/90 backdrop-blur-md md:hidden">
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium ${
            activeTab === "templates" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Layers size={20} />
          템플릿
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium ${
            activeTab === "projects" ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <FolderKanban size={20} />
          프로젝트
        </button>
      </div>
    </div>
  );
}
