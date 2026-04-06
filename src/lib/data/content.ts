import type { PracticeTest, PracticeSet, Course, Resource, HistoryEntry, User } from '$lib/types';

// ─── Mock User ────────────────────────────────────────────────────────────────

export const mockUser: User = {
	name: 'Alex Johnson',
	firstName: 'Alex',
	email: 'alex@example.com',
	plan: 'free',
	currentScore: 3.5,
	targetScore: 5.0,
	examDate: '2026-06-15',
	streak: 7,
	xp: 1240,
	level: 'Practitioner',
	joinDate: '2026-02-10'
};

// ─── Score History (for chart) ────────────────────────────────────────────────

export const scoreHistory = [
	{ date: 'Mar 1', score: 2.5 },
	{ date: 'Mar 8', score: 2.5 },
	{ date: 'Mar 15', score: 3.0 },
	{ date: 'Mar 22', score: 3.0 },
	{ date: 'Mar 29', score: 3.5 },
	{ date: 'Apr 5', score: 3.5 }
];

// ─── Practice Tests ───────────────────────────────────────────────────────────

export const practiceTests: PracticeTest[] = [
	{
		id: 101,
		type: 'test',
		title: 'TOEFL Practice Test #1',
		testNumber: 1,
		sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
		access: 'free',
		bestScore: 3.5,
		lastAttempt: '2026-03-29',
		attempts: 2,
		duration: '~3 hours',
		rating: 4.7,
		ratingCount: 312
	},
	{
		id: 102,
		type: 'test',
		title: 'TOEFL Practice Test #2',
		testNumber: 2,
		sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
		access: 'free',
		bestScore: null,
		lastAttempt: null,
		attempts: 0,
		duration: '~3 hours',
		rating: 4.6,
		ratingCount: 189
	},
	...Array.from({ length: 13 }, (_, i) => ({
		id: 103 + i,
		type: 'test' as const,
		title: `TOEFL Practice Test #${i + 3}`,
		testNumber: i + 3,
		sections: ['Reading', 'Listening', 'Speaking', 'Writing'] as const,
		access: 'locked' as const,
		bestScore: null,
		lastAttempt: null,
		attempts: 0,
		duration: '~3 hours',
		rating: 4.5 + Math.round(Math.random() * 4) / 10,
		ratingCount: Math.floor(50 + Math.random() * 200)
	}))
];

// ─── Practice Question Sets ───────────────────────────────────────────────────

export const practiceSets: PracticeSet[] = [
	{
		id: 201,
		type: 'practice',
		title: 'Free Interactive Reading Practice Questions',
		section: 'Reading',
		access: 'free',
		questionCount: 36,
		completionPercent: 72,
		difficulty: 'Intermediate',
		rating: 4.8,
		ratingCount: 423
	},
	{
		id: 202,
		type: 'practice',
		title: 'Free Interactive Listening Practice Questions',
		section: 'Listening',
		access: 'free',
		questionCount: 28,
		completionPercent: 50,
		difficulty: 'Intermediate',
		rating: 4.7,
		ratingCount: 387
	},
	{
		id: 203,
		type: 'practice',
		title: 'Free Interactive Speaking Practice Questions',
		section: 'Speaking',
		access: 'free',
		questionCount: 20,
		completionPercent: 0,
		difficulty: 'Advanced',
		rating: 4.9,
		ratingCount: 501
	},
	{
		id: 204,
		type: 'practice',
		title: 'Free Interactive Writing Practice Questions',
		section: 'Writing',
		access: 'free',
		questionCount: 16,
		completionPercent: 0,
		difficulty: 'Advanced',
		rating: 4.6,
		ratingCount: 278
	},
	{
		id: 205,
		type: 'practice',
		title: 'Advanced Reading Comprehension Drills',
		section: 'Reading',
		access: 'locked',
		questionCount: 60,
		completionPercent: 0,
		difficulty: 'Advanced',
		rating: 4.8,
		ratingCount: 145
	},
	{
		id: 206,
		type: 'practice',
		title: 'Listening Detail & Inference Questions',
		section: 'Listening',
		access: 'locked',
		questionCount: 45,
		completionPercent: 0,
		difficulty: 'Advanced',
		rating: 4.7,
		ratingCount: 132
	}
];

// ─── Skill Courses ────────────────────────────────────────────────────────────

