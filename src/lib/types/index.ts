export type Section =
  | "Reading"
  | "Listening"
  | "Speaking"
  | "Writing"
  | "General";

export type ContentType = "test" | "practice" | "course" | "resource";

export type AccessLevel = "free" | "locked";

export type UserPlan =
  | "free"
  | "emergency_basic"
  | "emergency_premium"
  | "score_builder"
  | "private_lessons"
  | "unlock_all_tests";

export interface PracticeTest {
  id: number;
  type: "test";
  title: string;
  testNumber: number;
  sections: Section[];
  access: AccessLevel;
  bestScore: number | null;
  lastAttempt: string | null;
  attempts: number;
  duration: string;
  rating: number;
  ratingCount: number;
  sectionScores?: Partial<
    Record<"Reading" | "Listening" | "Speaking" | "Writing", number | null>
  >;
}

export interface PracticeSet {
  id: number;
  type: "practice";
  title: string;
  section: Section;
  access: AccessLevel;
  questionCount: number;
  setCount?: number;
  completionPercent: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  ratingCount: number;
}

export interface Course {
  id: number;
  type: "course";
  title: string;
  section: Section;
  access: AccessLevel;
  lessonCount: number;
  progressPercent: number;
  thumbnail: string;
  rating: number;
  ratingCount: number;
  tag?: string; // e.g. "Popular", "New"
}

export interface Resource {
  id: number;
  type: "resource";
  title: string;
  section: Section;
  access: AccessLevel;
  description: string;
  fileSize: string;
  downloadUrl: string;
}

export interface HistoryEntry {
  id: number;
  date: string;
  contentType: ContentType;
  title: string;
  section?: Section;
  score: number | null;
  maxScore: number;
  percentCorrect?: number;
  duration: string; // time spent
  testNumber?: number;
}

export interface User {
  name: string;
  firstName: string;
  email: string;
  plan: UserPlan;
  currentScore: number;
  targetScore: number;
  examDate: string | null;
  streak: number;
  xp: number;
  level: string;
  joinDate: string;
  credits: number;
}

export type QuizSubmission = {
  // id: number;
  // quiz_id: number;
  // post_id: number;
  // test_number: number | null;
  id: string;
  test_number: number;
  practice: boolean;
  score: number;
  created_at: string;
} & (
  | {
      quiz_type: "reading" | "listening";
      ai: null;
      info: {
        p: number;
        t: number;
      }[];
    }
  | {
      quiz_type: "writing" | "speaking";
      ai: boolean;
      info: Record<
        string,
        {
          p: number;
          t: number;
          c: number;
        }
      >;
    }
);

export type QuizType = "reading" | "listening" | "writing" | "speaking";
export type QuizTypeComplete = QuizType | "complete";
export type QuizMode = "practice" | "test";

export type StatsPart = {
  average: number | null;
  best: number | null;
  sum: number;
  count: number;
  gradedCount: number;
};
export type StatsPartWithMode = Record<QuizMode | "all", StatsPart>;
export type StatsPartWithModeAndTest = Record<number, StatsPartWithMode> & {
  all: StatsPartWithMode;
};

export type SubmissionStats = Record<
  QuizTypeComplete,
  StatsPartWithModeAndTest
>;

export type SubmissionGeneralStats = Record<QuizType, StatsPartWithMode> & {
  all: StatsPart;
};

export type Sec4 = "Reading" | "Listening" | "Speaking" | "Writing";

export type CompleteSub = {
  id: string;
  testNumber: number;
  date: string;
  duration: string;
  scores: Record<Sec4, number | null>;
  composite: number | null;
};
