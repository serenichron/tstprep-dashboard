<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import QuizRow from '$lib/components/QuizRow.svelte';
	import TestRow from '$lib/components/TestRow.svelte';
	import type { QuizSubmission } from '$lib/types';
	import { formatScore } from '$lib/utils';
	import ProgressChart from '$lib/components/ProgressChart.svelte';
	import Select from '$lib/components/Select.svelte';
  	import SectionCard from '$lib/components/SectionCard.svelte';

	/* ─── URL ↔ section name ─── */
	const SLUG_TO_NAME: Record<string, string> = {
		'complete-tests': 'Complete Tests',
		'reading':        'Reading',
		'listening':      'Listening',
		'writing':        'Writing',
		'speaking':       'Speaking'
	};
	const NAME_TO_SLUG: Record<string, string> = {
		'Complete Tests': 'complete-tests',
		'Reading':        'reading',
		'Listening':      'listening',
		'Writing':        'writing',
		'Speaking':       'speaking'
	};

	/* ─── Helpers ─── */
	const fmtScore    = (v: number | null | undefined) =>
		v === null || v === undefined ? null : Number.isInteger(v) ? v + '.0' : String(v);
	const scoreColor  = (v: number) => (v >= 5 ? '#00b189' : v >= 3.5 ? '#f0a030' : '#ff5859');
	const roundHalf   = (v: number) => Math.round(v * 2) / 2;

	/* ─── Section submission mock data ─── */
	/* Reading: 25 entries (tests 1–8)  |  Listening: 22 entries (tests 1–7)
	   Writing: 8 entries (tests 1–5)   |  Speaking: 7 entries (tests 1–5)   */
	const MOCK: QuizSubmission[] = [
		// ── Reading ──
		{ id:'r0',   quiz_type:'reading',   test_number:1, practice:false, score:35, ai:null, created_at:'2025-12-15T09:00:00', info:[{p:7, t:12},{p:6 ,t:12}] },
		{ id:'r1',   quiz_type:'reading',   test_number:1, practice:true,  score:35, ai:null, created_at:'2026-01-10T09:15:00', info:[{p:7, t:12},{p:6 ,t:12}] },
		{ id:'r2',   quiz_type:'reading',   test_number:1, practice:false, score:46, ai:null, created_at:'2026-01-20T11:30:00', info:[{p:8, t:12},{p:7 ,t:12}] },
		{ id:'r3',   quiz_type:'reading',   test_number:1, practice:false, score:55, ai:null, created_at:'2026-02-14T10:00:00', info:[{p:9, t:12},{p:9 ,t:12}] },
		{ id:'r4',   quiz_type:'reading',   test_number:2, practice:false, score:46, ai:null, created_at:'2026-01-28T13:00:00', info:[{p:8, t:12},{p:7 ,t:12}] },
		{ id:'r5',   quiz_type:'reading',   test_number:2, practice:false, score:55, ai:null, created_at:'2026-02-05T10:00:00', info:[{p:9, t:12},{p:8 ,t:12}] },
		{ id:'r6',   quiz_type:'reading',   test_number:2, practice:true,  score:55, ai:null, created_at:'2026-02-12T14:00:00', info:[{p:9, t:12},{p:9 ,t:12}] },
		{ id:'r7',   quiz_type:'reading',   test_number:2, practice:false, score:66, ai:null, created_at:'2026-03-02T09:30:00', info:[{p:10,t:12},{p:9 ,t:12}] },
		{ id:'r8',   quiz_type:'reading',   test_number:3, practice:false, score:55, ai:null, created_at:'2026-02-18T14:20:00', info:[{p:10,t:12},{p:8 ,t:12}] },
		{ id:'r9',   quiz_type:'reading',   test_number:3, practice:true,  score:46, ai:null, created_at:'2026-02-25T09:45:00', info:[{p:9, t:12},{p:7 ,t:12}] },
		{ id:'r10',  quiz_type:'reading',   test_number:3, practice:false, score:66, ai:null, created_at:'2026-03-05T10:00:00', info:[{p:11,t:12},{p:9 ,t:12}] },
		{ id:'r11',  quiz_type:'reading',   test_number:3, practice:true,  score:55, ai:null, created_at:'2026-03-10T10:15:00', info:[{p:10,t:12},{p:9 ,t:12}] },
		{ id:'r12',  quiz_type:'reading',   test_number:4, practice:false, score:55, ai:null, created_at:'2026-03-18T09:00:00', info:[{p:10,t:12},{p:8 ,t:12}] },
		{ id:'r13',  quiz_type:'reading',   test_number:4, practice:true,  score:55, ai:null, created_at:'2026-03-22T15:00:00', info:[{p:10,t:12},{p:8 ,t:12}] },
		{ id:'r14',  quiz_type:'reading',   test_number:4, practice:false, score:66, ai:null, created_at:'2026-04-05T09:00:00', info:[{p:11,t:12},{p:9 ,t:12}] },
		{ id:'r15',  quiz_type:'reading',   test_number:5, practice:false, score:66, ai:null, created_at:'2026-04-01T09:30:00', info:[{p:11,t:12},{p:10,t:12}] },
		{ id:'r16',  quiz_type:'reading',   test_number:5, practice:true,  score:55, ai:null, created_at:'2026-04-08T10:00:00', info:[{p:10,t:12},{p:10,t:12}] },
		{ id:'r17',  quiz_type:'reading',   test_number:5, practice:false, score:75, ai:null, created_at:'2026-04-14T09:15:00', info:[{p:12,t:12},{p:11,t:12}] },
		{ id:'r18',  quiz_type:'reading',   test_number:6, practice:false, score:66, ai:null, created_at:'2026-03-25T11:00:00', info:[{p:11,t:12},{p:9 ,t:12}] },
		{ id:'r19',  quiz_type:'reading',   test_number:6, practice:true,  score:55, ai:null, created_at:'2026-04-02T14:00:00', info:[{p:10,t:12},{p:9 ,t:12}] },
		{ id:'r20',  quiz_type:'reading',   test_number:6, practice:false, score:75, ai:null, created_at:'2026-04-09T10:30:00', info:[{p:12,t:12},{p:11,t:12}] },
		{ id:'r21',  quiz_type:'reading',   test_number:7, practice:false, score:75, ai:null, created_at:'2026-04-06T09:00:00', info:[{p:12,t:12},{p:11,t:12}] },
		{ id:'r22',  quiz_type:'reading',   test_number:7, practice:true,  score:66, ai:null, created_at:'2026-04-10T11:00:00', info:[{p:11,t:12},{p:10,t:12}] },
		{ id:'r23',  quiz_type:'reading',   test_number:8, practice:false, score:75, ai:null, created_at:'2026-04-12T09:00:00', info:[{p:12,t:12},{p:11,t:12}] },
		{ id:'r24',  quiz_type:'reading',   test_number:8, practice:true,  score:66, ai:null, created_at:'2026-04-13T14:00:00', info:[{p:11,t:12},{p:10,t:12}] },
		// ── Listening ──
		{ id:'l0',   quiz_type:'listening', test_number:1, practice:false, score:35, ai:null, created_at:'2025-12-20T10:00:00', info:[{p:9, t:14},{p:8, t:14}] },
		{ id:'l1',   quiz_type:'listening', test_number:1, practice:true,  score:35, ai:null, created_at:'2026-01-12T10:00:00', info:[{p:10,t:14},{p:8, t:14}] },
		{ id:'l2',   quiz_type:'listening', test_number:1, practice:false, score:46, ai:null, created_at:'2026-01-25T14:00:00', info:[{p:10,t:14},{p:9, t:14}] },
		{ id:'l3',   quiz_type:'listening', test_number:1, practice:false, score:55, ai:null, created_at:'2026-02-20T09:00:00', info:[{p:12,t:14},{p:10,t:14}] },
		{ id:'l4',   quiz_type:'listening', test_number:2, practice:true,  score:35, ai:null, created_at:'2026-01-28T13:30:00', info:[{p:8, t:14},{p:9, t:14}] },
		{ id:'l5',   quiz_type:'listening', test_number:2, practice:false, score:46, ai:null, created_at:'2026-02-10T11:00:00', info:[{p:10,t:14},{p:9, t:14}] },
		{ id:'l6',   quiz_type:'listening', test_number:2, practice:true,  score:46, ai:null, created_at:'2026-02-18T10:00:00', info:[{p:10,t:14},{p:9, t:14}] },
		{ id:'l7',   quiz_type:'listening', test_number:2, practice:false, score:55, ai:null, created_at:'2026-03-14T14:00:00', info:[{p:12,t:14},{p:10,t:14}] },
		{ id:'l8',   quiz_type:'listening', test_number:3, practice:false, score:55, ai:null, created_at:'2026-02-20T09:15:00', info:[{p:12,t:14},{p:10,t:14}] },
		{ id:'l9',   quiz_type:'listening', test_number:3, practice:true,  score:46, ai:null, created_at:'2026-03-01T11:00:00', info:[{p:11,t:14},{p:9, t:14}] },
		{ id:'l10',  quiz_type:'listening', test_number:3, practice:false, score:66, ai:null, created_at:'2026-03-20T09:00:00', info:[{p:13,t:14},{p:11,t:14}] },
		{ id:'l11',  quiz_type:'listening', test_number:4, practice:true,  score:46, ai:null, created_at:'2026-03-05T14:00:00', info:[{p:11,t:14},{p:9, t:14}] },
		{ id:'l12',  quiz_type:'listening', test_number:4, practice:false, score:55, ai:null, created_at:'2026-03-15T10:30:00', info:[{p:12,t:14},{p:10,t:14}] },
		{ id:'l13',  quiz_type:'listening', test_number:4, practice:false, score:66, ai:null, created_at:'2026-04-03T09:00:00', info:[{p:13,t:14},{p:11,t:14}] },
		{ id:'l14',  quiz_type:'listening', test_number:5, practice:false, score:55, ai:null, created_at:'2026-03-15T10:30:00', info:[{p:12,t:14},{p:11,t:14}] },
		{ id:'l15',  quiz_type:'listening', test_number:5, practice:true,  score:66, ai:null, created_at:'2026-03-29T09:00:00', info:[{p:13,t:14},{p:11,t:14}] },
		{ id:'l16',  quiz_type:'listening', test_number:5, practice:false, score:66, ai:null, created_at:'2026-04-08T10:00:00', info:[{p:13,t:14},{p:12,t:14}] },
		{ id:'l17',  quiz_type:'listening', test_number:6, practice:false, score:66, ai:null, created_at:'2026-04-05T11:15:00', info:[{p:13,t:14},{p:12,t:14}] },
		{ id:'l18',  quiz_type:'listening', test_number:6, practice:true,  score:55, ai:null, created_at:'2026-04-10T14:00:00', info:[{p:12,t:14},{p:11,t:14}] },
		{ id:'l19',  quiz_type:'listening', test_number:6, practice:false, score:75, ai:null, created_at:'2026-04-14T09:00:00', info:[{p:14,t:14},{p:12,t:14}] },
		{ id:'l20',  quiz_type:'listening', test_number:7, practice:false, score:75, ai:null, created_at:'2026-04-07T10:00:00', info:[{p:14,t:14},{p:13,t:14}] },
		{ id:'l21',  quiz_type:'listening', test_number:7, practice:true,  score:66, ai:null, created_at:'2026-04-11T11:00:00', info:[{p:13,t:14},{p:12,t:14}] },
		// ── Writing ──
		{ id:'wh0',  quiz_type:'writing',   test_number:1, practice:false, score:75, ai:true,  created_at:'2024-08-10T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh1',  quiz_type:'writing',   test_number:2, practice:false, score:75, ai:true,  created_at:'2024-08-24T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh2',  quiz_type:'writing',   test_number:3, practice:false, score:86, ai:true,  created_at:'2024-09-07T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:5,t:5,c:1}} },
		{ id:'wh3',  quiz_type:'writing',   test_number:4, practice:false, score:75, ai:true,  created_at:'2024-09-21T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh4',  quiz_type:'writing',   test_number:5, practice:false, score:75, ai:true,  created_at:'2024-10-05T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh5',  quiz_type:'writing',   test_number:6, practice:false, score:86, ai:true,  created_at:'2024-10-19T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:5,t:5,c:1}} },
		{ id:'wh6',  quiz_type:'writing',   test_number:7, practice:false, score:75, ai:true,  created_at:'2024-11-02T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh7',  quiz_type:'writing',   test_number:8, practice:false, score:95, ai:true,  created_at:'2024-11-16T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:5,t:5,c:1}} },
		{ id:'wh8',  quiz_type:'writing',   test_number:1, practice:true,  score:75, ai:true,  created_at:'2024-11-30T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh9',  quiz_type:'writing',   test_number:2, practice:true,  score:86, ai:true,  created_at:'2024-12-14T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:5,t:5,c:1}} },
		{ id:'wh10', quiz_type:'writing',   test_number:3, practice:false, score:75, ai:true,  created_at:'2025-01-11T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh11', quiz_type:'writing',   test_number:4, practice:false, score:86, ai:true,  created_at:'2025-01-25T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:5,t:5,c:1}} },
		{ id:'wh12', quiz_type:'writing',   test_number:5, practice:false, score:75, ai:true,  created_at:'2025-02-08T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh13', quiz_type:'writing',   test_number:6, practice:false, score:75, ai:true,  created_at:'2025-02-22T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		{ id:'wh14', quiz_type:'writing',   test_number:7, practice:false, score:86, ai:true,  created_at:'2025-03-08T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:10,t:10,c:2},'ld_tstprep_write_an_email':{p:5,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:5,t:5,c:1}} },
		{ id:'w0',   quiz_type:'writing',   test_number:1, practice:false, score:35, ai:true,  created_at:'2026-01-14T10:30:00', info:{'ld_tstprep_build_a_sentence':{p:6, t:10,c:2},'ld_tstprep_write_an_email':{p:3,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:2,t:5,c:1}} },
		{ id:'w1',   quiz_type:'writing',   test_number:1, practice:true,  score:0,  ai:false, created_at:'2026-01-22T14:00:00', info:{'ld_tstprep_build_a_sentence':{p:7, t:10,c:2},'ld_tstprep_write_an_email':{p:0,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:0,t:5,c:1}} },
		{ id:'w2',   quiz_type:'writing',   test_number:2, practice:false, score:46, ai:true,  created_at:'2026-02-08T09:30:00', info:{'ld_tstprep_build_a_sentence':{p:7, t:10,c:2},'ld_tstprep_write_an_email':{p:3,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:3,t:5,c:1}} },
		{ id:'w3',   quiz_type:'writing',   test_number:3, practice:false, score:0,  ai:false, created_at:'2026-02-22T11:45:00', info:{'ld_tstprep_build_a_sentence':{p:8, t:10,c:2},'ld_tstprep_write_an_email':{p:0,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:0,t:5,c:1}} },
		{ id:'w5',   quiz_type:'writing',   test_number:4, practice:false, score:55, ai:true,  created_at:'2026-03-18T09:15:00', info:{'ld_tstprep_build_a_sentence':{p:9, t:10,c:2},'ld_tstprep_write_an_email':{p:4,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:3,t:5,c:1}} },
		{ id:'w4',   quiz_type:'writing',   test_number:3, practice:true,  score:55, ai:true,  created_at:'2026-03-01T10:00:00', info:{'ld_tstprep_build_a_sentence':{p:8, t:10,c:2},'ld_tstprep_write_an_email':{p:4,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:3,t:5,c:1}} },
		{ id:'w6',   quiz_type:'writing',   test_number:5, practice:false, score:0,  ai:false, created_at:'2026-03-28T14:30:00', info:{'ld_tstprep_build_a_sentence':{p:9, t:10,c:2},'ld_tstprep_write_an_email':{p:0,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:0,t:5,c:1}} },
		{ id:'w7',   quiz_type:'writing',   test_number:5, practice:true,  score:55, ai:true,  created_at:'2026-04-06T11:00:00', info:{'ld_tstprep_build_a_sentence':{p:9, t:10,c:2},'ld_tstprep_write_an_email':{p:4,t:5,c:1},'ld_tstprep_write_academic_discussion':{p:4,t:5,c:1}} },
		// ── Speaking ──
		{ id:'s0',   quiz_type:'speaking',  test_number:1, practice:false, score:0,  ai:false, created_at:'2026-01-16T11:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:0,t:5,c:1},'ld_tstprep_mock_speaking_interview':{p:0,t:5,c:1}} },
		{ id:'s1',   quiz_type:'speaking',  test_number:2, practice:true,  score:35, ai:true,  created_at:'2026-02-01T10:15:00', info:{'ld_tstprep_mock_speaking_repeat':{p:5,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s2',   quiz_type:'speaking',  test_number:2, practice:false, score:0,  ai:false, created_at:'2026-02-15T13:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:0,t:5,c:1},'ld_tstprep_mock_speaking_interview':{p:0,t:5,c:1}} },
		{ id:'s3',   quiz_type:'speaking',  test_number:3, practice:false, score:46, ai:true,  created_at:'2026-03-05T09:30:00', info:{'ld_tstprep_mock_speaking_repeat':{p:6,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s4',   quiz_type:'speaking',  test_number:4, practice:true,  score:0,  ai:false, created_at:'2026-03-20T14:45:00', info:{'ld_tstprep_mock_speaking_repeat':{p:0,t:5,c:1},'ld_tstprep_mock_speaking_interview':{p:0,t:5,c:1}} },
		{ id:'s5',   quiz_type:'speaking',  test_number:5, practice:false, score:55, ai:true,  created_at:'2026-04-04T10:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:7,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:4,t:4,c:4}} },
		{ id:'s6',   quiz_type:'speaking',  test_number:3, practice:true,  score:46, ai:true,  created_at:'2026-04-10T09:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:6,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s7',   quiz_type:'speaking',  test_number:2, practice:false, score:46, ai:true,  created_at:'2026-02-20T11:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:6,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s8',   quiz_type:'speaking',  test_number:2, practice:true,  score:35, ai:true,  created_at:'2026-03-01T10:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:5,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s9',   quiz_type:'speaking',  test_number:2, practice:false, score:0,  ai:false, created_at:'2026-03-12T14:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:0,t:5,c:1},'ld_tstprep_mock_speaking_interview':{p:0,t:5,c:1}} },
		{ id:'s10',  quiz_type:'speaking',  test_number:2, practice:false, score:46, ai:true,  created_at:'2026-03-20T09:30:00', info:{'ld_tstprep_mock_speaking_repeat':{p:6,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s11',  quiz_type:'speaking',  test_number:2, practice:true,  score:55, ai:true,  created_at:'2026-04-01T11:00:00', info:{'ld_tstprep_mock_speaking_repeat':{p:7,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:3,t:4,c:4}} },
		{ id:'s12',  quiz_type:'speaking',  test_number:2, practice:false, score:55, ai:true,  created_at:'2026-04-08T10:30:00', info:{'ld_tstprep_mock_speaking_repeat':{p:7,t:7,c:7},'ld_tstprep_mock_speaking_interview':{p:4,t:4,c:4}} },
	];

	/* ─── Complete test mock data ─── */
	type Sec4 = 'Reading' | 'Listening' | 'Speaking' | 'Writing';
	interface CompleteSub {
		id: string;
		testNumber: number;
		date: string;
		duration: string;
		scores: Record<Sec4, number | null>;
		composite: number | null;
	}
	const COMPLETE: CompleteSub[] = [
		{ id:'ct1a', testNumber:1, date:'2026-01-18T10:00:00', duration:'1h 32m', scores:{Reading:46,Listening:46,Speaking:null,Writing:35  }, composite:null },
		{ id:'ct1b', testNumber:1, date:'2026-03-10T09:30:00', duration:'1h 28m', scores:{Reading:55,Listening:46,Speaking:null,Writing:46  }, composite:null },
		{ id:'ct2a', testNumber:2, date:'2026-02-12T11:00:00', duration:'1h 35m', scores:{Reading:55,Listening:46,Speaking:35,  Writing:46  }, composite:Math.round((55+46+35+46)/4) },
		{ id:'ct2b', testNumber:2, date:'2026-03-29T10:15:00', duration:'1h 31m', scores:{Reading:66,Listening:55,Speaking:46,  Writing:55  }, composite:Math.round((66+55+46+55)/4) },
		{ id:'ct3a', testNumber:3, date:'2026-02-25T14:00:00', duration:'1h 40m', scores:{Reading:55,Listening:55,Speaking:46,  Writing:null}, composite:null },
		{ id:'ct3b', testNumber:3, date:'2026-04-01T09:00:00', duration:'1h 33m', scores:{Reading:66,Listening:66,Speaking:55,  Writing:55  }, composite:Math.round((66+66+55+55)/4) },
		{ id:'ct4a', testNumber:4, date:'2026-03-18T09:00:00', duration:'1h 29m', scores:{Reading:66,Listening:46,Speaking:null,Writing:55  }, composite:null },
		{ id:'ct4b', testNumber:4, date:'2026-04-07T10:30:00', duration:'1h 26m', scores:{Reading:66,Listening:55,Speaking:55,  Writing:55  }, composite:Math.round((66+55+55+55)/4) },
		{ id:'ct5a', testNumber:5, date:'2026-04-02T10:30:00', duration:'1h 27m', scores:{Reading:66,Listening:55,Speaking:55,  Writing:null}, composite:null },
		{ id:'ct5b', testNumber:5, date:'2026-04-13T09:00:00', duration:'1h 25m', scores:{Reading:75,Listening:66,Speaking:55,  Writing:55  }, composite:Math.round((75+66+55+55)/4) },
		{ id:'ct6a', testNumber:6, date:'2026-04-09T10:00:00', duration:'1h 30m', scores:{Reading:75,Listening:66,Speaking:55,  Writing:66  }, composite:Math.round((75+66+55+66)/4) },
		{ id:'ct7a', testNumber:7, date:'2026-04-14T11:00:00', duration:'1h 28m', scores:{Reading:75,Listening:75,Speaking:66,  Writing:66  }, composite:Math.round((75+75+66+66)/4) },
	];

	const SEC4: Sec4[] = ['Reading', 'Listening', 'Speaking', 'Writing'];

	/* ─── Icons ─── */
	const iconPaths: Record<string, string[]> = {
		Reading:        ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
		Listening:      ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'],
		Writing:        ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'],
		Speaking:       ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2'],
		'Complete Tests': ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 8h.01M9 16h.01M13 12h3m-3 4h3'],
	};

	/* ─── Arc helpers (gauge) ─── */
	const arcPath = (sa: number, ea: number) => {
		const r = 46, cx = 60, cy = 54;
		const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
		const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
		return `M${x1},${y1}A${r},${r},0,${ea - sa > Math.PI ? 1 : 0},1,${x2},${y2}`;
	};
	const SA = Math.PI * 0.82;
	const EA = Math.PI * 2.18;
	const TA = EA - SA;

	/* ─── State ─── */
	const secs = ['Complete Tests', 'Reading', 'Listening', 'Writing', 'Speaking'];
	const PAGE_SIZE  = 20;
	let mode       = $state<'all' | 'test' | 'practice'>('all');
	const sec      = $derived(SLUG_TO_NAME[page.params.section!] ?? 'Reading');
	let testFilter = $state<number | 'all'>('all');
	let datePage   = $state(1);

	const modeOptions = [
		{ value: 'all'      as const, label: 'All' },
		{ value: 'test'     as const, label: 'Test Mode' },
		{ value: 'practice' as const, label: 'Practice Mode' },
	];
	const testOptions: { value: number | 'all'; label: string }[] = [
		{ value: 'all', label: 'All' },
		...Array.from({length: 15}, (_, i) => ({ value: i + 1, label: String(i + 1) }))
	];

	/* ─── Derived — section stats ─── */
	const data = $derived(MOCK.filter(s => mode === 'all' || (mode === 'practice' ? s.practice : !s.practice)));

	const stats = $derived.by(() => {
		const o: Record<string, { avg: number | null; best: number | null; count: number; aiCount: number; trend: { v: number; date: string; testNumber: number }[] }> = {};
		secs.filter(s => s !== 'Complete Tests').forEach(sc => {
			const all = data.filter(s => s.quiz_type === sc.toLowerCase());
			const ws  = all.filter(s => s.ai !== false && s.score !== 0);
			const avg  = ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null;
			const best = ws.length ? Math.max(...ws.map(s => s.score as number)) : null;
			const trend = [...ws].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(s => ({ v: s.score as number, date: s.created_at as string, testNumber: s.test_number as number }));
			o[sc] = { avg, best, count: all.length, aiCount: ws.length, trend };
		});
		const ctFiltered = mode === 'all' ? COMPLETE : mode === 'test' ? COMPLETE : [];
		const scored = ctFiltered.filter(t => t.composite !== null);
		const avg  = scored.length ? roundHalf(scored.reduce((a, t) => a + (t.composite as number), 0) / scored.length) : null;
		const best = scored.length ? Math.max(...scored.map(t => t.composite as number)) : null;
		const trend = [...scored].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => ({ v: t.composite as number, date: t.date as string, testNumber: t.testNumber as number }));
		o['Complete Tests'] = { avg, best, count: ctFiltered.length, aiCount: scored.length, trend };
		return o;
	});

	const allAvg   = $derived((['Reading','Listening','Writing','Speaking'] as const).map(s => stats[s].avg));
	const secAvg   = $derived(allAvg.every(v => v !== null) ? roundHalf((allAvg as number[]).reduce((a, b) => a + b, 0) / 4) : null);
	const ctAvg    = $derived(stats['Complete Tests'].avg);
	const genScore = $derived(
		secAvg !== null && ctAvg !== null ? roundHalf((secAvg + ctAvg) / 2) :
		secAvg !== null ? secAvg : null
	);
	const genBest  = $derived((['Reading','Listening','Writing','Speaking'] as const).every(s => stats[s].best !== null)
		? roundHalf((['Reading','Listening','Writing','Speaking'] as const).reduce((a, s) => a + (stats[s].best as number), 0) / 4)
		: null);

	/* ─── Derived — section rows ─── */
	const rows = $derived(
		data.filter(s => s.quiz_type === sec.toLowerCase())
			.sort((a, b) => a.test_number !== b.test_number ? a.test_number - b.test_number : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
	);
	const byDateRows = $derived([...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));

	/* ─── Derived — complete test rows ─── */
	const ctData   = $derived(mode === 'practice' ? [] : COMPLETE);
	const ctByDate = $derived([...ctData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

	/* ─── Derived — test-number filter ─── */
	const filteredByDate   = $derived(testFilter === 'all' ? byDateRows : byDateRows.filter(s => s.test_number === (testFilter as number)));
	const filteredCtByDate = $derived(testFilter === 'all' ? ctByDate   : ctByDate.filter(t => t.testNumber  === (testFilter as number)));

	/* ─── Derived — panel helpers ─── */
	const isComplete     = $derived(sec === 'Complete Tests');
	const needsAI        = $derived(sec === 'Writing' || sec === 'Speaking');
	const st             = $derived(stats[sec]);
	const trendData = $derived((testFilter === 'all' ? st.trend : st.trend.filter(p => p.testNumber === testFilter)).map(x => ({score:x.v,created_at:x.date})));
	const gaugeScore     = $derived(genScore);
	const gaugeNA        = $derived(gaugeScore === null || gaugeScore === undefined);
	const gaugeColor     = $derived(gaugeNA ? '#ddd' : scoreColor(gaugeScore as number));
	const gaugeFillAngle = $derived(gaugeNA ? SA : SA + (((formatScore(gaugeScore ?? 0) as number) - 1) / 5) * TA);
	const gaugeBest      = $derived(genBest);

	const pagedDateRows  = $derived(filteredByDate.slice((datePage - 1) * PAGE_SIZE, datePage * PAGE_SIZE));
	const totalDatePages = $derived(Math.ceil(filteredByDate.length / PAGE_SIZE) || 1);
	const pagedCtRows    = $derived(filteredCtByDate.slice((datePage - 1) * PAGE_SIZE, datePage * PAGE_SIZE));
	const totalCtPages   = $derived(Math.ceil(filteredCtByDate.length / PAGE_SIZE) || 1);

	const selectedTestStats = $derived.by(() => {
		if (testFilter === 'all') return null;
		const n = testFilter as number;
		if (isComplete) {
			const r  = ctData.filter(t => t.testNumber === n);
			const sc = r.filter(t => t.composite !== null);
			return {
				avg:  sc.length ? roundHalf(sc.reduce((a, t) => a + (t.composite as number), 0) / sc.length) : null,
				best: sc.length ? Math.max(...sc.map(t => t.composite as number)) : null,
			};
		}
		const r  = data.filter(s => s.quiz_type === sec.toLowerCase() && s.test_number === n);
		const sc = r.filter(s => s.ai !== false && s.score !== 0);
		return {
			avg:  sc.length ? roundHalf(sc.reduce((a, s) => a + (s.score as number), 0) / sc.length) : null,
			best: sc.length ? Math.max(...sc.map(s => s.score as number)) : null,
		};
	});

	$effect(() => { void sec; testFilter = 'all'; });
	$effect(() => { void sec; void mode; void testFilter; datePage = 1; });
</script>

<svelte:head>
	<title>Submission History – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="font-dmsans px-4 pb-5 md:px-8 md:pb-7 text-gray-800">
	<!-- ─── Sticky header ─── -->
	<div class="sticky top-14 z-40 bg-gray-50 pt-2.5 px-4 -mx-4 mb-3.5 border-b border-gray-200 md:pt-3.5 md:px-8 md:-mx-8">
		<div class="flex flex-col items-start gap-2.5 mb-2.5 md:flex-row md:justify-between md:items-center md:gap-2 flex-wrap">
			<div>
				<h1 class="text-lg font-extrabold tracking-[-0.5px]"><span class="text-brand-green">Submission</span> History</h1>
				<p class="text-[11px] text-gray-400 mt-px">Track your TOEFL 2026 scores across all sections</p>
			</div>
		</div>

		<!-- Score Overview: Overall gauge + 5 section cards -->
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 items-stretch">
			<!-- Overall Score gauge -->
			<div class="bg-white rounded-xl pt-2 pb-[7px] px-2.5 shadow-[0_1px_4px_rgba(0,0,0,.05)] relative overflow-hidden text-center">
				<div class="relative max-w-[68px] mx-auto">
					<svg viewBox="0 0 120 86" class="w-[68px] h-[49px] block">
						<path d={arcPath(SA, EA)} fill="none" stroke="#ebebeb" stroke-width="9" stroke-linecap="round" />
						{#if !gaugeNA}
							<path d={arcPath(SA, gaugeFillAngle)} fill="none" stroke={gaugeColor} stroke-width="9" stroke-linecap="round" style="transition:all .6s ease" />
						{/if}
						<text x="14" y="82" font-size="8" fill="#ccc" text-anchor="middle">1</text>
						<text x="106" y="82" font-size="8" fill="#ccc" text-anchor="middle">6</text>
					</svg>
					<div class="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-extrabold tracking-[-1px] leading-none whitespace-nowrap" style="color:{gaugeNA ? '#d0d5dd' : gaugeColor}">
						{gaugeNA ? '—' : formatScore(gaugeScore ?? 0).toFixed(1)}{#if !gaugeNA}<span class="text-[10px] font-semibold text-gray-400">/6</span>{/if}
					</div>
				</div>
				<div class="block text-[10px] font-bold text-gray-400 uppercase tracking-[.5px] mt-px">{isComplete ? 'Composite Avg' : 'Overall Avg'}</div>
				{#if gaugeBest !== null}
					<div class="text-[11px] text-gray-400 mt-0.5">Best <b class="text-brand-green">{formatScore(gaugeBest).toFixed(1)}/6</b></div>
				{:else}
					<div class="text-[10px] text-gray-300 mt-0.5">{isComplete ? 'No fully scored tests' : 'Need all 4 sections'}</div>
				{/if}
			</div>

			<!-- Section cards -->
			{#each secs as sc}
				{@const s = stats[sc]}
				{@const comp = sc === 'Complete Tests'}
				<SectionCard
					selected={sec}
					value={sc}
					variant={comp ? 'green' : 'white'}
					href={resolve(`/submission-history/${NAME_TO_SLUG[sc]}`)}
					label={sc}
					scoreLabel={comp ? 'comp' : 'avg'}
					score={s.avg !== null ? formatScore(s.avg) : null}
					bestScore={s.best !== null ? formatScore(s.best) : null}
					count={s.count}
				/>
			{/each}
		</div>

		<!-- Section bar -->
		<div class="flex items-center gap-2.5 pt-2 pb-2 border-t border-gray-200 mt-2">
			<div class="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
				<div class="w-[22px] h-[22px] rounded-md bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						{#each iconPaths[sec] as d}<path {d} />{/each}
						{#if sec === 'Speaking'}<line x1="12" x2="12" y1="19" y2="22" />{/if}
					</svg>
				</div>
				<span class="text-xs font-bold text-gray-800 whitespace-nowrap">{sec}</span>
				<span class="text-gray-300 text-xs">·</span>
				<span class="text-[11px] text-gray-400 whitespace-nowrap">
					{isComplete ? filteredCtByDate.length : filteredByDate.length}
					{isComplete ? 'attempt' : 'submission'}{(isComplete ? filteredCtByDate.length : filteredByDate.length) !== 1 ? 's' : ''}
				</span>
				{#if isComplete && st.aiCount < st.count}<span class="text-[11px] text-gray-400 whitespace-nowrap">· {st.aiCount} fully scored</span>{/if}
				{#if !isComplete && needsAI}<span class="text-[11px] text-gray-400 whitespace-nowrap">· {st.aiCount} AI-graded</span>{/if}
				{#if testFilter !== 'all' && selectedTestStats}
					<span class="text-gray-300 text-xs">·</span>
					<span class="text-[11px] text-gray-500 whitespace-nowrap">
						Test #{testFilter}
						{#if selectedTestStats.avg !== null}
							· Avg <b style="color:{scoreColor(selectedTestStats.avg)}">{fmtScore(selectedTestStats.avg)}/6</b>
							· Best <b style="color:{scoreColor(selectedTestStats.best!)}">{fmtScore(selectedTestStats.best!)}/6</b>
						{:else}
							· No scored submissions
						{/if}
					</span>
				{/if}
			</div>
			<ProgressChart quizzes={trendData} label={sec} />
			<div class="w-px h-5 bg-gray-200 flex-shrink-0"></div>
			<div class="flex items-center gap-2 flex-shrink-0">
				<Select label="Test no." bind:value={testFilter} options={testOptions} />
				<Select label="Mode" bind:value={mode} options={modeOptions} />
			</div>
		</div>
	</div>

	<!-- Detail Panel -->
	<div>
		<!-- ═══ SECTION VIEW (Reading / Listening / Writing / Speaking) ═══ -->
		{#if !isComplete}
			{#if filteredByDate.length === 0}
				<div class="py-11 px-5 text-center">
					<div class="text-3xl mb-1.5 opacity-40">📝</div>
					<div class="text-[13px] font-semibold text-gray-400">No {sec.toLowerCase()} submissions{testFilter !== 'all' ? ` for Test #${testFilter}` : ''}</div>
					<div class="text-[11px] text-gray-300 mt-0.5">Complete a practice test to see results here</div>
				</div>
			{:else}
				<div class="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04)] overflow-hidden">
					{#each pagedDateRows as sub, i (sub.id)}
						<QuizRow quiz={sub} index={i} />
					{/each}
					{#if totalDatePages > 1}
						<div class="flex items-center justify-center gap-3 py-3 px-5 border-t border-gray-100">
							<button disabled={datePage===1} onclick={() => datePage--}
								class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
								← Prev
							</button>
							<span class="text-[11px] text-gray-400">Page {datePage} of {totalDatePages} · {filteredByDate.length} submissions</span>
							<button disabled={datePage===totalDatePages} onclick={() => datePage++}
								class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
								Next →
							</button>
						</div>
					{/if}
				</div>
			{/if}

		<!-- ═══ COMPLETE TESTS VIEW ═══ -->
		{:else}
			{#if filteredCtByDate.length === 0}
				<div class="py-11 px-5 text-center">
					<div class="text-3xl mb-1.5 opacity-40">🗂️</div>
					<div class="text-[13px] font-semibold text-gray-400">No complete test attempts{testFilter !== 'all' ? ` for Test #${testFilter}` : ''}</div>
					<div class="text-[11px] text-gray-300 mt-0.5">Take a full 4-section practice test to see results here</div>
				</div>
			{:else}
				<div class="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,.04)] overflow-hidden">
					{#each pagedCtRows as t, i}
						<TestRow row={t} index={i} sections={SEC4} />
					{/each}
					{#if totalCtPages > 1}
						<div class="flex items-center justify-center gap-3 py-3 px-5 border-t border-gray-100">
							<button disabled={datePage===1} onclick={() => datePage--}
								class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
								← Prev
							</button>
							<span class="text-[11px] text-gray-400">Page {datePage} of {totalCtPages} · {filteredCtByDate.length} attempts</span>
							<button disabled={datePage===totalCtPages} onclick={() => datePage++}
								class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
								Next →
							</button>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</div>

	<div class="text-center py-3.5 text-[10px] text-gray-300">
		Scores follow the TOEFL 2026 scale (1–6){#if needsAI && !isComplete} · Non-AI submissions excluded from averages{/if}{#if isComplete} · Composite = average of all 4 section scores{/if}
	</div>
</div>
