import { NextRequest, NextResponse } from "next/server";
import { undeploySite } from "@/lib/sites-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const deleted = await undeploySite(slug);

    if (!deleted) {
      return NextResponse.json(
        { error: "Site not found or already undeployed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("Undeploy error:", err);
    return NextResponse.json(
      { error: "Failed to undeploy site" },
      { status: 500 }
    );
  }
}
