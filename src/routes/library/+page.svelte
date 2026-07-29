<script lang="ts">
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { practiceTests, practiceSets, courses, resources } from '$lib/data/content';
	import type { Section } from '$lib/types';
	import { isTestAccessible, isCourseAccessible } from '$lib/userState.svelte';


	type Tab = 'tests' | 'practice' | 'courses' | 'resources';
	type TestView = 'byTest' | 'bySection';
	type SectionFilter = Section | 'All';

	let activeTab     = $state<Tab>('tests');
	let testView      = $state<TestView>('byTest');
	let sectionFilter = $state<SectionFilter>('All');
	let accessFilter  = $state<'all' | 'free' | 'locked'>('all');

	const tabs: { id: Tab; label: string; count: number }[] = [
		{ id: 'tests',     label: 'Practice Tests',    count: practiceTests.length },
		{ id: 'practice',  label: 'Practice Activities', count: practiceSets.length },
		{ id: 'courses',   label: 'Skill Courses',      count: courses.length },
		{ id: 'resources', label: 'Resources',          count: resources.length }
	];

	const sections: SectionFilter[] = ['All', 'Reading', 'Listening', 'Speaking', 'Writing'];
	const sectionList: ('Reading' | 'Listening' | 'Speaking' | 'Writing')[] = ['Reading', 'Listening', 'Speaking', 'Writing'];

	// Improvement #6: unified section color map used consistently across all tabs
	const sectionColors: Record<string, string> = {
		Reading:   'bg-blue-100 text-blue-700',
		Listening: 'bg-purple-100 text-purple-700',
		Speaking:  'bg-orange-100 text-orange-700',
		Writing:   'bg-pink-100 text-pink-700',
		General:   'bg-brand-green-light text-brand-green'
	};

	const sectionDotColors: Record<string, string> = {
		Reading:   'bg-blue-400',
		Listening: 'bg-purple-400',
		Speaking:  'bg-orange-400',
		Writing:   'bg-pink-400',
		General:   'bg-brand-green'
	};

	const sectionLeftBorder: Record<string, string> = {
		Reading:   'bg-blue-400',
		Listening: 'bg-purple-400',
		Speaking:  'bg-orange-400',
		Writing:   'bg-pink-400',
		General:   'bg-brand-green'
	};

	const sectionIconBg: Record<string, string> = {
		Reading:   'bg-blue-50 text-blue-500',
		Listening: 'bg-purple-50 text-purple-500',
		Speaking:  'bg-orange-50 text-orange-500',
		Writing:   'bg-pink-50 text-pink-500',
		General:   'bg-brand-green-light text-brand-green'
	};

	const sectionHeaderBg: Record<string, string> = {
		Reading:   'bg-blue-50',
		Listening: 'bg-purple-50',
		Speaking:  'bg-orange-50',
		Writing:   'bg-pink-50',
		General:   'bg-brand-green-light'
	};

	const sectionHeaderText: Record<string, string> = {
		Reading:   'text-blue-700',
		Listening: 'text-purple-700',
		Speaking:  'text-orange-700',
		Writing:   'text-pink-700',
		General:   'text-brand-green'
	};

	const sectionHoverBg: Record<string, string> = {
		Reading:   'hover:bg-blue-50',
		Listening: 'hover:bg-purple-50',
		Speaking:  'hover:bg-orange-50',
		Writing:   'hover:bg-pink-50',
		General:   'hover:bg-brand-green-light'
	};

	// Improvement #4: compute how many sections a test has completed
	function getCompletedSections(test: typeof practiceTests[0]): number {
		if (!test.sectionScores) return 0;
		return sectionList.filter(s => {
			const score = test.sectionScores?.[s];
			return score !== null && score !== undefined;
		}).length;
	}

	const filteredTests = $derived(practiceTests.filter((t) => {
		const accessible = isTestAccessible(t.testNumber);
		if (accessFilter === 'free')   return accessible;
		if (accessFilter === 'locked') return !accessible;
		return true;
	}));

	const filteredPractice = $derived(practiceSets.filter((s) =>
		(sectionFilter === 'All' || s.section === sectionFilter) &&
		(accessFilter === 'all' || s.access === accessFilter)
	));

	const filteredCourses = $derived(courses.filter((c) => {
		if (sectionFilter !== 'All' && c.section !== sectionFilter && c.section !== 'General') return false;
		if (accessFilter === 'free')   return isCourseAccessible(c.id);
		if (accessFilter === 'locked') return !isCourseAccessible(c.id);
		return true;
	}));

	// Improvement #8: section filter now works for resources too
	const filteredResources = $derived(resources.filter((r) =>
		sectionFilter === 'All' || r.section === sectionFilter || r.section === 'General'
	));

	const scoreColor = (v: number) => (v >= 5 ? '#00b189' : v >= 3.5 ? '#f0a030' : '#ff5859');

	function resetFilters() {
		sectionFilter = 'All';
		accessFilter = 'all';
	}
