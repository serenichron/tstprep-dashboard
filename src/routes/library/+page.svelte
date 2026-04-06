<script lang="ts">
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { practiceTests, practiceSets, courses, resources } from '$lib/data/content';
	import type { Section } from '$lib/types';

	type Tab = 'tests' | 'practice' | 'courses' | 'resources';
	type TestView = 'byTest' | 'bySection';
	type SectionFilter = Section | 'All';

	let activeTab     = $state<Tab>('tests');
	let testView      = $state<TestView>('byTest');
	let sectionFilter = $state<SectionFilter>('All');
	let accessFilter  = $state<'all' | 'free' | 'locked'>('all');

	const tabs: { id: Tab; label: string; count: number }[] = [
		{ id: 'tests',     label: 'Practice Tests',    count: practiceTests.length },
		{ id: 'practice',  label: 'Practice Questions', count: practiceSets.length },
		{ id: 'courses',   label: 'Skill Courses',      count: courses.length },
		{ id: 'resources', label: 'Resources',          count: resources.length }
	];

	const sections: SectionFilter[] = ['All', 'Reading', 'Listening', 'Speaking', 'Writing'];
	const sectionList: ('Reading' | 'Listening' | 'Speaking' | 'Writing')[] = ['Reading', 'Listening', 'Speaking', 'Writing'];

	const filteredTests     = $derived(practiceTests.filter((t) => accessFilter === 'all' || t.access === accessFilter));
	const filteredPractice  = $derived(practiceSets.filter((s) => (sectionFilter === 'All' || s.section === sectionFilter) && (accessFilter === 'all' || s.access === accessFilter)));
	const filteredCourses   = $derived(courses.filter((c) => (sectionFilter === 'All' || c.section === sectionFilter) && (accessFilter === 'all' || c.access === accessFilter)));
	const filteredResources = $derived(resources.filter((r) => sectionFilter === 'All' || r.section === sectionFilter));

	const sectionColors: Record<string, string> = {
		Reading:   'bg-blue-100 text-blue-700',
		Listening: 'bg-purple-100 text-purple-700',
		Speaking:  'bg-orange-100 text-orange-700',
		Writing:   'bg-pink-100 text-pink-700',
		General:   'bg-brand-green-light text-brand-green'
	};
</script>

<svelte:head>
	<title>Content Library – TST Prep</title>
</svelte:head>

