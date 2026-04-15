<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let {
		isOpen = true,
		onClose
	}: {
		isOpen?: boolean;
		onClose?: () => void;
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

	const activeHref = $derived.by(() => {
		const current = page.url.pathname.replace(base, '') || '/';
		for (const item of navItems) {
			const path = item.href.replace(base, '') || '/';
			if (path === '/' ? current === '/' : current.startsWith(path)) return item.href;
		}
		return '';
	});

	function handleNavClick() {
		onClose?.();
	}
</script>

<aside class="
	fixed top-14 bottom-0 left-0 w-60 bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm
	transition-transform duration-300
	{isOpen ? 'translate-x-0' : '-translate-x-full'}
">
	<!-- Navigation -->
	<nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
		{#each navItems as item}
			<a href={item.href} class="nav-link" class:active={item.href === activeHref} onclick={handleNavClick}>
				<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
					{@html item.icon}
				</svg>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- Upgrade CTA -->
	<div class="px-3 pb-4">
		<div class="bg-gradient-to-br from-brand-pink to-orange-400 rounded-xl p-3 text-white">
			<p class="text-xs font-bold mb-1">🚀 Go Premium</p>
			<p class="text-xs opacity-90 mb-2.5 leading-relaxed">Unlock all 15 tests + Score Builder courses</p>
			<button class="w-full bg-white text-brand-pink text-xs font-bold py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
				Upgrade Now
			</button>
		</div>
	</div>
</aside>
