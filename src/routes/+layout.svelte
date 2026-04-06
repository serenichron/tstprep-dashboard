<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { mockUser } from '$lib/data/content';
</script>

<div class="flex min-h-screen bg-gray-50">
	<Sidebar user={mockUser} />
	<main class="flex-1 ml-60 min-h-screen">
		<slot />
	</main>
</div>
