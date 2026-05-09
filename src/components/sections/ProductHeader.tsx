"use client";

import { useState } from "react";
import { HeaderContent } from "@/types/content";
import { Menu, X } from "lucide-react";

export default function ProductHeader({ logo, nav }: HeaderContent) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#1d1d1f]/95 backdrop-blur-md">
      <div className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-4 sm:px-6">
        <a href="/" className="text-sm font-semibold tracking-tight text-white" data-field="header.logo">
          {logo}
        </a>

        <nav className="hidden gap-7 md:flex">
          {nav.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-[11px] font-normal text-[#d1d1d6] transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-[#424245] bg-[#1d1d1f] px-4 pb-4 md:hidden">
          {nav.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="block py-3 text-sm text-[#d1d1d6] hover:text-white"
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
