import Link from "next/link";
import { SITE } from "@/lib/site";

const storeButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition sm:w-auto sm:min-w-[220px]";

export function StoreDownloadButtons() {
  const hasPlayStore = Boolean(SITE.playStoreUrl);
  const hasAppStore = Boolean(SITE.appStoreUrl);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {hasPlayStore ? (
        <a
          href={SITE.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${storeButtonClass} bg-mint text-primary-text hover:opacity-90`}
        >
          Get it on Google Play
        </a>
      ) : (
        <span
          className={`${storeButtonClass} cursor-not-allowed border border-border bg-card text-muted`}
        >
          Google Play — coming soon
        </span>
      )}

      {hasAppStore ? (
        <a
          href={SITE.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${storeButtonClass} border border-border bg-card text-foreground hover:bg-border`}
        >
          Download on the App Store
        </a>
      ) : (
        <span
          className={`${storeButtonClass} cursor-not-allowed border border-border bg-card text-muted`}
        >
          App Store — coming soon
        </span>
      )}
    </div>
  );
}

export function QuickLinks() {
  const links = [
    { href: "/support", label: "Support" },
    { href: "/contact", label: "Contact" },
    { href: "/delete-account", label: "Delete account" },
  ];

  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-border sm:justify-start"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
