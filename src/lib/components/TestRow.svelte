<script lang="ts">
  import { extractDateTime, formatScore, scoreColor } from "$lib/utils";
  import QuizProgressScore from "./QuizProgressScore.svelte";

	type Sec4 = 'Reading' | 'Listening' | 'Speaking' | 'Writing';

	interface CompleteTest {
		testNumber: number;
		date: string;
		duration: string;
		scores: Record<Sec4, number | null>;
		composite: number | null;
	}

	let {
		row,
		index,
		sections,
		onView
	}: {
		row: CompleteTest;
		index: number;
		sections?: Sec4[];
		onView?: () => void;
	} = $props();
	const { date, time } = $derived(extractDateTime(row.date));

	const SEC4_DEFAULT: Sec4[] = ['Reading', 'Listening', 'Speaking', 'Writing'];
	const secs = $derived(sections ?? SEC4_DEFAULT);
</script>

<div class="flex items-center px-5 py-[9px] border-b border-gray-100 text-xs gap-3 flex-nowrap max-md:px-3.5 max-md:gap-2 max-md:flex-wrap {index % 2 !== 0 ? 'bg-gray-50/40' : 'bg-white'}">
	<div class="flex items-center gap-1.5 flex-nowrap min-w-0 w-[470px] flex-shrink-0 max-md:w-full">
		<span class="text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap">Test #{row.testNumber}</span>
		<span class="text-gray-500 whitespace-nowrap">{date} <span class="text-gray-300">·</span> {time}</span>
		<span class="text-gray-500 whitespace-nowrap" style="color:#bbb">{row.duration}</span>
	</div>
	<div class="flex gap-1 flex-wrap flex-1 min-w-0 max-md:flex-[1_1_100%]">
		{#each secs as s}
			{@const v = row.scores[s]}
			{@const score = formatScore(v ?? 0)}
			{@const color = scoreColor(score)}
			<span class="text-[10px] font-bold py-0.5 px-[7px] rounded whitespace-nowrap" style="color:{v !== null ? color : '#ccc'};background:{v !== null ? color + '18' : '#f5f5f5'}">{s.slice(0, 1)}: {v !== null ? score.toFixed(1) : '—'}</span>
		{/each}
	</div>
	<div class="flex items-center gap-1.5 flex-[0_0_140px] max-md:flex-[0_0_120px] max-sm:flex-[0_0_100px]">
		<QuizProgressScore score={formatScore(row.composite ?? 0)} disabled={row.composite === null} disabledLabel="Pending" />
	</div>
	<button onclick={onView} class="flex-shrink-0 py-1 px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-brand-green hover:text-white max-sm:py-[3px] max-sm:px-2.5 max-sm:text-[10px]">
		View →
	</button>
</div>
