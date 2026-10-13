"use client";

import { useEffect, useState } from "react";
import { androidAppIntentUrl, isAndroidDevice, playStoreUrl } from "@/lib/openApp";

export default function OpenAppPage() {
  const [message, setMessage] = useState("Checking this device...");

  useEffect(() => {
    if (!isAndroidDevice()) {
      setMessage("Open Question Bank from an Android phone that already has the app installed.");
      return;
    }
    const intent = androidAppIntentUrl(playStoreUrl());
    setMessage("Opening the installed Android app...");
    window.location.href = intent;
  }, []);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold">Open Question Bank</h1>
      <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
      <a href={playStoreUrl()} className="mt-6 text-sm font-medium text-mint">
        Get it on Google Play
      </a>
    </main>
  );
}
