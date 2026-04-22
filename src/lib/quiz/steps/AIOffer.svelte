<script lang="ts">
	import type { QuizAnswers } from '../types';

	let {
		answers,
		onPick,
		onSkip
	}: {
		answers: QuizAnswers;
		onPick: (section: 'speaking' | 'writing') => void;
		onSkip: () => void;
	} = $props();
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight">Want to know your exact level?</h2>
<p class="text-xs text-gray-500 mb-5 leading-relaxed">
	Take a 2-minute practice task and our AI will score you on the official TOEFL scale. It's free and instant.
</p>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
	<button
		type="button"
		onclick={() => onPick('speaking')}
		class="border-2 border-gray-200 hover:border-brand-green rounded-xl p-5 text-center transition-colors group"
	>
		<svg class="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-brand-green transition-colors" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
		</svg>
		<p class="text-sm font-semibold text-gray-900 mb-1">Speaking Sample</p>
		<p class="text-xs text-gray-500 leading-relaxed mb-3">Record a 45-second response to a practice prompt.</p>
		<span class="inline-block text-xs font-semibold text-brand-green">Record Now →</span>
	</button>
	<button
		type="button"
		onclick={() => onPick('writing')}
		class="border-2 border-gray-200 hover:border-brand-green rounded-xl p-5 text-center transition-colors group"
	>
		<svg class="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-brand-green transition-colors" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
		</svg>
		<p class="text-sm font-semibold text-gray-900 mb-1">Writing Sample</p>
		<p class="text-xs text-gray-500 leading-relaxed mb-3">Write a short response to a practice question.</p>
		<span class="inline-block text-xs font-semibold text-brand-green">Write Now →</span>
	</button>
</div>

<button
	onclick={onSkip}
	class="w-full border-2 border-gray-200 text-gray-500 font-semibold py-3 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors"
>
	Skip → Show My Recommendations →
</button>

<p class="text-[11px] text-gray-400 text-center mt-3">Your sample is processed by AI and not stored.</p>
