<script lang="ts">
  /* Tiny sort toggle: a label with stacked up/down arrows.
	   The arrow matching the current direction lights up; the other dims.
	   When this control isn't the active sort, both arrows are dim. */
  let {
    label,
    by,
    activeBy = $bindable(),
    activeDir = $bindable(),
  }: {
    label: string;
    by: 'date' | 'score';
    activeBy: 'date' | 'score';
    activeDir: 'asc' | 'desc';
  } = $props();

  const isActive = $derived(activeBy === by);
  const ascOn = $derived(isActive && activeDir === 'asc');
  const descOn = $derived(isActive && activeDir === 'desc');
</script>

<button
  type="button"
  onclick={() => {
    activeDir = activeBy === by && activeDir === 'desc' ? 'asc' : 'desc';
    activeBy = by;
  }}
  class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors
		{isActive ? 'text-gray-800 bg-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}"
  aria-pressed={isActive}
  aria-label="Sort by {label} ({isActive ? activeDir : 'inactive'})"
>
  <span>{label}</span>
  <span class="inline-flex flex-col -my-px" aria-hidden="true">
    <svg
      width="7"
      height="5"
      viewBox="0 0 7 5"
      class="block {ascOn ? 'text-brand-green' : 'text-gray-300'}"
      fill="currentColor"
    >
      <path d="M3.5 0 L7 5 L0 5 Z" />
    </svg>
    <svg
      width="7"
      height="5"
      viewBox="0 0 7 5"
      class="block {descOn ? 'text-brand-green' : 'text-gray-300'}"
      fill="currentColor"
    >
      <path d="M0 0 L7 0 L3.5 5 Z" />
    </svg>
  </span>
</button>
