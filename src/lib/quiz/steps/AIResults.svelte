<script lang="ts">
	import type { AiSection, QuizAnswers, WeakArea } from '../types';

	let {
		answers,
		onNext
	}: {
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	// Pretend AI score — a plausible 3.5 for Speaking / 3.5 for Writing
	const score = 3.5;
	const section: AiSection = answers.aiSection ?? 'speaking';

	// PerceptionGap: user didn't flag this section as weak, but AI suggests it is
	const selfFlagged = answers.weakAreas as WeakArea[];
	const aiSectionTitle = section === 'speaking' ? 'Speaking' : 'Writing';
	const perceptionGap = !selfFlagged.includes(aiSectionTitle) && !selfFlagged.includes('all');

	// Gap to close depends on their target
	const targetMap: Record<string, number> = {
		'2.0-3.0': 3.0,
		'3.5-4.0': 4.0,
		'4.5-5.0': 5.0,
		'5.5-6.0': 6.0,
		'unsure':  4.0
	};
	const target = answers.targetScore ? targetMap[answers.targetScore] : 5.0;
	const gap = Math.max(0, target - score);

	// Position on 1–6 scale
	const scalePct = ((score - 1) / 5) * 100;
</script>

<div class="text-center py-2">
	<p class="text-sm font-semibold text-gray-700 mb-3">Your Current TOEFL Level</p>
	<div class="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-[6px] border-brand-green mb-2">
		<span class="text-3xl font-bold text-brand-green">{score.toFixed(1)}</span>
		<span class="text-[10px] text-gray-400">/ 6.0</span>
		<span class="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">Intermediate</span>
	</div>
</div>

<div class="bg-gray-50 rounded-xl p-4 mb-4">
	<p class="text-xs text-gray-500 mb-2">TOEFL 2026 Scale</p>
	<div class="relative h-1.5 bg-gray-200 rounded-full mb-2">
		<div class="absolute left-0 top-0 h-full bg-brand-green rounded-full" style="width: {scalePct}%"></div>
		<div class="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-brand-green rounded-full border-2 border-white shadow" style="left: calc({scalePct}% - 7px)"></div>
	</div>
	<div class="flex justify-between text-[10px] text-gray-400">
		<span>1.0</span><span>2.0</span><span>3.0</span>
		<span class="text-brand-green font-semibold">{score.toFixed(1)} ↑</span>
		<span>5.0</span><span>6.0</span>
	</div>
	<p class="text-[11px] text-gray-600 mt-2">Your target: {target.toFixed(1)}+</p>
	{#if gap > 0}
		<p class="text-[11px] text-orange-500 font-medium">Gap to close: ~{gap.toFixed(1)} points</p>
	{/if}
</div>

{#if perceptionGap}
	<div class="border-l-4 border-brand-green bg-brand-green-light rounded-r-lg px-4 py-3 mb-4">
		<p class="text-xs text-brand-green-dark leading-relaxed">
			<strong class="font-semibold">INSIGHT:</strong>
			You didn't flag {aiSectionTitle} as a weak area, but your score suggests it needs more attention. This is very common — many students overestimate their ability here until they get objective feedback.
		</p>
	</div>
{/if}

<div class="text-xs text-gray-700 leading-relaxed mb-5 space-y-1">
	<p>• Your grammar and vocabulary are at an intermediate level</p>
	<p>• With focused practice, closing this gap is very achievable</p>
</div>

<button
	onclick={() => onNext({ aiScore: score, aiSection: section })}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors"
>
	See My Personalized Plan →
</button>

<p class="text-[11px] text-gray-400 text-center mt-3">This is a quick estimate. For a full evaluation, try a complete practice test.</p>
