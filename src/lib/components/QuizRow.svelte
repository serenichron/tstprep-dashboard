<script lang="ts">
	import type { QuizSubmission } from '$lib/types';
	import { extractDateTime, formatScore, scoreColor } from '$lib/utils';
	import MarkButton from './MarkButton.svelte';

	let {
		quiz,
		onView,
		starred = false,
		feedback = null,
		onStarToggle,
		onFeedback
	}: {
		quiz: QuizSubmission;
		onView?: () => void;
		starred?: boolean;
		feedback?: 'up' | 'down' | null;
		onStarToggle?: () => void;
		onFeedback?: (kind: 'up' | 'down') => void;
	} = $props();

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

	<!-- Score + actions: one row on mobile, two separate flex items on desktop -->
	<div class="flex items-center gap-2 mt-3 md:mt-0 md:contents">
		<!-- Score bar + number -->
		<div class="flex items-center gap-2 flex-1 min-w-0 md:flex-initial md:gap-1.5 md:flex-[0_0_120px] md:order-2">
			{#if !scored}
				<div class="flex-1 md:flex-none md:w-[60px] h-[5px] rounded-full bg-[repeating-linear-gradient(90deg,_#e8e8e8_0px,_#e8e8e8_3px,_transparent_3px,_transparent_6px)]"></div>
				<span class="text-[12px] md:text-[11px] text-gray-400 italic">N/A</span>
			{:else}
				<div class="flex-1 md:flex-none md:w-[60px] h-[5px] rounded-full bg-gray-200 overflow-hidden">
					<div class="h-full rounded-full transition-[width] duration-500" style="width:{((band! - 1) / 5) * 100}%;background:{color}"></div>
				</div>
				<span class="text-sm md:text-xs font-bold min-w-[42px] md:min-w-[38px] text-right md:text-left whitespace-nowrap" style="color:{color}">{band!.toFixed(1)}/6</span>
			{/if}
		</div>
		<!-- Actions: View + mark icons -->
		<div class="flex items-center gap-1.5 flex-shrink-0 md:order-4">
			<button onclick={onView} class="py-1 px-3 md:px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer hover:bg-brand-green hover:text-white transition-colors whitespace-nowrap">
				View →
			</button>
			<MarkButton kind="star" active={starred} onclick={onStarToggle} />
			<MarkButton kind="up" active={feedback === 'up'} onclick={() => onFeedback?.('up')} />
			<MarkButton kind="down" active={feedback === 'down'} onclick={() => onFeedback?.('down')} />
		</div>
	</div>
</div>
