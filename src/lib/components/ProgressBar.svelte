<script lang="ts">
	export let percent: number = 0;
	export let color: string = 'bg-brand-green';
	export let height: string = 'h-1.5';
</script>

<div class="w-full bg-gray-100 rounded-full {height} overflow-hidden">
	<div
		class="{color} {height} rounded-full transition-all duration-500"
		style="width: {Math.min(100, Math.max(0, percent))}%"
	></div>
</div>