export const courses: Course[] = [
	{
		id: 301,
		type: 'course',
		title: 'Emergency Course for the TOEFL® – 2026',
		section: 'General',
		access: 'locked',
		lessonCount: 12,
		progressPercent: 0,
		thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
		rating: 4.9,
		ratingCount: 634,
		tag: 'Popular'
	},
	{
		id: 302,
		type: 'course',
		title: 'Introduction to the Score Builder for the TOEFL Test',
		section: 'General',
		access: 'locked',
		lessonCount: 8,
		progressPercent: 0,
		thumbnail: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&q=80',
		rating: 4.7,
		ratingCount: 412
	},
	{
		id: 303,
		type: 'course',
		title: 'The TOEFL Reading Score Builder Course – 2026',
		section: 'Reading',
		access: 'locked',
		lessonCount: 18,
		progressPercent: 0,
		thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
		rating: 4.8,
		ratingCount: 289
	},
	{
		id: 304,
		type: 'course',
		title: 'The TOEFL Listening Score Builder Course – 2026',
		section: 'Listening',
		access: 'locked',
		lessonCount: 15,
		progressPercent: 0,
		thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
		rating: 4.8,
		ratingCount: 267
	},
	{
		id: 305,
		type: 'course',
		title: 'The TOEFL Speaking Score Builder Course – 2026',
		section: 'Speaking',
		access: 'locked',
		lessonCount: 14,
		progressPercent: 0,
		thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80',
		rating: 4.9,
		ratingCount: 351,
		tag: 'Most Popular'
	},
	{
		id: 306,
		type: 'course',
		title: 'The TOEFL Writing Score Builder Course – 2026',
		section: 'Writing',
		access: 'locked',
		lessonCount: 13,
		progressPercent: 0,
		thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
		rating: 4.7,
		ratingCount: 198
	}
];

// ─── Resources (PDFs) ─────────────────────────────────────────────────────────

export const resources: Resource[] = [
	{
		id: 401,
		type: 'resource',
		title: 'Complete Practice Test #1 – PDF Format',
		section: 'General',
		access: 'free',
		description: 'Full 4-section TOEFL practice test in printable PDF format.',
		fileSize: '2.4 MB',
		downloadUrl: '#'
	},
	{
		id: 402,
		type: 'resource',
		title: 'Complete Practice Test #2 – PDF Format',
		section: 'General',
		access: 'free',
		description: 'Full 4-section TOEFL practice test in printable PDF format.',
		fileSize: '2.6 MB',
		downloadUrl: '#'
	},
	{
		id: 403,
		type: 'resource',
		title: '100 Practice Questions – Reading Section',
		section: 'Reading',
		access: 'free',
		description: '100 TOEFL-style reading comprehension questions with answer key.',
		fileSize: '1.8 MB',
		downloadUrl: '#'
	},
	{
		id: 404,
		type: 'resource',
		title: '100 Practice Questions – Listening Section',
		section: 'Listening',
		access: 'free',
		description: '100 TOEFL-style listening questions with transcripts and answer key.',
		fileSize: '1.5 MB',
		downloadUrl: '#'
	},
	{
		id: 405,
		type: 'resource',
		title: 'Self-Grading Rubrics – Speaking & Writing',
		section: 'General',
		access: 'free',
		description: 'Official-style rubrics for self-assessing Speaking and Writing responses.',
		fileSize: '0.8 MB',
		downloadUrl: '#'
	},
	{
		id: 406,
		type: 'resource',
		title: 'Free Practice Questions – Speaking Section',
		section: 'Speaking',
		access: 'free',
		description: 'Sample Speaking prompts with model answers and scoring notes.',
		fileSize: '1.1 MB',
		downloadUrl: '#'
	},
	{
		id: 407,
		type: 'resource',
		title: 'Free Practice Questions – Writing Section',
		section: 'Writing',
		access: 'free',
		description: 'Sample Writing tasks (Integrated & Independent) with model essays.',
		fileSize: '1.3 MB',
		downloadUrl: '#'
	}
];

// ─── Submission History ───────────────────────────────────────────────────────

export const submissionHistory: HistoryEntry[] = [
	{
		id: 1,
		date: '2026-03-29',
		contentType: 'test',
		title: 'TOEFL Practice Test #1',
		score: 3.5,
		maxScore: 6,
		duration: '2h 47m',
		testNumber: 1
	},
	{
		id: 2,
		date: '2026-03-22',
		contentType: 'practice',
		title: 'Free Interactive Reading Practice Questions',
		section: 'Reading',
		score: null,
		maxScore: 6,
		percentCorrect: 72,
		duration: '38m'
	},
	{
		id: 3,
		date: '2026-03-18',
		contentType: 'practice',
		title: 'Free Interactive Listening Practice Questions',
		section: 'Listening',
		score: null,
		maxScore: 6,
		percentCorrect: 61,
		duration: '44m'
	},
	{
		id: 4,
		date: '2026-03-10',
		contentType: 'test',
		title: 'TOEFL Practice Test #1',
		score: 3.0,
		maxScore: 6,
		duration: '3h 02m',
		testNumber: 1
	},
	{
		id: 5,
		date: '2026-03-05',
		contentType: 'practice',
		title: 'Free Interactive Reading Practice Questions',
		section: 'Reading',
		score: null,
		maxScore: 6,
		percentCorrect: 58,
		duration: '42m'
	}
];

// ─── Weekly Activity ──────────────────────────────────────────────────────────

export const weeklyActivity = {
	questionsAnswered: 84,
	testsCompleted: 1,
	minutesStudied: 187,
	streak: 7
};
