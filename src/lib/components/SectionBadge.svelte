<script lang="ts">
	import type { Section } from '$lib/types';

	let {
		section,
		size = 'sm'
	}: {
		section: Section;
		size?: 'sm' | 'md';
	} = $props();

	const map: Record<Section, { label: string; color: string }> = {
		Reading:   { label: 'R', color: 'bg-blue-500' },
		Listening: { label: 'L', color: 'bg-purple-500' },
		Speaking:  { label: 'S', color: 'bg-orange-500' },
		Writing:   { label: 'W', color: 'bg-pink-500' },
		General:   { label: 'G', color: 'bg-brand-green' }
	};

	const badge = $derived(map[section]);
	const sizeClass = $derived(size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-xs');
</script>

<span class="section-badge {badge.color} {sizeClass}" title={section}>
	{badge.label}
</span>
