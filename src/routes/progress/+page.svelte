<script lang="ts">
	import { mockUser, practiceSets, practiceTests } from '$lib/data/content';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import type { Section } from '$lib/types';

	const sectionScores: { section: Section; score: number; change: number; color: string; questionTypes: { label: string; accuracy: number }[] }[] = [
		{
			section: 'Reading',
			score: 3.5,
			change: +0.5,
			color: 'bg-blue-500',
			questionTypes: [
				{ label: 'Main Idea',    accuracy: 82 },
				{ label: 'Vocabulary',   accuracy: 74 },
				{ label: 'Inference',    accuracy: 58 },
				{ label: 'Detail',       accuracy: 71 },
				{ label: 'Organization', accuracy: 65 }
			]
		},
		{
			section: 'Listening',
			score: 3.5,
			change: +0.5,
			color: 'bg-purple-500',
			questionTypes: [
				{ label: 'Main Idea',  accuracy: 75 },
				{ label: 'Detail',     accuracy: 61 },
				{ label: 'Function',   accuracy: 55 },
				{ label: 'Attitude',   accuracy: 48 },
				{ label: 'Connecting', accuracy: 62 }
			]
		},
		{
			section: 'Speaking',
			score: 0,
			change: 0,
			color: 'bg-orange-500',
			questionTypes: [
				{ label: 'Task 1 (Independent)', accuracy: 0 },
				{ label: 'Task 2 (Campus)',       accuracy: 0 },
				{ label: 'Task 3 (Academic)',     accuracy: 0 },
				{ label: 'Task 4 (Lecture)',      accuracy: 0 }
			]
		},
		{
			section: 'Writing',
			score: 0,
			change: 0,
			color: 'bg-pink-500',
			questionTypes: [
				{ label: 'Integrated Task',  accuracy: 0 },
				{ label: 'Independent Task', accuracy: 0 }
			]
		}
	];

	const testsAttempted   = practiceTests.filter((t) => t.attempts > 0).length;
	const testsFree        = practiceTests.filter((t) => t.access === 'free').length;
	const xpToNextLevel    = 500 - (mockUser.xp % 500);
	const xpProgress       = ((mockUser.xp % 500) / 500) * 100;

	const badges = [
		{ icon: '🏆', label: 'First Test',   earned: testsAttempted >= 1,         desc: 'Completed first practice test' },
		{ icon: '📈', label: 'Improving',    earned: true,                         desc: 'Score improved +1.0' },
		{ icon: '💯', label: '100 Questions', earned: true,                        desc: 'Answered 100+ questions' },
		{ icon: '🔥', label: '7-Day Streak', earned: mockUser.streak >= 7,         desc: '7 consecutive study days' },
		{ icon: '🎯', label: 'Score 4.0+',   earned: mockUser.currentScore >= 4,   desc: 'Reached score of 4.0' },
		{ icon: '🌟', label: 'Score 5.0+',   earned: mockUser.currentScore >= 5,   desc: 'Reached score of 5.0' }
	];
</script>

<svelte:head>
	<title>My Progress – TST Prep</title>
</svelte:head>

<div class="px-8 py-8">
	<div class="mb-6">
		<h1 class="text-2xl font-black text-gray-900">My Progress</h1>
		<p class="text-gray-400 text-sm mt-1">Section breakdown, question types, and achievements</p>
	</div>

	<!-- Top stats row -->
	<div class="grid grid-cols-4 gap-4 mb-6">
		<div class="card text-center">
			<p class="text-3xl font-black text-brand-green">{mockUser.currentScore.toFixed(1)}</p>
			<p class="text-xs text-gray-400 mt-1">Overall Score</p>
			<p class="text-xs text-brand-green font-semibold mt-0.5">Target: {mockUser.targetScore.toFixed(1)}</p>
		</div>
		<div class="card text-center">
			<p class="text-3xl font-black text-blue-500">{testsAttempted}/{testsFree}</p>
			<p class="text-xs text-gray-400 mt-1">Free Tests Used</p>
			<p class="text-xs text-gray-300 mt-0.5">+13 with Premium</p>
		</div>
		<div class="card text-center">
			<p class="text-3xl font-black text-orange-500">{mockUser.streak}</p>
			<p class="text-xs text-gray-400 mt-1">Day Streak 🔥</p>
			<p class="text-xs text-gray-300 mt-0.5">Keep it going!</p>
		</div>
		<div class="card text-center">
			<p class="text-3xl font-black text-purple-500">{mockUser.xp.toLocaleString()}</p>
			<p class="text-xs text-gray-400 mt-1">Total XP</p>
			<p class="text-xs text-purple-400 mt-0.5">{mockUser.level}</p>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-6">
		<div class="col-span-2 space-y-4">
			<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Section Performance</h2>
			{#each sectionScores as sec}
				<div class="card">
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
							<a href="/library" class="btn-secondary text-xs px-4 py-2 inline-block">
								Start {sec.section} Practice →
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="space-y-4">
			<div class="card">
				<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Level & XP</h2>
				<div class="flex flex-col items-center text-center mb-4">
					<div class="w-20 h-20 bg-gradient-to-br from-brand-green to-blue-500 rounded-full flex items-center justify-center mb-2">
						<span class="text-3xl">⭐</span>
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

			<div class="card">
				<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Badges</h2>
				<div class="grid grid-cols-2 gap-3">
					{#each badges as badge}
						<div
							class="flex flex-col items-center text-center p-3 rounded-xl transition-all
							{badge.earned ? 'bg-brand-green-light' : 'bg-gray-50 opacity-50'}"
							title={badge.desc}
						>
							<span class="text-2xl mb-1 {!badge.earned ? 'grayscale' : ''}">{badge.icon}</span>
							<p class="text-xs font-bold {badge.earned ? 'text-gray-800' : 'text-gray-400'}">{badge.label}</p>
						</div>
					{/each}
				</div>
			</div>

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
