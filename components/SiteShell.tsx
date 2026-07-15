import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import { SiteHeader } from "@/components/SiteHeader";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function SiteShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main
        className={`mx-auto w-full min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:py-10 ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {children}
      </main>

      <footer className="border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <AppLogo size={28} />
            <div>
              <p className="text-sm font-medium">{SITE.name}</p>
              <p className="text-sm text-muted">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-x-5">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
