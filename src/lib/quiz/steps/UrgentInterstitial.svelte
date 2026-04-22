<script lang="ts">
	let { onContinue }: { onContinue: () => void } = $props();
</script>

<div class="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-5 flex gap-3">
	<svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
	</svg>
	<p class="text-xs text-orange-900 leading-relaxed">
		<strong class="font-semibold">Your test is coming up fast!</strong>
		With less than 3 weeks, you need focused, expert-guided preparation.
	</p>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
	<div class="border-2 border-brand-green rounded-xl p-4">
		<h3 class="text-sm font-semibold text-gray-900 mb-1">TOEFL Emergency Course</h3>
		<p class="text-xs text-gray-600 leading-relaxed mb-3">Fastest path to your best possible score. All 4 sections with proven strategies.</p>
		<a href="https://tstprep.com/sp/toefl-emergency-course/" target="_blank" rel="noopener noreferrer"
			class="block text-center bg-brand-green text-white text-xs font-semibold py-2 rounded-lg hover:bg-brand-green-dark transition-colors">
			Get Started →
		</a>
	</div>
	<div class="border-2 border-gray-200 rounded-xl p-4">
		<h3 class="text-sm font-semibold text-gray-900 mb-1">Private Lessons</h3>
		<p class="text-xs text-gray-600 leading-relaxed mb-3">1-on-1 with a TOEFL expert. Start with a $19 trial.</p>
		<a href="https://tstprep.com/sp/private-lessons-for-the-toefl-ibt/" target="_blank" rel="noopener noreferrer"
			class="block text-center bg-orange-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors">
			Book $19 Trial →
		</a>
	</div>
</div>

<div class="border-2 border-gray-200 bg-gray-50 rounded-xl p-4 mb-5">
	<h3 class="text-sm font-semibold text-gray-900 mb-1">TOEFL Score Builder</h3>
	<p class="text-xs text-gray-600 leading-relaxed mb-3">Best value for fast improvement — self-paced, all sections.</p>
	<a href="https://tstprep.com/sp/toefl-score-builder-program/" target="_blank" rel="noopener noreferrer"
		class="inline-block text-xs text-gray-600 font-semibold border border-gray-300 px-4 py-1.5 rounded-lg hover:border-gray-400 transition-colors">
		Learn More →
	</a>
</div>

<button
	onclick={onContinue}
	class="w-full text-xs text-gray-500 underline hover:text-gray-900 py-2 transition-colors"
>
	I have more time — continue the quiz →
</button>
