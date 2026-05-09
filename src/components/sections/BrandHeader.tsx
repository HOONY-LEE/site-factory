"use client";

import { useState, useEffect } from "react";
import { HeaderContent } from "@/types/content";
import { Menu, X } from "lucide-react";

export default function BrandHeader({ logo, nav }: HeaderContent) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex h-[60px] max-w-[980px] items-center justify-between px-5">
        {/* Logo */}
        <a
          href="/"
          className="text-[17px] font-bold tracking-tight text-[#272a30]"
          data-field="header.logo"
        >
          {logo}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={`text-[15px] font-semibold transition-colors ${
                i === 0
                  ? "text-[#06a96c]"
                  : "text-[#272a30] hover:text-[#06a96c]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="text-[#272a30] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-5 py-4 md:hidden">
          {nav.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={`block py-3 text-[15px] font-semibold ${
                i === 0 ? "text-[#06a96c]" : "text-[#272a30]"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
