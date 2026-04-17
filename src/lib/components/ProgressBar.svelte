<script lang="ts">
	let {
		percent = 0,
		color = 'bg-brand-green',
		height = 'h-1.5'
	}: {
		percent?: number;
		color?: string;
		height?: string;
	} = $props();
</script>

<div class="w-full bg-gray-100 rounded-full {height} overflow-hidden">
	<div
		class="{color} {height} rounded-full transition-all duration-500"
		style="width: {Math.min(100, Math.max(0, percent))}%"
	></div>
</div>
