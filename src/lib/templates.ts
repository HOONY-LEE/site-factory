import { SiteContent } from "@/types/content";
import { type LucideIcon } from "lucide-react";
import { Building2, Rocket, Palette, Smartphone } from "lucide-react";
import exampleCorpContent from "@/content/example-corp.json";
import startupDefaultContent from "@/content/startup-default.json";
import brandDefaultContent from "@/content/brand-default.json";
import productDefaultContent from "@/content/product-default.json";

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  Icon: LucideIcon;
  defaultContent: SiteContent;
  preview: {
    bgColor: string;
    accentColor: string;
    style: "light" | "dark";
  };
}

export const categories = [
  { id: "all", label: "전체" },
  { id: "회사홈페이지", label: "회사홈페이지" },
  { id: "제품소개", label: "제품소개" },
  { id: "쇼핑몰", label: "쇼핑몰" },
  { id: "예약사이트", label: "예약사이트" },
];

export const templates: TemplateInfo[] = [
  {
    id: "corporate",
    name: "기업 홈페이지",
    description: "전문적인 기업 소개 웹사이트. 서비스, 고객후기, 회사 소개 섹션을 포함합니다.",
    category: "회사홈페이지",
    Icon: Building2,
    defaultContent: exampleCorpContent as SiteContent,
    preview: { bgColor: "#f8fafc", accentColor: "#3b82f6", style: "light" },
  },
  {
    id: "startup",
    name: "스타트업 랜딩",
    description: "제품/서비스 런칭을 위한 모던한 원페이지 랜딩. 다크 히어로와 볼드한 디자인.",
    category: "회사홈페이지",
    Icon: Rocket,
    defaultContent: startupDefaultContent as SiteContent,
    preview: { bgColor: "#0f172a", accentColor: "#a78bfa", style: "dark" },
  },
  {
    id: "brand",
    name: "브랜드 소개",
    description: "세련된 다크 톤의 기업 브랜드 페이지. 핵심가치, 사업영역, 팀 후기 섹션을 포함합니다.",
    category: "회사홈페이지",
    Icon: Palette,
    defaultContent: brandDefaultContent as SiteContent,
    preview: { bgColor: "#030712", accentColor: "#6366f1", style: "dark" },
  },
  {
    id: "product",
    name: "제품소개",
    description: "Apple 스타일의 프리미엄 제품 쇼케이스. 풀스크린 섹션과 대형 타이포그래피로 제품을 돋보이게 합니다.",
    category: "제품소개",
    Icon: Smartphone,
    defaultContent: productDefaultContent as SiteContent,
    preview: { bgColor: "#000000", accentColor: "#2997ff", style: "dark" },
  },
];

export function getTemplate(id: string): TemplateInfo | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplateIds(): string[] {
  return templates.map((t) => t.id);
}
