<script lang="ts">
	import { mockUser, practiceSets, practiceTests } from '$lib/data/content';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import type { Section } from '$lib/types';

	const sectionScores: { section: Section; score: number; change: number; color: string; questionTypes: { id: string; label: string; accuracy: number }[] }[] = [
		{
			section: 'Reading', score: 3.5, change: +0.5, color: 'bg-blue-500',
			questionTypes: [
				{ id: 'reading_academic_passage',   label: 'Academic Passage',   accuracy: 71 },
				{ id: 'reading_complete_the_words', label: 'Complete the Words', accuracy: 82 },
				{ id: 'reading_daily_life',         label: 'Read in Daily Life', accuracy: 58 }
			]
		},
		{
			section: 'Listening', score: 3.5, change: +0.5, color: 'bg-purple-500',
			questionTypes: [
				{ id: 'listening_listen_and_choose', label: 'Listen and Choose',  accuracy: 75 },
				{ id: 'listening_conversation',      label: 'Conversation',        accuracy: 61 },
				{ id: 'listening_academic_talk',     label: 'Academic Talk',       accuracy: 48 }
			]
		},
		{
			section: 'Speaking', score: 0, change: 0, color: 'bg-orange-500',
			questionTypes: [
				{ id: 'speaking_listen_and_repeat', label: 'Listen and Repeat', accuracy: 0 },
				{ id: 'speaking_take_an_interview', label: 'Take an Interview',  accuracy: 0 }
			]
		},
		{
			section: 'Writing', score: 0, change: 0, color: 'bg-pink-500',
			questionTypes: [
				{ id: 'writing_build_a_sentence',    label: 'Build a Sentence',    accuracy: 0 },
				{ id: 'writing_write_an_email',      label: 'Write an Email',       accuracy: 0 },
				{ id: 'writing_academic_discussion', label: 'Academic Discussion',  accuracy: 0 }
			]
		}
	];

	const testsAttempted = practiceTests.filter((t) => t.attempts > 0).length;
	const testsFree      = practiceTests.filter((t) => t.access === 'free').length;
	const xpToNextLevel  = 500 - (mockUser.xp % 500);
	const xpProgress     = ((mockUser.xp % 500) / 500) * 100;

	const badges = [
		{ icon: '🏆', label: 'First Test',    earned: testsAttempted >= 1,       desc: 'Completed first practice test' },
		{ icon: '📈', label: 'Improving',     earned: true,                      desc: 'Score improved +1.0' },
		{ icon: '💯', label: '100 Questions', earned: true,                      desc: 'Answered 100+ questions' },
		{ icon: '🔥', label: '7-Day Streak',  earned: mockUser.streak >= 7,      desc: '7 consecutive study days' },
		{ icon: '🎯', label: 'Score 4.0+',    earned: mockUser.currentScore >= 4, desc: 'Reached score of 4.0' },
		{ icon: '🌟', label: 'Score 5.0+',    earned: mockUser.currentScore >= 5, desc: 'Reached score of 5.0' }
	];
</script>

<svelte:head>
	<title>My Progress – TST Prep</title>
</svelte:head>

