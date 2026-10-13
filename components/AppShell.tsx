"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AppLogo } from "@/components/AppLogo";
import { authApi, legalApi, needsTermsAcceptance } from "@/lib/api";
import { OpenAppLink } from "@/components/OpenInAppBanner";
import { APP_HOME, APP_NAV, SITE } from "@/lib/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading, signOut } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    Promise.all([authApi.me(), legalApi.getTermsVersion()])
      .then(([profile, terms]) => {
        if (cancelled) return;
        const needed = needsTermsAcceptance(profile, terms.version);
        if (needed && pathname !== "/accept-terms") {
          router.replace("/accept-terms");
          return;
        }
        if (!needed && pathname === "/accept-terms") {
          router.replace(APP_HOME);
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [loading, session, pathname, router]);

  if (loading || !session || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        Loading your account...
      </div>
    );
  }

  const plain = pathname === "/accept-terms";

  return (
    <>
      <div className="mx-auto grid min-h-[calc(100vh-57px)] w-full max-w-6xl gap-6 px-4 py-4 pb-24 sm:py-6 lg:grid-cols-[220px_1fr] lg:pb-6">
        {plain ? null : (
          <>
            <div className="flex flex-col gap-3 lg:hidden">
              <header className="flex items-center justify-between gap-3">
                <Link href={APP_HOME} className="flex min-w-0 items-center gap-2.5">
                  <AppLogo size={32} />
                  <span className="truncate font-semibold">{SITE.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut().then(() => router.replace("/login"))}
                  className="shrink-0 text-sm font-medium text-muted"
                >
                  Sign out
                </button>
              </header>
              <OpenAppLink className="flex min-h-11 w-full items-center justify-center rounded-xl bg-mint px-4 text-sm font-semibold text-ink" />
            </div>
            <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
              <Link href={APP_HOME} className="mb-6 flex items-center gap-3">
                <AppLogo size={36} />
                <span className="font-semibold">{SITE.name}</span>
              </Link>
              <AppNav pathname={pathname} />
              <button
                type="button"
                onClick={() => signOut().then(() => router.replace("/login"))}
                className="mt-4 text-sm text-muted"
              >
                Sign out
              </button>
            </aside>
          </>
        )}
        <div className={`min-w-0 ${plain ? "lg:col-span-2" : ""}`}>{children}</div>
      </div>
      {plain ? null : (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
          <AppNav pathname={pathname} mobile />
        </nav>
      )}
    </>
  );
}

function AppNav({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  return (
    <div className={mobile ? "grid grid-cols-5" : "flex flex-col gap-1"}>
      {APP_NAV.map((item) => {
        const active =
          item.href === APP_HOME
            ? pathname === APP_HOME
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              mobile
                ? `flex min-h-14 items-center justify-center px-1 text-center text-[11px] font-medium leading-4 ${
                    active ? "text-mint" : "text-muted"
                  }`
                : `rounded-xl px-3 py-2 text-sm font-medium ${
                    active ? "bg-mint text-ink" : "text-muted hover:bg-card"
                  }`
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
