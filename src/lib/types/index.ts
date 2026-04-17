export type Section = 'Reading' | 'Listening' | 'Speaking' | 'Writing' | 'General';

export type ContentType = 'test' | 'practice' | 'course' | 'resource';

export type AccessLevel = 'free' | 'locked';

export type UserPlan =
	| 'free'
	| 'emergency_basic'
	| 'emergency_premium'
	| 'score_builder'
	| 'private_lessons'
	| 'unlock_all_tests';

export interface PracticeTest {
	id: number;
	type: 'test';
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
	sectionScores?: Partial<Record<'Reading' | 'Listening' | 'Speaking' | 'Writing', number | null>>;
}

export interface PracticeSet {
	id: number;
	type: 'practice';
	title: string;
	section: Section;
	access: AccessLevel;
	questionCount: number;
	completionPercent: number;
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
	rating: number;
	ratingCount: number;
}

export interface Course {
	id: number;
	type: 'course';
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
	type: 'resource';
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
