import { SiteContent } from "@/types/content";

export interface DeployedSite {
  slug: string;
  name: string;
  templateId: string;
  content: SiteContent;
  deployedAt: string;
  customDomain?: string;
}

/* ─── Vercel Blob 사용 여부 (환경 변수로 판단) ─── */
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

/* ================================================================
   Vercel Blob Storage (프로덕션)
   ================================================================ */
async function blobGet(slug: string): Promise<DeployedSite | null> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `sites/${slug}.json`, limit: 1 });
  if (blobs.length === 0) return null;
  const res = await fetch(blobs[0].url);
  if (!res.ok) return null;
  return res.json();
}

async function blobPut(data: DeployedSite): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(`sites/${data.slug}.json`, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

async function blobDelete(slug: string): Promise<boolean> {
  const { list, del } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: `sites/${slug}.json`, limit: 1 });
  if (blobs.length === 0) return false;
  await del(blobs[0].url);
  return true;
}

async function blobList(): Promise<DeployedSite[]> {
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: "sites/" });
  const sites = await Promise.all(
    blobs
      .filter((b) => b.pathname.endsWith(".json"))
      .map(async (b) => {
        try {
          const res = await fetch(b.url);
          return (await res.json()) as DeployedSite;
        } catch {
          return null;
        }
      })
  );
  return sites.filter(Boolean) as DeployedSite[];
}

/* ================================================================
   File System Storage (로컬 개발)
   ================================================================ */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "sites");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function fsGet(slug: string): DeployedSite | null {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as DeployedSite;
  } catch {
    return null;
  }
}

function fsPut(data: DeployedSite): void {
  ensureDir();
  fs.writeFileSync(
    path.join(DATA_DIR, `${data.slug}.json`),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

function fsDelete(slug: string): boolean {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

function fsList(): DeployedSite[] {
  ensureDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(DATA_DIR, f), "utf-8")
        ) as DeployedSite;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as DeployedSite[];
}

/* ================================================================
   Public API (자동으로 Blob or FS 선택)
   ================================================================ */

/** 배포된 사이트 조회 */
export async function getDeployedSite(
  slug: string
): Promise<DeployedSite | null> {
  if (USE_BLOB) return blobGet(slug);
  return fsGet(slug);
}

/** 사이트 배포 (저장) */
export async function deploySite(data: DeployedSite): Promise<void> {
  if (USE_BLOB) return blobPut(data);
  fsPut(data);
}

/** 사이트 배포 해제 (삭제) */
export async function undeploySite(slug: string): Promise<boolean> {
  if (USE_BLOB) return blobDelete(slug);
  return fsDelete(slug);
}

/** 모든 배포된 사이트 목록 */
export async function listDeployedSites(): Promise<DeployedSite[]> {
  if (USE_BLOB) return blobList();
  return fsList();
}
