import { NextRequest, NextResponse } from "next/server";
import { listDeployedSites } from "@/lib/sites-server";

export async function GET(_req: NextRequest) {
  try {
    const sites = await listDeployedSites();
    const slugMap: Record<string, { deployedAt: string; customDomain?: string }> = {};
    for (const site of sites) {
      slugMap[site.slug] = {
        deployedAt: site.deployedAt,
        customDomain: site.customDomain,
      };
    }
    return NextResponse.json({ sites: slugMap });
  } catch (err) {
    console.error("Status error:", err);
    return NextResponse.json(
      { error: "Failed to fetch deploy status" },
      { status: 500 }
    );
  }
}
