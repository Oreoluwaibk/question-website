"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi, authErrorMessage } from "@/lib/api";
import { getDevicePayload } from "@/lib/device";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      if (!supabase) {
        setError("Supabase is not configured");
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const description = url.searchParams.get("error_description") ?? hash.get("error_description");

      try {
        if (description) throw new Error(description.replace(/\+/g, " "));
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session) throw new Error("Google sign-in did not return a session");
        const device = getDevicePayload();
        await authApi.registerSession({
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          refreshToken: data.session.refresh_token,
        });
        if (!cancelled) router.replace("/app");
      } catch (err) {
        const message = authErrorMessage(err);
        const alreadyRegistered = /user_device_sessions_user_id_device_id_key/i.test(message);
        if (!cancelled && alreadyRegistered) {
          router.replace("/app");
          return;
        }
        if (!cancelled) {
          await supabase.auth.signOut();
          setError(message);
        }
      }
    }

    finish();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-muted">{error || "Finishing Google sign-in..."}</p>
      {error ? (
        <button type="button" className="mt-4 text-sm font-medium text-mint" onClick={() => router.replace("/login")}>
          Back to sign in
        </button>
      ) : null}
    </main>
  );
}
