<script lang="ts">
	let { onSubmit }: { onSubmit: () => void } = $props();

	let text = $state('');
	let secondsLeft = $state(180);
	let submitted = $state(false);

	const wordCount = $derived(text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length);

	$effect(() => {
		if (submitted) return;
		const t = setInterval(() => {
			if (secondsLeft > 0) secondsLeft -= 1;
		}, 1000);
		return () => clearInterval(t);
	});

	function mmss(s: number) {
		const m = Math.floor(s / 60);
		const ss = s % 60;
		return `${m}:${String(ss).padStart(2, '0')}`;
	}

	function submit() {
		submitted = true;
		setTimeout(() => onSubmit(), 1800);
	}
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">Writing Assessment</h2>

<div class="bg-gray-50 rounded-xl p-4 mb-4">
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Practice Prompt</p>
	<p class="text-sm text-gray-800 leading-relaxed italic">
		Do you agree or disagree with the following statement?<br><br>
		"It is better to study alone than in a group."<br><br>
		Use specific reasons and examples to support your answer.
	</p>
</div>

{#if !submitted}
	<div class="bg-gray-100 rounded-xl py-2.5 text-center mb-3">
		<span class="text-xl font-bold {secondsLeft < 30 ? 'text-red-500' : 'text-gray-900'}">{mmss(secondsLeft)}</span>
	</div>

	<textarea
		bind:value={text}
		placeholder="Write your response here…"
		class="w-full min-h-[140px] border-2 border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:border-brand-green focus:outline-none resize-y mb-2"
	></textarea>

	<p class="text-xs text-gray-500 mb-4">Word count: {wordCount}</p>

	<button
		onclick={submit}
		disabled={wordCount < 10}
		class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
	>
		Submit →
	</button>
	<p class="text-[11px] text-gray-400 text-center mt-3">Your writing is processed by AI and not stored.</p>

{:else}
	<div class="py-12 text-center">
		<div class="inline-block w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
		<p class="text-sm text-gray-600">Analyzing your response…</p>
	</div>
{/if}
