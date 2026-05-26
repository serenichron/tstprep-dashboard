<script lang="ts">
  	import SubmissionDashboard from '$lib/components/SubmissionDashboard.svelte';
  import SubmissionState from '$lib/state/SubmissionState.svelte';
  	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const client = new QueryClient();
	const state = new SubmissionState();
</script>

<svelte:head>
	<title>Submission History – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<QueryClientProvider {client}>
	<SubmissionDashboard {state}></SubmissionDashboard>
</QueryClientProvider>
