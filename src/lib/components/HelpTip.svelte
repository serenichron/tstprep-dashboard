<script lang="ts">
	import { fade } from 'svelte/transition';

	let {
		text,
		placement = 'top'
	}: {
		text: string;
		placement?: 'top' | 'bottom';
	} = $props();

	let open = $state(false);
	let triggerEl: HTMLSpanElement | undefined = $state();
	let pos = $state({ x: 0, y: 0 });

	function updatePos() {
		if (!triggerEl) return;
		const r = triggerEl.getBoundingClientRect();
		pos = {
			x: r.left + r.width / 2,
			y: placement === 'top' ? r.top : r.bottom
		};
	}

	function show() {
		updatePos();
		open = true;
	}
	function hide() {
		open = false;
	}

	/* Outside-click handling (mobile tap-to-toggle). */
	$effect(() => {
		if (!open) return;
		const onDown = (e: MouseEvent) => {
			if (triggerEl && !triggerEl.contains(e.target as Node)) open = false;
		};
		const onScroll = () => updatePos();
		document.addEventListener('mousedown', onDown);
		window.addEventListener('scroll', onScroll, true);
		window.addEventListener('resize', onScroll);
		return () => {
			document.removeEventListener('mousedown', onDown);
			window.removeEventListener('scroll', onScroll, true);
			window.removeEventListener('resize', onScroll);
		};
	});

	/* Render the tooltip in document.body so it escapes any overflow:hidden ancestor. */
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}
</script>

<!-- Trigger: a span (not a button) so it can safely nest inside other buttons. -->
<span
	bind:this={triggerEl}
	role="button"
	tabindex="0"
	onclick={(e) => { e.stopPropagation(); open ? hide() : show(); }}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); open ? hide() : show(); } }}
	onmouseenter={show}
	onmouseleave={hide}
	onfocus={show}
	onblur={hide}
	aria-label="More info"
	class="inline-flex items-center justify-center w-3 h-3 translate-y-0.5 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full block" aria-hidden="true">
		<circle cx="12" cy="12" r="10" />
		<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
		<line x1="12" y1="17" x2="12.01" y2="17" />
	</svg>
</span>

{#if open}
	<div
		use:portal
		role="tooltip"
		class="fixed z-[300] w-[220px] px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-[11px] font-medium leading-snug shadow-[0_4px_16px_rgba(0,0,0,.25)] pointer-events-none normal-case tracking-normal"
		style="left:{pos.x}px; top:{pos.y}px; transform: translate(-50%, {placement === 'top' ? '-100%' : '0'}) translateY({placement === 'top' ? '-8px' : '8px'});"
		transition:fade={{ duration: 120 }}
	>
		{text}
		<span
			class="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45
				{placement === 'top' ? 'top-full -translate-y-1/2' : 'bottom-full translate-y-1/2'}"
			aria-hidden="true"
		></span>
	</div>
{/if}
