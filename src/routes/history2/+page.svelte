<script lang="ts">
	/* ─── Helpers ─── */
	const fmtScore    = (v: number | null | undefined) =>
		v === null || v === undefined ? null : Number.isInteger(v) ? v + '.0' : String(v);
	const fmtScoreFull = (v: number | null | undefined) =>
		v === null || v === undefined ? null : fmtScore(v) + '/6';
	const fmtD = (iso: string) =>
		new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const fmtT = (iso: string) =>
		new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const scoreColor  = (v: number) => (v >= 5 ? '#00b189' : v >= 3.5 ? '#f0a030' : '#ff5859');
	const roundHalf   = (v: number) => Math.round(v * 2) / 2;

	/* ─── Section submission mock data ─── */
	const MOCK = [
		{ id: 'r0', section: 'Reading',   testNumber: 1, mode: 'test',     score: 3.5, scoreAvailable: true,  date: '2026-01-10T09:15:00', details: { 'Part 1': '8/12',  'Part 2': '7/12'  } },
		{ id: 'r1', section: 'Reading',   testNumber: 1, mode: 'practice', score: 3.0, scoreAvailable: true,  date: '2026-01-20T11:30:00', details: { 'Part 1': '7/12',  'Part 2': '6/12'  } },
		{ id: 'r2', section: 'Reading',   testNumber: 2, mode: 'test',     score: 4.0, scoreAvailable: true,  date: '2026-02-05T10:00:00', details: { 'Part 1': '9/12',  'Part 2': '8/12'  } },
		{ id: 'r3', section: 'Reading',   testNumber: 3, mode: 'test',     score: 4.0, scoreAvailable: true,  date: '2026-02-18T14:20:00', details: { 'Part 1': '10/12', 'Part 2': '8/12'  } },
		{ id: 'r4', section: 'Reading',   testNumber: 3, mode: 'practice', score: 3.5, scoreAvailable: true,  date: '2026-02-25T09:45:00', details: { 'Part 1': '9/12',  'Part 2': '7/12'  } },
		{ id: 'r5', section: 'Reading',   testNumber: 3, mode: 'test',     score: 4.5, scoreAvailable: true,  date: '2026-03-10T10:15:00', details: { 'Part 1': '11/12', 'Part 2': '9/12'  } },
		{ id: 'r6', section: 'Reading',   testNumber: 4, mode: 'practice', score: 4.0, scoreAvailable: true,  date: '2026-03-22T15:00:00', details: { 'Part 1': '10/12', 'Part 2': '8/12'  } },
		{ id: 'r7', section: 'Reading',   testNumber: 5, mode: 'test',     score: 4.5, scoreAvailable: true,  date: '2026-04-01T09:30:00', details: { 'Part 1': '11/12', 'Part 2': '10/12' } },
		{ id: 'l0', section: 'Listening', testNumber: 1, mode: 'test',     score: 3.5, scoreAvailable: true,  date: '2026-01-12T10:00:00', details: { 'Part 1': '10/14', 'Part 2': '9/14'  } },
		{ id: 'l1', section: 'Listening', testNumber: 2, mode: 'practice', score: 3.0, scoreAvailable: true,  date: '2026-01-28T13:30:00', details: { 'Part 1': '8/14',  'Part 2': '9/14'  } },
		{ id: 'l2', section: 'Listening', testNumber: 2, mode: 'test',     score: 3.5, scoreAvailable: true,  date: '2026-02-10T11:00:00', details: { 'Part 1': '10/14', 'Part 2': '9/14'  } },
		{ id: 'l3', section: 'Listening', testNumber: 3, mode: 'test',     score: 4.0, scoreAvailable: true,  date: '2026-02-20T09:15:00', details: { 'Part 1': '12/14', 'Part 2': '10/14' } },
		{ id: 'l4', section: 'Listening', testNumber: 4, mode: 'practice', score: 3.5, scoreAvailable: true,  date: '2026-03-05T14:00:00', details: { 'Part 1': '11/14', 'Part 2': '9/14'  } },
		{ id: 'l5', section: 'Listening', testNumber: 5, mode: 'test',     score: 4.0, scoreAvailable: true,  date: '2026-03-15T10:30:00', details: { 'Part 1': '12/14', 'Part 2': '11/14' } },
		{ id: 'l6', section: 'Listening', testNumber: 5, mode: 'practice', score: 4.5, scoreAvailable: true,  date: '2026-03-29T09:00:00', details: { 'Part 1': '13/14', 'Part 2': '11/14' } },
		{ id: 'l7', section: 'Listening', testNumber: 6, mode: 'test',     score: 4.5, scoreAvailable: true,  date: '2026-04-05T11:15:00', details: { 'Part 1': '13/14', 'Part 2': '12/14' } },
		{ id: 'w0', section: 'Writing',   testNumber: 1, mode: 'test',     score: 3.0,  scoreAvailable: true,  date: '2026-01-14T10:30:00', details: { 'Build a Sentence': '6/10', 'Write an Email': '3/5',        'Academic Discussion': '2/5'        } },
		{ id: 'w1', section: 'Writing',   testNumber: 1, mode: 'practice', score: null, scoreAvailable: false, date: '2026-01-22T14:00:00', details: { 'Build a Sentence': '7/10', 'Write an Email': 'not graded', 'Academic Discussion': 'not graded' } },
		{ id: 'w2', section: 'Writing',   testNumber: 2, mode: 'test',     score: 3.5,  scoreAvailable: true,  date: '2026-02-08T09:30:00', details: { 'Build a Sentence': '7/10', 'Write an Email': '3/5',        'Academic Discussion': '3/5'        } },
		{ id: 'w3', section: 'Writing',   testNumber: 3, mode: 'test',     score: null, scoreAvailable: false, date: '2026-02-22T11:45:00', details: { 'Build a Sentence': '8/10', 'Write an Email': 'not graded', 'Academic Discussion': 'not graded' } },
		{ id: 'w4', section: 'Writing',   testNumber: 3, mode: 'practice', score: 4.0,  scoreAvailable: true,  date: '2026-03-01T10:00:00', details: { 'Build a Sentence': '8/10', 'Write an Email': '4/5',        'Academic Discussion': '3/5'        } },
		{ id: 'w5', section: 'Writing',   testNumber: 4, mode: 'test',     score: 4.0,  scoreAvailable: true,  date: '2026-03-18T09:15:00', details: { 'Build a Sentence': '9/10', 'Write an Email': '4/5',        'Academic Discussion': '3/5'        } },
		{ id: 'w6', section: 'Writing',   testNumber: 5, mode: 'test',     score: null, scoreAvailable: false, date: '2026-03-28T14:30:00', details: { 'Build a Sentence': '9/10', 'Write an Email': 'not graded', 'Academic Discussion': 'not graded' } },
		{ id: 's0', section: 'Speaking',  testNumber: 1, mode: 'test',     score: null, scoreAvailable: false, date: '2026-01-16T11:00:00', details: { 'Listen and Repeat': 'not graded', 'Take an Interview': 'not graded' } },
		{ id: 's1', section: 'Speaking',  testNumber: 2, mode: 'practice', score: 3.0,  scoreAvailable: true,  date: '2026-02-01T10:15:00', details: { 'Listen and Repeat': '5/7',        'Take an Interview': '3/4'         } },
		{ id: 's2', section: 'Speaking',  testNumber: 2, mode: 'test',     score: null, scoreAvailable: false, date: '2026-02-15T13:00:00', details: { 'Listen and Repeat': 'not graded', 'Take an Interview': 'not graded' } },
		{ id: 's3', section: 'Speaking',  testNumber: 3, mode: 'test',     score: 3.5,  scoreAvailable: true,  date: '2026-03-05T09:30:00', details: { 'Listen and Repeat': '6/7',        'Take an Interview': '3/4'         } },
		{ id: 's4', section: 'Speaking',  testNumber: 4, mode: 'practice', score: null, scoreAvailable: false, date: '2026-03-20T14:45:00', details: { 'Listen and Repeat': 'not graded', 'Take an Interview': 'not graded' } },
		{ id: 's5', section: 'Speaking',  testNumber: 5, mode: 'test',     score: 4.0,  scoreAvailable: true,  date: '2026-04-04T10:00:00', details: { 'Listen and Repeat': '7/7',        'Take an Interview': '4/4'         } },
	];

	/* ─── Complete test mock data ─── */
	type Sec4 = 'Reading' | 'Listening' | 'Speaking' | 'Writing';
	interface CompleteSub {
		id: string;
		testNumber: number;
		date: string;
		duration: string;
		scores: Record<Sec4, number | null>;
		composite: number | null;
	}
	const COMPLETE: CompleteSub[] = [
		{ id: 'ct1a', testNumber: 1, date: '2026-01-18T10:00:00', duration: '1h 32m', scores: { Reading: 3.5, Listening: 3.5, Speaking: null, Writing: 3.0 }, composite: null },
		{ id: 'ct1b', testNumber: 1, date: '2026-03-10T09:30:00', duration: '1h 28m', scores: { Reading: 4.0, Listening: 3.5, Speaking: null, Writing: 3.5 }, composite: null },
		{ id: 'ct2a', testNumber: 2, date: '2026-02-12T11:00:00', duration: '1h 35m', scores: { Reading: 4.0, Listening: 3.5, Speaking: 3.0, Writing: 3.5 }, composite: roundHalf((4.0+3.5+3.0+3.5)/4) },
		{ id: 'ct2b', testNumber: 2, date: '2026-03-29T10:15:00', duration: '1h 31m', scores: { Reading: 4.5, Listening: 4.0, Speaking: 3.5, Writing: 4.0 }, composite: roundHalf((4.5+4.0+3.5+4.0)/4) },
		{ id: 'ct3a', testNumber: 3, date: '2026-02-25T14:00:00', duration: '1h 40m', scores: { Reading: 4.0, Listening: 4.0, Speaking: 3.5, Writing: null }, composite: null },
		{ id: 'ct4a', testNumber: 4, date: '2026-03-18T09:00:00', duration: '1h 29m', scores: { Reading: 4.5, Listening: 3.5, Speaking: null, Writing: 4.0 }, composite: null },
		{ id: 'ct5a', testNumber: 5, date: '2026-04-02T10:30:00', duration: '1h 27m', scores: { Reading: 4.5, Listening: 4.0, Speaking: 4.0, Writing: null }, composite: null },
	];

	const SEC4: Sec4[] = ['Reading', 'Listening', 'Speaking', 'Writing'];
	const secColors: Record<Sec4, string> = {
		Reading: '#3b82f6', Listening: '#8b5cf6', Speaking: '#f97316', Writing: '#ec4899'
	};

	/* ─── Icon paths ─── */
	const iconPaths: Record<string, string[]> = {
		Reading:        ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
		Listening:      ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
		Writing:        ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'],
		Speaking:       ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2'],
		'Complete Tests': ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 8h.01M9 16h.01M13 12h3m-3 4h3'],
	};

	/* ─── Arc helpers (gauge) ─── */
	const arcPath = (sa: number, ea: number) => {
		const r = 46, cx = 60, cy = 54;
		const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
		const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
		return `M${x1},${y1}A${r},${r},0,${ea - sa > Math.PI ? 1 : 0},1,${x2},${y2}`;
	};
	const SA = Math.PI * 0.82;
	const EA = Math.PI * 2.18;
	const TA = EA - SA;

	/* ─── Trend helper ─── */
	function buildTrend(pts: { v: number }[]) {
		if (!pts || pts.length < 2) return null;
		const W = 180, H = 42, px = 4, py = 4;
		const mn = 0.5, mx = 6.5;
		const coords = pts.map((p, i) => ({
			x: px + (i / (pts.length - 1)) * (W - px * 2),
			y: py + (1 - (p.v - mn) / (mx - mn)) * (H - py * 2)
		}));
		const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
		const diff  = roundHalf(pts[pts.length - 1].v - pts[0].v);
		const color = diff >= 0 ? '#00b189' : '#ff5859';
		return {
			W, H, coords, d, color,
			area: `${d}L${coords[coords.length - 1].x},${H}L${coords[0].x},${H}Z`,
			diffLabel: (diff >= 0 ? '+' : '') + fmtScore(diff)
		};
	}

	/* ─── State ─── */
	const secs = ['Reading', 'Listening', 'Writing', 'Speaking', 'Complete Tests'];
	let mode    = $state<'all' | 'test' | 'practice'>('all');
	let sec     = $state('Reading');
	let expanded = $state<Record<string, boolean>>({});
	let viewBy  = $state<'test' | 'date'>('test');

	/* ─── Derived — section stats ─── */
	const data = $derived(MOCK.filter(s => mode === 'all' || s.mode === mode));

	const stats = $derived.by(() => {
		const o: Record<string, { avg: number | null; best: number | null; count: number; aiCount: number; trend: { v: number }[] }> = {};
		secs.filter(s => s !== 'Complete Tests').forEach(sc => {
			const all = data.filter(s => s.section === sc);
			const ws  = all.filter(s => s.scoreAvailable && s.score !== null);
			const avg  = ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null;
			const best = ws.length ? Math.max(...ws.map(s => s.score as number)) : null;
			const trend = [...ws].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => ({ v: s.score as number }));
			o[sc] = { avg, best, count: all.length, aiCount: ws.length, trend };
		});
		// Complete Tests stats
		const ctFiltered = mode === 'all' ? COMPLETE : mode === 'test' ? COMPLETE : [];
		const scored = ctFiltered.filter(t => t.composite !== null);
		const avg  = scored.length ? roundHalf(scored.reduce((a, t) => a + (t.composite as number), 0) / scored.length) : null;
		const best = scored.length ? Math.max(...scored.map(t => t.composite as number)) : null;
		const trend = [...scored].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => ({ v: t.composite as number }));
		o['Complete Tests'] = { avg, best, count: ctFiltered.length, aiCount: scored.length, trend };
		return o;
	});

	const allAvg   = $derived((['Reading','Listening','Writing','Speaking'] as const).map(s => stats[s].avg));
	const genScore = $derived(allAvg.every(v => v !== null) ? roundHalf((allAvg as number[]).reduce((a, b) => a + b, 0) / 4) : null);
	const genBest  = $derived((['Reading','Listening','Writing','Speaking'] as const).every(s => stats[s].best !== null)
		? roundHalf((['Reading','Listening','Writing','Speaking'] as const).reduce((a, s) => a + (stats[s].best as number), 0) / 4)
		: null);

	/* ─── Derived — section rows ─── */
	const rows = $derived(
		data.filter(s => s.section === sec)
			.sort((a, b) => a.testNumber !== b.testNumber ? a.testNumber - b.testNumber : new Date(b.date).getTime() - new Date(a.date).getTime())
	);
	const groups = $derived.by(() => {
		const g: Record<string, typeof rows> = {};
		rows.forEach(s => { if (!g[s.testNumber]) g[s.testNumber] = []; g[s.testNumber].push(s); });
		return g;
	});
	const byDateRows = $derived([...rows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

	/* ─── Derived — complete test rows ─── */
	const ctData = $derived(mode === 'practice' ? [] : COMPLETE);
	const ctGroups = $derived.by(() => {
		const g: Record<number, CompleteSub[]> = {};
		[...ctData].sort((a, b) => a.testNumber - b.testNumber || new Date(b.date).getTime() - new Date(a.date).getTime())
			.forEach(t => { if (!g[t.testNumber]) g[t.testNumber] = []; g[t.testNumber].push(t); });
		return g;
	});
	const ctByDate = $derived([...ctData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

	/* ─── Derived — panel helpers ─── */
	const isComplete   = $derived(sec === 'Complete Tests');
	const needsAI      = $derived(sec === 'Writing' || sec === 'Speaking');
	const st           = $derived(stats[sec]);
	const trendData    = $derived(buildTrend(st.trend));
	const gaugeScore   = $derived(isComplete ? st.avg : genScore);
	const gaugeNA      = $derived(gaugeScore === null || gaugeScore === undefined);
	const gaugeColor   = $derived(gaugeNA ? '#ddd' : scoreColor(gaugeScore as number));
	const gaugeFillAngle = $derived(gaugeNA ? SA : SA + (((gaugeScore as number) - 1) / 5) * TA);
	const gaugeLabel   = $derived(isComplete ? 'Composite Avg' : 'Overall Score');
	const gaugeBest    = $derived(isComplete ? st.best : genBest);

	function toggleTest(key: string) { expanded[key] = !expanded[key]; }
	function isExpanded(key: string) { return expanded[key] !== false; }
</script>

<svelte:head>
	<title>Results Dashboard – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="dashboard">
	<!-- ─── Sticky header: title row + overview cards ─── -->
	<div class="sticky-header">
		<div class="header">
			<div>
				<h1><span class="green">Results</span> Dashboard</h1>
				<p class="subtitle">Track your TOEFL 2026 scores across all sections</p>
			</div>
			<div class="mode-toggle">
				{#each [['all','All'],['test','Test'],['practice','Practice']] as [val, label]}
					<button class="mode-btn" class:active={mode === val} onclick={() => (mode = val as typeof mode)}>
						{label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Score Overview: Overall + 5 section cards (incl. Complete Tests) -->
		<div class="overview-row">
			<!-- Overall Score -->
			<div class="ov-card ov-overall">
				<span class="ov-label">{isComplete ? 'Composite Avg' : 'Overall Avg'}</span>
				<div class="ov-big" style="color:{gaugeNA ? '#d0d5dd' : gaugeColor}">
					{gaugeNA ? '—' : fmtScore(gaugeScore)}{#if !gaugeNA}<span class="ov-denom">/6</span>{/if}
				</div>
				{#if gaugeBest !== null}
					<div class="ov-best">Best <b class="green">{fmtScore(gaugeBest)}/6</b></div>
				{:else}
					<div class="ov-hint">{isComplete ? 'No fully scored tests' : 'Need all 4 sections'}</div>
				{/if}
			</div>

			<!-- Section cards -->
			{#each secs as sc}
				{@const s = stats[sc]}
				{@const act = sec === sc}
				<button class="ov-card ov-sec" class:active={act} onclick={() => (sec = sc)}>
					{#if act}<div class="ov-bar"></div>{/if}
					<div class="ov-head">
						<div class="ov-icon" class:active={act}>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								{#each iconPaths[sc] as d}<path {d} />{/each}
								{#if sc === 'Speaking'}<line x1="12" x2="12" y1="19" y2="22" />{/if}
							</svg>
						</div>
						<span class="ov-name">{sc === 'Complete Tests' ? 'Full Tests' : sc}</span>
					</div>
					<div class="ov-score-row">
						<span class="ov-val" style="color:{s.avg === null ? '#d0d5dd' : '#1a1a1a'}">{s.avg === null ? '—' : fmtScore(s.avg)}</span>
						{#if s.avg !== null}<span class="ov-denom">/6</span><span class="ov-unit">{sc === 'Complete Tests' ? 'comp' : 'avg'}</span>{/if}
					</div>
					<div class="ov-foot">
						<span>Best: <b style="color:{s.best === null ? '#ccc' : '#00b189'}">{s.best === null ? '—' : fmtScore(s.best)}</b></span>
						<span class="ov-count">{s.count}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Detail Panel -->
	<div class="panel">
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
						{st.count} {isComplete ? 'attempt' : 'submission'}{st.count !== 1 ? 's' : ''}
						{#if isComplete && st.aiCount < st.count} · {st.aiCount} fully scored{/if}
						{#if !isComplete && needsAI} · {st.aiCount} AI-graded{/if}
					</p>
				</div>
			</div>
			<div class="trend-area">
				<div class="trend-label">Progress</div>
				{#if trendData}
					<div style="display:flex;align-items:center;gap:8px">
						<svg width={trendData.W} height={trendData.H}>
							<defs>
								<linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color={trendData.color} stop-opacity=".12" />
									<stop offset="100%" stop-color={trendData.color} stop-opacity="0" />
								</linearGradient>
							</defs>
							<path d={trendData.area} fill="url(#tg2)" />
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
		{#if (isComplete ? ctData.length : rows.length) > 0}
			<div class="view-toggle-bar">
				<span class="view-label">View by</span>
				{#each [['test', 'Test Number'], ['date', 'Date']] as [val, label]}
					<button class="view-btn" class:active={viewBy === val} onclick={() => (viewBy = val as typeof viewBy)}>
						{label}
					</button>
				{/each}
			</div>
		{/if}

		<!-- ═══ SECTION VIEW ═══ -->
		{#if !isComplete}
			{#if rows.length === 0}
				<div class="empty">
					<div class="empty-icon">📝</div>
					<div class="empty-title">No {sec.toLowerCase()} submissions yet</div>
					<div class="empty-sub">Complete a practice test to see results here</div>
				</div>
			{:else if viewBy === 'test'}
				{#each Object.entries(groups) as [num, subs]}
					{@const open = isExpanded(sec + num)}
					<div>
						<button class="group-header" onclick={() => toggleTest(sec + num)}>
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

		<!-- ═══ COMPLETE TESTS VIEW ═══ -->
		{:else}
			{#if ctData.length === 0}
				<div class="empty">
					<div class="empty-icon">🗂️</div>
					<div class="empty-title">No complete test attempts yet</div>
					<div class="empty-sub">Take a full 4-section practice test to see results here</div>
				</div>
			{:else if viewBy === 'test'}
				{#each Object.entries(ctGroups) as [num, attempts]}
					{@const open = isExpanded('ct' + num)}
					<div>
						<button class="group-header" onclick={() => toggleTest('ct' + num)}>
							<span>
								<span class="group-name">TOEFL Practice Test #{num}</span>
								<span class="group-count">· {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}</span>
							</span>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform .2s;transform:rotate({open ? 180 : 0}deg)">
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>
						{#if open}
							{#each attempts as t, i}
								<div class="sub-row" class:alt={i % 2 !== 0}>
									<div class="sub-info">
										<span class="sub-date">{fmtD(t.date)} <span class="dot">·</span> {fmtT(t.date)}</span>
										<span class="sub-date" style="color:#bbb">{t.duration}</span>
									</div>
									<div class="sec-chips">
										{#each SEC4 as s}
											{@const v = t.scores[s]}
											<span class="sec-chip" style="color:{v !== null ? scoreColor(v) : '#ccc'};background:{v !== null ? scoreColor(v) + '18' : '#f5f5f5'}">
												{s.slice(0,1)}: {v !== null ? fmtScore(v) : '—'}
											</span>
										{/each}
									</div>
									<div class="sub-score">
										{#if t.composite !== null}
											<div class="bar-track" style="width:80px;height:6px">
												<div class="bar-fill" style="width:{((t.composite - 1) / 5) * 100}%;background:{scoreColor(t.composite)}"></div>
											</div>
											<span class="score-val" style="color:{scoreColor(t.composite)}">{fmtScoreFull(t.composite)}</span>
										{:else}
											<div class="bar-na" style="width:80px;height:6px"></div>
											<span class="na-label">Pending</span>
										{/if}
									</div>
									<button class="view-btn-row">View →</button>
								</div>
							{/each}
						{/if}
					</div>
				{/each}
			{:else}
				{#each ctByDate as t, i}
					<div class="sub-row" class:alt={i % 2 !== 0}>
						<div class="sub-info wide">
							<span class="test-pill">Test #{t.testNumber}</span>
							<span class="sub-date">{fmtD(t.date)} <span class="dot">·</span> {fmtT(t.date)}</span>
							<span class="sub-date" style="color:#bbb">{t.duration}</span>
						</div>
						<div class="sec-chips">
							{#each SEC4 as s}
								{@const v = t.scores[s]}
								<span class="sec-chip" style="color:{v !== null ? scoreColor(v) : '#ccc'};background:{v !== null ? scoreColor(v) + '18' : '#f5f5f5'}">
									{s.slice(0,1)}: {v !== null ? fmtScore(v) : '—'}
								</span>
							{/each}
						</div>
						<div class="sub-score">
							{#if t.composite !== null}
								<div class="bar-track" style="width:80px;height:6px">
									<div class="bar-fill" style="width:{((t.composite - 1) / 5) * 100}%;background:{scoreColor(t.composite)}"></div>
								</div>
								<span class="score-val" style="color:{scoreColor(t.composite)}">{fmtScoreFull(t.composite)}</span>
							{:else}
								<div class="bar-na" style="width:80px;height:6px"></div>
								<span class="na-label">Pending</span>
							{/if}
						</div>
						<button class="view-btn-row">View →</button>
					</div>
				{/each}
			{/if}
		{/if}
	</div>

	<div class="footer">
		Scores follow the TOEFL 2026 scale (1–6){#if needsAI && !isComplete} · Non-AI submissions excluded from averages{/if}{#if isComplete} · Composite = average of all 4 section scores{/if}
	</div>
</div>

<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }

	.dashboard { font-family: 'DM Sans', sans-serif; padding: 0 32px 28px; color: #222; }

	/* ── Sticky header ── */
	.sticky-header { position: sticky; top: 56px; z-index: 40; background: #f9fafb; padding: 20px 0 12px; border-bottom: 1px solid #ebebeb; margin-bottom: 16px; }

	.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
	h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
	.green { color: #00b189; }
	.subtitle { font-size: 12px; color: #999; margin-top: 2px; }

	.mode-toggle { display: inline-flex; background: #edeef0; border-radius: 99px; padding: 3px; }
	.mode-btn { padding: 6px 14px; border-radius: 99px; border: none; cursor: pointer; font-size: 12px; font-weight: 400; background: transparent; color: #777; transition: all .2s; font-family: inherit; }
	.mode-btn.active { font-weight: 600; background: #00b189; color: #fff; }

	/* ── Overview row: Overall + 5 section cards (incl. Complete Tests) ── */
	.overview-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }

	.ov-card { background: #fff; border-radius: 14px; padding: 14px 13px 12px; box-shadow: 0 1px 4px rgba(0,0,0,.05); position: relative; overflow: hidden; }
	.ov-overall { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 3px; }
	.ov-label { font-size: 10px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: .5px; }
	.ov-big { font-size: 28px; font-weight: 800; letter-spacing: -1.5px; line-height: 1; }
	.ov-denom { font-size: 13px; font-weight: 600; color: #bbb; }
	.ov-best { font-size: 11px; color: #999; }
	.ov-hint { font-size: 10px; color: #ccc; line-height: 1.3; max-width: 90px; }

	.ov-sec { border: 2px solid transparent; cursor: pointer; text-align: left; font-family: inherit; transition: all .15s; }
	.ov-sec.active { border-color: #00b189; box-shadow: 0 3px 12px rgba(0,177,137,.12); }
	.ov-sec:hover:not(.active) { background: #f8f8f8; }
	.ov-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #00b189; }
	.ov-head { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
	.ov-icon { width: 24px; height: 24px; border-radius: 7px; background: #f0f0f0; color: #999; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.ov-icon.active { background: rgba(0,177,137,.08); color: #00b189; }
	.ov-name { font-size: 11px; font-weight: 600; color: #333; }
	.ov-score-row { display: flex; align-items: baseline; gap: 2px; margin-bottom: 6px; }
	.ov-val { font-size: 22px; font-weight: 800; letter-spacing: -1px; }
	.ov-unit { font-size: 9px; color: #aaa; margin-left: 3px; }
	.ov-foot { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; }
	.ov-count { font-weight: 600; }

	.panel { background: #fff; border-radius: 16px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
	.panel-header { padding: 14px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
	.panel-title-row { display: flex; align-items: center; gap: 10px; }
	.panel-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(0,177,137,.06); display: flex; align-items: center; justify-content: center; color: #00b189; }
	.panel-section-name { font-size: 16px; font-weight: 700; }
	.panel-sub { font-size: 11px; color: #999; }
	.trend-area { text-align: right; }
	.trend-label { font-size: 9px; color: #aaa; margin-bottom: 2px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
	.no-trend { font-size: 10px; color: #ccc; font-style: italic; }

	.view-toggle-bar { padding: 8px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 6px; background: #fafbfc; }
	.view-label { font-size: 10px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: .4px; margin-right: 4px; }
	.view-btn { padding: 4px 12px; border-radius: 99px; border: none; cursor: pointer; font-size: 11px; font-weight: 400; background: transparent; color: #888; transition: all .15s; font-family: inherit; }
	.view-btn.active { font-weight: 600; background: #222; color: #fff; }

	.empty { padding: 44px 20px; text-align: center; }
	.empty-icon { font-size: 32px; margin-bottom: 6px; opacity: .4; }
	.empty-title { font-size: 13px; font-weight: 600; color: #aaa; }
	.empty-sub { font-size: 11px; color: #ccc; margin-top: 3px; }

	.group-header { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 9px 20px; background: #f8f9fb; border: none; border-bottom: 1px solid #eee; cursor: pointer; font-size: 11px; color: #888; font-weight: 600; font-family: inherit; }
	.group-name { color: #444; }
	.group-count { font-weight: 400; margin-left: 6px; }

	.sub-row { display: flex; align-items: center; padding: 9px 20px; background: #fff; border-bottom: 1px solid #f4f4f4; font-size: 12px; gap: 12px; flex-wrap: wrap; }
	.sub-row.alt { background: #fcfcfd; }
	.sub-info { flex: 1 1 180px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
	.sub-info.wide { flex: 1 1 220px; }
	.sub-date { color: #666; white-space: nowrap; }
	.dot { color: #ddd; }
	.test-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #f0f0f0; color: #555; white-space: nowrap; }

	.badge { font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 99px; text-transform: uppercase; letter-spacing: .4px; }
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

	.sec-chips { flex: 1 1 160px; display: flex; gap: 4px; flex-wrap: wrap; }
	.sec-chip { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px; white-space: nowrap; }

	.view-btn-row { flex: 0 0 auto; padding: 4px 13px; border-radius: 99px; border: 1.5px solid #00b189; background: transparent; color: #00b189; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; font-family: inherit; white-space: nowrap; }
	.view-btn-row:hover { background: #00b189; color: #fff; }

	.footer { text-align: center; padding: 14px 0; font-size: 10px; color: #c0c0c0; }

	@media (max-width: 900px) {
		.section-cards { grid-template-columns: repeat(3, 1fr); }
	}
	@media (max-width: 767px) {
		.dashboard { padding: 0 16px 20px; }
		.sticky-header { top: 56px; padding: 14px 0 10px; }
		h1 { font-size: 18px; }
		.header { flex-direction: column; align-items: flex-start; gap: 10px; }
		.overview-row { grid-template-columns: repeat(3, 1fr); }
		.ov-overall { grid-column: 1 / -1; flex-direction: row; text-align: left; gap: 16px; padding: 12px 14px; }
		.ov-big { font-size: 24px; }
		.ov-val { font-size: 20px; }
		.panel-header { flex-direction: column; align-items: flex-start; }
		.trend-area { text-align: left; width: 100%; }
		.sub-row { padding: 8px 14px; gap: 8px; }
		.sub-score { flex: 0 0 120px; }
		.sub-details, .sec-chips { flex-basis: 100%; }
		.group-header { padding: 8px 14px; }
		.view-toggle-bar { padding: 7px 14px; }
	}
	@media (max-width: 480px) {
		.overview-row { grid-template-columns: repeat(2, 1fr); }
		.ov-card { padding: 10px 10px 9px; }
		.sub-score { flex: 0 0 100px; }
		.view-btn-row { padding: 3px 10px; font-size: 10px; }
	}
</style>
