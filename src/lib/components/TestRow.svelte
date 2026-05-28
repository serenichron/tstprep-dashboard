<script lang="ts">
	import { extractDateTime, formatScoreOptional, scoreColor } from '$lib/utils';

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
		sections,
		onView
	}: {
		row: CompleteTest;
		sections?: Sec4[];
		onView?: () => void;
	} = $props();

	const SEC4_DEFAULT: Sec4[] = ['Reading', 'Listening', 'Speaking', 'Writing'];
	const secs = $derived(sections ?? SEC4_DEFAULT);
	const { date, time } = $derived(extractDateTime(row.date));
	const compBand = $derived(formatScoreOptional(row.composite));
	const compColor = $derived(compBand !== null ? scoreColor(compBand) : '#cbd5e1');
</script>

<div class="bg-white rounded-xl ring-1 ring-gray-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] px-3.5 py-3 md:flex md:items-center md:px-5 md:py-2.5 md:gap-3 md:flex-nowrap transition-shadow hover:shadow-[0_3px_10px_rgba(0,0,0,.06)]">
	<!-- Header: test# + duration + date -->
	<div class="flex items-center gap-1.5 flex-wrap min-w-0 md:w-[470px] md:flex-shrink-0 md:flex-nowrap">
		<span class="text-[11px] md:text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap">Test #{row.testNumber}</span>
		<span class="text-[11px] md:text-xs text-gray-400 whitespace-nowrap">{row.duration}</span>
		<span class="text-[12px] md:text-xs text-gray-500 whitespace-nowrap ml-auto md:ml-0">{date} <span class="text-gray-300">·</span> {time}</span>
	</div>

	<!-- Per-section score chips -->
	<div class="flex gap-1 flex-wrap mt-2 md:mt-0 md:flex-1 md:min-w-0 md:order-3">
		{#each secs as s}
			{@const v = row.scores[s]}
			{@const band = formatScoreOptional(v)}
			{@const c = band !== null ? scoreColor(band) : '#ccc'}
			<span class="text-[11px] md:text-[10px] font-bold py-0.5 px-[7px] rounded whitespace-nowrap" style="color:{c};background:{band !== null ? c + '18' : '#f5f5f5'}">
				{s.slice(0, 1)}: {band !== null ? band.toFixed(1) : '—'}
			</span>
		{/each}
	</div>

	<!-- Composite score bar (with mobile View button) -->
	<div class="flex items-center gap-2 mt-3 md:mt-0 md:gap-1.5 md:flex-[0_0_140px] md:order-2">
		{#if compBand !== null}
			<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-gray-200 overflow-hidden">
				<div class="h-full rounded-full transition-[width] duration-500" style="width:{((compBand - 1) / 5) * 100}%;background:{compColor}"></div>
			</div>
			<span class="text-sm md:text-xs font-bold min-w-[42px] md:min-w-[38px] text-right md:text-left" style="color:{compColor}">{compBand.toFixed(1)}/6</span>
		{:else}
			<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-[repeating-linear-gradient(90deg,_#e8e8e8_0px,_#e8e8e8_3px,_transparent_3px,_transparent_6px)]"></div>
			<span class="text-[12px] md:text-[11px] text-gray-400 italic">Pending</span>
		{/if}
		<button onclick={onView} class="md:hidden flex-shrink-0 py-1.5 px-3.5 rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-xs font-bold cursor-pointer hover:bg-brand-green hover:text-white transition-colors">
			View →
		</button>
	</div>

	<button onclick={onView} class="hidden md:inline-block flex-shrink-0 py-1 px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-brand-green hover:text-white md:order-4">
		View →
	</button>
</div>
