"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Empty, Notice, PageHeader } from "@/components/product-ui";
import { authErrorMessage, questionsApi } from "@/lib/api";
import { buildMaterialGroups } from "@/lib/materials";
import type { MaterialGroup } from "@/lib/types";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialGroup[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [rows, questions] = await Promise.all([
        questionsApi.listMaterials().catch(() => []),
        questionsApi.list(),
      ]);
      setMaterials(buildMaterialGroups(rows, questions));
      setError("");
    } catch (err) {
      setError(authErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = materials.reduce((sum, item) => sum + item.questionCount, 0);

  return (
    <div>
      <PageHeader
        title="Materials"
        subtitle={`${materials.length} materials · ${total} questions`}
        action={
          <Link href="/materials/add">
            <Button>Add questions</Button>
          </Link>
        }
      />
      {error ? <Notice>{error}</Notice> : null}
      {materials.length === 0 ? (
        <Empty>No materials yet. Upload a PDF or DOCX from Home.</Empty>
      ) : (
        <div className="grid gap-3">
          {materials.map((material) => (
            <Link key={material.id ?? material.title} href={`/materials/${encodeURIComponent(material.title)}`}>
              <Card
                title={material.title}
                subtitle={
                  material.sourceFile
                    ? `${material.questionCount} questions · ${material.sourceFile}`
                    : `${material.questionCount} question${material.questionCount === 1 ? "" : "s"}`
                }
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
