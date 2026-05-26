<script lang="ts">
	import type SubmissionState from '$lib/state/SubmissionState.svelte';
	import type { QuizMode, QuizType } from '$lib/types';
	import QuizRow from './QuizRow.svelte';

	const {
		submissionState,
		type,
		mode,
		test,
		page,
		sortBy = 'date',
		sortDir = 'desc'
	}: {
		submissionState: SubmissionState;
		type: QuizType;
		mode?: QuizMode;
		test?: number;
		page: number;
		sortBy?: 'date' | 'score';
		sortDir?: 'asc' | 'desc';
	} = $props();

	const { data: submissions } = $derived(
		submissionState.fetchSubmissions({ type, mode, test, page, sortBy, sortDir })
	);
</script>

{#each submissions?.submissions as sub (sub.id)}
	<QuizRow
		quiz={sub}
		starred={false}
		feedback={null}
		onStarToggle={() => {}}
		onFeedback={() => {}}
	/>
{/each}
