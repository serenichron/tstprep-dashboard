import type { Cohort, QuizAnswers, RecommendationBundle, RecommendedProduct } from './types';
import { cohortUsers } from './scenarios';

// ─── Product catalogue (hardcoded for prototype) ────────────────────────────
const PRODUCTS: Record<string, RecommendedProduct> = {
	emergency: {
		id: 'emergency',
		title: 'TOEFL Emergency Course',
		description: 'Fastest path to your best possible score — all 4 sections with proven strategies for test day.',
		bullets: ['6 practice tests included', 'Crash-course video lessons', 'Perfect when the test is close'],
		url: 'https://tstprep.com/sp/toefl-emergency-course/'
	},
	scoreBuilder: {
		id: 'score-builder',
		title: 'TOEFL Score Builder Course',
		description: 'Comprehensive self-paced program covering all 4 sections with video lessons, practice exercises, and AI-powered feedback.',
		bullets: [
			'Covers Speaking and Writing intensively',
			'AI scoring on every practice task',
			'Proven to improve scores by 1–2 points'
		],
		url: 'https://tstprep.com/sp/toefl-score-builder-program/'
	},
	privateLessons: {
		id: 'private-lessons',
		title: 'Private Lessons',
		description: '1-on-1 sessions with a TOEFL expert. Custom study plan designed around your goals.',
		bullets: ['Start with a $19 trial', 'Flexible scheduling', 'Fastest way to improve'],
		url: 'https://tstprep.com/sp/private-lessons-for-the-toefl-ibt/'
	},
	speakingEvals: {
		id: 'speaking-evaluations',
		title: 'Speaking Evaluations',
		description: 'Expert human feedback on your speaking responses from real TOEFL graders.'
	},
	practiceTests: {
		id: 'practice-tests',
		title: 'Practice Test Pack',
		description: '15 AI-enhanced practice tests — the closest thing to the real exam.'
	},
	writingEvals: {
		id: 'writing-evaluations',
		title: 'Writing Evaluations',
		description: 'Detailed feedback on your essays from experienced TOEFL writing graders.'
	}
};

// ─── Testimonials keyed by focus area ───────────────────────────────────────
const TESTIMONIALS = {
	speaking: {
		quote: 'I was stuck at 3.5 and needed a 5.0 for my MBA program. The Score Builder course helped me focus on exactly what I needed. Got a 5.0 in 6 weeks!',
		author: 'Ana, Brazil (Admitted to Columbia Business School)'
	},
	writing: {
		quote: 'The writing templates and feedback turned my weakest section into a strength. Jumped from 3.0 to 5.0 in two months.',
		author: 'Daniel, Spain'
	},
	urgent: {
		quote: 'Three weeks to test day and the Emergency Course saved me. Hit my target and got into my top choice.',
		author: 'Leila, Morocco'
	},
	general: {
		quote: 'The personalized plan was exactly what I needed. Clear, structured, and actually enjoyable.',
		author: 'Hiro, Japan'
	}
};

const FREE_RESOURCES = [
	'TOEFL Speaking Tips: 10 Strategies for 2026',
	'TOEFL Writing Templates That Actually Work',
	'Free Practice Test (1 full-length)'
];

// ─── Matching logic ─────────────────────────────────────────────────────────
export function buildRecommendations(
	cohort: Cohort,
	answers: QuizAnswers
): RecommendationBundle {
	const user = cohortUsers[cohort];
	const owned = new Set(user.ownedCourses ?? []);

	// Primary = driven by urgency first, then learning style
	let primary: RecommendedProduct;
	let focus: 'speaking' | 'writing' | 'urgent' | 'general' = 'general';

	if (answers.testDate === 'urgent') {
		primary = { ...PRODUCTS.emergency, primary: true, badge: '⚡ For your timeline' };
		focus = 'urgent';
	} else if (answers.studyPreference === 'private') {
		primary = { ...PRODUCTS.privateLessons, primary: true, badge: '★ Best Match' };
	} else {
		primary = { ...PRODUCTS.scoreBuilder, primary: true, badge: '★ Best Match' };
	}

	// Weak-area focus for testimonial + secondary picks
	if (answers.weakAreas.includes('Speaking')) focus = focus === 'urgent' ? focus : 'speaking';
	else if (answers.weakAreas.includes('Writing')) focus = focus === 'urgent' ? focus : 'writing';

	// Secondary: weak-area evaluations + practice tests, minus owned + primary
	const candidates: RecommendedProduct[] = [];
	if (answers.weakAreas.includes('Speaking')) candidates.push(PRODUCTS.speakingEvals);
	if (answers.weakAreas.includes('Writing')) candidates.push(PRODUCTS.writingEvals);
	candidates.push(PRODUCTS.practiceTests);
	if (primary.id !== 'private-lessons') candidates.push(PRODUCTS.privateLessons);

	const secondary = candidates
		.filter((p) => p.id !== primary.id && !owned.has(titleToOwnedKey(p.title)))
		.slice(0, 2);

	return {
		primary,
		secondary,
		testimonial: TESTIMONIALS[focus],
		freeResources: FREE_RESOURCES
	};
}

// Map a product title to the string used in cohortUsers.ownedCourses
function titleToOwnedKey(title: string): string {
	if (title.includes('Score Builder')) return 'Score Builder';
	if (title.includes('Emergency')) return 'Emergency Course';
	return title;
}
