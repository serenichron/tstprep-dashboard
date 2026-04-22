<script lang="ts">
	import type { QuizAnswers, WeakArea } from '../types';
	import type { Section } from '$lib/types';

	let {
		answers,
		onNext
	}: {
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	let picks = $state<WeakArea[]>([...answers.weakAreas]);

	const sectionIconPaths: Record<Section, string[]> = {
		Reading:   ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
		Listening: ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
		Speaking:  ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2'],
		Writing:   ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'],
		General:   []
	};

	const sections: { value: Section; label: string }[] = [
		{ value: 'Reading',   label: 'Reading'   },
		{ value: 'Listening', label: 'Listening' },
		{ value: 'Speaking',  label: 'Speaking'  },
		{ value: 'Writing',   label: 'Writing'   }
	];

	function toggle(v: WeakArea) {
		if (v === 'all') {
			picks = picks.includes('all') ? [] : ['all'];
			return;
		}
		picks = picks.filter((p) => p !== 'all');
		picks = picks.includes(v) ? picks.filter((p) => p !== v) : [...picks, v];
	}

	const allSelected = $derived(picks.includes('all'));
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight">Which TOEFL section is hardest for you?</h2>
<p class="text-xs text-gray-500 mb-5">Select one or more.</p>

<div class="grid grid-cols-2 gap-2.5 mb-3">
	{#each sections as s}
		{@const on = picks.includes(s.value)}
		<button
			type="button"
			onclick={() => toggle(s.value)}
			class="border-2 rounded-xl py-4 px-3 flex flex-col items-center gap-2 transition-colors
				{on ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 hover:border-brand-green/60'}"
		>
			<svg class="w-6 h-6 {on ? 'text-brand-green' : 'text-gray-400'}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
				{#each sectionIconPaths[s.value] as d}<path {d} />{/each}
			</svg>
			<div class="flex items-center gap-1.5">
				<span class="w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0
					{on ? 'border-brand-green bg-brand-green' : 'border-gray-300'}">
					{#if on}
						<svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{/if}
				</span>
				<span class="text-sm font-medium text-gray-900">{s.label}</span>
			</div>
		</button>
	{/each}
</div>

<button
	type="button"
	onclick={() => toggle('all')}
	class="w-full text-left border-2 rounded-xl px-4 py-3 flex items-center gap-3 mb-6 transition-colors
		{allSelected ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 hover:border-brand-green/60'}"
>
	<span class="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
		{allSelected ? 'border-brand-green bg-brand-green' : 'border-gray-300'}">
		{#if allSelected}<span class="w-1.5 h-1.5 rounded-full bg-white"></span>{/if}
	</span>
	<span class="text-sm text-gray-900">I'm not sure — all sections need work</span>
</button>

<button
	onclick={() => picks.length > 0 && onNext({ weakAreas: picks })}
	disabled={picks.length === 0}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
	Next →
</button>
