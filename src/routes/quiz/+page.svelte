<script lang="ts">
	import QuizFunnel from '$lib/quiz/QuizFunnel.svelte';
	import { cohortMeta } from '$lib/quiz/scenarios';
	import type { Cohort } from '$lib/quiz/types';

	let activeCohort = $state<Cohort | null>(null);

	function pick(id: Cohort) {
		activeCohort = id;
	}

	function exit() {
		activeCohort = null;
	}

	const accentClass: Record<'teal' | 'blue' | 'purple', string> = {
		teal:   'border-brand-green bg-brand-green-light text-brand-green-dark',
		blue:   'border-blue-300 bg-blue-50 text-blue-700',
		purple: 'border-purple-300 bg-purple-50 text-purple-700'
	};
</script>

<svelte:head>
	<title>Quiz Funnel · TST Prep</title>
</svelte:head>

{#if activeCohort}
	<QuizFunnel cohort={activeCohort} onExit={exit} />
{:else}
	<div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
		<div class="mb-8">
			<p class="text-[11px] font-bold uppercase tracking-wider text-brand-green mb-2">Dev Mode · Quiz Funnel</p>
			<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">Pick a scenario to test</h1>
			<p class="text-sm text-gray-600 leading-relaxed max-w-2xl">
				The real funnel will detect which cohort a user belongs to automatically. While the backend isn't wired up,
				pick a cohort below to simulate that user's experience end-to-end.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each cohortMeta as c}
				<button
					type="button"
					onclick={() => pick(c.id)}
					class="text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-brand-green hover:shadow-card transition-all group"
				>
					<div class="flex items-center justify-between mb-3">
						<span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border {accentClass[c.accent]}">
							Cohort {c.id}
						</span>
						<svg class="w-4 h-4 text-gray-300 group-hover:text-brand-green transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</div>
					<h2 class="text-base font-bold text-gray-900 mb-0.5">{c.title}</h2>
					<p class="text-xs text-gray-500 mb-3">{c.subtitle}</p>
					<p class="text-xs text-gray-700 leading-relaxed mb-3">{c.who}</p>
					<p class="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
						<span class="font-semibold text-gray-700">Flow:</span> {c.flow}
					</p>
				</button>
			{/each}
		</div>

		<div class="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
			<svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<p class="text-xs text-amber-900 leading-relaxed">
				<strong class="font-semibold">Heads up:</strong> backend signals (auth, orders, activity) are faked here.
				Product recommendations, AI scores, and user data are hardcoded mocks so the UX can be reviewed without a live API.
			</p>
		</div>
	</div>
{/if}
