<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { mockUser } from '$lib/data/content';

	let { children }: { children: Snippet } = $props();
	let sidebarOpen = $state(false);
</script>

<!-- Mobile header -->
<header class="lg:hidden fixed top-0 inset-x-0 z-50 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shadow-sm">
	<button
		onclick={() => (sidebarOpen = true)}
		class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
		aria-label="Open menu"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>
	<a href="/" class="flex items-center gap-2">
		<div class="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
			<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
		</div>
		<span class="font-black text-gray-900 tracking-tight">TST<span class="text-brand-green">Prep</span></span>
	</a>
</header>

<!-- Backdrop -->
{#if sidebarOpen}
	<div
		class="lg:hidden fixed inset-0 z-40 bg-black/40"
		onclick={() => (sidebarOpen = false)}
		role="button"
		aria-label="Close menu"
		tabindex="-1"
	></div>
{/if}

<div class="flex min-h-screen bg-gray-50">
	<Sidebar user={mockUser} mobileOpen={sidebarOpen} onMobileClose={() => (sidebarOpen = false)} />
	<main class="flex-1 lg:ml-60 min-h-screen pt-14 lg:pt-0">
		{@render children()}
	</main>
</div>