</script>

<svelte:head>
	<title>Content Library – TST Prep</title>
</svelte:head>

<div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7 bg-gray-50 min-h-screen">

	<!-- Header — Move 4: larger title -->
	<div class="mb-4 sm:mb-6">
		<h1 class="text-2xl sm:text-3xl font-black text-gray-900">Content Library</h1>
		<p class="text-gray-500 text-sm mt-1">All TOEFL preparation materials in one place</p>
	</div>

	<!-- Tab bar: 2×2 grid on mobile, single row on desktop -->
	<div class="bg-white border border-gray-200 shadow-sm rounded-[5px] p-1 grid grid-cols-2 min-[710px]:flex gap-1 mb-4 sm:mb-5">
		{#each tabs as tab}
			<button
				class="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-[5px] text-xs sm:text-sm font-semibold transition-all duration-150
					{activeTab === tab.id ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				onclick={() => { activeTab = tab.id; sectionFilter = 'All'; accessFilter = 'all'; }}
			>
				{tab.label}
				<span class="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-bold
					{activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'}">
					{tab.count}
				</span>
			</button>
		{/each}
	</div>

	<!-- Filter bar: section/view row + access filter (inline on desktop, separate row on mobile) -->
	<div class="bg-gray-50 border border-gray-200 rounded-[5px] px-3 py-2.5 mb-4 sm:mb-5">
		<!-- Main row: section/view filters + access filter pushed right on desktop -->
		<div class="flex items-center gap-2 flex-wrap">

			<!-- Section filter: practice, courses, resources -->
			{#if activeTab === 'practice' || activeTab === 'courses' || activeTab === 'resources'}
				<div class="flex gap-1 overflow-x-auto scrollbar-hide flex-nowrap">
					{#each sections as sec}
						<button
							class="px-2 py-1 rounded-[5px] text-[11px] font-semibold transition-all flex items-center gap-1
								{sectionFilter === sec
									? 'bg-brand-green text-white'
									: 'bg-white text-gray-600 hover:text-gray-800 hover:bg-white border border-gray-200'}"
							onclick={() => (sectionFilter = sec)}
						>
							{#if sec !== 'All'}
								<span class="w-1.5 h-1.5 rounded-full flex-shrink-0 {sectionDotColors[sec]}"></span>
							{/if}
							{sec}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Tests: byTest / bySection toggle -->
			{#if activeTab === 'tests'}
				<div class="flex bg-white border border-gray-200 rounded-[5px] overflow-hidden">
					<button
						class="px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-all
							{testView === 'bySection' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
						onclick={() => (testView = 'bySection')}
					>By Section</button>
					<button
						class="px-2.5 py-1 rounded-[5px] text-[11px] font-semibold transition-all
							{testView === 'byTest' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}"
						onclick={() => (testView = 'byTest')}
					>By Test</button>
				</div>
			{/if}

			<!-- Access filter: desktop — same row, pushed right -->
			{#if activeTab !== 'resources'}
				<div class="hidden sm:flex gap-1 ml-auto">
					{#each [['all', 'All'], ['free', 'Free'], ['locked', 'Premium']] as [val, lbl]}
						<button
							class="px-2 py-1 rounded-[5px] text-[11px] font-semibold transition-all
								{accessFilter === val
									? 'bg-gray-800 text-white'
									: 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200'}"
							onclick={() => (accessFilter = val as 'all' | 'free' | 'locked')}
						>{lbl}</button>
					{/each}
				</div>
			{/if}

		</div>

		<!-- Access filter: mobile — separate row with divider -->
		{#if activeTab !== 'resources'}
			<div class="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200 sm:hidden">
				<span class="text-[10px] font-semibold text-gray-500 mr-1">Access:</span>
				{#each [['all', 'All'], ['free', 'Free'], ['locked', 'Premium']] as [val, lbl]}
					<button
						class="px-2 py-1 rounded-[5px] text-[11px] font-semibold transition-all
							{accessFilter === val
								? 'bg-gray-800 text-white'
								: 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200'}"
						onclick={() => (accessFilter = val as 'all' | 'free' | 'locked')}
					>{lbl}</button>
				{/each}
			</div>
		{/if}
	</div>


	<!-- ── PRACTICE TESTS: BY TEST NUMBER ──────────────────────────── -->
	{#if activeTab === 'tests' && testView === 'byTest'}

		{#if filteredTests.length === 0}
			<!-- Improvement #9: empty state -->
			<div class="text-center py-16">
				<p class="text-gray-600 text-sm font-medium mb-3">No tests match your current filters.</p>
				<button onclick={resetFilters} class="text-xs font-semibold px-4 py-2 rounded-[5px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
					Clear filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1
				group-data-[sidebar=open]/layout:min-[1040px]:grid-cols-2
				group-data-[sidebar=open]/layout:min-[1790px]:grid-cols-4
				group-data-[sidebar=collapsed]/layout:min-[790px]:grid-cols-2
				group-data-[sidebar=collapsed]/layout:min-[1610px]:grid-cols-4
				gap-3">
				{#each filteredTests as test}
					{@const locked = !isTestAccessible(test.testNumber)}
					{@const completedCount = getCompletedSections(test)}
					{@const sScoreVals = (Object.values(test.sectionScores ?? {}).filter(s => s !== null) as number[])}
					{@const avgScore = sScoreVals.length > 0 ? sScoreVals.reduce((a, b) => a + b, 0) / sScoreVals.length : null}
					<div class="bg-white rounded-[5px] border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col {locked ? 'opacity-70' : ''}">

						<!--
							Status-tinted header. Uses emerald / amber / gray deliberately —
							NOT the section colors (blue/purple/orange/pink) which live only
							in the section-dot rows below. Zero visual conflict.
						-->
						<div class="px-4 py-3 rounded-t-[5px] border-b border-black/5 flex items-center justify-between
							{locked ? 'bg-gray-100' : completedCount === sectionList.length ? 'bg-emerald-50' : completedCount > 0 ? 'bg-amber-50' : 'bg-white'}">
							<h3 class="font-black text-base
								{locked ? 'text-gray-400' : completedCount === sectionList.length ? 'text-emerald-700' : 'text-brand-green'}">
								Test #{test.testNumber}
							</h3>
							{#if locked}
								<span class="text-[10px] bg-gray-200 text-gray-500 font-bold px-2 py-0.5 rounded-full">Locked</span>
							{:else if completedCount === sectionList.length}
								<span class="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Complete</span>
							{:else if completedCount > 0}
								<span class="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{completedCount}/{sectionList.length} done</span>
							{:else}
								<span class="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">Not started</span>
							{/if}
						</div>


						<!-- Section rows — 3-column: name | status | button -->
						<div class="px-4 flex flex-col">
							{#each sectionList as sec}
								{@const sScore = test.sectionScores?.[sec]}
								<div class="flex items-center gap-2 py-1.5 border-t border-gray-50 first:border-t-0">
									<!-- Col 1: section name -->
									<div class="flex items-center gap-2 flex-shrink-0 w-24">
										<span class="w-2 h-2 rounded-full flex-shrink-0 {sectionDotColors[sec]}"></span>
										<span class="text-xs text-gray-600 font-medium">{sec}</span>
									</div>
									<!-- Col 2: status text -->
									<div class="flex-1 min-w-0">
										{#if locked}
											<span class="text-[11px] text-gray-500">Locked</span>
										{:else if sScore !== null && sScore !== undefined}
											<span class="text-[11px] text-gray-500">Attempts: <span class="font-semibold text-gray-700 inline-block w-6 tabular-nums">{test.attempts}</span><span class="text-gray-300 mx-0.5">|</span> Avg: <span class="font-bold" style="color: {scoreColor(sScore)}">{sScore.toFixed(1)}</span></span>
										{:else}
											<span class="text-[11px] text-gray-500">Not attempted</span>
										{/if}
									</div>
									<!-- Col 3: action button -->
									{#if locked}
										<button class="text-[10px] font-semibold w-20 py-1 rounded-[5px] border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-all text-center flex-shrink-0">
											Unlock
										</button>
									{:else if sScore !== null && sScore !== undefined}
										<button class="text-[10px] font-semibold w-20 py-1 rounded-[5px] text-white transition-colors flex items-center justify-center gap-1 flex-shrink-0 hover:opacity-90" style="background-color: #8697b5;">Retake <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
									{:else}
										<button class="text-[10px] font-semibold w-20 py-1 rounded-[5px] bg-brand-green text-white hover:bg-brand-green-dark transition-colors text-center flex-shrink-0">
											Start
										</button>
									{/if}
								</div>
							{/each}
						</div>

					</div>
				{/each}
			</div>
		{/if}


	<!-- ── PRACTICE TESTS: BY SECTION (redesigned) ──────────────────── -->
	{:else if activeTab === 'tests' && testView === 'bySection'}
		<!--
			Improvement #2: replace the unreadable tiny icon grid with compact
			table-style rows — one row per test, scannable at a glance.
		-->
		<div class="grid grid-cols-1
			group-data-[sidebar=open]/layout:min-[1040px]:grid-cols-2
			group-data-[sidebar=open]/layout:min-[1790px]:grid-cols-4
			group-data-[sidebar=collapsed]/layout:min-[790px]:grid-cols-2
			group-data-[sidebar=collapsed]/layout:min-[1610px]:grid-cols-4
			gap-3">
			{#each sectionList as section}
				{@const sectionScoreList = (practiceTests.map(t => t.sectionScores?.[section]).filter(s => s !== null && s !== undefined) as number[])}
				{@const sectionTotalAttempts = practiceTests.filter(t => { const s = t.sectionScores?.[section]; return s !== null && s !== undefined; }).reduce((sum, t) => sum + (t.attempts ?? 0), 0)}
				{@const sectionAvg = sectionScoreList.length > 0 ? sectionScoreList.reduce((a, b) => a + b, 0) / sectionScoreList.length : null}
				<div class="bg-white rounded-[5px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

					<!-- Section header with aggregate attempts + avg -->
					<div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2 {sectionHeaderBg[section]}">
						<h3 class="text-base font-black {sectionHeaderText[section]}">{section} Section</h3>
						<div class="flex items-center gap-2 text-[11px] text-gray-600">
							{#if sectionTotalAttempts > 0}
								<span>Attempts: <span class="font-semibold text-gray-700">{sectionTotalAttempts}</span></span>
								<span class="text-gray-300">|</span>
								<span>Avg: <span class="font-bold" style="color: {scoreColor(sectionAvg!)}">{sectionAvg!.toFixed(1)}</span></span>
							{:else}
								<span class="text-gray-400">Attempts: <span class="font-semibold">n/a</span></span>
								<span class="text-gray-300">|</span>
								<span class="text-gray-400">Avg: <span class="font-semibold">n/a</span></span>
							{/if}
						</div>
					</div>

					<!-- Improvement #2: compact list rows instead of icon grid -->
					<div class="divide-y divide-gray-50">
						{#each practiceTests as test}
							{@const locked = !isTestAccessible(test.testNumber)}
							{@const sScore = test.sectionScores?.[section]}
							<!-- Section-colored hover instead of generic gray -->
							<div class="flex items-center px-4 py-1.5 gap-3 transition-colors {locked ? 'opacity-55' : sectionHoverBg[section]}">
								<span class="text-xs font-bold text-gray-500 w-14 flex-shrink-0">Test #{test.testNumber}</span>
								<div class="flex-1 min-w-0">
									{#if !locked && sScore !== null && sScore !== undefined}
										<span class="text-[11px] text-gray-500">Attempts: <span class="font-semibold text-gray-700 inline-block w-6 tabular-nums">{test.attempts}</span><span class="text-gray-300 mx-0.5">|</span> Avg: <span class="font-bold" style="color: {scoreColor(sScore)}">{sScore.toFixed(1)}</span></span>
									{:else if !locked}
										<span class="text-[11px] text-gray-500">Not attempted</span>
									{:else}
										<span class="text-[11px] text-gray-500">Locked</span>
									{/if}
								</div>
								<!-- Fixed-width buttons so all three states align -->
								{#if locked}
									<button class="text-[10px] font-semibold w-20 py-1 rounded-[5px] border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-all flex-shrink-0 text-center">
										Unlock
									</button>
								{:else if sScore !== null && sScore !== undefined}
									<button class="text-[10px] font-semibold w-20 py-1 rounded-[5px] text-white transition-colors flex-shrink-0 flex items-center justify-center gap-1 hover:opacity-90" style="background-color: #8697b5;">Retake <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
								{:else}
									<button class="text-[10px] font-semibold w-20 py-1 rounded-[5px] bg-brand-green text-white hover:bg-brand-green-dark transition-colors flex-shrink-0 text-center">
										Start
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>


	<!-- ── PRACTICE QUESTIONS ──────────────────────────────────────── -->
	{:else if activeTab === 'practice'}

		{#if filteredPractice.length === 0}
			<!-- Improvement #9: empty state -->
			<div class="text-center py-16">
				<p class="text-gray-600 text-sm font-medium mb-3">No practice sets match your current filters.</p>
				<button onclick={resetFilters} class="text-xs font-semibold px-4 py-2 rounded-[5px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
					Clear filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 min-[1400px]:grid-cols-4 gap-3">
				{#each filteredPractice as set}
					<div class="bg-white rounded-[5px] border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col {set.access === 'locked' ? 'opacity-75' : ''}">
						<!-- Colored header zone — fixed min-height for consistent card header height -->
						<div class="{sectionHeaderBg[set.section]} px-4 py-3.5 flex items-start justify-between gap-2 min-h-[84px]">
							<div class="min-w-0">
								<div class="mb-1.5"><SectionBadge section={set.section} size="sm" /></div>
								<h3 class="font-bold text-sm leading-snug {sectionHeaderText[set.section]} line-clamp-2">{set.title}</h3>
								<p class="text-[11px] mt-0.5 text-gray-500">
									{#if set.setCount}{set.setCount} sets · {set.questionCount} questions/set{:else}{set.questionCount} questions{/if} · {set.difficulty}
								</p>
							</div>
							{#if set.access === 'locked'}
								<span class="text-[10px] bg-white/80 text-gray-500 font-bold px-2 py-0.5 rounded-full flex-shrink-0">Locked</span>
							{/if}
						</div>
						<!-- White content area: flex col so button is always at bottom -->
						<div class="px-4 pt-3 pb-4 flex flex-col flex-1">
							<!-- Progress bar — always visible -->
							<div class="mb-3">
								<div class="flex justify-between text-[11px] text-gray-600 mb-1">
									<span>Progress</span>
									{#if set.completionPercent > 0}
										<span class="font-semibold text-brand-green">{set.completionPercent}%</span>
									{:else}
										<span>Not started</span>
									{/if}
								</div>
								{#if set.completionPercent > 0}
									<ProgressBar percent={set.completionPercent} />
								{:else}
									<div class="h-1.5 rounded-full bg-gray-200"></div>
								{/if}
							</div>
							<div class="flex-1"></div>
							<!-- Button pinned to bottom -->
							{#if set.access === 'locked'}
								<button class="text-xs font-semibold px-4 py-1.5 rounded-[5px] border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors">Unlock</button>
							{:else if set.completionPercent > 0}
								<button class="text-xs font-semibold px-4 py-1.5 rounded-[5px] bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Continue</button>
							{:else}
								<button class="text-xs font-semibold px-4 py-1.5 rounded-[5px] bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Start Practice</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}


	<!-- ── SKILL COURSES ────────────────────────────────────────────── -->
	{:else if activeTab === 'courses'}

		{#if filteredCourses.length === 0}
			<!-- Improvement #9: empty state -->
			<div class="text-center py-16">
				<p class="text-gray-600 text-sm font-medium mb-3">No courses match your current filters.</p>
				<button onclick={resetFilters} class="text-xs font-semibold px-4 py-2 rounded-[5px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
					Clear filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 min-[1400px]:grid-cols-4 gap-3">
				{#each filteredCourses as course}
					{@const locked = !isCourseAccessible(course.id)}
					<!-- Improvement #5: cleaner lock opacity at card level -->
					<div class="bg-white rounded-[5px] border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col group {locked ? 'opacity-80' : ''}">
						<div class="relative h-36 sm:h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
							<img src={course.thumbnail} alt={course.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 {locked ? 'brightness-50' : ''}" />
							<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
							{#if locked}
								<div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
									<div class="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
										<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</div>
									<span class="text-white text-[11px] font-bold bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">Locked</span>
								</div>
							{/if}
						</div>
						<!-- Content area: flex col so button is always at bottom -->
						<div class="p-3 sm:p-3.5 flex flex-col flex-1">
							<div class="mb-1.5"><SectionBadge section={course.section} size="sm" /></div>
							<h3 class="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{course.title}</h3>
							<div class="flex items-center gap-2 text-[11px] text-gray-600 mb-2">
								<span>{course.lessonCount} lessons</span>
							</div>
							<!-- Progress bar — always visible -->
							<div class="mb-2">
								{#if course.progressPercent > 0}
									<ProgressBar percent={course.progressPercent} />
								{:else}
									<div class="flex justify-between text-[11px] text-gray-600 mb-1">
										<span>Progress</span>
										<span>Not started</span>
									</div>
									<div class="h-1.5 rounded-full bg-gray-200"></div>
								{/if}
							</div>
							<div class="flex-1"></div>
							<!-- Button pinned to bottom -->
							{#if locked}
								<button class="w-full text-xs font-semibold py-2 rounded-[5px] border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors">Unlock Course</button>
							{:else if course.progressPercent > 0}
								<button class="w-full text-xs font-semibold py-2 rounded-[5px] bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Continue</button>
							{:else}
								<button class="w-full text-xs font-semibold py-2 rounded-[5px] bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Start Course</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-4 sm:mt-5 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-[5px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
				<div>
					<p class="font-black">Unlock All Score Builder Courses</p>
					<p class="text-sm text-gray-400 mt-0.5">Full access to all 6 expert-designed courses + 13 practice tests</p>
				</div>
				<button class="bg-brand-pink text-white text-sm font-bold px-5 py-2.5 rounded-[5px] hover:bg-brand-pink-dark transition-colors flex-shrink-0 w-full sm:w-auto">
					Upgrade to Premium
				</button>
			</div>
		{/if}


	<!-- ── RESOURCES ──────────────────────────────────────────────── -->
	{:else if activeTab === 'resources'}

		{#if filteredResources.length === 0}
			<!-- Improvement #9: empty state -->
			<div class="text-center py-16">
				<p class="text-gray-600 text-sm font-medium mb-3">No resources match your current filters.</p>
				<button onclick={resetFilters} class="text-xs font-semibold px-4 py-2 rounded-[5px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
					Clear filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 min-[1600px]:grid-cols-4 gap-3">
				{#each filteredResources as res}
					<div class="bg-white rounded-[5px] border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-row group">
						<!-- Cover image — portrait, left side -->
						{#if res.coverImage}
							<div class="relative aspect-[1/1.3] flex-shrink-0 min-w-[128px] bg-gray-100 overflow-hidden">
								<img src={res.coverImage} alt={res.title} class="absolute inset-0 w-full h-full object-cover object-top" />
							</div>
						{/if}
						<!-- Content — right side -->
						<div class="flex flex-col flex-1 min-w-0">
							<!-- Colored header zone -->
							<div class="{sectionHeaderBg[res.section] ?? 'bg-gray-50'} px-3 py-3">
								<div class="mb-1.5"><SectionBadge section={res.section} size="sm" /></div>
								<h3 class="font-bold text-sm leading-snug {sectionHeaderText[res.section] ?? 'text-gray-800'} line-clamp-2">{res.title}</h3>
							</div>
							<!-- White content area -->
							<div class="px-3 pt-2.5 pb-3 flex items-start gap-2 flex-1">
								<p class="text-[11px] text-gray-600 leading-relaxed line-clamp-3 flex-1">{res.description}</p>
								<div class="flex-shrink-0 self-end flex flex-col items-center gap-1">
									<div class="relative">
										<span class="hidden lg:group-hover:block absolute inset-0 rounded-[5px] bg-brand-green/40 animate-ping"></span>
										<span class="lg:hidden absolute inset-0 rounded-[5px] bg-brand-green/40" style="animation: mobilePingAnim 1s cubic-bezier(0, 0, 0.2, 1) infinite"></span>
										<a href={res.downloadUrl} class="relative w-7 h-7 rounded-[5px] border border-brand-green transition-colors flex items-center justify-center bg-brand-green/[0.12] text-brand-green max-lg:bg-brand-green max-lg:text-white lg:group-hover:bg-brand-green lg:group-hover:text-white">
											<i class="bi bi-download text-sm"></i>
										</a>
									</div>
									<span class="text-[10px] text-gray-400 whitespace-nowrap">{res.fileSize}</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

	{/if}
</div>

