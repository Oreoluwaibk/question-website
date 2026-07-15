import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import {
  QuickLinks,
  StoreDownloadButtons,
} from "@/components/StoreDownloadButtons";
import { SiteShell } from "@/components/SiteShell";
import { SITE } from "@/lib/site";

const FEATURES = [
  {
    title: "Upload study materials",
    description:
      "Add PDF and DOCX files from your courses, notes, or textbooks in a few taps.",
  },
  {
    title: "AI-generated questions",
    description:
      "Turn uploaded content into practice questions automatically so you can revise faster.",
  },
  {
    title: "Timed practice tests",
    description:
      "Run realistic test sessions, review answers, and see how you perform over time.",
  },
  {
    title: "Track your progress",
    description:
      "Keep materials organized, monitor scores, and focus on the topics that need work.",
  },
];

export default function HomePage() {
  return (
    <SiteShell wide>
      <div className="space-y-10 md:space-y-14 lg:space-y-16">
        <section className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10 lg:gap-12">
          <div className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 sm:px-4">
              <AppLogo size={36} priority className="h-9 w-9 sm:h-10 sm:w-10" />
              <span className="text-sm font-medium text-muted">{SITE.name}</span>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
                {SITE.tagline}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
                Question Bank helps students upload study documents, generate
                practice questions with AI, take timed tests, and track
                performance — all from one mobile app.
              </p>
            </div>
            <StoreDownloadButtons />
            <QuickLinks />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-mint sm:text-sm">
              Built for revision
            </p>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">
              From notes to practice tests
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Stop manually writing questions from your notes. Upload a document,
              let Question Bank extract the key content, and start practicing in
              minutes.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-muted sm:mt-6 sm:space-y-3">
              <li>• PDF and DOCX uploads</li>
              <li>• Organized study materials</li>
              <li>• Free tier to get started</li>
              <li>• Pro plans for higher limits</li>
            </ul>
          </div>
        </section>

        <section className="space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">What you can do</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Everything you need to turn passive reading into active practice.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5"
              >
                <h3 className="text-base font-semibold sm:text-lg">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-[var(--mint-soft)] p-5 sm:rounded-3xl sm:p-6 md:p-8">
          <h2 className="text-xl font-semibold sm:text-2xl">Get the app</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Download Question Bank on your phone when store links are available.
            Store buttons will activate automatically once you add the Play
            Store and App Store URLs.
          </p>
          <div className="mt-5 sm:mt-6">
            <StoreDownloadButtons />
          </div>
        </section>

        <section className="text-sm leading-6 text-muted">
          <p>
            Need help or have a privacy request? Visit{" "}
            <Link href="/support" className="font-medium text-mint hover:underline">
              Support
            </Link>
            ,{" "}
            <Link href="/contact" className="font-medium text-mint hover:underline">
              Contact
            </Link>
            , or{" "}
            <Link
              href="/delete-account"
              className="font-medium text-mint hover:underline"
            >
              Delete account
            </Link>
            .
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
