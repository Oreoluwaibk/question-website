import type { LegalDocument } from "@/lib/legalContent";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <article className="min-w-0 break-words">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {document.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Last updated {document.lastUpdated}
        </p>
      </header>

      <p className="text-sm leading-7 text-foreground sm:text-base">
        {document.intro}
      </p>

      <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-8">
        {document.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold sm:text-lg">{section.title}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-sm leading-7 text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
