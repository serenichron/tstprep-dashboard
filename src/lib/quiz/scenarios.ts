import type { Cohort, CohortMeta, CohortUser, StepId } from './types';

// ─── Cohort scenario metadata for the picker screen ─────────────────────────
export const cohortMeta: CohortMeta[] = [
	{
		id: 'A',
		title: 'New Visitor',
		subtitle: 'Anonymous — no account yet',
		who: 'Someone who just landed on the site. We know nothing about them.',
		flow: 'Full 10-step quiz · email = account creation · AI assessment offered',
		accent: 'teal'
	},
	{
		id: 'B1',
		title: 'Free Member · Active',
		subtitle: 'Logged in, has practice scores',
		who: 'A free user who has taken practice tests. We already know their level.',
		flow: 'Abbreviated 4-step quiz · pre-filled scores · skip email & AI',
		accent: 'blue'
	},
	{
		id: 'B2',
		title: 'Free Member · Inactive',
		subtitle: 'Logged in, no activity data',
		who: 'A free user who signed up but never practiced.',
		flow: 'Full quiz minus email capture · AI assessment offered',
		accent: 'blue'
	},
	{
		id: 'C1',
		title: 'Customer · Active',
		subtitle: 'Has purchases + practice data',
		who: 'A paying customer we already know well.',
		flow: 'No quiz — go straight to personalized dashboard recommendations',
		accent: 'purple'
	},
	{
		id: 'C2',
		title: 'Customer · Inactive',
		subtitle: 'Has purchases, no activity',
		who: 'A paying customer who hasn\'t started using what they bought.',
		flow: 'Abbreviated quiz · AI offered · owned products excluded from recs',
		accent: 'purple'
	}
];

// ─── Step sequences per cohort (urgent + AI branches handled dynamically) ──
export const cohortSteps: Record<Cohort, StepId[]> = {
	A:  ['welcome', 'test-date', 'experience', 'target-score', 'weak-areas', 'learning-style', 'ai-offer', 'ai-results', 'email', 'recommendations'],
	B1: ['welcome', 'test-date', 'target-score', 'weak-areas', 'learning-style', 'recommendations'],
	B2: ['welcome', 'test-date', 'experience', 'target-score', 'weak-areas', 'learning-style', 'ai-offer', 'ai-results', 'recommendations'],
	C1: ['c1-dashboard'],
	C2: ['welcome', 'test-date', 'target-score', 'weak-areas', 'learning-style', 'ai-offer', 'ai-results', 'recommendations']
};

// ─── Pre-seeded mock users per cohort ──────────────────────────────────────
export const cohortUsers: Record<Cohort, CohortUser> = {
	A: {
		firstName: ''
	},
	B1: {
		firstName: 'Ana',
		email: 'ana@example.com',
		sectionScores: { Reading: 4.0, Listening: 3.5, Speaking: 2.5, Writing: 3.0 },
		overallScore: 3.3,
		testsCompleted: 4
	},
	B2: {
		firstName: 'Marco',
		email: 'marco@example.com'
	},
	C1: {
		firstName: 'Priya',
		email: 'priya@example.com',
		sectionScores: { Reading: 4.5, Listening: 4.0, Speaking: 2.5, Writing: 3.5 },
		overallScore: 3.6,
		ownedCourses: ['Score Builder', 'Emergency Course'],
		testsCompleted: 12
	},
	C2: {
		firstName: 'Diego',
		email: 'diego@example.com',
		ownedCourses: ['Emergency Course'],
		testsCompleted: 0
	}
};

export function skipsEmail(cohort: Cohort): boolean {
	return cohort !== 'A';
}

export function offersAI(cohort: Cohort): boolean {
	return cohort === 'A' || cohort === 'B2' || cohort === 'C2';
}
