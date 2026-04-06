<script lang="ts">
	/* ─── Mock Data (deterministic) ─── */
	const fmtScore = (v: number | null | undefined) =>
		v === null || v === undefined ? null : Number.isInteger(v) ? v + '.0' : String(v);
	const fmtScoreFull = (v: number | null | undefined) =>
		v === null || v === undefined ? null : fmtScore(v) + '/6';
	const fmtD = (iso: string) =>
		new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const fmtT = (iso: string) =>
		new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const scoreColor = (v: number) => (v >= 5 ? '#00b189' : v >= 3.5 ? '#f0a030' : '#ff5859');
	const roundHalf = (v: number) => Math.round(v * 2) / 2;

	/* ─── Fixed mock submissions ─── */
	const MOCK = [
		// Reading
		{ id: 'r0', section: 'Reading', testNumber: 1, mode: 'test', score: 3.5, scoreAvailable: true, date: '2026-01-10T09:15:00', details: { 'Part 1': '8/12', 'Part 2': '7/12' } },
		{ id: 'r1', section: 'Reading', testNumber: 1, mode: 'practice', score: 3.0, scoreAvailable: true, date: '2026-01-20T11:30:00', details: { 'Part 1': '7/12', 'Part 2': '6/12' } },
		{ id: 'r2', section: 'Reading', testNumber: 2, mode: 'test', score: 4.0, scoreAvailable: true, date: '2026-02-05T10:00:00', details: { 'Part 1': '9/12', 'Part 2': '8/12' } },
		{ id: 'r3', section: 'Reading', testNumber: 3, mode: 'test', score: 4.0, scoreAvailable: true, date: '2026-02-18T14:20:00', details: { 'Part 1': '10/12', 'Part 2': '8/12' } },
		{ id: 'r4', section: 'Reading', testNumber: 3, mode: 'practice', score: 3.5, scoreAvailable: true, date: '2026-02-25T09:45:00', details: { 'Part 1': '9/12', 'Part 2': '7/12' } },
		{ id: 'r5', section: 'Reading', testNumber: 3, mode: 'test', score: 4.5, scoreAvailable: true, date: '2026-03-10T10:15:00', details: { 'Part 1': '11/12', 'Part 2': '9/12' } },
		{ id: 'r6', section: 'Reading', testNumber: 4, mode: 'practice', score: 4.0, scoreAvailable: true, date: '2026-03-22T15:00:00', details: { 'Part 1': '10/12', 'Part 2': '8/12' } },
		{ id: 'r7', section: 'Reading', testNumber: 5, mode: 'test', score: 4.5, scoreAvailable: true, date: '2026-04-01T09:30:00', details: { 'Part 1': '11/12', 'Part 2': '10/12' } },
		// Listening
		{ id: 'l0', section: 'Listening', testNumber: 1, mode: 'test', score: 3.5, scoreAvailable: true, date: '2026-01-12T10:00:00', details: { 'Part 1': '10/14', 'Part 2': '9/14' } },
		{ id: 'l1', section: 'Listening', testNumber: 2, mode: 'practice', score: 3.0, scoreAvailable: true, date: '2026-01-28T13:30:00', details: { 'Part 1': '8/14', 'Part 2': '9/14' } },
		{ id: 'l2', section: 'Listening', testNumber: 2, mode: 'test', score: 3.5, scoreAvailable: true, date: '2026-02-10T11:00:00', details: { 'Part 1': '10/14', 'Part 2': '9/14' } },
		{ id: 'l3', section: 'Listening', testNumber: 3, mode: 'test', score: 4.0, scoreAvailable: true, date: '2026-02-20T09:15:00', details: { 'Part 1': '12/14', 'Part 2': '10/14' } },
		{ id: 'l4', section: 'Listening', testNumber: 4, mode: 'practice', score: 3.5, scoreAvailable: true, date: '2026-03-05T14:00:00', details: { 'Part 1': '11/14', 'Part 2': '9/14' } },
		{ id: 'l5', section: 'Listening', testNumber: 5, mode: 'test', score: 4.0, scoreAvailable: true, date: '2026-03-15T10:30:00', details: { 'Part 1': '12/14', 'Part 2': '11/14' } },
		{ id: 'l6', section: 'Listening', testNumber: 5, mode: 'practice', score: 4.5, scoreAvailable: true, date: '2026-03-29T09:00:00', details: { 'Part 1': '13/14', 'Part 2': '11/14' } },
		{ id: 'l7', section: 'Listening', testNumber: 6, mode: 'test', score: 4.5, scoreAvailable: true, date: '2026-04-05T11:15:00', details: { 'Part 1': '13/14', 'Part 2': '12/14' } },
		// Writing
		{ id: 'w0', section: 'Writing', testNumber: 1, mode: 'test', score: 3.0, scoreAvailable: true, date: '2026-01-14T10:30:00', details: { 'Build a Sentence': '6/10', 'Write an Email': '3/5', 'Academic Discussion': '2/5' } },
		{ id: 'w1', section: 'Writing', testNumber: 1, mode: 'practice', score: null, scoreAvailable: false, date: '2026-01-22T14:00:00', details: { 'Build a Sentence': '7/10', 'Write an Email': 'not graded', 'Academic Discussion': 'not graded' } },
		{ id: 'w2', section: 'Writing', testNumber: 2, mode: 'test', score: 3.5, scoreAvailable: true, date: '2026-02-08T09:30:00', details: { 'Build a Sentence': '7/10', 'Write an Email': '3/5', 'Academic Discussion': '3/5' } },
		{ id: 'w3', section: 'Writing', testNumber: 3, mode: 'test', score: null, scoreAvailable: false, date: '2026-02-22T11:45:00', details: { 'Build a Sentence': '8/10', 'Write an Email': 'not graded', 'Academic Discussion': 'not graded' } },
		{ id: 'w4', section: 'Writing', testNumber: 3, mode: 'practice', score: 4.0, scoreAvailable: true, date: '2026-03-01T10:00:00', details: { 'Build a Sentence': '8/10', 'Write an Email': '4/5', 'Academic Discussion': '3/5' } },
		{ id: 'w5', section: 'Writing', testNumber: 4, mode: 'test', score: 4.0, scoreAvailable: true, date: '2026-03-18T09:15:00', details: { 'Build a Sentence': '9/10', 'Write an Email': '4/5', 'Academic Discussion': '3/5' } },
		{ id: 'w6', section: 'Writing', testNumber: 5, mode: 'test', score: null, scoreAvailable: false, date: '2026-03-28T14:30:00', details: { 'Build a Sentence': '9/10', 'Write an Email': 'not graded', 'Academic Discussion': 'not graded' } },
		// Speaking
		{ id: 's0', section: 'Speaking', testNumber: 1, mode: 'test', score: null, scoreAvailable: false, date: '2026-01-16T11:00:00', details: { 'Task 1': 'not graded', 'Task 2': 'not graded', 'Task 3': 'not graded', 'Task 4': 'not graded' } },
		{ id: 's1', section: 'Speaking', testNumber: 2, mode: 'practice', score: 3.0, scoreAvailable: true, date: '2026-02-01T10:15:00', details: { 'Task 1': '3/4', 'Task 2': '2/4', 'Task 3': '3/4', 'Task 4': '2/4' } },
		{ id: 's2', section: 'Speaking', testNumber: 2, mode: 'test', score: null, scoreAvailable: false, date: '2026-02-15T13:00:00', details: { 'Task 1': 'not graded', 'Task 2': 'not graded', 'Task 3': 'not graded', 'Task 4': 'not graded' } },
		{ id: 's3', section: 'Speaking', testNumber: 3, mode: 'test', score: 3.5, scoreAvailable: true, date: '2026-03-05T09:30:00', details: { 'Task 1': '3/4', 'Task 2': '3/4', 'Task 3': '3/4', 'Task 4': '2/4' } },
		{ id: 's4', section: 'Speaking', testNumber: 4, mode: 'practice', score: null, scoreAvailable: false, date: '2026-03-20T14:45:00', details: { 'Task 1': 'not graded', 'Task 2': 'not graded', 'Task 3': 'not graded', 'Task 4': 'not graded' } },
		{ id: 's5', section: 'Speaking', testNumber: 5, mode: 'test', score: 4.0, scoreAvailable: true, date: '2026-04-04T10:00:00', details: { 'Task 1': '4/4', 'Task 2': '3/4', 'Task 3': '3/4', 'Task 4': '3/4' } },
	];

	/* ─── SVG icon paths ─── */
	const iconPaths: Record<string, string[]> = {
		Reading: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
		Listening: ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
		Writing: ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'],
		Speaking: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2']
	};

	/* ─── Arc helper ─── */
	const arcPath = (sa: number, ea: number) => {
		const r = 46, cx = 60, cy = 54;
		const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
		const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
		return `M${x1},${y1}A${r},${r},0,${ea - sa > Math.PI ? 1 : 0},1,${x2},${y2}`;
	};
	const SA = Math.PI * 0.82;
	const EA = Math.PI * 2.18;
	const TA = EA - SA;

	/* ─── Trend helpers ─── */
	function buildTrend(pts: { v: number }[]) {
		if (!pts || pts.length < 2) return null;
		const W = 180, H = 42, px = 4, py = 4;
		const mn = 0.5, mx = 6.5, rng = mx - mn;
		const coords = pts.map((p, i) => ({
			x: px + (i / (pts.length - 1)) * (W - px * 2),
			y: py + (1 - (p.v - mn) / rng) * (H - py * 2)
		}));
		const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
		const diff = roundHalf((pts[pts.length - 1].v) - pts[0].v);
		const color = diff >= 0 ? '#00b189' : '#ff5859';
		const area = `${d}L${coords[coords.length - 1].x},${H}L${coords[0].x},${H}Z`;
		return { W, H, coords, d, area, diff, color, diffLabel: (diff >= 0 ? '+' : '') + fmtScore(diff) };
	}

	/* ─── State ─── */
	const secs = ['Reading', 'Listening', 'Writing', 'Speaking'];
	let mode: 'all' | 'test' | 'practice' = 'all';
	let sec = 'Reading';
	let expanded: Record<string, boolean> = {};
	let viewBy: 'test' | 'date' = 'test';

	/* ─── Reactive ─── */
	$: data = MOCK.filter(s => mode === 'all' || s.mode === mode);

	$: stats = (() => {
		const o: Record<string, { avg: number | null; best: number | null; count: number; aiCount: number; trend: { v: number }[] }> = {};
		secs.forEach(sc => {
			const all = data.filter(s => s.section === sc);
			const ws = all.filter(s => s.scoreAvailable && s.score !== null);
			const avg = ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null;
			const best = ws.length ? Math.max(...ws.map(s => s.score as number)) : null;
			const trend = [...ws].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => ({ v: s.score as number }));
			o[sc] = { avg, best, count: all.length, aiCount: ws.length, trend };
		});
		return o;
	})();

	$: allAvg = secs.map(s => stats[s].avg);
	$: genScore = allAvg.every(v => v !== null) ? roundHalf((allAvg as number[]).reduce((a, b) => a + b, 0) / 4) : null;
	$: genBest = secs.every(s => stats[s].best !== null) ? roundHalf(secs.reduce((a, s) => a + (stats[s].best as number), 0) / 4) : null;

	$: rows = data.filter(s => s.section === sec).sort((a, b) =>
		a.testNumber !== b.testNumber ? a.testNumber - b.testNumber : new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	$: groups = (() => {
		const g: Record<string, typeof rows> = {};
		rows.forEach(s => { if (!g[s.testNumber]) g[s.testNumber] = []; g[s.testNumber].push(s); });
		return g;
	})();

	$: byDateRows = [...rows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	$: needsAI = sec === 'Writing' || sec === 'Speaking';
	$: st = stats[sec];
	$: trendData = buildTrend(st.trend);

	$: gaugeNA = genScore === null || genScore === undefined;
	$: gaugeColor = gaugeNA ? '#ddd' : scoreColor(genScore as number);
	$: gaugeFillAngle = gaugeNA ? SA : SA + ((genScore as number - 1) / 5) * TA;

	function toggleTest(num: string) {
		const key = sec + num;
		expanded = { ...expanded, [key]: expanded[key] === false ? true : false };
	}

	function isExpanded(secName: string, num: string) {
		return expanded[secName + num] !== false;
	}
</script>

<svelte:head>
	<title>Results Dashboard – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="dashboard">
	<!-- Header -->
	<div class="header">
		<div>
			<h1><span class="green">Results</span> Dashboard</h1>
			<p class="subtitle">Track your TOEFL 2026 scores across all sections</p>
		</div>
		<div class="mode-toggle">
			{#each [['all','All'],['test','Test'],['practice','Practice']] as [val, label]}
				<button class="mode-btn" class:active={mode === val} on:click={() => (mode = val as typeof mode)}>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Score Overview -->
	<div class="overview-grid">
		<!-- General Score Gauge -->
		<div class="general-card">
			<div class="gauge-wrap" style="width:110px;height:{110 * 0.72}px;margin:0 auto;position:relative">
				<svg width="110" height={110 * 0.72} viewBox="0 0 120 86">
					<path d={arcPath(SA, EA)} fill="none" stroke="#eee" stroke-width="8" stroke-linecap="round" />
					{#if !gaugeNA}
						<path d={arcPath(SA, gaugeFillAngle)} fill="none" stroke={gaugeColor} stroke-width="8" stroke-linecap="round" style="transition:all .7s ease" />
					{/if}
					<text x="14" y="82" font-size="8" fill="#bbb" text-anchor="middle">1</text>
					<text x="106" y="82" font-size="8" fill="#bbb" text-anchor="middle">6</text>
				</svg>
				<div class="gauge-label" style="color:{gaugeNA ? '#ccc' : '#222'}">
					{gaugeNA ? '—' : fmtScoreFull(genScore)}
				</div>
			</div>
			<div class="card-meta">Overall Score</div>
			{#if genScore === null}
				<p class="card-hint">Requires scored submissions in all 4 sections</p>
			{/if}
			{#if genBest !== null}
				<div class="card-best">Best: <b class="green">{fmtScoreFull(genBest)}</b></div>
			{/if}
		</div>

		<!-- Section Cards -->
		<div class="section-cards">
			{#each secs as sc}
				{@const s = stats[sc]}
				{@const act = sec === sc}
				<button class="sec-card" class:active={act} on:click={() => (sec = sc)}>
					{#if act}<div class="sec-card-bar"></div>{/if}
					<div class="sec-card-head">
						<div class="sec-icon" class:active={act}>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								{#each iconPaths[sc] as d}
									<path {d} />
								{/each}
								{#if sc === 'Speaking'}
									<line x1="12" x2="12" y1="19" y2="22" />
								{/if}
							</svg>
						</div>
						<span class="sec-card-name">{sc}</span>
					</div>
					<div class="sec-card-score">
						<span class="sec-card-val" style="color:{s.avg === null ? '#d0d0d0' : '#222'}">{s.avg === null ? '—' : fmtScoreFull(s.avg)}</span>
						<span class="sec-card-unit">avg</span>
					</div>
					<div class="sec-card-foot">
						<span>Best: <b style="color:{s.best === null ? '#ccc' : '#00b189'}">{s.best === null ? '—' : fmtScoreFull(s.best)}</b></span>
						<span>{s.count}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Detail Panel -->
	<div class="panel">
		<!-- Panel Header -->
		<div class="panel-header">
			<div class="panel-title-row">
				<div class="panel-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						{#each iconPaths[sec] as d}
							<path {d} />
						{/each}
						{#if sec === 'Speaking'}
							<line x1="12" x2="12" y1="19" y2="22" />
						{/if}
					</svg>
				</div>
				<div>
					<h2 class="panel-section-name">{sec}</h2>
					<p class="panel-sub">
						{st.count} submission{st.count !== 1 ? 's' : ''}
						{#if needsAI} · {st.aiCount} AI-graded{/if}
					</p>
				</div>
			</div>
			<div class="trend-area">
				<div class="trend-label">Progress</div>
				{#if trendData}
					<div style="display:flex;align-items:center;gap:8px">
						<svg width={trendData.W} height={trendData.H}>
							<defs>
								<linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color={trendData.color} stop-opacity=".12" />
									<stop offset="100%" stop-color={trendData.color} stop-opacity="0" />
								</linearGradient>
							</defs>
							<path d={trendData.area} fill="url(#tg)" />
							<path d={trendData.d} fill="none" stroke={trendData.color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
							{#each trendData.coords as c}
								<circle cx={c.x} cy={c.y} r="2.2" fill="#fff" stroke={trendData.color} stroke-width="1.5" />
							{/each}
						</svg>
						<span style="font-size:11px;font-weight:700;color:{trendData.color}">{trendData.diffLabel}</span>
					</div>
				{:else}
					<span class="no-trend">Need 2+ scores</span>
				{/if}
			</div>
		</div>

		<!-- View toggle -->
		{#if rows.length > 0}
			<div class="view-toggle-bar">
				<span class="view-label">View by</span>
				{#each [['test', 'Test Number'], ['date', 'Date']] as [val, label]}
					<button class="view-btn" class:active={viewBy === val} on:click={() => (viewBy = val as typeof viewBy)}>
						{label}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Empty State -->
		{#if rows.length === 0}
			<div class="empty">
				<div class="empty-icon">📝</div>
				<div class="empty-title">No {sec.toLowerCase()} submissions yet</div>
				<div class="empty-sub">Complete a practice test to see results here</div>
			</div>

		<!-- Test Number View -->
		{:else if viewBy === 'test'}
			{#each Object.entries(groups) as [num, subs]}
				{@const open = isExpanded(sec, num)}
				<div>
					<button class="group-header" on:click={() => toggleTest(num)}>
						<span>
							<span class="group-name">{sec} Practice Test #{num}</span>
							<span class="group-count">· {subs.length} attempt{subs.length !== 1 ? 's' : ''}</span>
						</span>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform .2s;transform:rotate({open ? 180 : 0}deg)">
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>
					{#if open}
						{#each subs as sub, i}
							<div class="sub-row" class:alt={i % 2 !== 0}>
								<div class="sub-info">
									<span class="sub-date">{fmtD(sub.date)} <span class="dot">·</span> {fmtT(sub.date)}</span>
									<span class="badge" class:test={sub.mode === 'test'} class:practice={sub.mode === 'practice'}>{sub.mode}</span>
									{#if !sub.scoreAvailable}<span class="badge ai-off">AI off</span>{/if}
								</div>
								<div class="sub-score">
									{#if sub.score === null}
										<div class="bar-na" style="width:80px;height:6px"></div>
										<span class="na-label">N/A</span>
									{:else}
										<div class="bar-track" style="width:80px;height:6px">
											<div class="bar-fill" style="width:{((sub.score - 1) / 5) * 100}%;background:{scoreColor(sub.score)}"></div>
										</div>
										<span class="score-val" style="color:{scoreColor(sub.score)}">{fmtScoreFull(sub.score)}</span>
									{/if}
								</div>
								<div class="sub-details">
									{#each Object.entries(sub.details) as [k, v]}
										<span class="detail-pill" class:ungraded={v === 'not graded'}>{k}: <b>{v}</b></span>
									{/each}
								</div>
								<button class="view-btn-row">View →</button>
							</div>
						{/each}
					{/if}
				</div>
			{/each}

		<!-- Date View -->
		{:else}
			{#each byDateRows as sub, i}
				<div class="sub-row" class:alt={i % 2 !== 0}>
					<div class="sub-info wide">
						<span class="test-pill">Test #{sub.testNumber}</span>
						<span class="sub-date">{fmtD(sub.date)} <span class="dot">·</span> {fmtT(sub.date)}</span>
						<span class="badge" class:test={sub.mode === 'test'} class:practice={sub.mode === 'practice'}>{sub.mode}</span>
						{#if !sub.scoreAvailable}<span class="badge ai-off">AI off</span>{/if}
					</div>
					<div class="sub-score">
						{#if sub.score === null}
							<div class="bar-na" style="width:80px;height:6px"></div>
							<span class="na-label">N/A</span>
						{:else}
							<div class="bar-track" style="width:80px;height:6px">
								<div class="bar-fill" style="width:{((sub.score - 1) / 5) * 100}%;background:{scoreColor(sub.score)}"></div>
							</div>
							<span class="score-val" style="color:{scoreColor(sub.score)}">{fmtScoreFull(sub.score)}</span>
						{/if}
					</div>
					<div class="sub-details">
						{#each Object.entries(sub.details) as [k, v]}
							<span class="detail-pill" class:ungraded={v === 'not graded'}>{k}: <b>{v}</b></span>
						{/each}
					</div>
					<button class="view-btn-row">View →</button>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Footer -->
	<div class="footer">
		Scores follow the TOEFL 2026 scale (1–6){#if needsAI} · Non-AI submissions excluded from averages{/if}
	</div>
</div>

<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }

	.dashboard {
		font-family: 'DM Sans', sans-serif;
		padding: 28px 32px;
		color: #222;
	}

	/* Header */
	.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
	h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
	.green { color: #00b189; }
	.subtitle { font-size: 12px; color: #999; margin-top: 2px; }

	.mode-toggle { display: inline-flex; background: #edeef0; border-radius: 99px; padding: 3px; }
	.mode-btn {
		padding: 7px 16px; border-radius: 99px; border: none; cursor: pointer;
		font-size: 12px; font-weight: 400; background: transparent; color: #777;
		transition: all .2s; font-family: inherit;
	}
	.mode-btn.active { font-weight: 600; background: #00b189; color: #fff; }

	/* Overview Grid */
	.overview-grid { display: grid; grid-template-columns: 170px 1fr; gap: 12px; margin-bottom: 16px; }

	.general-card {
		background: #fff; border-radius: 16px; padding: 18px 10px 14px;
		box-shadow: 0 1px 6px rgba(0,0,0,.04); text-align: center;
	}
	.gauge-label {
		position: absolute; top: 38%; left: 50%; transform: translate(-50%, -50%);
		font-size: 22px; font-weight: 800; letter-spacing: -1px;
	}
	.card-meta { font-size: 11px; font-weight: 600; color: #999; }
	.card-hint { font-size: 9.5px; color: #c0c0c0; margin: 6px 8px 0; line-height: 1.3; }
	.card-best { margin-top: 6px; font-size: 11px; color: #999; }

	.section-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

	.sec-card {
		background: #fafafa; border: 2px solid transparent; border-radius: 14px;
		padding: 12px 10px; cursor: pointer; text-align: left; transition: all .15s;
		font-family: inherit; box-shadow: 0 1px 3px rgba(0,0,0,.03);
		position: relative; overflow: hidden;
	}
	.sec-card.active { background: #fff; border-color: #00b189; box-shadow: 0 3px 14px rgba(0,177,137,.1); }
	.sec-card-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #00b189; }
	.sec-card-head { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
	.sec-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #999; }
	.sec-icon.active { background: rgba(0,177,137,.07); color: #00b189; }
	.sec-card-name { font-weight: 600; font-size: 12px; color: #333; }
	.sec-card-score { display: flex; align-items: baseline; gap: 3px; margin-bottom: 4px; }
	.sec-card-val { font-size: 20px; font-weight: 800; letter-spacing: -1px; }
	.sec-card-unit { font-size: 10px; color: #aaa; }
	.sec-card-foot { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; }

	/* Panel */
	.panel { background: #fff; border-radius: 16px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
	.panel-header { padding: 14px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
	.panel-title-row { display: flex; align-items: center; gap: 10px; }
	.panel-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(0,177,137,.06); display: flex; align-items: center; justify-content: center; color: #00b189; }
	.panel-section-name { font-size: 16px; font-weight: 700; }
	.panel-sub { font-size: 11px; color: #999; }
	.trend-area { text-align: right; }
	.trend-label { font-size: 9px; color: #aaa; margin-bottom: 2px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
	.no-trend { font-size: 10px; color: #ccc; font-style: italic; }

	/* View toggle */
	.view-toggle-bar { padding: 8px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 6px; background: #fafbfc; }
	.view-label { font-size: 10px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: .4px; margin-right: 4px; }
	.view-btn {
		padding: 4px 12px; border-radius: 99px; border: none; cursor: pointer;
		font-size: 11px; font-weight: 400; background: transparent; color: #888;
		transition: all .15s; font-family: inherit;
	}
	.view-btn.active { font-weight: 600; background: #222; color: #fff; }

	/* Empty */
	.empty { padding: 44px 20px; text-align: center; }
	.empty-icon { font-size: 32px; margin-bottom: 6px; opacity: .4; }
	.empty-title { font-size: 13px; font-weight: 600; color: #aaa; }
	.empty-sub { font-size: 11px; color: #ccc; margin-top: 3px; }

	/* Group header */
	.group-header {
		width: 100%; display: flex; align-items: center; justify-content: space-between;
		padding: 9px 20px; background: #f8f9fb; border: none; border-bottom: 1px solid #eee;
		cursor: pointer; font-size: 11px; color: #888; font-weight: 600; font-family: inherit;
	}
	.group-name { color: #444; }
	.group-count { font-weight: 400; margin-left: 6px; }

	/* Submission row */
	.sub-row {
		display: flex; align-items: center; padding: 9px 20px;
		background: #fff; border-bottom: 1px solid #f4f4f4;
		font-size: 12px; gap: 12px; flex-wrap: wrap;
	}
	.sub-row.alt { background: #fcfcfd; }

	.sub-info { flex: 1 1 180px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
	.sub-info.wide { flex: 1 1 220px; }
	.sub-date { color: #666; white-space: nowrap; }
	.dot { color: #ddd; }

	.test-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #f0f0f0; color: #555; white-space: nowrap; }

	.badge {
		font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 99px;
		text-transform: uppercase; letter-spacing: .4px;
	}
	.badge.test { background: rgba(0,177,137,.08); color: #00b189; }
	.badge.practice { background: rgba(240,160,48,.08); color: #c8920a; }
	.badge.ai-off { font-weight: 500; background: #f5f5f5; color: #b0b0b0; }

	.sub-score { flex: 0 0 140px; display: flex; align-items: center; gap: 6px; }
	.bar-na { border-radius: 99px; background: repeating-linear-gradient(90deg, #e8e8e8 0px, #e8e8e8 3px, transparent 3px, transparent 6px); }
	.na-label { font-size: 11px; color: #bbb; font-style: italic; }
	.bar-track { border-radius: 99px; background: #eee; overflow: hidden; }
	.bar-fill { height: 100%; border-radius: 99px; transition: width .5s ease; }
	.score-val { font-size: 12px; font-weight: 700; min-width: 38px; }

	.sub-details { flex: 1 1 200px; display: flex; gap: 4px; flex-wrap: wrap; }
	.detail-pill { font-size: 10px; background: #f4f7f5; padding: 2px 6px; border-radius: 5px; color: #888; white-space: nowrap; }
	.detail-pill.ungraded { background: #fafafa; color: #ccc; }

	.view-btn-row {
		flex: 0 0 auto; padding: 4px 13px; border-radius: 99px;
		border: 1.5px solid #00b189; background: transparent;
		color: #00b189; font-size: 11px; font-weight: 700;
		cursor: pointer; transition: all .15s; font-family: inherit; white-space: nowrap;
	}
	.view-btn-row:hover { background: #00b189; color: #fff; }

	/* Footer */
	.footer { text-align: center; padding: 14px 0; font-size: 10px; color: #c0c0c0; }
</style>
