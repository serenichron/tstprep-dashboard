<script lang="ts">
	import { goto } from '$app/navigation';
	import { page as route } from '$app/state';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import SectionCard from '$lib/components/SectionCard.svelte';
	import type { QuizMode, QuizType } from '$lib/types';
  	import GaugeCard from '$lib/components/GaugeCard.svelte';
  	import AverageChip from '$lib/components/AverageChip.svelte';
  	import QuizIcon from '$lib/components/QuizIcon.svelte';
    import SubmissionState, { CHART_DATAPOINTS, PAGE_SIZE } from '$lib/state/SubmissionState.svelte';
	import SectionBar from './SectionBar.svelte';
	import { formatScoreOptional, sectionLabel, whitelist } from '$lib/utils';
  	import QuizRows from './QuizRows.svelte';

    const { state: submissionState }: { state: SubmissionState } = $props();

	/* ─── State ─── */
	/* Section comes from the URL path (/submission-history/[section]). Filters live in
	   query params. Changing section = navigate to a new path; the rest of the state
	   stays in this component instance. */
	const SECTIONS: QuizType[] = ['reading', 'listening', 'writing', 'speaking'];
	const section = $derived(
		whitelist<QuizType, string | undefined>(route.params.section, SECTIONS, 'reading')
	);

	const params = new URLSearchParams(location.search);
	let mode = $state(whitelist<QuizMode, string | null>(params.get('mode'), ['practice', 'test']));
	let test = $state(whitelist<number, number>(parseInt(params.get('test') ?? ''), (t) => t > 0 && t <= 15));

	function selectSection(newSection: QuizType) {
		if (newSection === section) return;
		test = undefined;
		page = 1;
		const qs = location.search; // keep remaining filters when switching section
		goto(resolve(`/submission-history/${newSection}`) + qs, { keepFocus: true, noScroll: true });
	}

	const { data: newStats } = $derived(submissionState.fetchStats(section, test));
	const modeStats = $derived(newStats?.[mode ?? 'all']);
	const maxPage = $derived(Math.ceil((modeStats?.count ?? 0) / PAGE_SIZE));

	let page = $state(whitelist<number, number>(parseInt(params.get('page') ?? ''), (p) => (p > 0) && (!newStats || p <= maxPage), 1));

	/* Sort. Default is date-desc (newest first) which gets stripped from the URL.
	   URL shape: ?sort=score-desc, ?sort=score-asc, ?sort=date-asc. */
	let sortBy = $state<'date' | 'score'>(
		whitelist<'date' | 'score', string | null>(params.get('sort')?.split('-')[0] ?? null, ['date', 'score'], 'date')
	);
	let sortDir = $state<'asc' | 'desc'>(
		whitelist<'asc' | 'desc', string | null>(params.get('sort')?.split('-')[1] ?? null, ['asc', 'desc'], 'desc')
	);

	function toggleSort(by: 'date' | 'score') {
		if (sortBy === by) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = by;
			sortDir = 'desc';
		}
		page = 1;
	}

	const { data: firstPageSubmissions } = $derived(submissionState.fetchSubmissions({
		type: section,
		mode: mode,
		test: test,
		page: page,
		sortBy,
		sortDir,
	}));
	
	const needsAI = $derived(section === 'writing' || section === 'speaking');

	/* Sync state → URL. Default values are stripped. Manual entry of default values
	   (e.g. ?mode=all) is normalized to a clean URL on first run. */
	$effect(() => {
		const params = new URLSearchParams(location.search);
		// section lives in the URL path now, not the query string
		params.delete('type');
		if (mode === undefined) params.delete('mode'); else params.set('mode', mode);
		if (test === undefined) params.delete('test'); else params.set('test', test.toString());
		if (page === 1) params.delete('page'); else params.set('page', String(page));
		if (sortBy === 'date' && sortDir === 'desc') params.delete('sort'); else params.set('sort', `${sortBy}-${sortDir}`);

		const nextSearch = params.toString();
		const currentSearch = location.search.startsWith('?') ? location.search.slice(1) : location.search;
		if (nextSearch === currentSearch) return;

		const target = location.pathname + (nextSearch ? '?' + nextSearch : '');
		goto(target, { replaceState: true, keepFocus: true, noScroll: true });
	});

	/* Scroll list back into view when paginating */
	let listEl = $state<HTMLDivElement | undefined>();
	$effect(() => {
		page;
		listEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});

	/* Mobile floating section indicator — appears only when the original section bar leaves view */
	let sectionBarEl = $state<HTMLDivElement | undefined>();
	let sectionBarVisible = $state(true);
	$effect(() => {
		if (!sectionBarEl) return;
		const observer = new IntersectionObserver(
			([entry]) => { sectionBarVisible = entry.isIntersecting; },
			{ rootMargin: '-56px 0px 0px 0px' }
		);
		observer.observe(sectionBarEl);
		return () => observer.disconnect();
	});

