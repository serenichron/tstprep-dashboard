<script lang="ts">
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import { submissionHistory, mockUser, scoreHistory } from '$lib/data/content';

	let filter: 'all' | 'test' | 'practice' | 'course' = 'all';

	$: filtered = submissionHistory.filter((e) => filter === 'all' || e.contentType === filter);

	const typeLabels: Record<string, string> = {
		test: 'Full Test',
		practice: 'Practice',
		course: 'Course',
		resource: 'Resource'
	};

	const typeColors: Record<string, string> = {
		test: 'bg-blue-100 text-blue-700',
		practice: 'bg-green-100 text-green-700',
		course: 'bg-purple-100 text-purple-700'
	};

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Summary stats
	$: totalTests = submissionHistory.filter((e) => e.contentType === 'test').length;
	$: totalPractice = submissionHistory.filter((e) => e.contentType === 'practice').length;
	$: bestScore = Math.max(...submissionHistory.filter((e) => e.score !== null).map((e) => e.score ?? 0));

	// Chart
	const chartMax = 6;
	const chartH = 70;
	$: chartPoints = scoreHistory.map((d, i) => ({
		...d,
		x: 30 + (i / (scoreHistory.length - 1)) * 520,
		y: chartH - (d.score / chartMax) * chartH
	}));
	$: polyline = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');
	$: areaPath = `M${chartPoints[0].x},${chartH} ${chartPoints.map((p) => `L${p.x},${p.y}`).join(' ')} L${chartPoints[chartPoints.length - 1].x},${chartH} Z`;
</script>

<svelte:head>
	<title>Submission History – TST Prep</title>
</svelte:head>

<div class="px-8 py-8">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-2xl font-black text-gray-900">Submission History</h1>
		<p class="text-gray-400 text-sm mt-1">All your quiz and test attempts</p>
	</div>

	<!-- Summary cards -->
	<div class="grid grid-cols-4 gap-4 mb-6">
		<div class="card text-center">
			<p class="text-3xl font-black text-brand-green">{mockUser.currentScore.toFixed(1)}</p>
			<p class="text-xs text-gray-400 mt-1">Current Score</p>
		</div>
		<div class="card text-center">
			<p class="text-3xl font-black text-blue-500">{bestScore.toFixed(1)}</p>
			<p class="text-xs text-gray-400 mt-1">Best Score</p>
		</div>
		<div class="card text-center">
			<p class="text-3xl font-black text-gray-800">{totalTests}</p>
			<p class="text-xs text-gray-400 mt-1">Full Tests</p>
		</div>
		<div class="card text-center">
			<p class="text-3xl font-black text-purple-500">{totalPractice}</p>
			<p class="text-xs text-gray-400 mt-1">Practice Sessions</p>
		</div>
	</div>

	<!-- Score trajectory chart -->
	<div class="card mb-6">
		<h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Score Over Time</h2>
		<svg viewBox="0 0 580 90" class="w-full" style="height: 100px;">
			{#each [1, 2, 3, 4, 5, 6] as line}
				<line x1="20" y1={chartH - (line / chartMax) * chartH} x2="560" y2={chartH - (line / chartMax) * chartH}
					stroke="#f3f4f6" stroke-width="1" />
				<text x="14" y={chartH - (line / chartMax) * chartH + 3} font-size="8" fill="#d1d5db" text-anchor="end">{line}</text>
			{/each}
			<line x1="20" y1={chartH - (mockUser.targetScore / chartMax) * chartH}
				x2="560" y2={chartH - (mockUser.targetScore / chartMax) * chartH}
				stroke="#ff5859" stroke-width="1.5" stroke-dasharray="5 3" />
			<text x="564" y={chartH - (mockUser.targetScore / chartMax) * chartH + 3} font-size="8" fill="#ff5859">Goal</text>
			<path d={areaPath} fill="#00b18918" />
			<polyline points={polyline} fill="none" stroke="#00b189" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
			{#each chartPoints as pt}
				<circle cx={pt.x} cy={pt.y} r="4" fill="#00b189" stroke="white" stroke-width="2" />
				<text x={pt.x} y={chartH + 13} font-size="8" fill="#9ca3af" text-anchor="middle">{pt.date}</text>
			{/each}
		</svg>
	</div>

	<!-- Filter tabs -->
	<div class="flex gap-2 mb-4">
		{#each [['all', 'All'], ['test', 'Full Tests'], ['practice', 'Practice'], ['course', 'Courses']] as [val, lbl]}
			<button
				class="tab {filter === val ? 'active' : ''}"
				on:click={() => (filter = val as typeof filter)}
			>
				{lbl}
			</button>
		{/each}
	</div>

	<!-- Table -->
	<div class="card p-0 overflow-hidden">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-gray-100 bg-gray-50">
					<th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
					<th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</th>
					<th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
					<th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
					<th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as entry}
					<tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
						<td class="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(entry.date)}</td>
						<td class="px-5 py-4">
							<div class="flex items-center gap-2">
								{#if entry.section}
									<SectionBadge section={entry.section} />
								{/if}
								<span class="font-medium text-gray-800 text-sm">{entry.title}</span>
							</div>
						</td>
						<td class="px-5 py-4">
							<span class="text-xs font-semibold px-2 py-1 rounded-full {typeColors[entry.contentType]}">
								{typeLabels[entry.contentType]}
							</span>
						</td>
						<td class="px-5 py-4">
							{#if entry.score !== null}
								<span class="font-black text-brand-green text-base">{entry.score.toFixed(1)}</span>
								<span class="text-xs text-gray-300"> / 6</span>
							{:else if entry.percentCorrect !== undefined}
								<span class="font-bold text-gray-700">{entry.percentCorrect}%</span>
								<span class="text-xs text-gray-400"> correct</span>
							{:else}
								<span class="text-gray-300">—</span>
							{/if}
						</td>
						<td class="px-5 py-4 text-xs text-gray-400">{entry.duration}</td>
					</tr>
				{/each}
				{#if filtered.length === 0}
					<tr>
						<td colspan="5" class="px-5 py-12 text-center text-gray-300 text-sm">No submissions yet.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
