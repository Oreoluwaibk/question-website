"use client";

import { useEffect, useState } from "react";
import { androidAppIntentUrl, isAndroidDevice, phoneOpenAppHref, playStoreUrl } from "@/lib/openApp";

export function OpenInAppBanner() {
  const [visible, setVisible] = useState(false);
  const [intentUrl, setIntentUrl] = useState("");

  useEffect(() => {
    if (!isAndroidDevice()) return;
    if (window.sessionStorage.getItem("qb-hide-app-banner") === "1") return;
    setIntentUrl(androidAppIntentUrl(window.location.href));
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6">
          Already have Question Bank on this phone? Open the installed Android app.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={intentUrl}
            className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-ink"
          >
            Open app
          </a>
          <a
            href={playStoreUrl()}
            className="rounded-full px-3 py-2 text-sm font-medium text-paper/80"
          >
            Play Store
          </a>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm text-paper/70"
            onClick={() => {
              window.sessionStorage.setItem("qb-hide-app-banner", "1");
              setVisible(false);
            }}
          >
            Stay on web
          </button>
        </div>
      </div>
    </div>
  );
}

export function OpenAppLink({ className = "" }: { className?: string }) {
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(phoneOpenAppHref(window.location.href));
  }, []);

  if (!href) return null;

  return (
    <a href={href} className={className}>
      Open app
    </a>
  );
}

export function OpenAppButton({ className = "" }: { className?: string }) {
  const [href, setHref] = useState(playStoreUrl());
  const [label, setLabel] = useState("Get the Android app");

  useEffect(() => {
    if (!isAndroidDevice()) return;
    setHref(androidAppIntentUrl(window.location.href));
    setLabel("Open in the app");
  }, []);

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
