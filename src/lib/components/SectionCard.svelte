<script lang="ts">
	import type { QuizType, StatsPartWithMode } from '$lib/types';
	import { formatScoreOptional, scoreColor, sectionLabel } from '$lib/utils';
	import QuizIcon from './QuizIcon.svelte';
	import HelpTip from './HelpTip.svelte';
	import TrendChip from './TrendChip.svelte';

	let {
		selected,
		value,
		stats,
		onSelect,
		trendDiff
	}: {
		selected: QuizType;
		value: QuizType;
		stats: StatsPartWithMode;
		onSelect?: (value: QuizType) => void;
		/** Trend delta in the 1–6 band; pass undefined if not available. */
		trendDiff?: number;
	} = $props();

	const label = $derived(sectionLabel(value));
	const active = $derived(value === selected);

	/* Per-section identity colors — muted pastel tints matched to the content
	   library tabs: Reading=blue, Listening=purple, Speaking=orange, Writing=pink. */
	const sectionTheme: Record<QuizType, { base: string; active: string; text: string; icon: string; border: string }> = {
		reading:   { base: 'bg-blue-50',   active: 'bg-blue-100',   text: 'text-blue-700',   icon: 'bg-blue-100 text-blue-600',     border: 'border-blue-100' },
		listening: { base: 'bg-purple-50', active: 'bg-purple-100', text: 'text-purple-700', icon: 'bg-purple-100 text-purple-600', border: 'border-purple-100' },
		speaking:  { base: 'bg-orange-50', active: 'bg-orange-100', text: 'text-orange-700', icon: 'bg-orange-100 text-orange-600', border: 'border-orange-100' },
		writing:   { base: 'bg-pink-50',   active: 'bg-pink-100',   text: 'text-pink-700',   icon: 'bg-pink-100 text-pink-600',     border: 'border-pink-100' }
	};
	const theme = $derived(sectionTheme[value]);
	const average = $derived(formatScoreOptional(stats.all.average));
	const best = $derived(formatScoreOptional(stats.all.best));
	const testAverage = $derived(formatScoreOptional(stats.test.average));
	const practiceAverage = $derived(formatScoreOptional(stats.practice.average));

	/* Score-band colors (red < 3.5, amber < 5, green ≥ 5) applied to all score numbers.
	   The ruler markers + legend dots keep identity colors (green=Test, amber=Practice)
	   so the two are still visually distinguishable on the same ruler. */
	const averageColor  = $derived(average  === null ? '#d0d5dd' : scoreColor(average));
	const bestColor     = $derived(best     === null ? '#d0d5dd' : scoreColor(best));
	const testColor     = $derived(testAverage     === null ? '#d0d5dd' : scoreColor(testAverage));
	const practiceColor = $derived(practiceAverage === null ? '#d0d5dd' : scoreColor(practiceAverage));

	const pct = (v: number) => ((v - 1) / 5) * 100;
	const fmt = (v: number) => v.toFixed(1);
</script>

<button
	type="button"
	onclick={() => onSelect?.(value)}
	class="flex flex-col no-underline rounded-xl relative overflow-hidden cursor-pointer text-left transition-shadow duration-150 bg-white border
		{active
			? 'border-transparent ring-2 ring-brand-green ring-offset-2 ring-offset-gray-50 shadow-[0_6px_20px_rgba(0,0,0,.12)]'
			: `${theme.border} shadow-[0_1px_4px_rgba(0,0,0,.05)] hover:shadow-[0_3px_10px_rgba(0,0,0,.1)]`}"
