import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About the Question Bank mobile application.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            About {SITE.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            {SITE.name} is a mobile study app that helps students turn their own
            materials into active revision. Upload documents, generate practice
            questions, take timed tests, and track performance over time.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Our mission</h2>
          <p className="text-sm leading-7 text-muted">
            We built Question Bank to make revision faster and more effective.
            Instead of re-reading the same notes, you can practice with
            questions generated from your own content and focus on what you
            actually need to learn.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Who it&apos;s for</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
            <li>Students preparing for exams and coursework</li>
            <li>Learners who want practice questions from their own notes</li>
            <li>Anyone revising with PDF or DOCX study materials</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Important note</h2>
          <p className="text-sm leading-7 text-muted">
            AI-generated questions are for study and revision purposes only.
            Always review generated content before relying on it for teaching,
            assessment, or exam preparation.
          </p>
        </section>

        <p className="text-sm text-muted">
          Learn more on the{" "}
          <Link href="/" className="font-medium text-mint hover:underline">
            home page
          </Link>{" "}
          or reach us via{" "}
          <Link href="/contact" className="font-medium text-mint hover:underline">
            Contact
          </Link>
          .
        </p>
      </div>
    </SiteShell>
  );
}
