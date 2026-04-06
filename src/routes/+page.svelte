<script lang="ts">
	import { base } from '$app/paths';
	import ScoreGauge from '$lib/components/ScoreGauge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import {
		mockUser,
		scoreHistory,
		weeklyActivity,
		practiceTests,
		practiceSets,
		courses
	} from '$lib/data/content';

	const daysUntilExam = mockUser.examDate
		? Math.max(0, Math.ceil((new Date(mockUser.examDate).getTime() - Date.now()) / 86400000))
		: null;

	const recommendations = [
		{
			label: 'Speaking',
			reason: "You haven't tried Speaking yet",
			cta: 'Start Speaking Practice',
			href: `${base}/library`,
			icon: '🎤'
		},
		{
			label: 'Writing',
			reason: "You haven't tried Writing yet",
			cta: 'Start Writing Practice',
			href: `${base}/library`,
			icon: '✍️'
		}
	];

	const stats = [
		{ label: 'Questions Answered', value: weeklyActivity.questionsAnswered, icon: '✅', color: 'text-brand-green' },
		{ label: 'Tests Completed',    value: weeklyActivity.testsCompleted,    icon: '📋', color: 'text-blue-500' },
		{ label: 'Minutes Studied',    value: weeklyActivity.minutesStudied,    icon: '⏱️', color: 'text-purple-500' }
	];

	const chartMax = 6;
	const chartH = 80;
	const chartPoints = scoreHistory.map((d, i) => ({
		...d,
		x: 30 + (i / (scoreHistory.length - 1)) * 220,
		y: chartH - (d.score / chartMax) * chartH
	}));
	const polyline = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');
	const areaPath = `M${chartPoints[0].x},${chartH} ${chartPoints.map((p) => `L${p.x},${p.y}`).join(' ')} L${chartPoints[chartPoints.length - 1].x},${chartH} Z`;

	const inProgress = [
		practiceSets.find((s) => s.completionPercent > 0 && s.completionPercent < 100),
		practiceSets.find((s) => s.id === 202)
	].filter(Boolean);
</script>

<svelte:head>
	<title>Dashboard – TST Prep</title>
</svelte:head>

