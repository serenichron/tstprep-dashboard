<script lang="ts">
  import type { TrendInfo } from '$lib/types';
  import { formatScore } from '$lib/utils';

  const mn = 0.5,
    mx = 6.5;
  const CW = 400,
    CH = 160,
    pL = 32,
    pR = 14,
    pT = 16,
    pB = 32;
  const iW = CW - pL - pR,
    iH = CH - pT - pB;
  const {
    trend,
    label,
  }: {
    trend?: TrendInfo;
    label: string;
  } = $props();

  let trendOpen = $state(false);
  let trendHovIdx = $state<number | null>(null);

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  const trendData = $derived.by(() => {
    if (!trend) {
      return null;
    }

    const yFor = (v: number) => (1 - (v - mn) / (mx - mn)) * iH;
    // Single point: center it. Multiple points: distribute across the width.
    const coords = trend.submissions.map((q, i) => {
      const s = formatScore(q.score);
      const x = trend.submissions.length === 1 ? iW / 2 : (i / (trend.submissions.length - 1)) * iW;
      return { x, y: yFor(s), v: s, date: q.created_at };
    });
    const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
    const color = trend.diff > 0 ? '#00b189' : trend.diff < 0 ? '#ff5859' : '#94a3b8';
    return {
      coords,
      d,
      color,
      area: `${d}L${coords.at(-1)!.x.toFixed(1)},${iH}L${coords[0].x.toFixed(1)},${iH}Z`,
      diffLabel: (trend.diff >= 0 ? '+' : '') + trend.diff.toFixed(1),
      yLast10: yFor(trend.latest.average),
      yBaseline: yFor(trend.prev.average),
      yTicks: [1, 2, 3, 4, 5, 6].map(v => ({ v, y: yFor(v) })),
    };
  });
</script>

<button
  onclick={() => {
    if (trendData) {
      trendOpen = true;
      trendHovIdx = null;
    }
  }}
  disabled={!trendData}
  class="flex items-center gap-1.5 shrink-0 bg-transparent border-0 py-1 px-1.5 -my-1 -mx-1.5 rounded-lg cursor-pointer transition-colors hover:enabled:bg-black/5 disabled:cursor-default"
  title="View progress chart"
