export const ANDROID_PACKAGE = "com.oreoluwacreatives.questionapp";
export const APP_SCHEME = "questionapp";

const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

export const SITE = {
  name: "Question Bank",
  tagline: "Turn your study materials into practice tests",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://oiquestionbank.netlify.app",
  adminUrl:
    process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://oiquestionadmin.netlify.app",
  supportEmail: "oreoluwa.creatives@gmail.com",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? PLAY_STORE_URL,
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL ?? "",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/delete-account", label: "Delete Account" },
] as const;

export const APP_HOME = "/app";

export const APP_NAV = [
  { href: APP_HOME, label: "Home" },
  { href: "/materials", label: "Materials" },
  { href: "/history", label: "History" },
  { href: "/analytics", label: "Analytics" },
  { href: "/profile", label: "Profile" },
] as const;
