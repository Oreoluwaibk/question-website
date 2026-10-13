"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  backendPending,
  startBackendWait,
  subscribeBackendActivity,
} from "@/lib/backendActivity";

type Phase = "idle" | "loading" | "done";

export function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef(phase);
  const pathnameRef = useRef(pathname);
  const routeReady = useRef(false);
  const startedAt = useRef(0);
  const quietTimer = useRef<number | undefined>(undefined);
  const capTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const id = window.setTimeout(() => setPhase("idle"), 180);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    function clearQuiet() {
      if (quietTimer.current) window.clearTimeout(quietTimer.current);
      quietTimer.current = undefined;
    }

    function finish() {
      clearQuiet();
      if (capTimer.current) window.clearTimeout(capTimer.current);
      capTimer.current = undefined;
      setPhase((current) => (current === "loading" ? "done" : current));
    }

    function scheduleFinish() {
      if (phaseRef.current !== "loading" || !routeReady.current || backendPending() > 0) {
        return;
      }
      clearQuiet();
      const elapsed = Date.now() - startedAt.current;
      const wait = Math.max(200, 280 - elapsed);
      quietTimer.current = window.setTimeout(() => {
        if (phaseRef.current !== "loading" || !routeReady.current || backendPending() > 0) {
          return;
        }
        finish();
      }, wait);
    }

    const unsubscribe = subscribeBackendActivity(() => {
      if (backendPending() > 0) clearQuiet();
      else scheduleFinish();
    });

    function start() {
      clearQuiet();
      if (capTimer.current) window.clearTimeout(capTimer.current);
      routeReady.current = false;
      startedAt.current = Date.now();
      startBackendWait();
      setPhase("loading");
      capTimer.current = window.setTimeout(() => {
        if (backendPending() > 0) {
          capTimer.current = window.setTimeout(() => finish(), 2000);
          return;
        }
        finish();
      }, 20000);
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      start();
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      unsubscribe();
      clearQuiet();
      if (capTimer.current) window.clearTimeout(capTimer.current);
    };
  }, []);

  useEffect(() => {
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;
    routeReady.current = true;
    if (phaseRef.current !== "loading" || backendPending() > 0) return;

    const id = window.setTimeout(() => {
      if (phaseRef.current !== "loading" || backendPending() > 0) return;
      setPhase("done");
    }, 450);
    return () => window.clearTimeout(id);
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-[80] h-1 overflow-hidden"
      role="progressbar"
      aria-label="Loading page"
    >
      <div
        className={`h-full origin-left bg-mint ${
          phase === "done" ? "w-full scale-x-100" : "nav-progress"
        }`}
      />
    </div>
  );
}
