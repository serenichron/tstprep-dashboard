<script lang="ts">
	import type { Section } from '$lib/types';

	export let section: Section;
	export let size: 'sm' | 'md' = 'sm';

	const map: Record<Section, { label: string; color: string }> = {
		Reading: { label: 'R', color: 'bg-blue-500' },
		Listening: { label: 'L', color: 'bg-purple-500' },
		Speaking: { label: 'S', color: 'bg-orange-500' },
		Writing: { label: 'W', color: 'bg-pink-500' },
		General: { label: 'G', color: 'bg-brand-green' }
	};

	$: badge = map[section];
	$: sizeClass = size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-xs';
</script>

<span
	class="section-badge {badge.color} {sizeClass}"
	title={section}
>
	{badge.label}
</span>
