<script lang="ts">
    import { scoreColor } from "$lib/utils";
    import Gauge from "./Gauge.svelte";
    import HelpTip from "./HelpTip.svelte";

    const { best, average }: { best: number | null, average: number | null } = $props();
    const color = $derived(average === null ? '#ddd' : scoreColor(average));
    const bestColor = $derived(best === null ? '#d0d5dd' : scoreColor(best));
</script>

<div class="hidden xl:flex relative rounded-xl bg-gradient-to-br from-brand-green-light via-white to-white shadow-[0_1px_4px_rgba(0,0,0,.05)] overflow-hidden flex-col items-center justify-center text-center px-3 py-3">
    <div class="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-green/10"></div>
    <div class="text-[9px] font-bold text-brand-green-dark uppercase tracking-[.6px] mb-1 relative inline-flex items-center gap-1">
        <span>Overall Avg</span>
        <HelpTip text="Average of your 4 section averages (Reading, Listening, Writing, Speaking)." />
    </div>
    <div class="relative w-[88px] mx-auto">
        <Gauge score={average} {color} class="w-[88px] h-[63px] block" />
        <div class="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-baseline gap-0.5 leading-none whitespace-nowrap">
            <span class="text-[22px] font-extrabold tracking-[-1.2px]" style="color:{average === null ? '#d0d5dd' : color}">{average === null ? '—' : average.toFixed(1)}</span>
            {#if average !== null}<span class="text-[10px] font-semibold text-gray-400">/6</span>{/if}
        </div>
    </div>
    {#if best !== null}
        <div class="inline-flex items-center gap-1 mt-1 px-2 py-[3px] rounded-full bg-white border border-brand-green/25 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
            <svg class="w-3 h-3 -translate-y-px" viewBox="0 0 24 24" fill="currentColor" style="color:{bestColor}"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>
            <span class="text-[9px] uppercase tracking-[.4px] font-semibold text-gray-500">Best</span>
            <b class="text-[11px] font-extrabold leading-none" style="color:{bestColor}">{best.toFixed(1)}</b>
        </div>
    {:else}
        <div class="text-[10px] text-gray-400 mt-1.5 italic">Need all 4 sections</div>
    {/if}
</div>
