import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Question Bank team.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Contact us
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            For support, privacy requests, billing questions, or general
            feedback about {SITE.name}, reach us using the details below.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Email</h2>
          <p className="mt-2 text-sm text-muted">
            The fastest way to reach us:
          </p>
          <Link
            href={`mailto:${SITE.supportEmail}`}
            className="mt-3 inline-block text-base font-medium text-mint hover:underline"
          >
            {SITE.supportEmail}
          </Link>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">What to include</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            <li>The email address linked to your Question Bank account</li>
            <li>A clear description of your question or issue</li>
            <li>Screenshots if something is not working as expected</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Related pages</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/support" className="font-medium text-mint hover:underline">
              Support
            </Link>
            <Link
              href="/delete-account"
              className="font-medium text-mint hover:underline"
            >
              Delete account
            </Link>
            <Link href="/privacy" className="font-medium text-mint hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-medium text-mint hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
