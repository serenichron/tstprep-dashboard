import { CHART_DATAPOINTS } from "./state/SubmissionState.svelte";
import type {
  QuizSubmission,
  QuizType,
  StatsPart,
  StatsPartWithMode,
  TrendInfo,
} from "./types";

export function formatScore(score: number): number {
  return (
    [
      [95, 6.0],
      [86, 5.5],
      [75, 5.0],
      [66, 4.5],
      [55, 4.0],
      [46, 3.5],
      [35, 3.0],
      [26, 2.5],
      [15, 2.0],
      [6, 1.5],
      [0, 1.0],
    ]
      .find((s) => score >= s[0])
      ?.at(1) ?? 1.0
  );
}

export function formatScoreOptional(score: number | null): number | null {
  if (score === null) {
    return null;
  }

  return formatScore(score);
}

export function scoreColor(score: number): string {
  return score >= 5 ? "#00b189" : score >= 3.5 ? "#f0a030" : "#ff5859";
}

export function extractDateTime(date: string): { date: string; time: string } {
  const d = new Date(date);

  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export function sectionLabel(section: QuizType) {
  return (
    {
      reading: "Reading",
      listening: "Listening",
      writing: "Writing",
      speaking: "Speaking",
    } satisfies Record<typeof section, string>
  )[section];
}

export function whitelist<U extends T, T>(value: T, list: U[], def: U): U;
export function whitelist<U extends T, T>(value: T, list: U[]): U | undefined;
export function whitelist<U extends T, T>(
  value: T,
  predicate: (value: T) => boolean,
  def: U,
): U;
export function whitelist<U extends T, T>(
  value: T,
  predicate: (value: T) => boolean,
): U | undefined;
export function whitelist<T>(
  value: T,
  predicate: T[] | ((value: T) => boolean),
  def?: T,
): T | undefined {
  if (Array.isArray(predicate)) {
    if (predicate.includes(value)) {
      return value;
    }

    return def;
  }

  if (predicate(value)) {
    return value;
  }

  return def;
}

export function trendInfoRoot(
  stats: StatsPartWithMode["all"],
): number | undefined {
  if (stats.trend_sum === null || stats.trend_count === 0) {
    return;
  }

  return (
    formatScore(stats.trend_sum / stats.trend_count) -
    formatScore(
      (stats.sum - stats.trend_sum) / (stats.count - stats.trend_count),
    )
  );
}

export function trendInfo(
  stats: StatsPart,
  submissions: QuizSubmission[],
  extraSubmissions?: QuizSubmission[],
): TrendInfo | undefined {
  if (stats.count < 3) {
    return;
  }

  const latestCount = Math.min(CHART_DATAPOINTS, Math.floor(stats.count / 3));
  const subs = submissions
    .filter((s) => s.ai !== false)
    .concat(extraSubmissions ?? [])
    .slice(0, latestCount)
    .reverse();

  const latestSum = subs.map((s) => s.score).reduce((a, b) => a + b, 0);
  const latest = {
    count: subs.length,
    average: formatScore(latestSum / subs.length),
  };
  const prev = {
    count: stats.count - latest.count,
    average: formatScore(
      (stats.sum - latestSum) / (stats.count - latest.count),
    ),
  };

  return {
    submissions: subs,
    latest,
    prev,
    diff: latest.average - prev.average,
  };
}
