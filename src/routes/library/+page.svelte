<script lang="ts">
	import { base } from '$app/paths';
	import SectionBadge from '$lib/components/SectionBadge.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import { practiceTests, practiceSets, courses, resources } from '$lib/data/content';
	import type { Section } from '$lib/types';

	type Tab = 'tests' | 'practice' | 'courses' | 'resources';
	let activeTab: Tab = 'tests';

	type SectionFilter = Section | 'All';
	let sectionFilter: SectionFilter = 'All';
	let accessFilter: 'all' | 'free' | 'locked' = 'all';

	const tabs: { id: Tab; label: string; count: number }[] = [
		{ id: 'tests', label: 'Practice Tests', count: practiceTests.length },
		{ id: 'practice', label: 'Practice Questions', count: practiceSets.length },
		{ id: 'courses', label: 'Skill Courses', count: courses.length },
		{ id: 'resources', label: 'Resources', count: resources.length }
	];

	const sections: SectionFilter[] = ['All', 'Reading', 'Listening', 'Speaking', 'Writing', 'General'];

	$: filteredTests = practiceTests.filter((t) => {
		if (accessFilter !== 'all' && t.access !== accessFilter) return false;
		return true;
	});

	$: filteredPractice = practiceSets.filter((s) => {
		if (sectionFilter !== 'All' && s.section !== sectionFilter) return false;
		if (accessFilter !== 'all' && s.access !== accessFilter) return false;
		return true;
	});

	$: filteredCourses = courses.filter((c) => {
		if (sectionFilter !== 'All' && c.section !== sectionFilter) return false;
		if (accessFilter !== 'all' && c.access !== accessFilter) return false;
		return true;
	});

	$: filteredResources = resources.filter((r) => {
		if (sectionFilter !== 'All' && r.section !== sectionFilter) return false;
		return true;
	});

	const sectionColors: Record<string, string> = {
		Reading: 'bg-blue-100 text-blue-700',
		Listening: 'bg-purple-100 text-purple-700',
		Speaking: 'bg-orange-100 text-orange-700',
		Writing: 'bg-pink-100 text-pink-700',
		General: 'bg-brand-green-light text-brand-green'
	};
</script>

<svelte:head>
	<title>Content Library – TST Prep</title>
</svelte:head>

