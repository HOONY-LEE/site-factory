import CorporateTemplate from "@/templates/corporate";
import content from "@/content/example-corp.json";
import { SiteContent } from "@/types/content";

export default function Home() {
  return <CorporateTemplate content={content as SiteContent} />;
}
