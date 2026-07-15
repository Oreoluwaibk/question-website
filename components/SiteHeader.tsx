"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLogo } from "@/components/AppLogo";
import { FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/site";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const mobileLinks = [...NAV_LINKS, ...FOOTER_LINKS];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <AppLogo size={32} className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="truncate font-semibold sm:text-base">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap transition hover:text-foreground ${
                pathname === link.href ? "font-medium text-mint" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-border md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-site-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-[57px] z-40 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="mobile-site-nav"
            className="relative z-50 border-t border-border bg-card px-4 py-3 md:hidden sm:px-6"
          >
            <div className="space-y-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-border ${
                    pathname === link.href ? "bg-[var(--mint-soft)] text-mint" : "text-foreground"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
}
