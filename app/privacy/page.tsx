import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { SiteShell } from "@/components/SiteShell";
import { getLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Question Bank mobile application.",
};

export default function PrivacyPage() {
  const document = getLegalDocument("privacy");

  return (
    <SiteShell>
      <LegalDocumentView document={document} />
    </SiteShell>
  );
}
