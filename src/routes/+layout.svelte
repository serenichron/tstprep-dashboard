<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { mockUser } from '$lib/data/content';
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar user={mockUser} currentPath={page.url.pathname} />
	<main class="flex-1 ml-60 min-h-screen">
		<slot />
	</main>
</div>
