<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { mockUser } from '$lib/data/content';

	let { children }: { children: Snippet } = $props();

	// Starts closed; $effect opens it on desktop after mount
	let sidebarOpen = $state(false);

	$effect(() => {
		sidebarOpen = window.matchMedia('(min-width: 1024px)').matches;
	});

	const levelColors: Record<string, string> = {
		Beginner:     'bg-gray-400',
		Practitioner: 'bg-blue-500',
		Advanced:     'bg-brand-green',
		Expert:       'bg-purple-500',
		Master:       'bg-pink-500'
	};
</script>

<!-- ─── Sticky Header ──────────────────────────────────────────────────────── -->
<header class="fixed top-0 inset-x-0 h-14 bg-white border-b border-gray-100 z-50 flex items-center px-4 gap-3 shadow-sm">

	<!-- Sidebar toggle -->
	<button
		onclick={() => (sidebarOpen = !sidebarOpen)}
		class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0"
		aria-label="Toggle menu"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>

	<!-- Logo -->
	<a href="/" class="flex items-center gap-2 flex-shrink-0">
		<div class="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
			<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
		</div>
		<span class="font-black text-gray-900 tracking-tight">TST<span class="text-brand-green">Prep</span></span>
	</a>

	<!-- Spacer -->
	<div class="flex-1"></div>

	<!-- Score chip — hidden on xs -->
	<div class="hidden sm:flex items-center gap-1.5 bg-brand-green-light rounded-full px-3 py-1.5 flex-shrink-0">
		<span class="text-brand-green font-black text-sm leading-none">{mockUser.currentScore.toFixed(1)}</span>
		<span class="text-gray-400 text-xs leading-none">/ 6.0</span>
		<span class="hidden md:inline text-[10px] text-gray-400 leading-none ml-0.5">score</span>
	</div>

	<!-- Credits chip — hidden on xs -->
	<div class="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1.5 flex-shrink-0">
		<svg class="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
		</svg>
		<span class="text-amber-700 font-bold text-xs leading-none">{mockUser.credits}</span>
		<span class="hidden md:inline text-amber-400 text-[10px] leading-none">credits</span>
	</div>

	<!-- User info -->
	<div class="flex items-center gap-2 flex-shrink-0">
		<!-- Avatar -->
		<div class="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
			<span class="text-white font-bold text-sm">{mockUser.firstName[0]}</span>
		</div>
		<!-- Name + level — hidden on mobile -->
		<div class="hidden md:block leading-none">
			<p class="text-sm font-semibold text-gray-800">{mockUser.firstName}</p>
			<div class="flex items-center gap-1 mt-0.5">
				<span class="w-1.5 h-1.5 rounded-full {levelColors[mockUser.level] ?? 'bg-gray-400'}"></span>
				<span class="text-[10px] text-gray-400">{mockUser.level}</span>
			</div>
		</div>
		<!-- Plan badge — hidden on xs -->
		<span class="hidden sm:inline text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium capitalize">
			{mockUser.plan}
		</span>
	</div>
</header>

<!-- ─── Backdrop (mobile only) ───────────────────────────────────────────── -->
{#if sidebarOpen}
	<div
		class="lg:hidden fixed inset-0 z-40 bg-black/40"
		onclick={() => (sidebarOpen = false)}
		role="button"
		aria-label="Close menu"
		tabindex="-1"
	></div>
{/if}

<!-- ─── Layout body ───────────────────────────────────────────────────────── -->
<div class="flex min-h-screen bg-gray-50 pt-14">
	<Sidebar isOpen={sidebarOpen} onClose={() => (sidebarOpen = false)} />
	<main class="flex-1 min-h-screen transition-[margin] duration-300 {sidebarOpen ? 'lg:ml-60' : ''}">
		{@render children()}
	</main>
</div>
