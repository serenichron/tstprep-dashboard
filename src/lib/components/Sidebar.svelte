<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import type { User } from '$lib/types';

	export let user: User;

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
			href: `${base}/progress`,
			label: 'My Progress',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`
		}
	];

	$: currentPath = $page.url.pathname;

	function isActive(href: string) {
		const path = href.replace(base, '') || '/';
		const current = currentPath.replace(base, '') || '/';
		if (path === '/') return current === '/';
		return current.startsWith(path);
	}

	const levelColors: Record<string, string> = {
		Beginner: 'bg-gray-400',
		Practitioner: 'bg-blue-500',
		Advanced: 'bg-brand-green',
		Expert: 'bg-purple-500',
		Master: 'bg-brand-pink'
	};

	$: levelColor = levelColors[user.level] ?? 'bg-gray-400';
</script>

<aside class="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm">
	<!-- Logo -->
	<div class="px-5 py-5 border-b border-gray-50">
		<a href="{base}/" class="flex items-center gap-2">
			<div class="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
				<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
				</svg>
			</div>
			<div>
				<span class="font-black text-gray-900 text-base tracking-tight">TST</span>
				<span class="font-black text-brand-green text-base tracking-tight">Prep</span>
			</div>
		</a>
	</div>

	<!-- Score badge -->
	<div class="mx-4 mt-4 bg-brand-green-light rounded-xl p-3 flex items-center gap-3">
		<div class="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
			<span class="text-white font-black text-sm">{user.currentScore.toFixed(1)}</span>
		</div>
		<div class="min-w-0">
			<p class="text-xs text-gray-500 leading-none mb-0.5">Current Score</p>
			<p class="text-sm font-bold text-brand-green leading-none">{user.currentScore.toFixed(1)} / 6.0</p>
			<p class="text-xs text-gray-400 mt-0.5">Target: {user.targetScore.toFixed(1)}</p>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
		{#each navItems as item}
			<a href={item.href} class="nav-link {isActive(item.href) ? 'active' : ''}">
				<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
					{@html item.icon}
				</svg>
				<span>{item.label}</span>
			</a>
		{/each}

		<!-- Divider -->
		<div class="pt-3 pb-1">
			<p class="px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Account</p>
		</div>

		{#if user.plan === 'free'}
			<div class="mx-1 bg-gradient-to-br from-brand-pink to-orange-400 rounded-xl p-3 text-white">
				<p class="text-xs font-bold mb-1">🚀 Go Premium</p>
				<p class="text-xs opacity-90 mb-2">Unlock all 15 tests + Score Builder courses</p>
				<button class="w-full bg-white text-brand-pink text-xs font-bold py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
					Upgrade Now
				</button>
			</div>
		{/if}
	</nav>

	<!-- User profile -->
	<div class="px-4 py-4 border-t border-gray-100">
		<div class="flex items-center gap-3">
			<div class="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
				<span class="text-white font-bold text-sm">{user.firstName[0]}</span>
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-sm font-semibold text-gray-800 truncate">{user.firstName}</p>
				<div class="flex items-center gap-1.5">
					<span class="w-2 h-2 rounded-full {levelColor}"></span>
					<span class="text-xs text-gray-400">{user.level}</span>
				</div>
			</div>
			<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium capitalize">
				{user.plan}
			</span>
		</div>
	</div>
</aside>
