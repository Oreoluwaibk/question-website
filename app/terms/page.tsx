import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { SiteShell } from "@/components/SiteShell";
import { getLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for the Question Bank mobile application.",
};

export default function TermsPage() {
  const document = getLegalDocument("terms");

  return (
    <SiteShell>
      <LegalDocumentView document={document} />
    </SiteShell>
  );
}
