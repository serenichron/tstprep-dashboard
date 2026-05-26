<script lang="ts">
    const { score, color, class: className }: { score: number | null, color: string, class?: string } = $props();
    const arcPath = (sa: number, ea: number) => {
		const r = 46, cx = 60, cy = 54;
		const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
		const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
		return `M${x1},${y1}A${r},${r},0,${ea - sa > Math.PI ? 1 : 0},1,${x2},${y2}`;
	};
    const SA = Math.PI * 0.82;
	const EA = Math.PI * 2.18;
	const TA = EA - SA;

	const gaugeNA = $derived(score === null);
	const gaugeFillAngle = $derived(gaugeNA ? SA : SA + ((score! - 1) / 5) * TA);
</script>

<svg viewBox="0 0 120 86" class={className}>
    <path d={arcPath(SA, EA)} fill="none" stroke="#eaf2ee" stroke-width="10" stroke-linecap="round" />
    {#if !gaugeNA}
        <path d={arcPath(SA, gaugeFillAngle)} fill="none" stroke={color} stroke-width="10" stroke-linecap="round" style="transition:all .6s ease" />
    {/if}
</svg>