<div class="px-8 py-8">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-2xl font-black text-gray-900">Content Library</h1>
		<p class="text-gray-400 text-sm mt-1">All TOEFL preparation materials in one place</p>
	</div>

	<!-- Tabs -->
	<div class="flex items-center gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-card w-fit">
		{#each tabs as tab}
			<button
				class="tab {activeTab === tab.id ? 'active' : ''} flex items-center gap-2"
				on:click={() => { activeTab = tab.id; sectionFilter = 'All'; }}
			>
				{tab.label}
				<span class="text-xs {activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-500'} px-1.5 py-0.5 rounded-full font-bold">
					{tab.count}
				</span>
			</button>
		{/each}
	</div>

	<!-- Filters -->
	<div class="flex items-center gap-3 mb-6 flex-wrap">
		{#if activeTab !== 'tests' && activeTab !== 'resources'}
			<div class="flex gap-1.5 flex-wrap">
				{#each sections as sec}
					<button
						class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {sectionFilter === sec ? 'bg-brand-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}"
						on:click={() => (sectionFilter = sec)}
					>
						{sec}
					</button>
				{/each}
			</div>
		{/if}

		{#if activeTab !== 'resources'}
			<div class="flex gap-1.5 ml-auto">
				{#each [['all', 'All'], ['free', 'Free'], ['locked', 'Premium']] as [val, lbl]}
					<button
						class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {accessFilter === val ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}"
						on:click={() => (accessFilter = val as 'all' | 'free' | 'locked')}
					>
						{lbl}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- ── PRACTICE TESTS ────────────────────────────────────── -->
	{#if activeTab === 'tests'}
		<div class="grid grid-cols-3 gap-4">
			{#each filteredTests as test}
				<div class="card relative {test.access === 'locked' ? 'opacity-90' : ''} hover:shadow-lg transition-shadow">
					{#if test.access === 'locked'}
						<div class="absolute top-4 right-4">
							<span class="bg-gray-100 text-gray-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
								🔒 Premium
							</span>
						</div>
					{:else if test.attempts > 0}
						<div class="absolute top-4 right-4">
							<span class="bg-brand-green-light text-brand-green text-xs font-bold px-2 py-1 rounded-full">
								✓ Attempted
							</span>
						</div>
					{:else}
						<div class="absolute top-4 right-4">
							<span class="bg-blue-50 text-blue-500 text-xs font-bold px-2 py-1 rounded-full">
								Free
							</span>
						</div>
					{/if}

					<div class="mb-3">
						<p class="text-xs font-semibold text-gray-400 mb-1">TOEFL Full Test</p>
						<h3 class="font-black text-gray-900 text-base pr-16">Test #{test.testNumber}</h3>
					</div>

					<!-- Section icons -->
					<div class="flex gap-1.5 mb-4">
						{#each test.sections as sec}
							<SectionBadge section={sec} size="md" />
						{/each}
					</div>

					<!-- Score / stats -->
					{#if test.bestScore !== null}
						<div class="flex items-center gap-3 mb-3">
							<div class="bg-brand-green-light rounded-xl px-3 py-1.5 text-center">
								<p class="text-brand-green font-black text-lg leading-none">{test.bestScore.toFixed(1)}</p>
								<p class="text-xs text-gray-400">Best</p>
							</div>
							<div class="text-xs text-gray-400">
								<p>{test.attempts} attempt{test.attempts !== 1 ? 's' : ''}</p>
								<p>{test.lastAttempt}</p>
							</div>
						</div>
					{:else}
						<div class="flex items-center gap-2 mb-3 text-xs text-gray-400">
							<span>⏱ {test.duration}</span>
							<span>·</span>
							<span>4 sections</span>
						</div>
					{/if}

					<StarRating rating={test.rating} count={test.ratingCount} />

					<div class="mt-4">
						{#if test.access === 'locked'}
							<button class="btn-primary w-full">🔒 Unlock Test</button>
						{:else if test.attempts > 0}
							<button class="btn-secondary w-full">Retake Test</button>
						{:else}
							<button class="btn-secondary w-full">Start Test →</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>

	<!-- ── PRACTICE QUESTIONS ─────────────────────────────────── -->
	{:else if activeTab === 'practice'}
		<div class="grid grid-cols-2 gap-4">
			{#each filteredPractice as set}
				<div class="card flex gap-5 {set.access === 'locked' ? 'opacity-90' : ''} hover:shadow-lg transition-shadow">
					<div class="flex-shrink-0">
						<SectionBadge section={set.section} size="md" />
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-2 mb-1">
							<h3 class="font-bold text-gray-900 text-sm leading-snug">
								{set.title.replace('Free Interactive ', '').replace(' for the TOEFL Test', '')}
							</h3>
							{#if set.access === 'locked'}
								<span class="text-gray-300 text-lg flex-shrink-0">🔒</span>
							{/if}
						</div>

						<div class="flex items-center gap-2 mb-2">
							<span class="text-xs px-2 py-0.5 rounded-full font-semibold {sectionColors[set.section]}">{set.section}</span>
							<span class="text-xs text-gray-400">{set.questionCount} questions</span>
							<span class="text-xs text-gray-400">· {set.difficulty}</span>
						</div>

						{#if set.completionPercent > 0}
							<div class="mb-2">
								<div class="flex justify-between text-xs text-gray-400 mb-1">
									<span>Progress</span>
									<span class="font-semibold text-brand-green">{set.completionPercent}%</span>
								</div>
								<ProgressBar percent={set.completionPercent} />
							</div>
						{/if}

						<StarRating rating={set.rating} count={set.ratingCount} />

						<div class="mt-3">
							{#if set.access === 'locked'}
								<button class="btn-primary text-xs px-4 py-2">🔒 Unlock</button>
							{:else if set.completionPercent > 0}
								<button class="btn-secondary text-xs px-4 py-2">Continue →</button>
							{:else}
								<button class="btn-secondary text-xs px-4 py-2">Start Practice →</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

	<!-- ── COURSES ────────────────────────────────────────────── -->
	{:else if activeTab === 'courses'}
		<div class="grid grid-cols-3 gap-4">
			{#each filteredCourses as course}
				<div class="card p-0 overflow-hidden {course.access === 'locked' ? '' : ''} hover:shadow-lg transition-shadow group">
					<!-- Thumbnail -->
					<div class="relative h-36 bg-gray-100 overflow-hidden">
						<img
							src={course.thumbnail}
							alt={course.title}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
						{#if course.tag}
							<span class="absolute top-3 left-3 bg-brand-pink text-white text-xs font-bold px-2 py-1 rounded-full">
								{course.tag}
							</span>
						{/if}
						{#if course.access === 'locked'}
							<div class="absolute top-3 right-3 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center">
								<span class="text-white text-sm">🔒</span>
							</div>
						{/if}
						<div class="absolute bottom-3 left-3">
							<SectionBadge section={course.section} size="md" />
						</div>
					</div>

					<div class="p-4">
						<h3 class="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
							{course.title}
						</h3>

						<div class="flex items-center gap-3 text-xs text-gray-400 mb-2">
							<span>📚 {course.lessonCount} lessons</span>
						</div>

						{#if course.progressPercent > 0}
							<div class="mb-3">
								<ProgressBar percent={course.progressPercent} />
							</div>
						{/if}

						<StarRating rating={course.rating} count={course.ratingCount} />

						<div class="mt-3">
							{#if course.access === 'locked'}
								<button class="btn-primary w-full text-xs">🔒 Unlock Course</button>
							{:else if course.progressPercent > 0}
								<button class="btn-secondary w-full text-xs">Continue Course →</button>
							{:else}
								<button class="btn-secondary w-full text-xs">Start Course →</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Upsell banner for locked courses -->
		<div class="mt-6 p-5 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl flex items-center justify-between text-white">
			<div>
				<p class="font-black text-lg">Unlock All Score Builder Courses</p>
				<p class="text-sm text-gray-400 mt-0.5">Get full access to all 6 expert-designed courses + 13 practice tests</p>
			</div>
			<button class="btn-primary flex-shrink-0">Upgrade to Premium</button>
		</div>

	<!-- ── RESOURCES ──────────────────────────────────────────── -->
	{:else if activeTab === 'resources'}
		<div class="grid grid-cols-2 gap-4">
			{#each filteredResources as res}
				<div class="card flex items-start gap-4 hover:shadow-lg transition-shadow">
					<div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
						<span class="text-2xl">📄</span>
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-2">
							<h3 class="font-bold text-gray-900 text-sm leading-snug">{res.title}</h3>
							<SectionBadge section={res.section} />
						</div>
						<p class="text-xs text-gray-400 mt-1 mb-3">{res.description}</p>
						<div class="flex items-center gap-3">
							<span class="text-xs text-gray-300">📦 {res.fileSize}</span>
							<a
								href={res.downloadUrl}
								class="btn-ghost text-xs py-1.5 px-3 inline-flex items-center gap-1"
							>
								⬇ Download PDF
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
