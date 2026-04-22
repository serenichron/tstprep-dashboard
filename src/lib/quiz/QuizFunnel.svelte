<script lang="ts">
	import type { Cohort, QuizAnswers, StepId } from './types';
	import { cohortSteps, cohortUsers } from './scenarios';

	import QuizShell from './QuizShell.svelte';
	import Welcome from './steps/Welcome.svelte';
	import TestDate from './steps/TestDate.svelte';
	import UrgentInterstitial from './steps/UrgentInterstitial.svelte';
	import Experience from './steps/Experience.svelte';
	import TargetScore from './steps/TargetScore.svelte';
	import WeakAreas from './steps/WeakAreas.svelte';
	import LearningStyle from './steps/LearningStyle.svelte';
	import AIOffer from './steps/AIOffer.svelte';
	import Speaking from './steps/Speaking.svelte';
	import Writing from './steps/Writing.svelte';
	import AIResults from './steps/AIResults.svelte';
	import Email from './steps/Email.svelte';
	import Recommendations from './steps/Recommendations.svelte';
	import C1Dashboard from './steps/C1Dashboard.svelte';

	let {
		cohort,
		onExit
	}: {
		cohort: Cohort;
		onExit: () => void;
	} = $props();

	const user = $derived(cohortUsers[cohort]);
	const baseSteps = $derived(cohortSteps[cohort]);

	// Internal runtime state — seeded via $effect so it tracks cohort changes
	let answers = $state<QuizAnswers>({ weakAreas: [] });
	let history = $state<StepId[]>([]);
	let pendingStep = $state<StepId | null>(null); // for urgent / ai branches

	// Seed / reset when cohort prop changes
	$effect(() => {
		const u = cohortUsers[cohort];
		answers = {
			weakAreas: [],
			firstName: u.firstName || undefined,
			email: u.email
		};
		history = [cohortSteps[cohort][0]];
		pendingStep = null;
	});

	const current = $derived<StepId>(pendingStep ?? history[history.length - 1] ?? baseSteps[0]);

	// Progress bar only shown during core quiz questions
	const CORE_STEPS: StepId[] = ['test-date', 'experience', 'target-score', 'weak-areas', 'learning-style'];
	const mainSteps = $derived(baseSteps.filter((s) => CORE_STEPS.includes(s)));
	const currentMainIndex = $derived(mainSteps.indexOf(current as StepId));
	const progress = $derived(
		currentMainIndex < 0 ? undefined : ((currentMainIndex + 1) / mainSteps.length) * 100
	);
	const stepLabel = $derived(
		currentMainIndex < 0 ? undefined : `Step ${currentMainIndex + 1} of ${mainSteps.length}`
	);
	const canRestart = $derived(history.length > 1 || !!pendingStep);

	function goBack() {
		if (pendingStep) { pendingStep = null; return; }
		if (history.length > 1) {
			history = history.slice(0, -1);
		} else {
			onExit();
		}
	}

	function nextMainStep(): StepId | null {
		const idx = baseSteps.indexOf(history[history.length - 1]);
		return baseSteps[idx + 1] ?? null;
	}

	// ─── Per-step advance handlers ─────────────────────────────────────────
	function handleNext(patch?: Partial<QuizAnswers>) {
		const next = nextMainStep();
		if (!next) return;
		if (patch) answers = { ...answers, ...patch };
		history = [...history, next];
	}

	function handleTestDateNext(patch?: Partial<QuizAnswers>) {
		if (patch) answers = { ...answers, ...patch };
		// If urgent, inject the interstitial as a side-trip
		if (answers.testDate === 'urgent') {
			pendingStep = 'urgent';
		} else {
			const next = nextMainStep();
			if (next) history = [...history, next];
		}
	}

	function continueFromUrgent() {
		pendingStep = null;
		const next = nextMainStep();
		if (next) history = [...history, next];
	}

	function handleAIPick(section: 'speaking' | 'writing') {
		answers = { ...answers, aiSection: section };
		pendingStep = section;
	}

	function handleAISampleDone() {
		// After speaking/writing sample, advance main sequence to ai-results (already next in baseSteps)
		pendingStep = null;
		const next = nextMainStep();
		if (next) history = [...history, next];
	}

	function handleAISkip() {
		// Skip ai-results too: advance twice
		const idx = baseSteps.indexOf('ai-offer');
		const afterAI = baseSteps.slice(idx + 1).find((s) => s !== 'ai-results');
		answers = { ...answers, aiSection: null };
		if (afterAI) history = [...history, afterAI];
	}

	function restart() {
		answers = {
			weakAreas: [],
			firstName: user.firstName || undefined,
			email: user.email
		};
		history = [baseSteps[0]];
		pendingStep = null;
	}
</script>

<div class="min-h-[calc(100vh-3.5rem)] bg-white">
	<QuizShell
		progress={progress}
		stepLabel={stepLabel}
		onBack={history.length > 1 || pendingStep ? goBack : undefined}
		onRestart={canRestart ? restart : undefined}
		onExit={onExit}
	>
		{#if pendingStep === 'urgent'}
			<UrgentInterstitial onContinue={continueFromUrgent} />

		{:else if pendingStep === 'speaking'}
			<Speaking onSubmit={handleAISampleDone} />

		{:else if pendingStep === 'writing'}
			<Writing onSubmit={handleAISampleDone} />

		{:else if current === 'welcome'}
			<Welcome {cohort} {user} {answers} onNext={handleNext} />

		{:else if current === 'test-date'}
			<TestDate {answers} onNext={handleTestDateNext} />

		{:else if current === 'experience'}
			<Experience {answers} onNext={handleNext} />

		{:else if current === 'target-score'}
			<TargetScore {answers} onNext={handleNext} />

		{:else if current === 'weak-areas'}
			<WeakAreas {answers} onNext={handleNext} />

		{:else if current === 'learning-style'}
			{@const nextIsEnd = nextMainStep() === null || nextMainStep() === 'recommendations'}
			<LearningStyle
				{answers}
				ctaLabel={nextIsEnd ? 'See My Results →' : 'Next →'}
				onNext={handleNext}
			/>

		{:else if current === 'ai-offer'}
			<AIOffer {answers} onPick={handleAIPick} onSkip={handleAISkip} />


		{:else if current === 'ai-results'}
			<AIResults {answers} onNext={handleNext} />

		{:else if current === 'email'}
			<Email {answers} onNext={handleNext} />

		{:else if current === 'recommendations'}
			<Recommendations {cohort} {user} {answers} onRestart={restart} {onExit} />

		{:else if current === 'c1-dashboard'}
			<C1Dashboard {user} {onExit} />
		{/if}
	</QuizShell>
</div>
