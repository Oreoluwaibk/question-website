import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with the Question Bank app.",
};

const TOPICS = [
  {
    title: "Account & sign in",
    body: "Use the email and password you registered with. If you signed up with Google, continue using that option. Check your inbox for the verification code if your account is not yet activated.",
  },
  {
    title: "Uploading materials",
    body: "Question Bank supports PDF and DOCX files. Make sure your file is readable and not password-protected. Free plans include upload limits; upgrade to Pro for higher limits.",
  },
  {
    title: "Practice tests & scores",
    body: "Start a test from any material, answer questions, and review your results afterward. Free plans may limit the number of attempts you can start.",
  },
  {
    title: "Subscriptions & billing",
    body: "Paid plans are processed through Paystack. Subscription details and cancellation options are shown in the app before checkout.",
  },
  {
    title: "Account deletion",
    body: "You can request permanent deletion from the app or through our public deletion page.",
  },
];

export default function SupportPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Support
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Need help with {SITE.name}? Start with the topics below or contact us
            directly.
          </p>
        </div>

        <div className="space-y-4">
          {TOPICS.map((topic) => (
            <section
              key={topic.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{topic.body}</p>
            </section>
          ))}
        </div>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Still need help?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Email us at{" "}
            <Link
              href={`mailto:${SITE.supportEmail}`}
              className="font-medium text-mint hover:underline"
            >
              {SITE.supportEmail}
            </Link>{" "}
            with your account email and a short description of the issue.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/contact"
              className="font-medium text-mint hover:underline"
            >
              Contact page
            </Link>
            <Link
              href="/delete-account"
              className="font-medium text-mint hover:underline"
            >
              Delete account
            </Link>
            <Link
              href="/privacy"
              className="font-medium text-mint hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
