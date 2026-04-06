<script lang="ts">
	export let score: number = 0;
	export let maxScore: number = 6;
	export let targetScore: number = 5.0;

	// Gauge: 300° arc, 60° gap at the bottom center
	// Start at 210° (7 o'clock), end at 150° (5 o'clock) going clockwise via 12
	const r = 72;
	const cx = 100;
	const cy = 108;
	const C = 2 * Math.PI * r;
	const trackDeg = 300;
	const trackLength = (trackDeg / 360) * C;
	const gapLength = C - trackLength;

	// Rotate the gauge group: default circle starts at 3 o'clock (90°).
	// We want to start at 7 o'clock (210°). Rotation needed: 210 - 90 = 120° clockwise.
	const rotation = 120;

	$: scoreLength = Math.max(0, (score / maxScore) * trackLength);
	$: targetLength = (targetScore / maxScore) * trackLength;

	// Target marker angle (absolute SVG degrees from top)
	// gauge starts at 210° (clock), score at targetLength along the 300° arc
	$: targetAngle = 210 + (targetScore / maxScore) * 300;
	$: targetRad = ((targetAngle - 90) * Math.PI) / 180;
	$: targetX = cx + r * Math.cos(targetRad);
	$: targetY = cy + r * Math.sin(targetRad);

	$: scoreColor =
		score >= 5
			? '#00b189'
			: score >= 3.5
				? '#00b189'
				: score >= 2.5
					? '#f59e0b'
					: '#ff5859';
</script>

<svg viewBox="0 0 200 175" class="w-full" aria-label="Score gauge: {score} out of {maxScore}">
	<!-- Gauge group: rotated so arc starts at 7 o'clock -->
	<g transform="rotate({rotation}, {cx}, {cy})">
		<!-- Background track -->
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
		<!-- Score fill -->
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

	<!-- Target score marker (pink dot) -->
	{#if targetScore > 0}
		<circle
			cx={targetX}
			cy={targetY}
			r="6"
			fill="#ff5859"
			stroke="white"
			stroke-width="2"
		/>
	{/if}

	<!-- Center text (not rotated) -->
	<text
		x={cx}
		y={cy - 10}
		text-anchor="middle"
		font-family="Montserrat, sans-serif"
		font-size="34"
		font-weight="800"
		fill="#111827"
	>
		{score.toFixed(1)}
	</text>
	<text
		x={cx}
		y={cy + 14}
		text-anchor="middle"
		font-family="Montserrat, sans-serif"
		font-size="13"
		fill="#9ca3af"
	>
		/ {maxScore}.0 score
	</text>

	<!-- Labels -->
	<text x="22" y={cy + 30} font-family="Montserrat, sans-serif" font-size="10" fill="#d1d5db">1.0</text>
	<text x="168" y={cy + 30} font-family="Montserrat, sans-serif" font-size="10" fill="#d1d5db">6.0</text>

	<!-- Target label -->
	{#if targetScore > 0}
		<text
			x={cx}
			y={cy + 50}
			text-anchor="middle"
			font-family="Montserrat, sans-serif"
			font-size="10"
			fill="#ff5859"
		>
			● Target: {targetScore.toFixed(1)}
		</text>
	{/if}
</svg>
