<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { User } from '$lib/types';

	let {
		user,
		mobileOpen = false,
		onMobileClose
	}: {
		user: User;
		mobileOpen?: boolean;
		onMobileClose?: () => void;
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
			href: `${base}/tests`,
			label: 'Test History',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`
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

	const levelColors: Record<string, string> = {
		Beginner:     'bg-gray-400',
		Practitioner: 'bg-blue-500',
		Advanced:     'bg-brand-green',
		Expert:       'bg-purple-500',
		Master:       'bg-brand-pink'
	};

	function handleNavClick() {
		onMobileClose?.();
	}
</script>

<aside class="
	fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm
	transition-transform duration-300
	{mobileOpen ? 'translate-x-0' : '-translate-x-full'}
	lg:translate-x-0
">
	<!-- Logo + mobile close -->
	<div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
		<a href="{base}/" class="flex items-center gap-2" onclick={handleNavClick}>
			<div class="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
				<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
				</svg>
			</div>
			<div class="leading-none">
				<span class="font-black text-gray-900 text-lg tracking-tight">TST</span><span class="font-black text-brand-green text-lg tracking-tight">Prep</span>
			</div>
		</a>
		<button
			class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
			onclick={onMobileClose}
			aria-label="Close menu"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<!-- Score badge -->
	<div class="mx-3 mt-3 bg-brand-green-light rounded-xl p-3">
		<p class="text-xs text-gray-400 mb-1">Current Score</p>
		<div class="flex items-center justify-between">
			<p class="text-xl font-black text-brand-green">{user.currentScore.toFixed(1)} <span class="text-sm font-medium text-gray-400">/ 6.0</span></p>
			<div class="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center">
				<span class="text-white font-black text-sm">{user.currentScore.toFixed(1)}</span>
			</div>
		</div>
		<p class="text-xs text-gray-400 mt-1">Target: <span class="font-semibold text-gray-600">{user.targetScore.toFixed(1)}</span></p>
	</div>

	<!-- Credits -->
	<div class="mx-3 mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<div class="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
				<svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
				</svg>
			</div>
			<div>
				<p class="text-xs font-bold text-amber-700">{user.credits} Credits</p>
				<p class="text-[10px] text-amber-500 leading-none">AI feedback</p>
			</div>
		</div>
		<button class="text-[10px] font-semibold text-amber-600 hover:text-amber-800 transition-colors bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-lg">
			+ Get more
		</button>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
		{#each navItems as item}
			<a href={item.href} class="nav-link" class:active={item.href === activeHref} onclick={handleNavClick}>
				<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
					{@html item.icon}
				</svg>
				<span>{item.label}</span>
			</a>
		{/each}

		<div class="pt-3 pb-1">
			<p class="px-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Account</p>
		</div>

		{#if user.plan === 'free'}
			<div class="mx-0.5 bg-gradient-to-br from-brand-pink to-orange-400 rounded-xl p-3 text-white">
				<p class="text-xs font-bold mb-1">🚀 Go Premium</p>
				<p class="text-xs opacity-90 mb-2.5 leading-relaxed">Unlock all 15 tests + Score Builder courses</p>
				<button class="w-full bg-white text-brand-pink text-xs font-bold py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
					Upgrade Now
				</button>
			</div>
		{/if}
	</nav>

	<!-- User profile -->
	<div class="px-3 py-3 border-t border-gray-100">
		<div class="flex items-center gap-2.5">
			<div class="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
				<span class="text-white font-bold text-sm">{user.firstName[0]}</span>
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-sm font-semibold text-gray-800 truncate">{user.firstName}</p>
				<div class="flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 rounded-full {levelColors[user.level] ?? 'bg-gray-400'}"></span>
					<span class="text-xs text-gray-400">{user.level}</span>
				</div>
			</div>
			<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0">
				{user.plan}
			</span>
		</div>
	</div>
</aside>
