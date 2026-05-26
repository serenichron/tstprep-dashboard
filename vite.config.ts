import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Force @tanstack/svelte-query through Vite's Svelte plugin so SSR can load
	// its .svelte files. Without this, Node's ESM loader errors with
	// "Unknown file extension '.svelte'" when prerendering or SSR'ing.
	ssr: {
		noExternal: ['@tanstack/svelte-query']
	}
});
