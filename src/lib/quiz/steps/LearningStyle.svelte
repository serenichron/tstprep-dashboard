<script lang="ts">
	import type { QuizAnswers, StudyPreference } from '../types';

	let {
		answers,
		ctaLabel = 'See My Results →',
		onNext
	}: {
		answers: QuizAnswers;
		ctaLabel?: string;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	let selected = $state<StudyPreference | undefined>(answers.studyPreference);

	const options: { value: StudyPreference; title: string; desc: string; icon: string }[] = [
		{
			value: 'self-paced',
			title: 'Self-paced materials I can use anytime',
			desc: 'Study on your schedule with video lessons, practice exercises, and AI feedback.',
			icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
		},
		{
			value: 'group',
			title: 'Live group classes with an instructor',
			desc: 'Learn with other students. Real-time feedback from expert teachers.',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
		},
		{
			value: 'private',
			title: 'One-on-one private lessons for maximum focus',
			desc: 'Custom study plans designed around YOUR goals. The fastest way to improve.',
			icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
		}
	];
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight">What type of support helps you learn best?</h2>
<p class="text-xs text-gray-500 mb-5">We have world-class options for every goal and budget.</p>

<div class="space-y-3 mb-6">
	{#each options as o}
		<button
			type="button"
			onclick={() => (selected = o.value)}
			class="w-full text-left border-2 rounded-xl p-4 flex gap-3 transition-colors
				{selected === o.value ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 hover:border-brand-green/60'}"
		>
			<svg class="w-6 h-6 flex-shrink-0 mt-0.5 {selected === o.value ? 'text-brand-green' : 'text-gray-400'}" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d={o.icon} />
			</svg>
			<div class="flex-1">
				<p class="text-sm font-semibold text-gray-900 mb-0.5">{o.title}</p>
				<p class="text-xs text-gray-500 leading-relaxed">{o.desc}</p>
			</div>
		</button>
	{/each}
</div>

<button
	onclick={() => selected && onNext({ studyPreference: selected })}
	disabled={!selected}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
	{ctaLabel}
</button>
