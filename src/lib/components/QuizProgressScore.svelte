<script lang="ts">
    import { scoreColor } from "$lib/utils";

	let { score, disabled = false, disabledLabel = 'N/A' }: { score: number, disabled?: boolean, disabledLabel?: string } = $props();
    const color = $derived(scoreColor(score));
</script>

{#if disabled}
    <div class="rounded-full w-[70px] h-[5px] bg-[repeating-linear-gradient(90deg,_#e8e8e8_0px,_#e8e8e8_3px,_transparent_3px,_transparent_6px)]"></div>
    <span class="text-[11px] text-gray-400 italic">{disabledLabel}</span>
{:else}
    <div class="rounded-full bg-gray-200 overflow-hidden" style="width:70px;height:5px">
        <div class="h-full rounded-full transition-[width] duration-500" style="width:{((score - 1) / 5) * 100}%;background:{color}"></div>
    </div>
    <span class="text-xs font-bold min-w-[38px]" style="color:{color}">{score.toFixed(1)}/6</span>
{/if}
