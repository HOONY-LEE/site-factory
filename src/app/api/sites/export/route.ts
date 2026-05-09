import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { SiteContent } from "@/types/content";
import { generateStaticHtml } from "@/lib/html-export";

export async function POST(req: NextRequest) {
  try {
    const { templateId, content, name } = (await req.json()) as {
      templateId: string;
      content: SiteContent;
      name: string;
    };

    if (!templateId || !content) {
      return NextResponse.json(
        { error: "templateId and content are required" },
        { status: 400 }
      );
    }

    // 정적 HTML 생성
    const html = generateStaticHtml(content, templateId);

    // ZIP 생성
    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("content.json", JSON.stringify(content, null, 2));

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    const safeFileName = (name || "site")
      .replace(/[^a-zA-Z0-9가-힣\s\-_]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeFileName}.zip"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Failed to export site: " + String(err) },
      { status: 500 }
    );
  }
}
