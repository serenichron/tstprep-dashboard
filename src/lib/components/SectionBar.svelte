<script lang="ts">
    import type { QuizMode, QuizSubmission, QuizType, StatsPart, TrendInfo } from "$lib/types";
    import { formatScore, scoreColor, sectionLabel } from "$lib/utils";
    import ProgressChart from "./ProgressChart.svelte";
    import QuizIcon from "./QuizIcon.svelte";
    import Select from "./Select.svelte";
    import SortControl from "./SortControl.svelte";
  
  let {
    section,
    stats,
    total,
    test = $bindable(),
    mode = $bindable(),
    trend,
    sortBy = $bindable(),
    sortDir = $bindable(),
    root = $bindable(),
  }: {
    section: QuizType;
    stats: StatsPart;
    total: number;
    test?: number;
    mode?: QuizMode;
    trend?: TrendInfo;
    sortBy: 'date' | 'score';
    sortDir: 'asc' | 'desc';
    root?: HTMLElement;
  } = $props();
  const label = $derived(sectionLabel(section));
  const needsAI = $derived(section === 'writing' || section === 'speaking');

  const modeOptions: Select<QuizMode | undefined>['$$prop_def']['options'] = [
    { value: undefined, label: 'All' },
    { value: 'test', label: 'Test Mode' },
    { value: 'practice', label: 'Practice Mode' },
  ];
  const testOptions: Select<number | undefined>['$$prop_def']['options'] = [
    { value: undefined, label: 'All' },
    ...Array.from({ length: 15 }, (_, i) => ({ value: i + 1, label: String(i + 1) })),
  ];

  // TODO: use reactive properties
  const isComplete = false;
  const filteredCtByDate = [];
</script>

<div bind:this={root} class="flex items-center gap-2.5 pt-2 pb-2 border-t border-gray-200 mt-2 flex-wrap max-md:gap-y-2">
    <div class="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
        <div class="w-[22px] h-[22px] rounded-md bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0">
            <QuizIcon variant={section} width="14" height="14" />
        </div>
        <span class="text-xs font-bold text-gray-800 whitespace-nowrap">{label}</span>
        <span class="text-gray-300 text-xs">·</span>
        <span class="text-[11px] text-gray-400 whitespace-nowrap">
            {isComplete ? filteredCtByDate.length : stats.count}
            {isComplete ? 'attempt' : 'submission'}{(isComplete ? filteredCtByDate.length : stats.count) !== 1 ? 's' : ''}
        </span>
        {#if !isComplete && needsAI}<span class="text-[11px] text-gray-400 whitespace-nowrap">· {stats.count} AI-graded</span>{/if}
        {#if test !== undefined}
            <span class="text-gray-300 text-xs">·</span>
            <span class="text-[11px] text-gray-500 whitespace-nowrap">
                Test #{test}
                {#if stats.average !== null}
                    {@const average = formatScore(stats.average)}
                    {@const best = formatScore(stats.best!)}
                    · Avg <b style="color:{scoreColor(average)}">{average.toFixed(1)}/6</b>
                    · Best <b style="color:{scoreColor(best)}">{best.toFixed(1)}/6</b>
                {:else}
                    · No scored submissions
                {/if}
            </span>
        {/if}
    </div>
    <ProgressChart {trend} {label} />
    <div class="w-px h-5 bg-gray-200 flex-shrink-0 max-md:hidden"></div>
    <div class="flex items-center gap-2 flex-shrink-0 max-md:basis-full max-md:justify-end">
        <Select label="Test no." bind:value={test} options={testOptions} />
        <Select label="Mode" bind:value={mode} options={modeOptions} />
        <div class="w-px h-5 bg-gray-200 flex-shrink-0"></div>
        <span class="text-[10px] uppercase tracking-[.4px] font-semibold text-gray-400 whitespace-nowrap">Sort by</span>
        <SortControl label="Date" by="date" bind:activeBy={sortBy} bind:activeDir={sortDir} />
        <SortControl label="Score" by="score" bind:activeBy={sortBy} bind:activeDir={sortDir} />
    </div>
</div>