<div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
	<!-- Header -->
	<div class="flex items-start justify-between mb-6 lg:mb-8">
		<div>
			<h1 class="text-xl sm:text-2xl font-black text-gray-900">
				Good morning, <span class="text-brand-green">{mockUser.firstName}</span> 👋
			</h1>
			<p class="text-gray-400 text-sm mt-1">
				{#if daysUntilExam !== null}
					<span class="text-brand-pink font-semibold">⏰ {daysUntilExam} days</span> until your exam · Keep it up!
				{:else}
					Here's your study overview for today.
				{/if}
			</p>
		</div>
		<div class="flex items-center gap-2 bg-white rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-card flex-shrink-0">
			<span class="text-xl sm:text-2xl">🔥</span>
			<div>
				<p class="text-lg sm:text-xl font-black text-gray-900 leading-none">{mockUser.streak}</p>
				<p class="text-xs text-gray-400 leading-none">day streak</p>
			</div>
		</div>
	</div>

	<!-- Score + Trend -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
		<div class="card lg:col-span-1">
			<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Your Score</h2>
			<ScoreGauge score={mockUser.currentScore} maxScore={6} targetScore={mockUser.targetScore} />
			<div class="mt-2 flex items-center justify-between text-xs text-gray-400">
				<span>Started: 2.5</span>
				<span class="text-brand-green font-semibold">+{(mockUser.currentScore - 2.5).toFixed(1)} improvement</span>
			</div>
		</div>

		<div class="card lg:col-span-2">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Score Trend</h2>
					<p class="text-xs text-gray-400 mt-0.5">Last 6 weeks</p>
				</div>
				<a href="{base}/progress" class="text-xs text-brand-green font-semibold hover:underline">Full analytics →</a>
			</div>
			<svg viewBox="0 0 280 100" class="w-full" preserveAspectRatio="none" style="height: 110px;">
				{#each [1, 2, 3, 4, 5, 6] as line}
					<line x1="20" y1={chartH - (line / chartMax) * chartH} x2="260" y2={chartH - (line / chartMax) * chartH} stroke="#f3f4f6" stroke-width="1" />
					<text x="14" y={chartH - (line / chartMax) * chartH + 3} font-size="7" fill="#d1d5db" text-anchor="end">{line}</text>
				{/each}
				<path d={areaPath} fill="#00b18920" />
				<polyline points={polyline} fill="none" stroke="#00b189" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
				{#each chartPoints as pt}
					<circle cx={pt.x} cy={pt.y} r="3.5" fill="#00b189" stroke="white" stroke-width="1.5" />
					<text x={pt.x} y={chartH + 12} font-size="7.5" fill="#9ca3af" text-anchor="middle">{pt.date}</text>
				{/each}
				<line x1="20" y1={chartH - (mockUser.targetScore / chartMax) * chartH} x2="260" y2={chartH - (mockUser.targetScore / chartMax) * chartH} stroke="#ff5859" stroke-width="1.5" stroke-dasharray="4 3" />
				<text x="262" y={chartH - (mockUser.targetScore / chartMax) * chartH + 3} font-size="7" fill="#ff5859">Goal</text>
			</svg>
		</div>
	</div>

	<!-- Weekly Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 lg:mb-6">
		{#each stats as stat}
			<div class="card py-3 sm:py-4">
				<div class="flex items-center gap-3">
					<span class="text-2xl">{stat.icon}</span>
					<div>
						<p class="text-xl sm:text-2xl font-black {stat.color}">{stat.value}</p>
						<p class="text-xs text-gray-400">{stat.label} this week</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Bottom row -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
		<!-- Recommended -->
		<div class="card">
			<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recommended Next</h2>
			<div class="space-y-3">
				{#each recommendations as rec}
					<div class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-brand-green-light transition-colors">
						<span class="text-xl">{rec.icon}</span>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold text-gray-800">{rec.label}</p>
							<p class="text-xs text-gray-400 mt-0.5">{rec.reason}</p>
							<a href={rec.href} class="text-xs text-brand-green font-semibold mt-1 inline-block hover:underline">{rec.cta} →</a>
						</div>
					</div>
				{/each}
				<a href="{base}/library" class="block text-center text-xs text-gray-400 hover:text-brand-green transition-colors pt-1">Browse all content →</a>
			</div>
		</div>

		<!-- Continue Studying -->
		<div class="card">
			<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Continue Studying</h2>
			<div class="space-y-4">
				{#each inProgress as item}
					{#if item}
						<div>
							<div class="flex items-center justify-between mb-1">
								<div class="flex items-center gap-2">
									<SectionBadge section={item.section} />
									<p class="text-xs font-semibold text-gray-700 truncate max-w-[160px]">{item.title.replace('Free Interactive ', '').replace(' for the TOEFL Test', '')}</p>
								</div>
								<span class="text-xs font-bold text-brand-green">{item.completionPercent}%</span>
							</div>
							<ProgressBar percent={item.completionPercent} />
							<p class="text-xs text-gray-400 mt-1">{item.questionCount} questions</p>
						</div>
					{/if}
				{/each}
				<a href="{base}/library" class="btn-secondary w-full text-center block mt-2">Go to Library</a>
			</div>
		</div>

		<!-- XP & Level -->
		<div class="card md:col-span-2 lg:col-span-1">
			<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Your Progress</h2>
			<div class="flex flex-col items-center text-center">
				<div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-green to-blue-400 rounded-full flex items-center justify-center mb-3">
					<span class="text-white text-xl sm:text-2xl">⭐</span>
				</div>
				<p class="font-black text-gray-900 text-lg">{mockUser.level}</p>
				<p class="text-xs text-gray-400 mb-3">{mockUser.xp.toLocaleString()} XP</p>
				<div class="w-full mb-1">
					<ProgressBar percent={((mockUser.xp % 500) / 500) * 100} color="bg-blue-500" />
				</div>
				<p class="text-xs text-gray-400">{500 - (mockUser.xp % 500)} XP to next level</p>
				<div class="mt-4 grid grid-cols-2 gap-2 w-full">
					<div class="bg-brand-green-light rounded-xl p-2 text-center">
						<p class="text-brand-green font-black text-lg">{practiceTests.filter(t => t.attempts > 0).length}</p>
						<p class="text-xs text-gray-400">Tests Taken</p>
					</div>
					<div class="bg-blue-50 rounded-xl p-2 text-center">
						<p class="text-blue-500 font-black text-lg">{mockUser.streak}</p>
						<p class="text-xs text-gray-400">Day Streak</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if mockUser.plan === 'free'}
		<div class="mt-4 lg:mt-6 bg-gradient-to-r from-brand-pink to-orange-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
			<div>
				<p class="font-black text-base sm:text-lg">You've used both free tests 🎯</p>
				<p class="text-sm opacity-90 mt-0.5">Unlock 13 more full practice tests + all Score Builder courses</p>
			</div>
			<button class="bg-white text-brand-pink font-black px-5 sm:px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0 w-full sm:w-auto text-center">
				Upgrade to Premium
			</button>
		</div>
	{/if}
</div>