</script>

<svelte:head>
	<title>Submission History – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div
	class="font-dmsans relative px-4 pb-5 md:px-8 md:pb-7 text-gray-800
		min-h-[calc(100vh-3.5rem)]
		bg-gray-50
		bg-[radial-gradient(55%_22%_at_100%_0%,rgba(0,177,137,0.11),transparent_70%),radial-gradient(50%_18%_at_0%_18%,rgba(0,177,137,0.07),transparent_70%),radial-gradient(60%_20%_at_100%_38%,rgba(0,177,137,0.08),transparent_70%),radial-gradient(55%_18%_at_0%_58%,rgba(0,177,137,0.06),transparent_70%),radial-gradient(50%_20%_at_100%_78%,rgba(0,177,137,0.07),transparent_70%),radial-gradient(60%_18%_at_0%_96%,rgba(0,177,137,0.06),transparent_70%)]"
>
	<!-- ─── Page header (sticky only on md+, mobile lets it scroll away) ─── -->
	<div class="relative md:sticky md:top-14 z-40 bg-gray-50/75 backdrop-blur-md pt-2.5 px-4 -mx-4 mb-3.5 border-b border-gray-200/70 md:pt-3.5 md:px-8 md:-mx-8">
		<!-- Title row -->
		<div class="flex items-center justify-between gap-2 mb-2 md:mb-2.5">
			<div class="min-w-0">
				<h1 class="text-base md:text-lg font-extrabold tracking-[-0.5px] leading-tight"><span class="text-brand-green">Submission</span> History</h1>
				<p class="hidden md:block text-[11px] text-gray-400 mt-px">Track your TOEFL 2026 scores across all sections</p>
			</div>
			<!-- Mobile-only inline overall chip -->
			<AverageChip score={submissionState.stats.all.average} />
		</div>

		<!-- Score grid — 2-col on mobile & tablet (section cards only), 5-col on xl+ (with gauge) -->
		<div class="grid grid-cols-2 gap-2 xl:grid-cols-[0.72fr_repeat(4,1fr)] items-stretch pb-1">
			<!-- Overall gauge card (only when there's room for 5-col) -->
			<GaugeCard best={formatScoreOptional(submissionState.stats.all.best)} average={formatScoreOptional(submissionState.stats.all.average)} />

			<!-- Section cards -->
			{#each SECTIONS as sc}
				{@const info = submissionState.getTrendInfo(sc)}
				{@const latestAvg = info.latestCount > 0 ? formatScoreOptional(info.latestSum / info.latestCount) : null}
				{@const baselineAvg = info.baseline.count > 0 ? formatScoreOptional(info.baseline.sum / info.baseline.count) : null}
				{@const trendDiff = latestAvg !== null && baselineAvg !== null ? +(latestAvg - baselineAvg).toFixed(1) : undefined}
				<SectionCard
					selected={section}
					value={sc}
					stats={submissionState.stats[sc]}
					onSelect={selectSection}
					{trendDiff}
				/>
			{/each}
		</div>

		<!-- Section bar -->
		{#if modeStats && firstPageSubmissions}
			{@const trendInfo = submissionState.getTrendInfo(section, mode, test)}
			<SectionBar
				section={section}
				stats={modeStats}
				trendSubmissions={
					firstPageSubmissions
						.submissions
						.filter(s => s.ai !== false)
						.concat(firstPageSubmissions.extraSubmissions ?? [])
						.slice(0, trendInfo.latestCount)
						.reverse()
				}
				trendBaseline={trendInfo.baseline}
				{sortBy}
				{sortDir}
				onToggleSort={toggleSort}
				bind:root={sectionBarEl}
				bind:mode={
					() => mode,
					(m) => {
						mode = m;
						page = 1;
					}
				}
				bind:test={
					() => test,
					(t) => {
						test = t;
						page = 1;
					}
				}
			/>
		{/if}
	</div>

	<!-- Mobile-only floating section indicator — fades in once the original section bar leaves view -->
	{#if !sectionBarVisible && modeStats}
		<div
			class="md:hidden fixed top-14 left-0 right-0 z-30 px-4 py-2 bg-gray-50/85 backdrop-blur-md border-b border-gray-200/70"
			transition:fade={{ duration: 180 }}
		>
			<div class="flex items-center gap-2">
				<div class="w-[22px] h-[22px] rounded-md bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0">
					<QuizIcon variant={section} width="13" height="13" />
				</div>
				<span class="text-[13px] font-bold text-gray-800">{sectionLabel(section)}</span>
				<span class="text-gray-300 text-xs">·</span>
				<span class="text-[11px] text-gray-500">{modeStats.count} submission{modeStats.count !== 1 ? 's' : ''}</span>
				<!-- <span class="text-[11px] text-gray-500">{isComplete ? filteredCtByDate.length : newStats.count} {isComplete ? 'attempt' : 'submission'}{(isComplete ? filteredCtByDate.length : newStats.count) !== 1 ? 's' : ''}</span> -->
			</div>
		</div>
	{/if}

	<!-- Detail Panel -->
	<div>
		<!-- ═══ SECTION VIEW ═══ -->
		{#if modeStats}
			{#if modeStats.count === 0}
				<div class="py-11 px-5 text-center">
					<div class="text-3xl mb-1.5 opacity-40">📝</div>
					<div class="text-[13px] font-semibold text-gray-400">No {section} submissions{test ? ` for Test #${test}` : ''}</div>
					<div class="text-[11px] text-gray-300 mt-0.5">Complete a practice test to see results here</div>
				</div>
			{:else}
				<div bind:this={listEl} class="flex flex-col gap-2 scroll-mt-20 md:scroll-mt-72">
					<QuizRows
						{submissionState}
						type={section}
						mode={mode}
						test={test}
						page={page}
						{sortBy}
						{sortDir}
					/>
				</div>
				{#if maxPage > 1}
					<div class="flex items-center justify-center gap-3 py-3 mt-3">
						<button disabled={page === 1} onclick={() => page--}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							← Prev
						</button>
						<span class="text-[11px] text-gray-400">Page {page} of {maxPage} · {modeStats.count} submissions</span>
						<button disabled={page === maxPage} onclick={() => page++}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							Next →
						</button>
					</div>
				{/if}
			{/if}
		{/if}
		<!-- ═══ COMPLETE TESTS VIEW ═══ -->
		<!-- {:else}
			{#if filteredCtByDate.length === 0}
				<div class="py-11 px-5 text-center">
					<div class="text-3xl mb-1.5 opacity-40">🗂️</div>
					<div class="text-[13px] font-semibold text-gray-400">No complete test attempts{testFilter !== 'all' ? ` for Test #${testFilter}` : ''}</div>
					<div class="text-[11px] text-gray-300 mt-0.5">Take a full 4-section practice test to see results here</div>
				</div>
			{:else}
				<div bind:this={listEl} class="flex flex-col gap-2 scroll-mt-20 md:scroll-mt-72">
					{#each pagedCtRows as t (t.id)}
						<TestRow row={t} sections={SEC4} />
					{/each}
				</div>
				{#if totalCtPages > 1}
					<div class="flex items-center justify-center gap-3 py-3 mt-3">
						<button disabled={datePage === 1} onclick={() => datePage--}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							← Prev
						</button>
						<span class="text-[11px] text-gray-400">Page {datePage} of {totalCtPages} · {filteredCtByDate.length} attempts</span>
						<button disabled={datePage === totalCtPages} onclick={() => datePage++}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							Next →
						</button>
					</div>
				{/if}
			{/if}
		{/if} -->
	</div>

	<div class="text-center py-3.5 text-[10px] text-gray-300">
		Scores follow the TOEFL 2026 scale (1–6){#if needsAI} · Non-AI submissions excluded from averages{/if}
		<!-- Scores follow the TOEFL 2026 scale (1–6){#if needsAI && !isComplete} · Non-AI submissions excluded from averages{/if}{#if isComplete} · Composite = average of all 4 section scores{/if} -->
	</div>
</div>
