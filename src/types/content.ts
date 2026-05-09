export interface SiteContent {
  meta: SiteMeta;
  header: HeaderContent;
  hero: HeroContent;
  features: FeaturesContent;
  about: AboutContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  cta: CtaContent;
  footer: FooterContent;
}

export interface SiteMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderContent {
  logo: string;
  nav: NavLink[];
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  backgroundImage?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  image?: string;
}

export interface FeaturesContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  items: Feature[];
}

export interface AboutContent {
  sectionTitle: string;
  description: string;
  image?: string;
  stats?: { label: string; value: string; image?: string }[];
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface ServicesContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  items: Service[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
}

export interface TestimonialsContent {
  sectionTitle: string;
  items: Testimonial[];
}

export interface CtaContent {
  headline: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface FooterContent {
  companyName: string;
  description?: string;
  links: { title: string; items: NavLink[] }[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  copyright: string;
}