<div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
	<div class="mb-5 sm:mb-6">
		<h1 class="text-xl sm:text-2xl font-black text-gray-900">My Progress</h1>
		<p class="text-gray-400 text-sm mt-1">Section breakdown, question types, and achievements</p>
	</div>

	<!-- Top stats -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
		<div class="card text-center p-4 sm:p-6">
			<p class="text-2xl sm:text-3xl font-black text-brand-green">{mockUser.currentScore.toFixed(1)}</p>
			<p class="text-xs text-gray-400 mt-1">Overall Score</p>
			<p class="text-xs text-brand-green font-semibold mt-0.5">Target: {mockUser.targetScore.toFixed(1)}</p>
		</div>
		<div class="card text-center p-4 sm:p-6">
			<p class="text-2xl sm:text-3xl font-black text-blue-500">{testsAttempted}/{testsFree}</p>
			<p class="text-xs text-gray-400 mt-1">Free Tests Used</p>
			<p class="text-xs text-gray-300 mt-0.5">+13 with Premium</p>
		</div>
		<div class="card text-center p-4 sm:p-6">
			<p class="text-2xl sm:text-3xl font-black text-orange-500">{mockUser.streak}</p>
			<p class="text-xs text-gray-400 mt-1">Day Streak 🔥</p>
			<p class="text-xs text-gray-300 mt-0.5">Keep it going!</p>
		</div>
		<div class="card text-center p-4 sm:p-6">
			<p class="text-2xl sm:text-3xl font-black text-purple-500">{mockUser.xp.toLocaleString()}</p>
			<p class="text-xs text-gray-400 mt-1">Total XP</p>
			<p class="text-xs text-purple-400 mt-0.5">{mockUser.level}</p>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
		<!-- Section scores (left 2 cols on desktop, full width on mobile) -->
		<div class="lg:col-span-2 space-y-4">
			<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Section Performance</h2>
			{#each sectionScores as sec}
				<div class="card p-4 sm:p-6">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							<SectionBadge section={sec.section} size="md" />
							<div>
								<h3 class="font-bold text-gray-900">{sec.section}</h3>
								{#if sec.score > 0}
									<p class="text-xs text-gray-400">{sec.questionTypes.length} question types</p>
								{:else}
									<p class="text-xs text-brand-pink font-medium">Not attempted yet</p>
								{/if}
							</div>
						</div>
						<div class="text-right">
							{#if sec.score > 0}
								<p class="text-2xl font-black text-gray-900">{sec.score.toFixed(1)}</p>
								<p class="text-xs {sec.change >= 0 ? 'text-brand-green' : 'text-brand-pink'} font-semibold">
									{sec.change >= 0 ? '+' : ''}{sec.change.toFixed(1)}
								</p>
							{:else}
								<p class="text-sm text-gray-300 font-medium">—</p>
							{/if}
						</div>
					</div>
					<div class="space-y-2.5">
						{#each sec.questionTypes as qt}
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">{qt.label}</span>
									<span class="font-semibold {qt.accuracy >= 70 ? 'text-brand-green' : qt.accuracy >= 50 ? 'text-yellow-500' : qt.accuracy === 0 ? 'text-gray-300' : 'text-brand-pink'}">
										{qt.accuracy > 0 ? `${qt.accuracy}%` : 'Not started'}
									</span>
								</div>
								<ProgressBar
									percent={qt.accuracy}
									color={qt.accuracy >= 70 ? 'bg-brand-green' : qt.accuracy >= 50 ? 'bg-yellow-400' : qt.accuracy === 0 ? 'bg-gray-100' : 'bg-brand-pink'}
								/>
							</div>
						{/each}
					</div>
					{#if sec.score === 0}
						<div class="mt-4">
							<a href="/library" class="btn-secondary text-xs px-4 py-2 inline-block">Start {sec.section} Practice →</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Right column -->
		<div class="space-y-4">
			<!-- XP card -->
			<div class="card p-4 sm:p-6">
				<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Level & XP</h2>
				<div class="flex flex-col items-center text-center mb-4">
					<div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-green to-blue-500 rounded-full flex items-center justify-center mb-2">
						<span class="text-2xl sm:text-3xl">⭐</span>
					</div>
					<p class="font-black text-xl text-gray-900">{mockUser.level}</p>
					<p class="text-sm text-gray-400">{mockUser.xp.toLocaleString()} XP</p>
				</div>
				<ProgressBar percent={xpProgress} color="bg-purple-500" height="h-2" />
				<p class="text-xs text-center text-gray-400 mt-2">{xpToNextLevel} XP to next level</p>
				<div class="mt-4 pt-4 border-t border-gray-50">
					<p class="text-xs font-semibold text-gray-500 mb-2">Earn XP by:</p>
					<div class="space-y-1 text-xs text-gray-400">
						<p>✅ Complete a practice set → +50 XP</p>
						<p>📋 Finish a full test → +200 XP</p>
						<p>🔥 Daily login → +10 XP</p>
						<p>📈 Score improvement → +100 XP</p>
					</div>
				</div>
			</div>

			<!-- Badges -->
			<div class="card p-4 sm:p-6">
				<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Badges</h2>
				<div class="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
					{#each badges as badge}
						<div
							class="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl transition-all
							{badge.earned ? 'bg-brand-green-light' : 'bg-gray-50 opacity-50'}"
							title={badge.desc}
						>
							<span class="text-xl sm:text-2xl mb-1 {!badge.earned ? 'grayscale' : ''}">{badge.icon}</span>
							<p class="text-[10px] sm:text-xs font-bold {badge.earned ? 'text-gray-800' : 'text-gray-400'}">{badge.label}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Study plan upsell -->
			<div class="bg-gradient-to-br from-brand-green to-blue-500 rounded-2xl p-4 text-white">
				<p class="text-sm font-black mb-1">📅 Study Plan</p>
				<p class="text-xs opacity-90 mb-3">Get a personalized weekly study plan based on your exam date and target score.</p>
				<button class="w-full bg-white text-brand-green text-xs font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors">
					Generate My Plan (Premium)
				</button>
			</div>
		</div>
	</div>
</div>
