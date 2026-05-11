<script lang="ts" generics="T">
	type Option = { value: T; label: string };

	let {
		label,
		value = $bindable(),
		options
	}: {
		label: string;
		value: T;
		options: readonly Option[];
	} = $props();

	let open = $state(false);
	let root: HTMLDivElement;

	const currentLabel = $derived(options.find(o => o.value === value)?.label ?? '');

	$effect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) open = false;
		};
		document.addEventListener('mousedown', onDown);
		return () => document.removeEventListener('mousedown', onDown);
	});
</script>

<div class="flex items-center gap-2" bind:this={root}>
	<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-[.4px] whitespace-nowrap">{label}</span>
	<div class="relative">
		<button
			type="button"
			onclick={() => open = !open}
			class="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] border-[1.5px] bg-white text-gray-700 text-[11px] font-semibold cursor-pointer transition-[border-color,box-shadow] duration-150 shadow-[0_1px_3px_rgba(0,0,0,.05)] whitespace-nowrap hover:border-gray-300 hover:bg-gray-50
				{open ? 'border-brand-green shadow-[0_0_0_3px_rgba(0,177,137,.1)]' : 'border-gray-200'}"
		>
			{currentLabel}
			<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
		</button>
		{#if open}
			<div class="absolute top-[calc(100%+6px)] right-0 bg-white rounded-xl shadow-[0_6px_24px_rgba(0,0,0,.13)] border border-gray-100 min-w-[150px] overflow-hidden z-[100]">
				{#each options as opt}
					<button
						type="button"
						onclick={() => { value = opt.value; open = false; }}
						class="block w-full px-3.5 py-[9px] border-0 bg-transparent text-xs cursor-pointer text-left transition-colors duration-100 hover:bg-gray-100
							{value === opt.value ? 'font-bold text-brand-green bg-brand-green/5' : 'font-medium text-gray-700'}"
					>
						{opt.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