>
  {#if trendData && trend}
    <svg width="72" height="22" viewBox="0 0 {iW} {iH}" preserveAspectRatio="none">
      <defs
        ><linearGradient id="sbg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={trendData.color} stop-opacity=".12" />
          <stop offset="100%" stop-color={trendData.color} stop-opacity="0" />
        </linearGradient></defs
      >
      <path d={trendData.area} fill="url(#sbg2)" />
      <path
        d={trendData.d}
        fill="none"
        stroke={trendData.color}
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      {#each trendData.coords as c}
        <circle
          cx={c.x}
          cy={c.y}
          r="2"
          fill="#fff"
          stroke={trendData.color}
          stroke-width="1.4"
          vector-effect="non-scaling-stroke"
        />
      {/each}
    </svg>
    <span class="text-[11px] font-bold whitespace-nowrap" style="color:{trendData.color}">{trendData.diffLabel}</span>
  {:else}
    <span class="text-[10px] text-gray-300 italic">No trend yet</span>
  {/if}
</button>

{#if trendOpen && trendData && trend}
  <div use:portal>
    <button
      type="button"
      class="fixed inset-0 z-200 bg-black/25 backdrop-blur-sm cursor-default"
      onclick={() => {
        trendOpen = false;
        trendHovIdx = null;
      }}
      aria-label="Close trend"
    ></button>
    <div
      class="fixed z-201 bg-white rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,.18),0_4px_16px_rgba(0,0,0,.08)] w-118 max-w-[calc(100vw-32px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
    >
      <!-- Header -->
      <div class="flex justify-between items-start p-4.5 pb-3.5 border-b border-gray-100">
        <div class="flex flex-col gap-0.75">
          <span class="text-[15px] font-extrabold text-gray-900 tracking-[-0.3px]">{label}</span>
          <span class="text-[11px] text-gray-400">
            Last {trendData.coords.length} scored submissions
            {#if trend.prev.count > 0}
              · progress vs previous {trend.prev.count}{/if}
          </span>
        </div>
        <button
          type="button"
          onclick={() => {
            trendOpen = false;
            trendHovIdx = null;
          }}
          aria-label="Close"
          class="w-7 h-7 rounded-lg border-0 bg-gray-100 text-gray-500 cursor-pointer flex items-center justify-center shrink-0 transition-colors hover:bg-gray-200 hover:text-gray-700"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Chart -->
      <div class="px-4 pt-4 pb-1">
        <div class="relative inline-block">
          <svg width={CW} height={CH} style="display:block;overflow:visible">
            <defs>
              <linearGradient id="tpgrd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color={trendData.color} stop-opacity=".13" />
                <stop offset="100%" stop-color={trendData.color} stop-opacity="0" />
              </linearGradient>
            </defs>

            <g transform="translate({pL},{pT})">
              {#each trendData.yTicks as t}
                <line x1={0} y1={t.y} x2={iW} y2={t.y} stroke="#f0f0f0" stroke-width="1" />
                <text x={-7} y={t.y + 3.5} text-anchor="end" font-size="9" fill="#ccc" font-family="DM Sans,sans-serif"
                  >{t.v}</text
                >
              {/each}

              {#if trendData.yBaseline !== null}
                <line
                  x1={0}
                  y1={trendData.yBaseline}
                  x2={iW}
                  y2={trendData.yBaseline}
                  stroke="#cbd5e1"
                  stroke-width="1.3"
                  stroke-dasharray="5,4"
                />
                <text
                  x={iW + 5}
                  y={trendData.yBaseline + 3.5}
                  font-size="8.5"
                  fill="#94a3b8"
                  font-family="DM Sans,sans-serif"
                  font-weight="600"
                >
                  {trend.prev.average.toFixed(1)}
                </text>
              {/if}

              <line
                x1={0}
                y1={trendData.yLast10}
                x2={iW}
                y2={trendData.yLast10}
                stroke={trendData.color}
                stroke-width="1.3"
                stroke-dasharray="5,4"
                opacity=".55"
              />
              <text
                x={iW + 5}
                y={trendData.yLast10 + 3.5}
                font-size="8.5"
                fill={trendData.color}
                font-family="DM Sans,sans-serif"
                font-weight="600"
              >
                {trend.latest.average.toFixed(1)}
              </text>

              <path d={trendData.area} fill="url(#tpgrd)" />
              <path
                d={trendData.d}
                fill="none"
                stroke={trendData.color}
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              {#each trendData.coords as c, i}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={trendHovIdx === i ? 5.5 : 3.5}
                  fill={trendHovIdx === i ? trendData.color : '#fff'}
                  stroke={trendData.color}
                  stroke-width="2"
                  style="cursor:pointer;transition:r .1s,fill .1s"
                  role="img"
                  aria-label="Data point {i + 1}: {c.v.toFixed(1)} of 6"
                  onmouseenter={() => (trendHovIdx = i)}
                  onmouseleave={() => (trendHovIdx = null)}
                />
              {/each}

              {#each trendData.coords as c, i}
                {#if i === 0 || i === trendData.coords.length - 1 || i === Math.floor((trendData.coords.length - 1) / 2)}
                  <text
                    x={c.x}
                    y={iH + 17}
                    text-anchor="middle"
                    font-size="8.5"
                    fill="#bbb"
                    font-family="DM Sans,sans-serif"
                  >
                    {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                {/if}
              {/each}
            </g>
          </svg>

          {#if trendHovIdx !== null}
            {@const c = trendData.coords[trendHovIdx]}
            <div
              class="absolute pointer-events-none -translate-x-1/2 -translate-y-[calc(100%+10px)] bg-gray-900 text-white rounded-lg py-1.5 px-2.5 text-[11px] whitespace-nowrap flex flex-col items-center gap-px z-10 font-dmsans"
              style="left:{pL + c.x}px; top:{pT + c.y}px"
            >
              <b class="text-[13px] font-extrabold leading-[1.2]" style="color:{trendData.color}">{c.v.toFixed(1)}/6</b>
              <span class="text-[10px] leading-[1.2] text-white/60"
                >{new Date(c.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}</span
              >
            </div>
          {/if}
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-3.5 py-3 px-4.5 border-t border-gray-100 flex-wrap">
        <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span class="inline-block w-5 h-0.5 rounded-sm shrink-0 bg-slate-300"></span>
          Previous {trend.prev.count} avg&nbsp;<b class="text-gray-800 font-bold">{trend.prev.average.toFixed(1)}/6</b>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span class="inline-block w-5 h-0.5 rounded-sm shrink-0" style="background:{trendData.color};opacity:.55">
          </span>
          Last {trendData.coords.length} avg&nbsp;
          <b class="font-bold" style="color:{trendData.color}">{trend.latest.average.toFixed(1)}/6</b>
        </div>
        <div class="ml-auto text-[13px] font-extrabold tracking-[-0.4px]" style="color:{trendData.color}">
          {trendData.diffLabel}&nbsp;vs previous
        </div>
      </div>
    </div>
  </div>
{/if}
