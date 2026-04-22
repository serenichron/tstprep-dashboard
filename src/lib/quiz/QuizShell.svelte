<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		stepLabel,
		progress,
		onBack,
		onRestart,
		onExit,
		children
	}: {
		stepLabel?: string;
		progress?: number; // 0–100; omit to hide bar
		onBack?: () => void;
		onRestart?: () => void;
		onExit?: () => void;
		children: Snippet;
	} = $props();
</script>

<div class="flex flex-col h-full">
	<!-- Top bar: back + exit -->
	<div class="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
		{#if onBack}
			<button
				onclick={onBack}
				class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
				type="button"
			>
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				Back
			</button>
		{:else}
			<span></span>
		{/if}

		<div class="flex items-center gap-3">
			{#if onRestart}
				<button
					onclick={onRestart}
					class="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 uppercase tracking-wider"
					type="button"
					title="Restart this scenario"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Restart
				</button>
			{/if}
			{#if onExit}
				<button
					onclick={onExit}
					class="text-[11px] text-gray-400 hover:text-gray-700 uppercase tracking-wider"
					type="button"
					title="Exit to scenarios"
				>
					Exit
				</button>
			{/if}
		</div>
	</div>

	<!-- Progress -->
	{#if progress !== undefined}
		<div class="px-4 sm:px-6 pb-4">
			{#if stepLabel}
				<div class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2 text-right">{stepLabel}</div>
			{/if}
			<div class="flex items-center gap-2">
				<div class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
					<div class="h-full bg-brand-green rounded-full transition-all duration-300" style="width: {progress}%"></div>
				</div>
				<span class="text-[10px] text-gray-400 whitespace-nowrap">{Math.round(progress)}%</span>
			</div>
		</div>
	{/if}

	<!-- Step content -->
	<div class="flex-1 px-4 sm:px-6 pb-6 overflow-y-auto">
		<div class="max-w-lg mx-auto">
			{@render children()}
		</div>
	</div>
</div>
