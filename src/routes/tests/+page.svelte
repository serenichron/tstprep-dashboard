<script lang="ts">
	/* ─── Helpers ─── */
	const fmtD = (iso: string) =>
		new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const fmtScore = (v: number | null) =>
		v === null ? '—' : Number.isInteger(v) ? v + '.0' : String(v);
	const scoreColor = (v: number | null) =>
		v === null ? '#ccc' : v >= 5 ? '#00b189' : v >= 3.5 ? '#f0a030' : '#ff5859';
	const scoreBg = (v: number | null) =>
		v === null ? '#f4f5f7' : v >= 5 ? '#e6f7f3' : v >= 3.5 ? '#fff5e0' : '#ffe8e8';
	const roundHalf = (v: number) => Math.round(v * 2) / 2;

	/* ─── Mock complete test results ─── */
	type Section = 'Reading' | 'Listening' | 'Speaking' | 'Writing';
	interface TestResult {
		id: string;
		testNumber: number;
		date: string;
		duration: string;
		scores: Record<Section, number | null>;
		composite: number | null;
		notes?: string;
	}

	const TESTS: TestResult[] = [
		{
			id: 'ct1a',
			testNumber: 1,
			date: '2026-01-18T10:00:00',
			duration: '1h 32m',
			scores: { Reading: 3.5, Listening: 3.5, Speaking: null, Writing: 3.0 },
			composite: null,
			notes: 'Speaking pending AI grading'
		},
		{
			id: 'ct1b',
			testNumber: 1,
			date: '2026-03-10T09:30:00',
			duration: '1h 28m',
			scores: { Reading: 4.0, Listening: 3.5, Speaking: null, Writing: 3.5 },
			composite: null,
			notes: 'Speaking pending AI grading'
		},
		{
			id: 'ct2a',
			testNumber: 2,
			date: '2026-02-12T11:00:00',
			duration: '1h 35m',
			scores: { Reading: 4.0, Listening: 3.5, Speaking: 3.0, Writing: 3.5 },
			composite: roundHalf((4.0 + 3.5 + 3.0 + 3.5) / 4)
		},
		{
			id: 'ct2b',
			testNumber: 2,
			date: '2026-03-29T10:15:00',
			duration: '1h 31m',
			scores: { Reading: 4.5, Listening: 4.0, Speaking: 3.5, Writing: 4.0 },
			composite: roundHalf((4.5 + 4.0 + 3.5 + 4.0) / 4)
		},
		{
			id: 'ct3a',
			testNumber: 3,
			date: '2026-02-25T14:00:00',
			duration: '1h 40m',
			scores: { Reading: 4.0, Listening: 4.0, Speaking: 3.5, Writing: null },
			composite: null,
			notes: 'Writing pending AI grading'
		},
		{
			id: 'ct4a',
			testNumber: 4,
			date: '2026-03-18T09:00:00',
			duration: '1h 29m',
			scores: { Reading: 4.5, Listening: 3.5, Speaking: null, Writing: 4.0 },
			composite: null,
			notes: 'Speaking pending AI grading'
		},
		{
			id: 'ct5a',
			testNumber: 5,
			date: '2026-04-02T10:30:00',
			duration: '1h 27m',
			scores: { Reading: 4.5, Listening: 4.0, Speaking: 4.0, Writing: null },
			composite: null,
			notes: 'Writing pending AI grading'
		}
	];

	const SECTIONS: Section[] = ['Reading', 'Listening', 'Speaking', 'Writing'];

	const sectionColors: Record<Section, { text: string; bg: string; dot: string }> = {
		Reading:   { text: 'text-blue-700',   bg: 'bg-blue-50',   dot: 'bg-blue-500' },
		Listening: { text: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-500' },
		Speaking:  { text: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
		Writing:   { text: 'text-pink-700',   bg: 'bg-pink-50',   dot: 'bg-pink-500' }
	};

	const iconPaths: Record<string, string[]> = {
		Reading:   ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
		Listening: ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
		Speaking:  ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2'],
		Writing:   ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z']
	};

	/* ─── State ─── */
	type Tab = 'all' | Section;
	let activeTab = $state<Tab>('all');
	let expanded = $state<Record<string, boolean>>({});

	/* ─── Derived ─── */
	const sortedTests = $derived(
		[...TESTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	);

	const completedTests = $derived(TESTS.filter(t => t.composite !== null));

	const bestComposite = $derived(
		completedTests.length ? Math.max(...completedTests.map(t => t.composite as number)) : null
	);

	const latestComposite = $derived(
		completedTests.length
			? [...completedTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].composite
			: null
	);

	const sectionBests = $derived(
		Object.fromEntries(
			SECTIONS.map(s => {
				const vals = TESTS.map(t => t.scores[s]).filter(v => v !== null) as number[];
				return [s, vals.length ? Math.max(...vals) : null];
			})
		) as Record<Section, number | null>
	);

	// For section tab: show evolution of that section across all tests, sorted by date
	const sectionRows = $derived(
		activeTab === 'all'
			? []
			: [...TESTS]
					.filter(t => t.scores[activeTab as Section] !== undefined)
					.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	);
</script>

<svelte:head>
	<title>Complete Test History – TST Prep</title>
</svelte:head>

<div class="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto space-y-6">

	<!-- Page header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<div>
			<h1 class="text-2xl font-black text-gray-900">
				Complete <span class="text-brand-green">Test History</span>
			</h1>
			<p class="text-sm text-gray-400 mt-0.5">Full practice tests — all 4 sections per attempt</p>
		</div>
		<div class="text-sm text-gray-400">
			{TESTS.length} attempt{TESTS.length !== 1 ? 's' : ''} total
		</div>
	</div>

	<!-- Summary stats -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
		<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
			<p class="text-xs text-gray-400 mb-1">Tests Taken</p>
			<p class="text-2xl font-black text-gray-900">{TESTS.length}</p>
		</div>
		<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
			<p class="text-xs text-gray-400 mb-1">Best Overall</p>
			<p class="text-2xl font-black" style="color:{scoreColor(bestComposite)}">
				{fmtScore(bestComposite)}<span class="text-sm font-normal text-gray-400"> /6</span>
			</p>
		</div>
		<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
			<p class="text-xs text-gray-400 mb-1">Latest Overall</p>
			<p class="text-2xl font-black" style="color:{scoreColor(latestComposite)}">
				{fmtScore(latestComposite)}<span class="text-sm font-normal text-gray-400"> /6</span>
			</p>
		</div>
		<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
			<p class="text-xs text-gray-400 mb-1">Fully Scored</p>
			<p class="text-2xl font-black text-gray-900">
				{completedTests.length}<span class="text-sm font-normal text-gray-400"> / {TESTS.length}</span>
			</p>
		</div>
	</div>

	<!-- Section bests row -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
		{#each SECTIONS as section}
			{@const c = sectionColors[section]}
			<div class="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm flex items-center gap-3">
				<div class="w-8 h-8 rounded-xl {c.bg} flex items-center justify-center flex-shrink-0">
					<svg class="w-4 h-4 {c.text}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
						{#each iconPaths[section] as d}
							<path stroke-linecap="round" stroke-linejoin="round" d={d} />
						{/each}
					</svg>
				</div>
				<div class="min-w-0">
					<p class="text-[10px] text-gray-400 leading-none">{section}</p>
					<p class="text-lg font-black mt-0.5" style="color:{scoreColor(sectionBests[section])}">
						{fmtScore(sectionBests[section])}
						{#if sectionBests[section] !== null}
							<span class="text-xs font-normal text-gray-400">/6</span>
						{/if}
					</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Tab navigation -->
	<div class="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
		<button
			class="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all {activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
			onclick={() => (activeTab = 'all')}
		>
			Complete Tests
		</button>
		{#each SECTIONS as section}
			{@const c = sectionColors[section]}
			<button
				class="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all {activeTab === section ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (activeTab = section)}
			>
				<span class="w-1.5 h-1.5 rounded-full {c.dot}"></span>
				{section}
			</button>
		{/each}
	</div>

	<!-- ─── Complete Tests view ─── -->
	{#if activeTab === 'all'}
		<div class="space-y-3">
			{#each sortedTests as test (test.id)}
				{@const isOpen = expanded[test.id] !== false}
				<div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					<!-- Row header — always visible -->
					<button
						class="w-full text-left px-5 py-4 flex items-center gap-4"
						onclick={() => (expanded[test.id] = !isOpen)}
					>
						<!-- Test badge -->
						<div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
							<span class="text-white text-xs font-black">#{test.testNumber}</span>
						</div>

						<!-- Title + date -->
						<div class="flex-1 min-w-0">
							<p class="font-bold text-gray-900 text-sm">TOEFL Practice Test #{test.testNumber}</p>
							<p class="text-xs text-gray-400">{fmtD(test.date)} · {test.duration}</p>
						</div>

						<!-- Section score chips — hidden on small screens, shown on md+ -->
						<div class="hidden md:flex items-center gap-2">
							{#each SECTIONS as section}
								{@const v = test.scores[section]}
								{@const c = sectionColors[section]}
								<div class="flex flex-col items-center gap-0.5">
									<span class="text-[9px] font-semibold {c.text} uppercase tracking-wide">{section.slice(0, 1)}</span>
									<span
										class="text-sm font-black px-2 py-0.5 rounded-lg"
										style="color:{scoreColor(v)};background:{scoreBg(v)}"
									>
										{fmtScore(v)}
									</span>
								</div>
							{/each}
						</div>

						<!-- Composite score -->
						<div class="flex-shrink-0 text-right ml-2">
							{#if test.composite !== null}
								<p class="text-xl font-black" style="color:{scoreColor(test.composite)}">{fmtScore(test.composite)}</p>
								<p class="text-[10px] text-gray-400">/ 6.0 overall</p>
							{:else}
								<p class="text-sm font-semibold text-gray-400">Pending</p>
								<p class="text-[10px] text-gray-300">scoring</p>
							{/if}
						</div>

						<!-- Chevron -->
						<svg
							class="w-4 h-4 text-gray-300 flex-shrink-0 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
							fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					<!-- Expanded detail -->
					{#if isOpen}
						<div class="border-t border-gray-50 px-5 py-4 bg-gray-50/50 space-y-4">

							<!-- Section scores — full breakdown with bars -->
							<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{#each SECTIONS as section}
									{@const v = test.scores[section]}
									{@const c = sectionColors[section]}
									<div class="bg-white rounded-xl p-3 border border-gray-100">
										<div class="flex items-center gap-1.5 mb-2">
											<span class="w-2 h-2 rounded-full {c.dot}"></span>
											<span class="text-xs font-semibold text-gray-500">{section}</span>
										</div>
										{#if v !== null}
											<p class="text-2xl font-black mb-1" style="color:{scoreColor(v)}">{fmtScore(v)}<span class="text-xs font-normal text-gray-400"> /6</span></p>
											<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
												<div
													class="h-full rounded-full transition-all duration-700"
													style="width:{((v - 1) / 5) * 100}%;background:{scoreColor(v)}"
												></div>
											</div>
										{:else}
											<p class="text-sm font-semibold text-gray-400 mt-1">Awaiting grading</p>
											{#if v === null && (section === 'Speaking' || section === 'Writing')}
												<p class="text-[10px] text-amber-500 mt-0.5 flex items-center gap-1">
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
														<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
													</svg>
													AI feedback available
												</p>
											{/if}
										{/if}
									</div>
								{/each}
							</div>

							<!-- Composite + note -->
							<div class="flex flex-col sm:flex-row sm:items-center gap-3">
								{#if test.composite !== null}
									<div class="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
										<span class="text-sm text-gray-500 font-medium">Overall Score</span>
										<span class="text-2xl font-black" style="color:{scoreColor(test.composite)}">{fmtScore(test.composite)}</span>
										<span class="text-sm text-gray-400">/ 6.0</span>
									</div>
								{/if}
								{#if test.notes}
									<p class="text-xs text-gray-400 italic">{test.notes}</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

	<!-- ─── Section view ─── -->
	{:else}
		{@const section = activeTab as Section}
		{@const c = sectionColors[section]}
		<div class="space-y-3">
			<div class="flex items-center gap-2 mb-1">
				<span class="w-2 h-2 rounded-full {c.dot}"></span>
				<p class="text-sm text-gray-500">Showing {section} scores from complete tests, most recent first</p>
			</div>

			{#each sectionRows as test (test.id)}
				{@const v = test.scores[section]}
				<div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
					<!-- Test badge -->
					<div class="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
						<span class="text-white text-xs font-black">#{test.testNumber}</span>
					</div>

					<!-- Info -->
					<div class="flex-1 min-w-0">
						<p class="font-bold text-gray-900 text-sm">TOEFL Practice Test #{test.testNumber}</p>
						<p class="text-xs text-gray-400">{fmtD(test.date)} · {test.duration}</p>
					</div>

					<!-- Score bar -->
					{#if v !== null}
						<div class="hidden sm:flex items-center gap-3 flex-1 max-w-xs">
							<div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									class="h-full rounded-full transition-all duration-700"
									style="width:{((v - 1) / 5) * 100}%;background:{scoreColor(v)}"
								></div>
							</div>
						</div>
					{/if}

					<!-- Score chip -->
					{#if v !== null}
						<div class="flex-shrink-0 text-right">
							<p class="text-2xl font-black" style="color:{scoreColor(v)}">{fmtScore(v)}</p>
							<p class="text-[10px] text-gray-400">/ 6.0</p>
						</div>
					{:else}
						<div class="flex-shrink-0 text-right">
							<p class="text-sm font-semibold text-gray-400">Pending</p>
							{#if section === 'Speaking' || section === 'Writing'}
								<p class="text-[10px] text-amber-500 flex items-center justify-end gap-1 mt-0.5">
									<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
									</svg>
									Use AI feedback
								</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}

			{#if sectionRows.length === 0}
				<div class="text-center py-12 text-gray-400 text-sm">
					No {section} results yet
				</div>
			{/if}
		</div>
	{/if}
</div>
