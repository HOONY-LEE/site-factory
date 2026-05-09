import { NextRequest, NextResponse } from "next/server";
import { deploySite, type DeployedSite } from "@/lib/sites-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, templateId, content, customDomain } = body;

    if (!slug || !name || !templateId || !content) {
      return NextResponse.json(
        { error: "slug, name, templateId, content are required" },
        { status: 400 }
      );
    }

    const site: DeployedSite = {
      slug,
      name,
      templateId,
      content,
      deployedAt: new Date().toISOString(),
      customDomain: customDomain || undefined,
    };

    await deploySite(site);

    const baseUrl = req.nextUrl.origin;
    const deployedUrl = `${baseUrl}/s/${slug}`;

    return NextResponse.json({
      success: true,
      url: deployedUrl,
      slug,
      deployedAt: site.deployedAt,
    });
  } catch (err) {
    console.error("Deploy error:", err);
    return NextResponse.json(
      { error: "Failed to deploy site" },
      { status: 500 }
    );
  }
}
