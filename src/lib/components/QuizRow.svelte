<script lang="ts">
  import type { QuizSubmission } from "$lib/types";
  import { extractDateTime, formatScore } from "$lib/utils";
  import QuizProgressScore from "./QuizProgressScore.svelte";

	let { quiz, index }: { quiz: QuizSubmission; index: number } = $props();
	const score = $derived(formatScore(quiz.score ?? 0));
	const { date, time } = $derived(extractDateTime(quiz.created_at));
</script>

<div class="flex items-center px-5 py-[9px] border-b border-gray-100 text-xs gap-3 flex-nowrap max-md:px-3.5 max-md:gap-2 max-md:flex-wrap {index % 2 !== 0 ? 'bg-gray-50/40' : 'bg-white'}">
	<div class="flex items-center gap-1.5 flex-nowrap min-w-0 w-[470px] flex-shrink-0 max-md:w-full">
		<span class="text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap">Test #{quiz.test_number}</span>
		<span class="text-gray-500 whitespace-nowrap">{date} <span class="text-gray-300">·</span> {time}</span>
		<span class="text-[9px] font-bold py-px px-[7px] rounded-full uppercase tracking-[.4px]
			{quiz.practice ? 'bg-[#f0a030]/10 text-[#c8920a]' : 'bg-brand-green/10 text-brand-green'}">
			{quiz.practice ? 'Practice Mode' : 'Test Mode'}
		</span>
		{#if quiz.ai === false}
			<span class="text-[9px] font-medium py-px px-[7px] rounded-full uppercase tracking-[.4px] bg-gray-100 text-gray-400">AI off</span>
		{/if}
	</div>
	<div class="flex items-center gap-1.5 flex-[0_0_140px] max-md:flex-[0_0_120px] max-sm:flex-[0_0_100px]">
		<QuizProgressScore score={score} disabled={quiz.ai === false}/>
	</div>
	<div class="flex gap-1 flex-wrap flex-1 min-w-0 max-md:flex-[1_1_100%]">
		{#if quiz.quiz_type === 'reading' || quiz.quiz_type === 'listening'}
			{#each quiz.info as { p, t }, i (i)}
				<span class="text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap bg-[#f4f7f5] text-gray-500">Part {i + 1}: <b>{p}/{t}</b></span>
			{/each}
		{:else}
			{@const labels: Record<string, string> = {
				ld_tstprep_mock_speaking_repeat: 'Listen and Repeat',
				ld_tstprep_mock_speaking_interview: 'Take an Interview',
				ld_tstprep_build_a_sentence: 'Build a Sentence',
				ld_tstprep_write_an_email: 'Write an Email',
				ld_tstprep_write_academic_discussion: 'Academic Discussion',
			}}

			{#each Object.entries(quiz.info) as [ty, { p, t }] (ty)}
				{@const ungraded = !quiz.ai && ty !== 'ld_tstprep_build_a_sentence'}
				<span class="text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap {ungraded ? 'bg-gray-50 text-gray-300' : 'bg-[#f4f7f5] text-gray-500'}">
					{labels[ty]}: <b>{ungraded ? 'not graded' : p + '/' + t}</b>
				</span>
			{/each}
		{/if}
	</div>
	<a href="#" class="flex-shrink-0 py-1 px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-brand-green hover:text-white max-sm:py-[3px] max-sm:px-2.5 max-sm:text-[10px]">
		View →
	</a>
</div>