>
	<!-- Section-colored header strip -->
	<div class="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 {active ? theme.active : theme.base}">
		<div class="w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-md flex items-center justify-center flex-shrink-0 {theme.icon}">
			<QuizIcon width="11" height="11" variant={value} />
		</div>
		<span class="text-[11px] md:text-[12px] font-bold truncate {theme.text}">{label}</span>
		{#if trendDiff !== undefined}
			<TrendChip diff={trendDiff} variant="default" />
		{/if}
		<span class="ml-auto text-[10px] text-gray-400 flex-shrink-0">{stats.all.count} <span class="hidden md:inline xl:hidden">submission{stats.all.count !== 1 ? 's' : ''}</span><span class="hidden xl:inline 2xl:hidden">sub.</span><span class="hidden 2xl:inline">submission{stats.all.count !== 1 ? 's' : ''}</span></span>
	</div>

	<!-- Body -->
	<div class="flex flex-col flex-1 px-2.5 md:px-3 pt-2 pb-2 md:pt-2.5 md:pb-2.5">
		<!-- Hero avg + Best -->
		<div class="flex items-baseline gap-1 mb-2 md:mb-3 flex-wrap">
			<span class="text-[20px] md:text-[28px] font-extrabold tracking-[-1px] md:tracking-[-1.5px] leading-none" style="color:{averageColor}">{average === null ? '—' : fmt(average)}</span>
			<span class="text-[11px] md:text-[13px] font-semibold text-gray-500 leading-none">/6</span>
			<span class="text-[9px] md:text-[10px] uppercase tracking-[.5px] text-gray-500 leading-none ml-0.5 font-semibold">avg</span>
			<HelpTip text="Based on your last 30 submissions for this section. If you have fewer, the average uses all available." />
			{#if best !== null}
				<span class="ml-auto inline-flex items-baseline gap-1 text-[10px] text-gray-400 leading-none">
					<svg class="w-3 h-3 self-center -translate-y-px" viewBox="0 0 24 24" fill="currentColor" style="color:{bestColor}"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>
					<span>Best</span>
					<b class="text-[10.5px] md:text-[12px] font-bold" style="color:{bestColor}">{fmt(best)}</b>
				</span>
			{/if}
		</div>

		<!-- Shared 1–6 ruler with Test + Practice markers -->
		{#if testAverage !== null || practiceAverage !== null}
			<div class="mt-auto">
				<!-- Ruler rendered as SVG so every tick is pixel-crisp at the same width -->
				<div class="relative h-4">
					<svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
						<line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#f3f4f6" stroke-width="1" vector-effect="non-scaling-stroke" />
						{#each [1.5, 2.5, 3.5, 4.5, 5.5] as t}
							<line x1="{((t - 1) / 5) * 100}%" y1="38%" x2="{((t - 1) / 5) * 100}%" y2="62%" stroke="#e5e7eb" stroke-width="1" vector-effect="non-scaling-stroke" />
						{/each}
						{#each [1, 2, 3, 4, 5, 6] as t}
							<line x1="{((t - 1) / 5) * 100}%" y1="22%" x2="{((t - 1) / 5) * 100}%" y2="78%" stroke="#d1d5db" stroke-width="1" vector-effect="non-scaling-stroke" />
						{/each}
					</svg>
					{#if practiceAverage !== null}
						<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white bg-[#f0a030] shadow-[0_1px_3px_rgba(0,0,0,.25)]" style="left:{pct(practiceAverage)}%" title="Practice avg {fmt(practiceAverage)}/6"></div>
					{/if}
					{#if testAverage !== null}
						<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white bg-brand-green shadow-[0_1px_3px_rgba(0,0,0,.25)]" style="left:{pct(testAverage)}%" title="Test avg {fmt(testAverage)}/6"></div>
					{/if}
				</div>

				<!-- Legend -->
				<div class="flex items-center justify-between mt-1 md:mt-1.5 gap-1.5">
					<div class="flex items-center gap-1 min-w-0 leading-none">
						<svg width="7" height="7" viewBox="0 0 7 7" class="flex-shrink-0 overflow-visible" aria-hidden="true"><circle cx="3.5" cy="3.5" r="3.5" fill="#00b189" /></svg>
						<span class="text-[8.5px] uppercase tracking-[.4px] font-semibold text-gray-500">Test</span>
						<b class="text-[11px] font-extrabold" style="color:{testColor}">{testAverage === null ? '—' : fmt(testAverage)}</b>
						<span class="hidden md:inline xl:hidden 2xl:inline text-[8px] uppercase tracking-[.4px] text-gray-400">avg</span>
					</div>
					<div class="flex items-center gap-1 min-w-0 leading-none">
						<svg width="7" height="7" viewBox="0 0 7 7" class="flex-shrink-0 overflow-visible" aria-hidden="true"><circle cx="3.5" cy="3.5" r="3.5" fill="#f0a030" /></svg>
						<span class="text-[8.5px] uppercase tracking-[.4px] font-semibold text-gray-500 truncate"><span class="hidden md:inline xl:hidden 2xl:inline">Practice</span><span class="md:hidden xl:inline 2xl:hidden">Prac</span></span>
						<b class="text-[11px] font-extrabold" style="color:{practiceColor}">{practiceAverage === null ? '—' : fmt(practiceAverage)}</b>
						<span class="hidden md:inline xl:hidden 2xl:inline text-[8px] uppercase tracking-[.4px] text-gray-400">avg</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</button>
