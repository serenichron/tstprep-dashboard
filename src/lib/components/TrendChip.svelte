<script lang="ts">
	/* Small trend indicator: arrow + signed delta (in 1–6 band points).
	   `variant`:
	     - 'default'  → light bg context (uses brand colors)
	     - 'onGreen'  → dark green bg context (uses high-contrast pale tints) */
	let {
		diff,
		variant = 'default'
	}: { diff: number; variant?: 'default' | 'onGreen' } = $props();

	const arrow = $derived(diff > 0 ? '↗' : diff < 0 ? '↘' : '→');
	const sign = $derived(diff > 0 ? '+' : '');

	const colorClass = $derived(
		variant === 'onGreen'
			? diff > 0
				? 'text-emerald-100'
				: diff < 0
					? 'text-rose-200'
					: 'text-white/70'
			: diff > 0
				? 'text-brand-green'
				: diff < 0
					? 'text-red-500'
					: 'text-gray-400'
	);
</script>

<span class="inline-flex items-baseline gap-0.5 text-[10px] font-bold leading-none whitespace-nowrap {colorClass}">
	<span class="text-[11px] leading-none -translate-y-px">{arrow}</span>
	<span>{sign}{diff.toFixed(1)}</span>
</span>
