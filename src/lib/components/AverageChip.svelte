<script lang="ts">
    import { scoreColor } from "$lib/utils";

    const { score }: { score: number | null } = $props();
    const color = $derived(score === null ? '#d0d5dd' : scoreColor(score));
</script>

<div class="md:hidden flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 shadow-[0_1px_3px_rgba(0,0,0,.05)] flex-shrink-0">
    <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Overall</span>
    <span class="text-sm font-extrabold leading-none" style="color:{color}">{score === null ? '—' : score.toFixed(1)}</span>
    <span class="text-[10px] text-gray-400 leading-none">/6</span>
</div>
