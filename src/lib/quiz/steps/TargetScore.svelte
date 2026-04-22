<script lang="ts">
	import type { QuizAnswers, TargetScoreRange } from '../types';

	let {
		answers,
		onNext
	}: {
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	let selected = $state<TargetScoreRange | undefined>(answers.targetScore);

	const options: { value: TargetScoreRange; label: string }[] = [
		{ value: '2.0-3.0', label: '2.0–3.0 (Basic proficiency)' },
		{ value: '3.5-4.0', label: '3.5–4.0 (University admission — most common)' },
		{ value: '4.5-5.0', label: '4.5–5.0 (Competitive programs)' },
		{ value: '5.5-6.0', label: '5.5–6.0 (Top universities / scholarships)' },
		{ value: 'unsure',  label: "I'm not sure yet" }
	];
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight">What score do you need?</h2>
<p class="text-xs text-gray-500 mb-5 leading-relaxed">TOEFL 2026 uses a 1–6 scale per section. Your total is the average across all 4 sections.</p>

<div class="space-y-2.5 mb-6">
	{#each options as o}
		<button
			type="button"
			onclick={() => (selected = o.value)}
			class="w-full text-left border-2 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors
				{selected === o.value ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 hover:border-brand-green/60'}"
		>
			<span class="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
				{selected === o.value ? 'border-brand-green bg-brand-green' : 'border-gray-300'}">
				{#if selected === o.value}<span class="w-1.5 h-1.5 rounded-full bg-white"></span>{/if}
			</span>
			<span class="text-sm text-gray-900">{o.label}</span>
		</button>
	{/each}
</div>

<button
	onclick={() => selected && onNext({ targetScore: selected })}
	disabled={!selected}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
	Next →
</button>
