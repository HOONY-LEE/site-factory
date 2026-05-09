"use client";

import { useParams } from "next/navigation";
import { getTemplate } from "@/lib/templates";
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

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const template = getTemplate(templateId);

  if (!template) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-200">404</h1>
          <p className="mt-4 text-gray-500">템플릿을 찾을 수 없습니다</p>
          <a href="/" className="mt-6 inline-block text-sm text-indigo-600 hover:underline">
            대시보드로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  const Template = templateComponents[templateId] ?? templateComponents.corporate;
  return <Template content={template.defaultContent} />;
}
