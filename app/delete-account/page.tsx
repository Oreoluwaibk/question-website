import type { Metadata } from "next";
import Link from "next/link";
import { DeleteAccountForm } from "@/components/DeleteAccountForm";
import { SiteShell } from "@/components/SiteShell";
import { DEFAULT_DELETION_INFO } from "@/lib/publicApi";

export const metadata: Metadata = {
  title: "Delete Account & Data",
  description:
    "Request deletion of your Question Bank account and associated personal data.",
};

export default function DeleteAccountPage() {
  const info = DEFAULT_DELETION_INFO;

  return (
    <SiteShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Delete your account & data
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Use this page to request permanent deletion of your {info.appName}{" "}
            account and associated personal data. You can also submit a request
            from the app under Profile → Delete account & data.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
            <li>
              Submit the form below with the email address tied to your account.
            </li>
            <li>
              We verify the request and permanently delete your account within{" "}
              {info.processingDays} days.
            </li>
            <li>
              You will receive confirmation at your email once processing is
              complete.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Data that will be deleted</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            {info.deletedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Data that may be retained</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            {info.retainedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Submit a deletion request</h2>
          <p className="mt-2 mb-5 text-sm text-muted">
            Signed in on the app? You can also request deletion from your
            profile for faster processing.
          </p>
          <DeleteAccountForm />
        </section>

        <p className="text-sm text-muted">
          Questions? Contact{" "}
          <Link
            href={`mailto:${info.supportEmail}`}
            className="font-medium text-mint underline-offset-2 hover:underline"
          >
            {info.supportEmail}
          </Link>
          .
        </p>
      </div>
    </SiteShell>
  );
}
