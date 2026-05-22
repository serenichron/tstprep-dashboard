<script lang="ts">
  import type SubmissionState from "$lib/state/SubmissionState.svelte";
  import type { QuizMode, QuizType } from "$lib/types";
    import QuizRow from "./QuizRow.svelte";
    const {
        submissionState,
        type,
        mode,
        test,
        page,
    }: {
        submissionState: SubmissionState,
        type: QuizType,
		mode?: QuizMode,
		test?: number,
		page: number,
    } = $props();
    const { data: submissions } = $derived(submissionState.fetchSubmissions({
		type,
		mode,
		test,
		page,
	}));
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
