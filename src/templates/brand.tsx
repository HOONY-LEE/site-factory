import { SiteContent } from "@/types/content";
import BrandHeader from "@/components/sections/BrandHeader";
import BrandHero from "@/components/sections/BrandHero";
import BrandStats from "@/components/sections/BrandStats";
import BrandServices from "@/components/sections/BrandServices";
import BrandValues from "@/components/sections/BrandValues";
import BrandTestimonials from "@/components/sections/BrandTestimonials";
import BrandCta from "@/components/sections/BrandCta";
import BrandFooter from "@/components/sections/BrandFooter";

interface BrandTemplateProps {
  content: SiteContent;
}

export default function BrandTemplate({ content }: BrandTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <div data-section="header"><BrandHeader {...content.header} /></div>
      <main>
        <div data-section="hero"><BrandHero {...content.hero} /></div>
        <div data-section="about"><BrandStats {...content.about} /></div>
        <div data-section="services"><BrandServices {...content.services} /></div>
        <div data-section="features"><BrandValues {...content.features} /></div>
        <div data-section="testimonials"><BrandTestimonials {...content.testimonials} /></div>
        <div data-section="cta"><BrandCta {...content.cta} /></div>
      </main>
      <div data-section="footer"><BrandFooter {...content.footer} /></div>
    </div>
  );
}
