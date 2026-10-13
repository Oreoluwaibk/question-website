"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  ApiError,
  authApi,
  authErrorMessage,
  setSupabaseSession,
} from "@/lib/api";
import { getDevicePayload } from "@/lib/device";
import { supabase, supabaseConfigured } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    acceptedTerms: boolean;
  }) => Promise<{ needsOtp: boolean }>;
  resendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const registerCurrentSession = useCallback(async (activeSession: Session) => {
    const device = getDevicePayload();
    await authApi.registerSession({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      refreshToken: activeSession.refresh_token,
    });
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let active = true;
    client.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
      if (data.session) {
        try {
          await registerCurrentSession(data.session);
        } catch (err) {
          if (
            err instanceof ApiError &&
            (err.code === "DEVICE_LIMIT_REACHED" || err.code === "ACCOUNT_DEACTIVATED")
          ) {
            await client.auth.signOut();
            setSession(null);
          }
        }
      }
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [registerCurrentSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const device = getDevicePayload();
    const { session: backendSession } = await authApi.login(email, password, device);
    await setSupabaseSession(
      backendSession.access_token,
      backendSession.refresh_token
    );
  }, []);

  const signUp = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      acceptedTerms: boolean;
    }) => {
      const result = await authApi.register(payload);
      if (result.autoConfirmed && result.accessToken && result.refreshToken) {
        await setSupabaseSession(result.accessToken, result.refreshToken);
        return { needsOtp: false };
      }
      return { needsOtp: true };
    },
    []
  );

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    const device = getDevicePayload();
    const { accessToken, refreshToken } = await authApi.verifyOtp(email, otp, device);
    await setSupabaseSession(accessToken, refreshToken);
  }, []);

  const resetPassword = useCallback(
    async (email: string, otp: string, newPassword: string) => {
      const { accessToken, refreshToken } = await authApi.resetPassword(
        email,
        otp,
        newPassword
      );
      await setSupabaseSession(accessToken, refreshToken);
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error("Supabase is not configured");
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout(getDevicePayload().deviceId);
    } catch {
      // Local sign-out still continues if the API is unreachable.
    }
    await supabase?.auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured: supabaseConfigured,
      signIn,
      signUp,
      resendOtp: async (email: string) => {
        await authApi.resendOtp(email);
      },
      verifyOtp,
      forgotPassword: async (email: string) => {
        await authApi.forgotPassword(email);
      },
      resetPassword,
      signInWithGoogle,
      signOut,
    }),
    [
      session,
      loading,
      signIn,
      signUp,
      verifyOtp,
      resetPassword,
      signInWithGoogle,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { authErrorMessage };
