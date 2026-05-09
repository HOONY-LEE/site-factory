"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { HeaderContent } from "@/types/content";

export default function Header({ logo, nav }: HeaderContent) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="text-xl font-bold text-gray-900" data-field="header.logo">
            {logo}
          </a>

          <nav className="hidden gap-8 md:flex">
            {nav.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴 열기"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-gray-100 py-4 md:hidden">
            {nav.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="block py-2 text-sm font-medium text-gray-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </Container>
    </header>
  );
}
