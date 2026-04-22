<script lang="ts">
	import type { ExperienceLevel, QuizAnswers, ScoreRange } from '../types';

	let {
		answers,
		onNext
	}: {
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	let selected = $state<ExperienceLevel | undefined>(answers.experience);
	let scoreRange = $state<ScoreRange | undefined>(answers.previousScore);

	const options: { value: ExperienceLevel; label: string; hasDropdown: boolean }[] = [
		{ value: 'new-format', label: 'Yes, I took the TOEFL 2026 format',      hasDropdown: true },
		{ value: 'old-format', label: 'Yes, but the old format (before 2026)',  hasDropdown: true },
		{ value: 'first-time', label: 'No, this will be my first time',          hasDropdown: false }
	];

	const scoreRanges: ScoreRange[] = ['1.0-2.5', '3.0-3.5', '4.0-4.5', '5.0-6.0'];

	const canProceed = $derived(
		selected === 'first-time' || (selected !== undefined && scoreRange !== undefined)
	);
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 leading-tight">Have you taken the official TOEFL before?</h2>

<div class="space-y-2.5 mb-6">
	{#each options as o}
		<button
			type="button"
			onclick={() => { selected = o.value; if (!o.hasDropdown) scoreRange = undefined; }}
			class="w-full text-left border-2 rounded-xl px-4 py-3 flex items-start gap-3 transition-colors
				{selected === o.value ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 hover:border-brand-green/60'}"
		>
			<span class="w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
				{selected === o.value ? 'border-brand-green bg-brand-green' : 'border-gray-300'}">
				{#if selected === o.value}<span class="w-1.5 h-1.5 rounded-full bg-white"></span>{/if}
			</span>
			<span class="flex-1">
				<span class="block text-sm text-gray-900">{o.label}</span>
				{#if o.hasDropdown && selected === o.value}
					<select
						bind:value={scoreRange}
						onclick={(e) => e.stopPropagation()}
						class="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:border-brand-green focus:outline-none"
					>
						<option value={undefined}>Select your score range</option>
						{#each scoreRanges as r}
							<option value={r}>{r}</option>
						{/each}
					</select>
				{/if}
			</span>
		</button>
	{/each}
</div>

<button
	onclick={() => canProceed && onNext({ experience: selected, previousScore: scoreRange })}
	disabled={!canProceed}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
	Next →
</button>
