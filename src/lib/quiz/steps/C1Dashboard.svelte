<script lang="ts">
	import type { CohortUser } from '../types';

	let {
		user,
		onExit
	}: {
		user: CohortUser;
		onExit: () => void;
	} = $props();

	// Identify weakest & strongest from user's known scores
	const entries = Object.entries(user.sectionScores ?? {}) as [string, number][];
	const sorted = [...entries].sort((a, b) => a[1] - b[1]);
	const weakest = sorted[0];
	const strongest = sorted[sorted.length - 1];
</script>

<!-- Dark profile strip -->
<div class="bg-gray-900 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-5 rounded-xl">
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Your Profile</p>
	<div class="space-y-1 text-xs text-gray-100">
		{#if user.ownedCourses}
			<div class="flex justify-between gap-2"><span class="text-gray-400">Courses owned</span><span class="text-brand-green text-right">{user.ownedCourses.join(', ')}</span></div>
		{/if}
		<div class="flex justify-between"><span class="text-gray-400">Practice tests</span><span>{user.testsCompleted} completed</span></div>
		<div class="flex justify-between"><span class="text-gray-400">Current level</span><span>{user.overallScore?.toFixed(1)} avg</span></div>
		{#if weakest}
			<div class="flex justify-between"><span class="text-gray-400">Weakest area</span><span class="text-orange-400">{weakest[0]} ({weakest[1].toFixed(1)} ⚠)</span></div>
		{/if}
		{#if strongest}
			<div class="flex justify-between"><span class="text-gray-400">Strongest area</span><span>{strongest[0]} ({strongest[1].toFixed(1)})</span></div>
		{/if}
	</div>
</div>

<p class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Recommended For You</p>
<p class="text-xs text-gray-600 mb-4 leading-relaxed">
	Your {weakest?.[0] ?? 'weakest'} score is holding back your overall average.
</p>

<div class="relative border-2 border-brand-green rounded-xl p-4 mb-3">
	<span class="absolute -top-2.5 right-4 bg-brand-green text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
		★ Best for You
	</span>
	<h3 class="text-sm font-semibold text-gray-900 mb-1">{weakest?.[0] ?? 'Speaking'} Evaluations</h3>
	<p class="text-xs text-gray-600 leading-relaxed mb-3">Expert feedback on your responses from real TOEFL graders.</p>
	<button class="w-full bg-brand-green text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-brand-green-dark transition-colors">
		Get Evaluations →
	</button>
</div>

<div class="border-2 border-gray-200 rounded-xl p-4 mb-4">
	<h3 class="text-sm font-semibold text-gray-900 mb-1">Private {weakest?.[0] ?? 'Speaking'} Lessons</h3>
	<p class="text-xs text-gray-600 leading-relaxed mb-3">1-on-1 sessions on technique and response structure.</p>
	<button class="w-full border-2 border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg hover:border-gray-300 transition-colors">
		Book a Trial →
	</button>
</div>

{#if user.ownedCourses}
	<p class="text-[11px] text-gray-400 mb-5">
		Already owned: {user.ownedCourses.map((c) => c + ' ✓').join(', ')} — not shown above.
	</p>
{/if}

<button onclick={onExit} class="w-full text-xs text-gray-500 hover:text-gray-900 underline py-2">Back to scenarios</button>
