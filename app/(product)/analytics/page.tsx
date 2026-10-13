"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Empty, PageHeader } from "@/components/product-ui";
import { analyticsApi } from "@/lib/api";
import { formatTopic, formatWhen, percent } from "@/lib/format";
import type {
  AnalyticsHistoryItem,
  AnalyticsSummary,
  LeaderboardPage,
  TypeAccuracy,
} from "@/lib/types";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [history, setHistory] = useState<AnalyticsHistoryItem[]>([]);
  const [byType, setByType] = useState<TypeAccuracy[]>([]);
  const [weakTopics, setWeakTopics] = useState<unknown[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPage | null>(null);

  useEffect(() => {
    Promise.all([
      analyticsApi.summary(),
      analyticsApi.history(),
      analyticsApi.byType(),
      analyticsApi.weakTopics().catch(() => []),
      analyticsApi.leaderboard({ limit: 10 }).catch(() => null),
    ])
      .then(([summaryData, historyData, typeData, weakData, board]) => {
        setSummary(summaryData);
        setHistory(historyData);
        setByType(typeData);
        setWeakTopics(weakData);
        setLeaderboard(board);
      })
      .catch(() => undefined);
  }, []);

  const entries = leaderboard?.entries ?? [];

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Track your progress across attempts" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Attempts" value={String(summary?.totalAttempts ?? 0)} />
        <Stat label="Accuracy" value={percent(summary?.averageAccuracy)} />
        <Stat label="Best" value={String(summary?.bestScore ?? 0)} />
        <Stat label="Avg time" value={`${summary?.averageTimeSeconds ?? 0}s`} />
      </div>

      <div className="mt-8 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        {(leaderboard?.total ?? 0) > 10 ? (
          <Link href="/leaderboard" className="text-sm font-medium text-mint">
            See all
          </Link>
        ) : null}
      </div>
      {entries.length === 0 ? (
        <Empty>No rankings yet. Complete attempts to appear here.</Empty>
      ) : (
        <div className="grid gap-2">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                entry.isCurrentUser ? "border-mint bg-mint-soft" : "border-line bg-card"
              }`}
            >
              <p className="min-w-0 truncate text-sm">
                <span className="font-semibold">#{entry.rank}</span> {entry.name}
              </p>
              <p className="shrink-0 text-sm text-muted">{percent(entry.averageAccuracy)}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 mb-3 text-lg font-semibold">By question type</h2>
      {byType.length === 0 ? (
        <Empty>No type data yet</Empty>
      ) : (
        <div className="grid gap-2">
          {byType.map((item) => (
            <Card
              key={item.questionType}
              title={item.questionType.replace(/_/g, " ")}
              subtitle={`${percent(item.averageAccuracy)} average accuracy`}
            />
          ))}
        </div>
      )}

      <h2 className="mt-8 mb-3 text-lg font-semibold">Recent history</h2>
      {history.length === 0 ? (
        <Empty>No completed attempts yet</Empty>
      ) : (
        <div className="grid gap-2">
          {history
            .slice(-10)
            .reverse()
            .map((item, index) => (
              <Card
                key={`${item.date}-${index}`}
                title={`Score ${item.score} · ${percent(item.accuracy)}`}
                subtitle={formatWhen(item.date)}
              />
            ))}
        </div>
      )}

      {weakTopics.length > 0 ? (
        <>
          <h2 className="mt-8 mb-3 text-lg font-semibold">Weak topics</h2>
          <div className="grid gap-2">
            {weakTopics.map((topic, index) => (
              <Card key={index} title={formatTopic(topic)} subtitle="Needs review" />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
