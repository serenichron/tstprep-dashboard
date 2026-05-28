<script lang="ts">
	import type { QuizSubmission } from '$lib/types';
	import { extractDateTime, formatScore, scoreColor } from '$lib/utils';
	import MarkButton from './MarkButton.svelte';

	let {
		quiz,
		starred = false,
		feedback = null,
		onStarToggle,
		onFeedback
	}: {
		quiz: QuizSubmission;
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

<!--
	Layout:
	- Mobile: card with 3 visual rows (header → chips → score+actions)
	- Desktop (md+): single-row CSS grid with fixed column widths so every row aligns
	  like a table. Wrapping groups use `md:contents` to flatten their children into
	  the grid.

	Desktop columns:
	  1. Test#        (70px)
	  2. Mode pill    (110px)
	  3. AI off pill  (60px, empty when not present)
	  4. Date · Time  (150px)
	  5. Chips        (1fr — flexible)
	  6. Score bar+number (115px)
	  7. Actions      (auto)
-->
<div
	class="bg-white rounded-xl ring-1 ring-gray-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] px-3.5 py-3
		md:grid md:[grid-template-columns:70px_110px_60px_150px_1fr_115px_auto] md:items-center md:gap-2.5
		md:px-5 md:py-2.5 transition-shadow hover:shadow-[0_3px_10px_rgba(0,0,0,.06)]"
>
	<!-- Header group: flex on mobile, contents (flatten into grid) on desktop -->
	<div class="flex items-center gap-1.5 flex-wrap min-w-0 md:contents">
		<span
			class="text-[11px] md:text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap md:justify-self-start"
		>
			Test #{quiz.test_number}
		</span>

		<span
			class="text-[10px] md:text-[9px] font-bold py-0.5 px-2.5 rounded-full uppercase tracking-[.4px] whitespace-nowrap md:justify-self-start
				{quiz.practice ? 'bg-[#f0a030]/10 text-[#c8920a]' : 'bg-brand-green/10 text-brand-green'}"
		>
			{quiz.practice ? 'Practice Mode' : 'Test Mode'}
		</span>

		{#if aiOff}
			<span
				class="text-[10px] md:text-[9px] font-medium py-0.5 px-2 rounded-full uppercase tracking-[.4px] bg-gray-100 text-gray-400 whitespace-nowrap md:justify-self-start"
			>
				AI off
			</span>
		{:else}
			<!-- Empty placeholder so the grid keeps its 3rd column aligned -->
			<span class="hidden md:block" aria-hidden="true"></span>
		{/if}

		<span
			class="text-[12px] md:text-xs text-gray-500 whitespace-nowrap ml-auto md:ml-0 md:justify-self-start"
		>
			{date} <span class="text-gray-300">·</span> {time}
		</span>
	</div>

	<!-- Detail chips (col 5 on desktop, flexible width) -->
	<div class="flex gap-1 flex-wrap mt-2 md:mt-0 md:min-w-0">
		{#if quiz.quiz_type === 'reading' || quiz.quiz_type === 'listening'}
			{#each quiz.info as { p, t }, i (i)}
				<span class="text-[11px] md:text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap bg-[#f4f7f5] text-gray-500">
					Part {i + 1}: <b>{p}/{t}</b>
				</span>
			{/each}
		{:else}
			{#each Object.entries(quiz.info) as [ty, { p, t }] (ty)}
				{@const ungraded = aiOff && ty !== 'ld_tstprep_build_a_sentence'}
				<span
					class="text-[11px] md:text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap {ungraded
						? 'bg-gray-50 text-gray-300'
						: 'bg-[#f4f7f5] text-gray-500'}"
				>
					{labels[ty]}: <b>{ungraded ? 'not graded' : p + '/' + t}</b>
				</span>
			{/each}
		{/if}
	</div>

	<!-- Score + actions wrapper: flex on mobile, contents on desktop -->
	<div class="flex items-center gap-2 mt-3 md:mt-0 md:contents">
		<!-- Score bar + number (col 6 on desktop) -->
		<div class="flex items-center gap-2 flex-1 min-w-0 md:gap-1.5 md:flex-initial">
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

		<!-- Actions: View + mark icons (col 7 on desktop) -->
		<div class="flex items-center gap-1.5 flex-shrink-0">
			<a
				href="?submission={quiz.id}"
				class="py-1 px-3 md:px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer hover:bg-brand-green hover:text-white transition-colors whitespace-nowrap"
			>
				View →
			</a>
			<MarkButton kind="star" active={starred} onclick={onStarToggle} />
			<MarkButton kind="up" active={feedback === 'up'} onclick={() => onFeedback?.('up')} />
			<MarkButton kind="down" active={feedback === 'down'} onclick={() => onFeedback?.('down')} />
		</div>
	</div>
</div>
