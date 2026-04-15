<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { getUpsell } from '$lib/userState.svelte';

	let {
		isOpen = true,
		onClose,
		onToggle
	}: {
		isOpen?: boolean;
		onClose?: () => void;
		onToggle?: () => void;
	} = $props();

	const navItems = [
		{
			href: `${base}/`,
			label: 'Dashboard',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`
		},
		{
			href: `${base}/library`,
			label: 'Content Library',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`
		},
		{
			href: `${base}/history`,
			label: 'Submission History',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />`
		},
		{
			href: `${base}/history2`,
			label: 'Results v2',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6m-3-3v6" />`
		},
		{
			href: `${base}/progress`,
			label: 'My Progress',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`
		}
	];

	// Fix: use exact match or startsWith(path + '/') to avoid /history matching /history2
	const activeHref = $derived.by(() => {
		const current = page.url.pathname.replace(base, '') || '/';
		for (const item of navItems) {
			const path = item.href.replace(base, '') || '/';
			const matches = path === '/'
				? current === '/'
				: current === path || current.startsWith(path + '/');
			if (matches) return item.href;
		}
		return '';
	});

	function handleNavClick() {
		onClose?.();
	}
</script>

<aside class="
	fixed top-14 bottom-0 left-0 bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm
	transition-all duration-300 overflow-hidden
	{isOpen
		? 'w-60 translate-x-0'
		: 'w-60 -translate-x-full lg:translate-x-0 lg:w-14'}
">
	<!-- Navigation -->
	<nav class="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
		{#each navItems as item}
			<a
				href={item.href}
				class="nav-link {isOpen ? '' : 'lg:justify-center lg:px-0 lg:py-3'}"
				class:active={item.href === activeHref}
				title={item.label}
				onclick={handleNavClick}
			>
				<svg class="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
					{@html item.icon}
				</svg>
				<span class="truncate {isOpen ? '' : 'lg:hidden'}">{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- Upgrade CTA — dynamic per plan, full when open, icon-only when collapsed -->
	{#if getUpsell()}
		{@const upsell = getUpsell()!}
		{#if isOpen}
			<div class="px-3 pb-3">
				<a href={upsell.href} target="_blank" rel="noopener noreferrer" class="block bg-gradient-to-br from-brand-pink to-orange-400 rounded-xl p-3 text-white no-underline hover:brightness-105 transition-all">
					<p class="text-xs font-bold mb-1">{upsell.headline}</p>
					<p class="text-xs opacity-90 mb-2.5 leading-relaxed">{upsell.body}</p>
					<span class="block w-full bg-white text-brand-pink text-xs font-bold py-1.5 rounded-lg text-center hover:bg-gray-50 transition-colors">
						{upsell.cta}
					</span>
				</a>
			</div>
		{:else}
			<div class="pb-3 px-2 hidden lg:block">
				<a href={upsell.href} target="_blank" rel="noopener noreferrer"
					class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-brand-pink to-orange-400 flex items-center justify-center cursor-pointer"
					title={upsell.headline}>
					<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 3l14 9-14 9V3z" />
					</svg>
				</a>
			</div>
		{/if}
	{/if}

	<!-- ─── Collapse / expand toggle (desktop only) ─── -->
	<button
		onclick={onToggle}
		class="hidden lg:flex items-center border-t border-gray-100 py-3 transition-colors hover:bg-gray-50 text-gray-400 hover:text-gray-600
			{isOpen ? 'px-4 gap-2' : 'justify-center px-0'}"
		aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
	>
		<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
			{#if isOpen}
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			{:else}
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			{/if}
		</svg>
		{#if isOpen}
			<span class="text-xs font-medium">Collapse</span>
		{/if}
	</button>
</aside>
