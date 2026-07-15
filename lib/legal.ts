import {
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
  type LegalDocument,
} from "@/lib/legalContent";

export type { LegalDocument, LegalSection } from "@/lib/legalContent";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

function isReachableApiUrl(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !["localhost", "127.0.0.1", "0.0.0.0"].includes(host);
  } catch {
    return false;
  }
}

const FALLBACK: Record<"terms" | "privacy", LegalDocument> = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
};

export function getLegalDocument(slug: "terms" | "privacy"): LegalDocument {
  return FALLBACK[slug];
}

export async function fetchLegalDocument(
  slug: "terms" | "privacy"
): Promise<LegalDocument> {
  if (!isReachableApiUrl(API_URL)) {
    return FALLBACK[slug];
  }

  try {
    const response = await fetch(`${API_URL}/legal/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return FALLBACK[slug];
    }

    return (await response.json()) as LegalDocument;
  } catch {
    return FALLBACK[slug];
  }
}
