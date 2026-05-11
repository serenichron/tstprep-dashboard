<script lang="ts">
  import QuizIcon from "./QuizIcon.svelte";

    const {
        selected = $bindable(),
        value,
        variant,
        href,
        label,
        scoreLabel,
        score,
        bestScore,
        count,
    }: { 
        selected: string;
        value: string;
        variant: 'white' | 'green';
        href: string;
        label: string;
        scoreLabel: string;
        score: number | null;
        bestScore: number | null;
        count: number;
    } = $props();

    const active = $derived(value === selected);
    const isGreen = $derived(variant === 'green');
</script>

<a
    href={href}
    class="block no-underline rounded-xl pt-2 pb-[7px] px-2.5 relative overflow-hidden cursor-pointer text-left transition-all duration-150
        {isGreen
            ? active
                ? 'border border-[#58ae9b] bg-gradient-to-br from-brand-green to-[#00c99a] text-white shadow-[0_6px_20px_rgba(0,177,137,.4)]'
                : 'border border-[#58ae9b] bg-gradient-to-br from-brand-green to-[#00c99a] text-white shadow-[0_4px_16px_rgba(0,177,137,.3)] hover:from-[#00a87f] hover:to-[#00b88d]'
            : active
                ? 'border-2 border-brand-green bg-white shadow-[0_3px_12px_rgba(0,177,137,.12)]'
                : 'border-2 border-transparent bg-white shadow-[0_1px_4px_rgba(0,0,0,.05)] hover:bg-gray-50'}"
>
    {#if active}
        <div class="absolute top-0 left-0 right-0 h-[3px] {isGreen ? 'bg-white/40' : 'bg-brand-green'}"></div>
    {/if}
    <div class="flex items-center gap-1.5 mb-[7px]">
        <div class="w-[22px] h-[22px] rounded-md flex items-center justify-center flex-shrink-0
            {isGreen ? 'bg-white/20 text-white' : active ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-400'}">
            <QuizIcon width="13" height="13" variant={value} />
        </div>
        <span class="text-[11px] font-semibold {isGreen ? 'text-white/85' : 'text-gray-700'}">{label}</span>
    </div>
    <div class="flex items-baseline gap-0.5 mb-1">
        <span class="text-xl font-extrabold tracking-[-1px]" style="color:{score === null ? (isGreen ? '#fff' : '#d0d5dd') : (isGreen ? '#fff' : '#1a1a1a')}">{score === null ? '—' : score.toFixed(1)}</span>
        {#if score !== null}
            <span class="text-[11px] font-semibold {isGreen ? 'text-white/70' : 'text-gray-400'}">/6</span>
            <span class="text-[9px] ml-[3px] {isGreen ? 'text-white/70' : 'text-gray-400'}">{scoreLabel}</span>
        {/if}
    </div>
    <div class="flex justify-between text-[10px] {isGreen ? 'text-white/75' : 'text-gray-400'}">
        <span>Best: <b style="color:{bestScore === null ? (isGreen ? '#fff' : '#ccc') : (isGreen ? '#fff' : '#00b189')}">{bestScore === null ? '—' : bestScore.toFixed(1)}</b></span>
        <span class="font-semibold {isGreen ? 'bg-white/20 text-white rounded px-1' : ''}">{count}</span>
    </div>
</a>
