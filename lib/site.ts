export const SITE = {
  name: "Question Bank",
  tagline: "Turn your study materials into practice tests",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://oiquestionbank.netlify.app",
  adminUrl:
    process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://oiquestionadmin.netlify.app",
  supportEmail: "oreoluwa.creatives@gmail.com",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? "",
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
