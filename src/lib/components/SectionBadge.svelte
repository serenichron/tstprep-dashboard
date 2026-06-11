<script lang="ts">
	import type { Section } from '$lib/types';

	let {
		section,
		size = 'sm'
	}: {
		section: Section;
		size?: 'sm' | 'md';
	} = $props();

	const colorMap: Record<Section, string> = {
		Reading:   'bg-blue-500 text-white',
		Listening: 'bg-purple-500 text-white',
		Speaking:  'bg-orange-500 text-white',
		Writing:   'bg-pink-500 text-white',
		General:   'bg-brand-green text-white'
	};

	const colorClass = $derived(colorMap[section]);
	const sizeClass = $derived(
		size === 'sm'
			? 'text-[9px] px-1.5 py-0.5'
			: 'text-[10px] px-2 py-0.5'
	);
</script>

<span
	class="inline-flex items-center rounded-full font-bold uppercase tracking-wide {colorClass} {sizeClass}"
	title={section}
>
	{section}
</span>