<div class="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
	<!-- Header -->
	<div class="mb-4 sm:mb-5">
		<h1 class="text-xl sm:text-2xl font-black text-gray-900">Content Library</h1>
		<p class="text-gray-400 text-sm mt-0.5">All TOEFL preparation materials in one place</p>
	</div>

	<!-- Tab bar — scrollable on mobile -->
	<div class="flex overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-1 mb-4 sm:mb-5 scrollbar-hide">
		<div class="flex bg-gray-100 rounded-xl p-1 gap-1 min-w-max sm:min-w-0 sm:flex-wrap">
			{#each tabs as tab}
				<button
					class="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap
						{activeTab === tab.id ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
					onclick={() => { activeTab = tab.id; sectionFilter = 'All'; accessFilter = 'all'; }}
				>
					{tab.label}
					<span class="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-bold
						{activeTab === tab.id ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-500'}">
						{tab.count}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Toolbar -->
	<div class="flex items-center gap-2 mb-4 sm:mb-5 flex-wrap">
		{#if activeTab === 'practice' || activeTab === 'courses'}
			<div class="flex gap-1 flex-wrap">
				{#each sections as sec}
					<button
						class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
							{sectionFilter === sec ? 'bg-brand-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}"
						onclick={() => (sectionFilter = sec)}
					>{sec}</button>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'tests'}
			<div class="flex bg-gray-100 rounded-lg p-0.5">
				<button
					class="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all
						{testView === 'bySection' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500'}"
					onclick={() => (testView = 'bySection')}
				>Test Section</button>
				<button
					class="px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all
						{testView === 'byTest' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500'}"
					onclick={() => (testView = 'byTest')}
				>Test Number</button>
			</div>
		{/if}

		{#if activeTab !== 'resources'}
			<div class="flex gap-1 ml-auto">
				{#each [['all', 'All'], ['free', 'Free'], ['locked', 'Premium']] as [val, lbl]}
					<button
						class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
							{accessFilter === val ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}"
						onclick={() => (accessFilter = val as 'all' | 'free' | 'locked')}
					>{lbl}</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- ── PRACTICE TESTS: BY TEST NUMBER ────────────────────────── -->
	{#if activeTab === 'tests' && testView === 'byTest'}
		<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
			{#each filteredTests as test}
				<div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col
					{test.access === 'locked' ? 'opacity-85' : ''}">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-black text-brand-green text-base">Test #{test.testNumber}</h3>
						{#if test.access === 'locked'}
							<span class="text-[10px] bg-gray-100 text-gray-400 font-bold px-2 py-0.5 rounded-full">🔒 Premium</span>
						{:else if test.attempts > 0}
							<span class="text-[10px] bg-brand-green-light text-brand-green font-bold px-2 py-0.5 rounded-full">✓ Done</span>
						{:else}
							<span class="text-[10px] bg-blue-50 text-blue-500 font-bold px-2 py-0.5 rounded-full">Free</span>
						{/if}
					</div>
					<StarRating rating={test.rating} count={test.ratingCount} />
					<div class="mt-3 flex flex-col gap-1.5">
						{#each sectionList as sec}
							{@const sScore = test.sectionScores?.[sec]}
							<div class="flex items-center justify-between py-1.5 border-t border-gray-50 first:border-t-0">
								<div class="flex items-center gap-2">
									<SectionBadge section={sec} size="sm" />
									<span class="text-xs text-gray-600 font-medium">{sec} #{test.testNumber}</span>
								</div>
								<div class="flex items-center gap-1.5">
									{#if test.access === 'locked'}
										<button class="text-[10px] font-semibold px-2 py-1 rounded-lg border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-all whitespace-nowrap">
											🔒 Unlock
										</button>
									{:else if sScore !== null && sScore !== undefined}
										<span class="text-xs font-black text-brand-green">{sScore.toFixed(1)}</span>
										<button class="text-[10px] font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">↺</button>
									{:else}
										<button class="text-[10px] font-semibold px-2 py-1 rounded-lg bg-brand-green text-white hover:bg-brand-green-dark transition-colors whitespace-nowrap">
											Start →
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
					{#if test.lastAttempt}
						<p class="text-[10px] text-gray-300 mt-2">Last attempt: {test.lastAttempt}</p>
					{/if}
				</div>
			{/each}
		</div>

	<!-- ── PRACTICE TESTS: BY SECTION ────────────────────────────── -->
	{:else if activeTab === 'tests' && testView === 'bySection'}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
			{#each sectionList as section}
				<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card">
					<div class="px-4 sm:px-6 py-4 sm:py-5 text-center border-b border-gray-50">
						<h3 class="text-lg sm:text-xl font-black text-brand-green">{section} section</h3>
					</div>
					<div class="p-3 sm:p-4 grid grid-cols-4 sm:grid-cols-5 gap-2">
						{#each practiceTests as test}
							<div class="flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-xl
								{test.access === 'locked' ? 'opacity-50' : 'hover:bg-brand-green-light cursor-pointer'} transition-colors">
								<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2
									{test.access === 'locked' ? 'border-dashed border-gray-300' : 'border-dashed border-brand-green'}
									flex items-center justify-center">
									<SectionBadge section={section} size="sm" />
								</div>
								<span class="text-[10px] sm:text-[11px] font-semibold text-gray-600 leading-none">Test#{test.testNumber}</span>
								{#if test.access === 'locked'}
									<button class="text-[8px] sm:text-[9px] font-bold text-brand-pink border border-brand-pink rounded-md px-1 sm:px-1.5 py-0.5 hover:bg-brand-pink hover:text-white transition-all leading-none">
										Unlock
									</button>
								{:else}
									{@const sScore = test.sectionScores?.[section]}
									{#if sScore !== null && sScore !== undefined}
										<span class="text-[10px] font-black text-brand-green">{sScore.toFixed(1)}</span>
									{:else}
										<span class="text-[9px] text-brand-green font-semibold">Start</span>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

	<!-- ── PRACTICE QUESTIONS ──────────────────────────────────────── -->
	{:else if activeTab === 'practice'}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			{#each filteredPractice as set}
				<div class="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 sm:gap-4 hover:shadow-md transition-shadow
					{set.access === 'locked' ? 'opacity-85' : ''}">
					<SectionBadge section={set.section} size="md" />
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-2 mb-1.5">
							<h3 class="font-bold text-gray-900 text-sm leading-snug">{set.title}</h3>
							{#if set.access === 'locked'}
								<span class="text-gray-300 text-base flex-shrink-0">🔒</span>
							{/if}
						</div>
						<div class="flex items-center gap-2 mb-2 flex-wrap">
							<span class="text-[11px] px-2 py-0.5 rounded-full font-semibold {sectionColors[set.section]}">{set.section}</span>
							<span class="text-[11px] text-gray-400">{set.questionCount} questions · {set.difficulty}</span>
						</div>
						{#if set.completionPercent > 0}
							<div class="mb-2">
								<div class="flex justify-between text-[11px] text-gray-400 mb-1">
									<span>Progress</span>
									<span class="font-semibold text-brand-green">{set.completionPercent}%</span>
								</div>
								<ProgressBar percent={set.completionPercent} />
							</div>
						{/if}
						<StarRating rating={set.rating} count={set.ratingCount} />
						<div class="mt-2.5">
							{#if set.access === 'locked'}
								<button class="text-xs font-semibold px-4 py-1.5 rounded-lg border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-all">🔒 Unlock</button>
							{:else if set.completionPercent > 0}
								<button class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Continue →</button>
							{:else}
								<button class="text-xs font-semibold px-4 py-1.5 rounded-lg bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Start Practice →</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

	<!-- ── COURSES ──────────────────────────────────────────────────── -->
	{:else if activeTab === 'courses'}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredCourses as course}
				<div class="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
					<div class="relative h-28 sm:h-32 bg-gray-100">
						<img src={course.thumbnail} alt={course.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
						<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
						{#if course.tag}
							<span class="absolute top-2.5 left-2.5 bg-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{course.tag}</span>
						{/if}
						{#if course.access === 'locked'}
							<div class="absolute top-2.5 right-2.5 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center">
								<span class="text-white text-xs">🔒</span>
							</div>
						{/if}
						<div class="absolute bottom-2.5 left-2.5">
							<SectionBadge section={course.section} size="sm" />
						</div>
					</div>
					<div class="p-3 sm:p-3.5">
						<h3 class="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{course.title}</h3>
						<div class="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
							<span>📚 {course.lessonCount} lessons</span>
						</div>
						{#if course.progressPercent > 0}
							<div class="mb-2"><ProgressBar percent={course.progressPercent} /></div>
						{/if}
						<StarRating rating={course.rating} count={course.ratingCount} />
						<div class="mt-3">
							{#if course.access === 'locked'}
								<button class="w-full text-xs font-semibold py-2 rounded-lg border border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-all">🔒 Unlock Course</button>
							{:else if course.progressPercent > 0}
								<button class="w-full text-xs font-semibold py-2 rounded-lg bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Continue →</button>
							{:else}
								<button class="w-full text-xs font-semibold py-2 rounded-lg bg-brand-green text-white hover:bg-brand-green-dark transition-colors">Start Course →</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-4 sm:mt-5 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
			<div>
				<p class="font-black">Unlock All Score Builder Courses</p>
				<p class="text-sm text-gray-400 mt-0.5">Full access to all 6 expert-designed courses + 13 practice tests</p>
			</div>
			<button class="bg-brand-pink text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-brand-pink-dark transition-colors flex-shrink-0 w-full sm:w-auto">
				Upgrade to Premium
			</button>
		</div>

	<!-- ── RESOURCES ──────────────────────────────────────────────── -->
	{:else if activeTab === 'resources'}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			{#each filteredResources as res}
				<div class="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
					<div class="w-9 h-9 sm:w-10 sm:h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
						<span class="text-lg sm:text-xl">📄</span>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-2 mb-1">
							<h3 class="font-bold text-gray-900 text-sm leading-snug">{res.title}</h3>
							<SectionBadge section={res.section} />
						</div>
						<p class="text-[11px] text-gray-400 mb-2.5">{res.description}</p>
						<div class="flex items-center gap-3">
							<span class="text-[11px] text-gray-300">📦 {res.fileSize}</span>
							<a href={res.downloadUrl} class="text-xs font-semibold text-brand-green hover:underline">⬇ Download PDF</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
