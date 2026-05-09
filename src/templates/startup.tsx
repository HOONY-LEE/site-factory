import { SiteContent } from "@/types/content";
import Header from "@/components/sections/Header";
import StartupHero from "@/components/sections/StartupHero";
import Features from "@/components/sections/Features";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";

interface StartupTemplateProps {
  content: SiteContent;
}

export default function StartupTemplate({ content }: StartupTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <div data-section="header"><Header {...content.header} /></div>
      <main>
        <div data-section="hero"><StartupHero {...content.hero} /></div>
        <div data-section="features"><Features {...content.features} /></div>
        <div data-section="about"><About {...content.about} /></div>
        <div data-section="services"><Services {...content.services} /></div>
        <div data-section="testimonials"><Testimonials {...content.testimonials} /></div>
        <div data-section="cta"><Cta {...content.cta} /></div>
      </main>
      <div data-section="footer"><Footer {...content.footer} /></div>
    </div>
  );
}
