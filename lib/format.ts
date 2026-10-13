export function percent(value: number | null | undefined) {
  return `${Math.round((value ?? 0) * 100)}%`;
}

export function formatWhen(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function formatTopic(topic: unknown): string {
  if (typeof topic === "string") return topic;
  if (topic && typeof topic === "object" && "topic" in topic) {
    return String((topic as { topic: unknown }).topic);
  }
  return "Topic";
}

export function formatAnswer(answer: unknown): string {
  if (answer == null) return "—";
  if (typeof answer === "string" || typeof answer === "number" || typeof answer === "boolean") {
    return String(answer);
  }
  if (Array.isArray(answer)) {
    return answer
      .map((item) => {
        if (item && typeof item === "object" && "left" in item) {
          const pair = item as { left?: string; right?: string };
          return `${pair.left ?? ""} → ${pair.right ?? ""}`;
        }
        return String(item);
      })
      .join(", ");
  }
  return JSON.stringify(answer);
}

export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
