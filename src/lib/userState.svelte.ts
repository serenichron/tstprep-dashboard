import type { UserPlan } from '$lib/types';

// ─── Reactive shared plan state ───────────────────────────────────────────────
export let userPlan = $state<UserPlan>('free');

// ─── Plan display labels ──────────────────────────────────────────────────────
export const planLabels: Record<UserPlan, string> = {
	free:             'Free',
	emergency_basic:  'Emergency Basic',
	emergency_premium:'Emergency Premium',
	score_builder:    'Score Builder',
	private_lessons:  'Private Lessons',
	unlock_all_tests: 'Unlock All Tests'
};

// ─── Practice test access (by test number, 1-indexed) ────────────────────────
const testCounts: Record<UserPlan, number> = {
	free:             2,
	emergency_basic:  2,
	emergency_premium:6,
	score_builder:    10,
	private_lessons:  13,
	unlock_all_tests: 15
};

// ─── Course access (by course ID) ────────────────────────────────────────────
const courseAccess: Record<number, UserPlan[]> = {
	301: ['emergency_basic', 'emergency_premium', 'score_builder', 'private_lessons', 'unlock_all_tests'],
	302: ['score_builder', 'private_lessons', 'unlock_all_tests'],
	303: ['score_builder', 'private_lessons', 'unlock_all_tests'],
	304: ['score_builder', 'private_lessons', 'unlock_all_tests'],
	305: ['score_builder', 'private_lessons', 'unlock_all_tests'],
	306: ['score_builder', 'private_lessons', 'unlock_all_tests']
};

export function isTestAccessible(testNumber: number): boolean {
	return testNumber <= testCounts[userPlan];
}

export function isCourseAccessible(courseId: number): boolean {
	return courseAccess[courseId]?.includes(userPlan) ?? false;
}

// ─── Sidebar upsell config ────────────────────────────────────────────────────
export interface UpsellConfig {
	headline: string;
	body:     string;
	cta:      string;
	href:     string;
}

export function getUpsell(): UpsellConfig | null {
	switch (userPlan) {
		case 'free':
			return {
				headline: 'Try Emergency Course',
				body:     'Fast-track your prep with our crash course + 6 practice tests.',
				cta:      'See Plans',
				href:     'https://tstprep.com/sp/toefl-emergency-course/'
			};
		case 'emergency_basic':
			return {
				headline: 'Upgrade to Premium',
				body:     'Get 6 full practice tests + full Emergency Course access.',
				cta:      'Upgrade Now',
				href:     'https://tstprep.com/sp/toefl-emergency-course/'
			};
		case 'emergency_premium':
			return {
				headline: 'Try Score Builder',
				body:     '10 practice tests + 6 expert courses for lasting score gains.',
				cta:      'Learn More',
				href:     'https://tstprep.com/sp/toefl-score-builder-program/'
			};
		case 'score_builder':
			return {
				headline: 'Get Private Lessons',
				body:     '1-on-1 coaching with a TOEFL expert to hit your target score faster.',
				cta:      'Book a Lesson',
				href:     'https://tstprep.com/sp/private-lessons-for-the-toefl-ibt/'
			};
		case 'private_lessons':
			return null;
		case 'unlock_all_tests':
			return {
				headline: 'Add Score Builder',
				body:     'Pair your 15 tests with expert courses to maximize your score.',
				cta:      'Learn More',
				href:     'https://tstprep.com/sp/toefl-score-builder-program/'
			};
		default:
			return null;
	}
}
