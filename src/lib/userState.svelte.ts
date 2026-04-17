import type { UserPlan } from '$lib/types';

// ─── Reactive shared plan state (class pattern avoids ES module assignment error) ──
class UserState {
	plan = $state<UserPlan>('free');
}
export const userState = new UserState();

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
	emergency_basic:  4,  // 2 free + 2 from product (tests 3–4)
	emergency_premium:8,  // 2 free + 6 from product (tests 3–8)
	score_builder:    12, // 2 free + 10 from product (tests 3–12)
	private_lessons:  15, // 2 free + 13 from product (tests 3–15)
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
	if (testNumber <= 2) return true; // always free
	return testNumber <= testCounts[userState.plan];
}

export function isCourseAccessible(courseId: number): boolean {
	return courseAccess[courseId]?.includes(userState.plan) ?? false;
}

// ─── Sidebar upsell config ────────────────────────────────────────────────────
export interface UpsellConfig {
	headline: string;
	body:     string;
	cta:      string;
	href:     string;
}

export function getUpsell(): UpsellConfig | null {
	switch (userState.plan) {
		case 'free':
			return {
				headline: 'Try Emergency Course',
				body:     'Fast-track your prep with our crash course + 6 practice tests.',
				cta:      'See Plans',
				href:     'https://tstprep.com/sp/toefl-emergency-course/'
			};
		case 'emergency_basic':
			return {
				headline: 'Try Score Builder',
				body:     '10 practice tests + 6 expert courses built for lasting score gains.',
				cta:      'Learn More',
				href:     'https://tstprep.com/sp/toefl-score-builder-program/'
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
			return {
				headline: 'Keep the momentum',
				body:     'You\'re on the fastest path to your target score. Book your next session to stay on track.',
				cta:      'Schedule a Lesson',
				href:     'https://tstprep.com/sp/private-lessons-for-the-toefl-ibt/'
			};
		case 'unlock_all_tests':
			return {
				headline: 'Unlock All 15 Tests',
				body:     'Get instant access to all 15 full TOEFL practice tests — no restrictions.',
				cta:      'Unlock Now',
				href:     'https://tstprep.com/sp/toefl-ibt-practice-tests/'
			};
		default:
			return null;
	}
}
