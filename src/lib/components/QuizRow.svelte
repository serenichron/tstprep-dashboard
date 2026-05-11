<script lang="ts">
	import type { QuizSubmission } from '$lib/types';
	import { extractDateTime, formatScore, scoreColor } from '$lib/utils';

	let { quiz, onView }: { quiz: QuizSubmission; onView?: () => void } = $props();

	const aiOff = $derived(quiz.ai === false);
	const scored = $derived(!aiOff && quiz.score > 0);
	const band = $derived(scored ? formatScore(quiz.score) : null);
	const color = $derived(band !== null ? scoreColor(band) : '#cbd5e1');
	const { date, time } = $derived(extractDateTime(quiz.created_at));

	const labels: Record<string, string> = {
		ld_tstprep_mock_speaking_repeat: 'Listen and Repeat',
		ld_tstprep_mock_speaking_interview: 'Take an Interview',
		ld_tstprep_build_a_sentence: 'Build a Sentence',
		ld_tstprep_write_an_email: 'Write an Email',
		ld_tstprep_write_academic_discussion: 'Academic Discussion'
	};
</script>

<!-- Mobile card / desktop row -->
<div class="bg-white rounded-xl ring-1 ring-gray-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] px-3.5 py-3 md:flex md:items-center md:px-5 md:py-2.5 md:gap-3 md:flex-nowrap transition-shadow hover:shadow-[0_3px_10px_rgba(0,0,0,.06)]">
	<!-- Header: test# + mode chip + (AI off) + date -->
	<div class="flex items-center gap-1.5 flex-wrap min-w-0 md:w-[470px] md:flex-shrink-0 md:flex-nowrap">
		<span class="text-[11px] md:text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap">Test #{quiz.test_number}</span>
		<span class="text-[10px] md:text-[9px] font-bold py-px px-[7px] rounded-full uppercase tracking-[.4px] whitespace-nowrap
			{quiz.practice ? 'bg-[#f0a030]/10 text-[#c8920a]' : 'bg-brand-green/10 text-brand-green'}">
			{quiz.practice ? 'Practice Mode' : 'Test Mode'}
		</span>
		{#if aiOff}
			<span class="text-[10px] md:text-[9px] font-medium py-px px-[7px] rounded-full uppercase tracking-[.4px] bg-gray-100 text-gray-400 whitespace-nowrap">AI off</span>
		{/if}
		<span class="text-[12px] md:text-xs text-gray-500 whitespace-nowrap ml-auto md:ml-0">{date} <span class="text-gray-300">·</span> {time}</span>
	</div>

	<!-- Detail chips -->
	<div class="flex gap-1 flex-wrap mt-2 md:mt-0 md:flex-1 md:min-w-0 md:order-3">
		{#if quiz.quiz_type === 'reading' || quiz.quiz_type === 'listening'}
			{#each quiz.info as { p, t }, i (i)}
				<span class="text-[11px] md:text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap bg-[#f4f7f5] text-gray-500">
					Part {i + 1}: <b>{p}/{t}</b>
				</span>
			{/each}
		{:else}
			{#each Object.entries(quiz.info) as [ty, { p, t }] (ty)}
				{@const ungraded = aiOff && ty !== 'ld_tstprep_build_a_sentence'}
				<span class="text-[11px] md:text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap {ungraded ? 'bg-gray-50 text-gray-300' : 'bg-[#f4f7f5] text-gray-500'}">
					{labels[ty]}: <b>{ungraded ? 'not graded' : p + '/' + t}</b>
				</span>
			{/each}
		{/if}
	</div>

	<!-- Score bar + score number (with mobile View button) -->
	<div class="flex items-center gap-2 mt-3 md:mt-0 md:gap-1.5 md:flex-[0_0_140px] md:order-2">
		{#if !scored}
			<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-[repeating-linear-gradient(90deg,_#e8e8e8_0px,_#e8e8e8_3px,_transparent_3px,_transparent_6px)]"></div>
			<span class="text-[12px] md:text-[11px] text-gray-400 italic">N/A</span>
		{:else}
			<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-gray-200 overflow-hidden">
				<div class="h-full rounded-full transition-[width] duration-500" style="width:{((band! - 1) / 5) * 100}%;background:{color}"></div>
			</div>
			<span class="text-sm md:text-xs font-bold min-w-[42px] md:min-w-[38px] text-right md:text-left" style="color:{color}">{band!.toFixed(1)}/6</span>
		{/if}
		<button onclick={onView} class="md:hidden flex-shrink-0 py-1.5 px-3.5 rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-xs font-bold cursor-pointer hover:bg-brand-green hover:text-white transition-colors">
			View →
		</button>
	</div>

	<!-- Desktop View button -->
	<button onclick={onView} class="hidden md:inline-block flex-shrink-0 py-1 px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-brand-green hover:text-white md:order-4">
		View →
	</button>
</div>
