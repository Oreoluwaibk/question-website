"use client";

import { useEffect, useState } from "react";
import { BackLink, Button, Empty } from "@/components/product-ui";
import { analyticsApi } from "@/lib/api";
import { percent } from "@/lib/format";
import type { LeaderboardEntry, LeaderboardPage } from "@/lib/types";

export default function LeaderboardPage() {
  const [page, setPage] = useState<LeaderboardPage | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(offset: number) {
    setLoading(true);
    const data = await analyticsApi.leaderboard({ limit: 20, offset });
    setPage(data);
    setEntries((current) => (offset === 0 ? data.entries : [...current, ...data.entries]));
    setLoading(false);
  }

  useEffect(() => {
    load(0).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <BackLink href="/analytics">Analytics</BackLink>
      <h1 className="mb-4 text-2xl font-semibold">Leaderboard</h1>
      {entries.length === 0 ? (
        <Empty>No rankings yet.</Empty>
      ) : (
        <div className="grid gap-2">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border px-4 py-3 ${
                entry.isCurrentUser ? "border-mint bg-mint-soft" : "border-line bg-card"
              }`}
            >
              <span className="font-semibold">#{entry.rank}</span>
              <span className="min-w-0">
                <span className="block truncate">{entry.name}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {entry.attempts} attempts · best {entry.bestScore}
                </span>
              </span>
              <span className="text-sm">{percent(entry.averageAccuracy)}</span>
            </div>
          ))}
        </div>
      )}
      {page?.hasMore ? (
        <Button className="mt-4" disabled={loading} onClick={() => load(entries.length)}>
          {loading ? "Loading..." : "Load more"}
        </Button>
      ) : null}
    </div>
  );
}
