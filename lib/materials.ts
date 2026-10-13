import type { Material, MaterialGroup, Question } from './types';

export function buildMaterialGroups(
  materials: Material[],
  questions: Question[]
): MaterialGroup[] {
  const groups = new Map<string, MaterialGroup>();

  for (const material of materials) {
    groups.set(material.title, {
      id: material.id,
      title: material.title,
      sourceFile: material.source_file,
      questionCount: material.question_count,
      createdAt: material.created_at,
    });
  }

  const questionsByTitle = new Map<string, Question[]>();
  for (const question of questions) {
    const title = question.material_title?.trim();
    if (!title) continue;

    if (!questionsByTitle.has(title)) {
      questionsByTitle.set(title, []);
    }
    questionsByTitle.get(title)!.push(question);
  }

  for (const [title, titleQuestions] of questionsByTitle) {
    const existing = groups.get(title);
    if (existing) {
      existing.questionCount = titleQuestions.length;
      if (!existing.id && titleQuestions[0]?.material_id) {
        existing.id = titleQuestions[0].material_id;
      }
      continue;
    }

    groups.set(title, {
      id: titleQuestions[0]?.material_id ?? null,
      title,
      sourceFile: null,
      questionCount: titleQuestions.length,
    });
  }

  return [...groups.values()].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (a.createdAt) return -1;
    if (b.createdAt) return 1;
    return a.title.localeCompare(b.title);
  });
}
