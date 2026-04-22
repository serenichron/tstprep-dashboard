<script lang="ts">
	let { onSubmit }: { onSubmit: () => void } = $props();

	type Phase = 'prep' | 'recording' | 'processing';

	let phase = $state<Phase>('prep');
	let secondsLeft = $state(15);
	let prepInterval: ReturnType<typeof setInterval> | undefined;
	let recordInterval: ReturnType<typeof setInterval> | undefined;

	function startRecording() {
		if (prepInterval) clearInterval(prepInterval);
		phase = 'recording';
		secondsLeft = 45;
		recordInterval = setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft <= 0) stop();
		}, 1000);
	}

	function stop() {
		if (recordInterval) clearInterval(recordInterval);
		phase = 'processing';
		setTimeout(() => onSubmit(), 1800);
	}

	$effect(() => {
		prepInterval = setInterval(() => {
			secondsLeft -= 1;
			if (secondsLeft <= 0) startRecording();
		}, 1000);
		return () => {
			if (prepInterval) clearInterval(prepInterval);
			if (recordInterval) clearInterval(recordInterval);
		};
	});
</script>

<h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">Speaking Assessment</h2>

<div class="bg-gray-50 rounded-xl p-4 mb-5">
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Practice Prompt</p>
	<p class="text-sm text-gray-800 leading-relaxed italic">"Describe a skill you learned recently and explain why it is important to you."</p>
</div>

{#if phase === 'prep'}
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Preparation Time</p>
	<div class="bg-gray-100 rounded-xl py-3 text-center mb-2">
		<span class="text-2xl font-bold text-gray-900">0:{String(secondsLeft).padStart(2, '0')}</span>
	</div>
	<p class="text-xs text-gray-500 mb-5">Use this time to organize your thoughts.</p>
	<button onclick={startRecording} class="w-full bg-brand-green text-white font-semibold py-3 rounded-xl hover:bg-brand-green-dark transition-colors">
		Start Recording Now →
	</button>

{:else if phase === 'recording'}
	<p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Recording Time</p>
	<div class="bg-red-50 border border-red-200 rounded-xl py-3 text-center mb-3">
		<span class="text-2xl font-bold text-red-500">0:{String(secondsLeft).padStart(2, '0')}</span>
	</div>
	<div class="bg-brand-green-light rounded-xl h-14 flex items-center justify-center gap-1 mb-5">
		{#each Array(14) as _, i}
			<span class="bg-brand-green rounded-sm w-1" style="height: {14 + ((i * 7) % 28)}px; animation: pulse 1.2s ease-in-out infinite; animation-delay: {i * 0.05}s"></span>
		{/each}
	</div>
	<button onclick={stop} class="w-full bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
		<span class="w-2.5 h-2.5 bg-white rounded-sm"></span>
		Recording… (click to stop)
	</button>

{:else}
	<div class="py-12 text-center">
		<div class="inline-block w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4"></div>
		<p class="text-sm text-gray-600">Analyzing your response…</p>
	</div>
{/if}

<p class="text-[11px] text-gray-400 text-center mt-3">Your recording is processed by AI and not stored.</p>

<style>
	@keyframes pulse {
		0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
		50%      { transform: scaleY(1);   opacity: 1; }
	}
</style>
