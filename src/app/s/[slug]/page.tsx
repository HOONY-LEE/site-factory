export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDeployedSite } from "@/lib/sites-server";
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublishedSitePage({ params }: PageProps) {
  const { slug } = await params;
  const site = await getDeployedSite(slug);

  if (!site) {
    notFound();
  }

  const Template = templateComponents[site.templateId] ?? templateComponents.corporate;
  return <Template content={site.content} />;
}
