<script lang="ts">
	import type { Cohort, CohortUser, QuizAnswers } from '../types';

	let {
		cohort,
		user,
		answers,
		onNext
	}: {
		cohort: Cohort;
		user: CohortUser;
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	const hasScores = !!user.sectionScores;
</script>

{#if cohort === 'A'}
	<!-- Anonymous: classic marketing welcome -->
	<div class="pt-4 pb-6 text-center">
		<h1 class="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
			Find Your Perfect <span class="text-brand-green">TOEFL Study Plan</span>
		</h1>
		<p class="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm mx-auto">
			Answer a few quick questions and we'll recommend the best path to your target score. Takes about 2 minutes.
		</p>
		<button
			onclick={() => onNext()}
			class="w-full max-w-sm mx-auto bg-brand-green text-white font-semibold py-3.5 rounded-xl hover:bg-brand-green-dark transition-colors"
		>
			Start the Quiz →
		</button>
	</div>

	<div class="border-t border-gray-100 pt-5 mt-6">
		<p class="text-[11px] text-gray-400 text-center mb-3">Trusted by 15,000+ students from 90+ countries</p>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
			<p class="text-[11px] italic text-gray-500 leading-relaxed">"Went from 3.0 to 5.0 in 8 weeks!"</p>
			<p class="text-[11px] italic text-gray-500 leading-relaxed">"Got my target score in 2 months!"</p>
			<p class="text-[11px] italic text-gray-500 leading-relaxed">"Matched me with the perfect course!"</p>
		</div>
	</div>

{:else if cohort === 'B1' && hasScores}
	<!-- Free + active: pre-filled scores -->
	<div class="pt-4 pb-6">
		<h1 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
			Hey {user.firstName}, we've been tracking your progress!
		</h1>
		<p class="text-sm text-gray-600 mb-4">Based on your practice tests, here's what we know:</p>

		<div class="bg-brand-green-light rounded-xl p-4 mb-4">
			<p class="text-[10px] font-bold uppercase tracking-wider text-brand-green-dark mb-2">Your practice scores</p>
			<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
				{#each Object.entries(user.sectionScores ?? {}) as [section, score]}
					{@const isWeak = score !== null && score !== undefined && score <= 2.5}
					<div class="flex justify-between">
						<span class="text-gray-600">{section}</span>
						<span class="font-semibold {isWeak ? 'text-orange-500' : 'text-gray-800'}">
							{score?.toFixed(1)}{isWeak ? ' ⚠' : ''}
						</span>
					</div>
				{/each}
			</div>
			{#if user.overallScore}
				<p class="mt-3 text-xs text-brand-green-dark">Overall: {user.overallScore.toFixed(1)} / 6.0 · Intermediate</p>
			{/if}
		</div>

		<p class="text-sm text-gray-600 mb-5 leading-relaxed">
			Answer 3 quick questions and we'll recommend the perfect next step for your level.
		</p>
		<button
			onclick={() => onNext()}
			class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors"
		>
			Personalize My Plan →
		</button>
		<p class="text-[11px] text-gray-400 text-center mt-3">Next: Test date → Target score → Study style</p>
	</div>

{:else if cohort === 'B2'}
	<!-- Free + inactive: full quiz, welcomed by name -->
	<div class="pt-4 pb-6 text-center">
		<h1 class="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
		<p class="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm mx-auto">
			Let's find the perfect study plan for you. Answer a few quick questions — takes about 2 minutes.
		</p>
		<button
			onclick={() => onNext()}
			class="w-full max-w-sm mx-auto bg-brand-green text-white font-semibold py-3.5 rounded-xl hover:bg-brand-green-dark transition-colors"
		>
			Start the Quiz →
		</button>
	</div>

{:else if cohort === 'C2'}
	<!-- Customer + inactive: dashboard-embedded prompt -->
	<div class="pt-4 pb-6">
		<h1 class="text-xl font-bold text-gray-900 mb-1">Help us personalize your experience</h1>
		<p class="text-sm text-gray-600 mb-5 leading-relaxed">
			Welcome back, {user.firstName}! We noticed you haven't taken any practice tests yet. Answer 3 quick questions so we can recommend the best next step.
		</p>
		<button
			onclick={() => onNext()}
			class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors"
		>
			Personalize My Dashboard →
		</button>
	</div>
{/if}
