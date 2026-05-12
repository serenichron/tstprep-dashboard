<script lang="ts">
	import QuizIcon from './QuizIcon.svelte';

	let {
		selected,
		value,
		href,
		label,
		score,
		bestScore,
		testScore,
		practiceScore,
		count
	}: {
		selected: string;
		value: string;
		href: string;
		label: string;
		// Scores arrive already in the 1–6 TOEFL band (caller is expected to use formatScore()).
		score: number | null;
		bestScore: number | null;
		testScore: number | null;
		practiceScore: number | null;
		count: number;
	} = $props();

	const active = $derived(value === selected);

	const pct = (v: number) => ((v - 1) / 5) * 100;
	const fmt = (v: number) => v.toFixed(1);
</script>

<a
	{href}
	class="flex flex-col no-underline rounded-xl relative overflow-hidden cursor-pointer text-left transition-shadow duration-150 bg-white
		{active
			? 'ring-2 ring-brand-green ring-offset-2 ring-offset-gray-50 shadow-[0_6px_20px_rgba(0,177,137,.18)]'
			: 'shadow-[0_1px_4px_rgba(0,0,0,.05)] hover:shadow-[0_3px_10px_rgba(0,0,0,.1)]'}"
>
	<!-- Green header strip -->
	<div class="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 {active ? 'bg-brand-green-dark' : 'bg-brand-green'}">
		<div class="w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-md flex items-center justify-center flex-shrink-0 bg-white/20 text-white">
			<QuizIcon width="11" height="11" variant={value} />
		</div>
		<span class="text-[11px] md:text-[12px] font-bold text-white truncate">{label}</span>
		<span class="ml-auto text-[10px] text-white/75 flex-shrink-0">{count} <span class="hidden md:inline xl:hidden">submission{count !== 1 ? 's' : ''}</span><span class="hidden xl:inline 2xl:hidden">sub.</span><span class="hidden 2xl:inline">submission{count !== 1 ? 's' : ''}</span></span>
	</div>

	<!-- Body -->
	<div class="flex flex-col flex-1 px-2.5 md:px-3 pt-2 pb-2 md:pt-2.5 md:pb-2.5">
		<!-- Hero avg + Best -->
		<div class="flex items-baseline gap-1 mb-2 md:mb-3 flex-wrap">
			<span class="text-[20px] md:text-[28px] font-extrabold tracking-[-1px] md:tracking-[-1.5px] leading-none" style="color:{score === null ? '#d0d5dd' : '#1a1a1a'}">{score === null ? '—' : fmt(score)}</span>
			<span class="text-[10px] md:text-[12px] font-semibold text-gray-300 leading-none">/6</span>
			<span class="text-[8.5px] md:text-[9px] uppercase tracking-[.5px] text-gray-400 leading-none ml-0.5">avg</span>
			{#if bestScore !== null}
				<span class="ml-auto inline-flex items-baseline gap-1 text-[10px] text-gray-400 leading-none">
					<svg class="w-3 h-3 text-brand-green self-center -translate-y-px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>
					<span>Best</span>
					<b class="text-[10.5px] md:text-[12px] font-bold" style="color:#00b189">{fmt(bestScore)}</b>
				</span>
			{/if}
		</div>

		<!-- Shared 1–6 ruler with Test + Practice markers -->
		{#if testScore !== null || practiceScore !== null}
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
					{#if practiceScore !== null}
						<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white bg-[#f0a030] shadow-[0_1px_3px_rgba(0,0,0,.25)]" style="left:{pct(practiceScore)}%" title="Practice avg {fmt(practiceScore)}/6"></div>
					{/if}
					{#if testScore !== null}
						<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white bg-brand-green shadow-[0_1px_3px_rgba(0,0,0,.25)]" style="left:{pct(testScore)}%" title="Test avg {fmt(testScore)}/6"></div>
					{/if}
				</div>

				<!-- Legend -->
				<div class="flex items-center justify-between mt-1 md:mt-1.5 gap-1.5">
					<div class="flex items-center gap-1 min-w-0 leading-none">
						<svg width="7" height="7" viewBox="0 0 7 7" class="flex-shrink-0 overflow-visible" aria-hidden="true"><circle cx="3.5" cy="3.5" r="3.5" fill="#00b189" /></svg>
						<span class="text-[8.5px] uppercase tracking-[.4px] font-semibold text-gray-500">Test</span>
						<b class="text-[11px] font-extrabold" style="color:{testScore === null ? '#d0d5dd' : '#00876c'}">{testScore === null ? '—' : fmt(testScore)}</b>
						<span class="hidden md:inline xl:hidden 2xl:inline text-[8px] uppercase tracking-[.4px] text-gray-400">avg</span>
					</div>
					<div class="flex items-center gap-1 min-w-0 leading-none">
						<svg width="7" height="7" viewBox="0 0 7 7" class="flex-shrink-0 overflow-visible" aria-hidden="true"><circle cx="3.5" cy="3.5" r="3.5" fill="#f0a030" /></svg>
						<span class="text-[8.5px] uppercase tracking-[.4px] font-semibold text-gray-500 truncate"><span class="hidden md:inline xl:hidden 2xl:inline">Practice</span><span class="md:hidden xl:inline 2xl:hidden">Prac</span></span>
						<b class="text-[11px] font-extrabold" style="color:{practiceScore === null ? '#d0d5dd' : '#a87a08'}">{practiceScore === null ? '—' : fmt(practiceScore)}</b>
						<span class="hidden md:inline xl:hidden 2xl:inline text-[8px] uppercase tracking-[.4px] text-gray-400">avg</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</a>
