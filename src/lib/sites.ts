import { SiteContent } from "@/types/content";

export interface SavedSite {
  id: string;
  name: string;
  slug: string;
  templateId: string;
  content: SiteContent;
  createdAt: string;
  updatedAt: string;
  deployed?: boolean;
  deployedAt?: string;
  deployedUrl?: string;
  customDomain?: string;
}

const STORAGE_KEY = "site-factory-sites";

export function getSites(): SavedSite[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getSite(id: string): SavedSite | undefined {
  return getSites().find((s) => s.id === id);
}

export function getSiteBySlug(slug: string): SavedSite | undefined {
  return getSites().find((s) => s.slug === slug);
}

export function saveSite(site: SavedSite): void {
  const sites = getSites();
  const index = sites.findIndex((s) => s.id === site.id);
  if (index >= 0) {
    sites[index] = { ...site, updatedAt: new Date().toISOString() };
  } else {
    sites.push(site);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

export function deleteSite(id: string): void {
  const sites = getSites().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function toSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  // 한글만 있는 경우 등 영문이 하나도 없으면 랜덤 ID 사용
  if (!slug) {
    return "site-" + Date.now().toString(36);
  }
  return slug;
}
