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

	const sections: { value: Section; label: string; icon: string }[] = [
		{ value: 'Reading',   label: 'Reading',   icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V5a2 2 0 012-2h12a2 2 0 012 2v12M4 19.5A2.5 2.5 0 006.5 22H20v-5' },
		{ value: 'Listening', label: 'Listening', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
		{ value: 'Speaking',  label: 'Speaking',  icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
		{ value: 'Writing',   label: 'Writing',   icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
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
			<svg class="w-6 h-6 {on ? 'text-brand-green' : 'text-gray-400'}" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d={s.icon} />
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
