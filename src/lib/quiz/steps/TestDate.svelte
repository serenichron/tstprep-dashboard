<script lang="ts">
	import type { QuizAnswers, TestDateRange } from '../types';

	let {
		answers,
		onNext
	}: {
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	let selected = $state<TestDateRange | undefined>(answers.testDate);

	const options: { value: TestDateRange; label: string; sub?: string }[] = [
		{ value: 'urgent',   label: 'Within the next 3 weeks', sub: 'We\'ll show urgent options next' },
		{ value: '1-3m',     label: '1–3 months away' },
		{ value: '3-6m',     label: '3–6 months away' },
		{ value: '6m-plus',  label: 'More than 6 months / Not scheduled yet' }
	];
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-5 leading-tight">When is your TOEFL test?</h2>

<div class="space-y-2.5 mb-6">
	{#each options as o}
		<button
			type="button"
			onclick={() => (selected = o.value)}
			class="w-full text-left border-2 rounded-xl px-4 py-3 flex items-start gap-3 transition-colors
				{selected === o.value ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 hover:border-brand-green/60'}"
		>
			<span class="w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
				{selected === o.value ? 'border-brand-green bg-brand-green' : 'border-gray-300'}">
				{#if selected === o.value}
					<span class="w-1.5 h-1.5 rounded-full bg-white"></span>
				{/if}
			</span>
			<span class="flex-1">
				<span class="block text-sm text-gray-900">{o.label}</span>
				{#if o.sub}<span class="block text-xs text-gray-500 mt-0.5">{o.sub}</span>{/if}
			</span>
		</button>
	{/each}
</div>

<button
	onclick={() => selected && onNext({ testDate: selected })}
	disabled={!selected}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
	Next →
</button>
