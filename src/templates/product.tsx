import { SiteContent } from "@/types/content";
import ProductHeader from "@/components/sections/ProductHeader";
import ProductHero from "@/components/sections/ProductHero";
import ProductFeatures from "@/components/sections/ProductFeatures";
import ProductStats from "@/components/sections/ProductStats";
import ProductServices from "@/components/sections/ProductServices";
import ProductTestimonials from "@/components/sections/ProductTestimonials";
import ProductCta from "@/components/sections/ProductCta";
import ProductFooter from "@/components/sections/ProductFooter";

interface ProductTemplateProps {
  content: SiteContent;
}

export default function ProductTemplate({ content }: ProductTemplateProps) {
  return (
    <div className="min-h-screen bg-black">
      <div data-section="header"><ProductHeader {...content.header} /></div>
      <main>
        <div data-section="hero"><ProductHero {...content.hero} /></div>
        <div data-section="features"><ProductFeatures {...content.features} /></div>
        <div data-section="about"><ProductStats {...content.about} /></div>
        <div data-section="services"><ProductServices {...content.services} /></div>
        <div data-section="testimonials"><ProductTestimonials {...content.testimonials} /></div>
        <div data-section="cta"><ProductCta {...content.cta} /></div>
      </main>
      <div data-section="footer"><ProductFooter {...content.footer} /></div>
    </div>
  );
}
