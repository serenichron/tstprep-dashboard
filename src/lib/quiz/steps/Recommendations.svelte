<script lang="ts">
	import type { Cohort, CohortUser, QuizAnswers } from '../types';
	import { buildRecommendations } from '../recommendations';

	let {
		cohort,
		user,
		answers,
		onRestart,
		onExit
	}: {
		cohort: Cohort;
		user: CohortUser;
		answers: QuizAnswers;
		onRestart: () => void;
		onExit: () => void;
	} = $props();

	const recs = $derived(buildRecommendations(cohort, answers));

	const testDateLabel: Record<string, string> = {
		'urgent': 'Within 3 weeks',
		'1-3m':   '1–3 months away',
		'3-6m':   '3–6 months away',
		'6m-plus':'6+ months away'
	};

	const focusLabel = $derived(
		answers.weakAreas.length === 0 || answers.weakAreas.includes('all')
			? 'All sections'
			: answers.weakAreas.join(', ')
	);
</script>

<h2 class="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-5 leading-tight">
	Your Personalized TOEFL Action Plan
</h2>

<!-- Profile card -->
<div class="bg-gray-50 rounded-xl p-4 mb-5">
	<div class="flex justify-between items-center mb-3">
		<p class="text-[10px] font-bold uppercase tracking-wider text-gray-500">Your Profile</p>
		<button onclick={onRestart} class="text-[11px] text-brand-green hover:underline">Edit →</button>
	</div>
	<div class="space-y-1 text-xs">
		{#if answers.testDate}
			<div class="flex justify-between"><span class="text-gray-500">Test date</span><span class="text-gray-900 font-medium">{testDateLabel[answers.testDate]}</span></div>
		{/if}
		{#if answers.targetScore}
			<div class="flex justify-between"><span class="text-gray-500">Target score</span><span class="text-gray-900 font-medium">{answers.targetScore === 'unsure' ? 'Not sure yet' : answers.targetScore}</span></div>
		{/if}
		<div class="flex justify-between"><span class="text-gray-500">Focus areas</span><span class="text-gray-900 font-medium">{focusLabel}</span></div>
		{#if answers.aiScore}
			<div class="flex justify-between"><span class="text-gray-500">AI Assessment</span><span class="text-brand-green font-medium">{answers.aiScore.toFixed(1)} / 6.0 ({answers.aiSection === 'speaking' ? 'Speaking' : 'Writing'})</span></div>
		{/if}
		{#if user.ownedCourses && user.ownedCourses.length > 0}
			<div class="flex justify-between"><span class="text-gray-500">Already owned</span><span class="text-gray-900 font-medium">{user.ownedCourses.join(', ')}</span></div>
		{/if}
	</div>
</div>

<!-- Primary product -->
<div class="relative border-2 border-brand-green rounded-xl p-4 mb-4">
	{#if recs.primary.badge}
		<span class="absolute -top-2.5 right-4 bg-brand-green text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
			{recs.primary.badge}
		</span>
	{/if}
	<h3 class="text-sm font-semibold text-gray-900 mb-1.5">{recs.primary.title}</h3>
	<p class="text-xs text-gray-600 leading-relaxed mb-3">{recs.primary.description}</p>
	{#if recs.primary.bullets}
		<ul class="text-xs text-brand-green-dark space-y-1 mb-3">
			{#each recs.primary.bullets as b}
				<li>✓ {b}</li>
			{/each}
		</ul>
	{/if}
	<div class="flex gap-2">
		{#if recs.primary.url}
			<a href={recs.primary.url} target="_blank" rel="noopener noreferrer"
				class="flex-1 text-center bg-brand-green text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-brand-green-dark transition-colors">
				Start Course →
			</a>
			<a href={recs.primary.url} target="_blank" rel="noopener noreferrer"
				class="flex-1 text-center border-2 border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg hover:border-gray-300 transition-colors">
				Learn More
			</a>
		{:else}
			<button class="flex-1 bg-brand-green text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-brand-green-dark transition-colors">
				Start Course →
			</button>
		{/if}
	</div>
</div>

<!-- Secondary products -->
{#if recs.secondary.length > 0}
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Also Recommended For You</p>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
		{#each recs.secondary as s}
			<div class="border-2 border-gray-200 rounded-xl p-3">
				<p class="text-xs font-semibold text-gray-900 mb-1">{s.title}</p>
				<p class="text-[11px] text-gray-500 leading-relaxed mb-2">{s.description}</p>
				<button class="w-full border border-gray-300 text-gray-600 text-[11px] font-semibold py-1.5 rounded-lg hover:border-gray-400 transition-colors">
					Learn More →
				</button>
			</div>
		{/each}
	</div>
{/if}

<!-- Testimonial -->
{#if recs.testimonial}
	<div class="bg-gray-50 rounded-xl p-4 mb-5">
		<p class="text-xs text-gray-700 italic leading-relaxed">"{recs.testimonial.quote}"</p>
		<p class="text-[11px] text-gray-500 mt-2">— {recs.testimonial.author}</p>
	</div>
{/if}

<!-- Free resources -->
<div class="border-t border-gray-100 pt-4 mb-5">
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Free Resources To Get Started</p>
	<div class="text-xs text-brand-green space-y-1.5">
		{#each recs.freeResources as r}
			<p>→ {r}</p>
		{/each}
	</div>
</div>

{#if cohort === 'A'}
	<p class="text-xs text-gray-500 text-center mb-3">Not ready to commit?</p>
	<button class="w-full border-2 border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:border-gray-300 transition-colors">
		Save My Plan
	</button>
	<p class="text-[11px] text-gray-400 text-center mt-2">Saves your plan via email drip sequence</p>
{/if}

<div class="mt-6 pt-5 border-t border-gray-100 flex gap-3">
	<button onclick={onRestart} class="flex-1 text-xs text-gray-500 hover:text-gray-900 underline py-2">Restart quiz</button>
	<button onclick={onExit} class="flex-1 text-xs text-gray-500 hover:text-gray-900 underline py-2">Back to scenarios</button>
</div>
