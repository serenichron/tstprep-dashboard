<script lang="ts">
	let {
		score = 0,
		maxScore = 6,
		targetScore = 5.0
	}: {
		score?: number;
		maxScore?: number;
		targetScore?: number;
	} = $props();

	// Gauge: 300° arc, 60° gap at the bottom center
	const r = 72;
	const cx = 100;
	const cy = 108;
	const C = 2 * Math.PI * r;
	const trackDeg = 300;
	const trackLength = (trackDeg / 360) * C;
	const gapLength = C - trackLength;
	const rotation = 120;

	const scoreLength = $derived(Math.max(0, (score / maxScore) * trackLength));
	const targetAngle = $derived(210 + (targetScore / maxScore) * 300);
	const targetRad = $derived(((targetAngle - 90) * Math.PI) / 180);
	const targetX = $derived(cx + r * Math.cos(targetRad));
	const targetY = $derived(cy + r * Math.sin(targetRad));
	const scoreColor = $derived(
		score >= 3.5 ? '#00b189' : score >= 2.5 ? '#f59e0b' : '#ff5859'
	);
</script>

<svg viewBox="0 0 200 175" class="w-full" aria-label="Score gauge: {score} out of {maxScore}">
	<g transform="rotate({rotation}, {cx}, {cy})">
		<circle
			cx={cx}
			cy={cy}
			r={r}
			fill="none"
			stroke="#e5e7eb"
			stroke-width="14"
			stroke-dasharray="{trackLength} {gapLength}"
			stroke-linecap="round"
		/>
		<circle
			cx={cx}
			cy={cy}
			r={r}
			fill="none"
			stroke={scoreColor}
			stroke-width="14"
			stroke-dasharray="{scoreLength} 9999"
			stroke-linecap="round"
		/>
	</g>

	{#if targetScore > 0}
		<circle cx={targetX} cy={targetY} r="6" fill="#ff5859" stroke="white" stroke-width="2" />
	{/if}

	<text x={cx} y={cy - 10} text-anchor="middle" font-family="Montserrat, sans-serif" font-size="34" font-weight="800" fill="#111827">
		{score.toFixed(1)}
	</text>
	<text x={cx} y={cy + 14} text-anchor="middle" font-family="Montserrat, sans-serif" font-size="13" fill="#9ca3af">
		/ {maxScore}.0 score
	</text>

	<text x="22" y={cy + 30} font-family="Montserrat, sans-serif" font-size="10" fill="#d1d5db">1.0</text>
	<text x="168" y={cy + 30} font-family="Montserrat, sans-serif" font-size="10" fill="#d1d5db">6.0</text>

	{#if targetScore > 0}
		<text x={cx} y={cy + 50} text-anchor="middle" font-family="Montserrat, sans-serif" font-size="10" fill="#ff5859">
			● Target: {targetScore.toFixed(1)}
		</text>
	{/if}
</svg>
