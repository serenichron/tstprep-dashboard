<script lang="ts">
	import type { QuizAnswers } from '../types';

	let {
		answers,
		onNext
	}: {
		answers: QuizAnswers;
		onNext: (patch?: Partial<QuizAnswers>) => void;
	} = $props();

	let firstName = $state(answers.firstName ?? '');
	let email = $state(answers.email ?? '');

	const valid = $derived(
		firstName.trim().length > 0 && /^\S+@\S+\.\S+$/.test(email.trim())
	);

	// Current + target for visual
	const currentScore = answers.aiScore ?? 3.5;
	const targetMap: Record<string, number> = {
		'2.0-3.0': 3.0, '3.5-4.0': 4.0, '4.5-5.0': 5.0, '5.5-6.0': 6.0, 'unsure': 4.5
	};
	const target = answers.targetScore ? targetMap[answers.targetScore] : 5.0;
	const pct = Math.min(100, ((currentScore - 1) / (target - 1)) * 100);
</script>

<div class="text-center pt-2 pb-5">
	<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">Your personalized plan is ready!</h2>
	<div class="bg-gray-50 rounded-xl p-4 max-w-xs mx-auto">
		<div class="flex items-center gap-2">
			<span class="text-sm font-semibold text-gray-500 min-w-[32px]">{currentScore.toFixed(1)}</span>
			<div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
				<div class="h-full bg-brand-green rounded-full" style="width: {pct}%"></div>
			</div>
			<span class="text-sm font-semibold text-brand-green min-w-[32px] text-right">{target.toFixed(1)}</span>
		</div>
		<p class="text-[11px] text-gray-500 mt-2">Your current → target score</p>
	</div>
</div>

<p class="text-sm text-gray-700 leading-relaxed mb-4">
	Create your free account to see your complete TOEFL Action Plan. We'll also email you a copy you can access anytime.
</p>

<div class="space-y-1 mb-4 text-xs text-brand-green-dark">
	<p>✓ See your personalized TOEFL Action Plan</p>
	<p>✓ Access free practice materials</p>
	<p>✓ Track your progress over time</p>
</div>

<input
	bind:value={firstName}
	placeholder="First name"
	class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 mb-2 focus:border-brand-green focus:outline-none"
/>
<input
	bind:value={email}
	type="email"
	placeholder="Email address"
	class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 mb-4 focus:border-brand-green focus:outline-none"
/>

<button
	onclick={() => valid && onNext({ firstName, email })}
	disabled={!valid}
	class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
	See My Plan &amp; Create Account →
</button>

<p class="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
	By continuing, you agree to our Terms of Service.<br>
	We respect your privacy. Unsubscribe anytime.
</p>
