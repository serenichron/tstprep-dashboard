import type { Section } from '$lib/types';

// ─── Cohorts ────────────────────────────────────────────────────────────────
export type Cohort = 'A' | 'B1' | 'B2' | 'C1' | 'C2';

export interface CohortMeta {
	id: Cohort;
	title: string;
	subtitle: string;
	who: string;
	flow: string;
	accent: 'teal' | 'blue' | 'purple';
}

// ─── Step identifiers ───────────────────────────────────────────────────────
export type StepId =
	| 'welcome'
	| 'test-date'
	| 'urgent'
	| 'experience'
	| 'target-score'
	| 'weak-areas'
	| 'learning-style'
	| 'ai-offer'
	| 'speaking'
	| 'writing'
	| 'ai-results'
	| 'email'
	| 'recommendations'
	| 'c1-dashboard';

// ─── Answers captured across the funnel ─────────────────────────────────────
export type TestDateRange = 'urgent' | '1-3m' | '3-6m' | '6m-plus';
export type ExperienceLevel = 'new-format' | 'old-format' | 'first-time';
export type ScoreRange = '1.0-2.5' | '3.0-3.5' | '4.0-4.5' | '5.0-6.0';
export type TargetScoreRange = '2.0-3.0' | '3.5-4.0' | '4.5-5.0' | '5.5-6.0' | 'unsure';
export type WeakArea = Section | 'all';
export type StudyPreference = 'self-paced' | 'group' | 'private';
export type AiSection = 'speaking' | 'writing' | null;

export interface QuizAnswers {
	testDate?: TestDateRange;
	experience?: ExperienceLevel;
	previousScore?: ScoreRange;
	targetScore?: TargetScoreRange;
	weakAreas: WeakArea[];
	studyPreference?: StudyPreference;
	aiSection?: AiSection;
	aiScore?: number;
	email?: string;
	firstName?: string;
}

// ─── Pre-seeded cohort user profile ─────────────────────────────────────────
export interface CohortUser {
	firstName: string;
	email?: string;
	sectionScores?: Partial<Record<Section, number>>;
	overallScore?: number;
	ownedCourses?: string[];
	testsCompleted?: number;
}

// ─── Recommendation output ──────────────────────────────────────────────────
export interface RecommendedProduct {
	id: string;
	title: string;
	description: string;
	bullets?: string[];
	primary?: boolean;
	badge?: string;
	url?: string;
	price?: string;
}

export interface RecommendationBundle {
	primary: RecommendedProduct;
	secondary: RecommendedProduct[];
	testimonial?: { quote: string; author: string };
	freeResources: string[];
}
