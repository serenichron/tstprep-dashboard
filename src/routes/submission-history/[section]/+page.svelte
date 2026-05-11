<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';

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
	const fmtScoreFull = (v: number | null | undefined) =>
		v === null || v === undefined ? null : fmtScore(v) + '/6';
	const fmtD = (iso: string) =>
		new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	const fmtT = (iso: string) =>
		new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	const scoreColor  = (v: number) => (v >= 5 ? '#00b189' : v >= 3.5 ? '#f0a030' : '#ff5859');
	const roundHalf   = (v: number) => Math.round(v * 2) / 2;

	/* ─── Section submission mock data ─── */
	/* Reading: 25 entries (tests 1–8)  |  Listening: 22 entries (tests 1–7)
	   Writing: 8 entries (tests 1–5)   |  Speaking: 7 entries (tests 1–5)   */
	const MOCK = [
		// ── Reading ──
		{ id:'r0',  section:'Reading', testNumber:1, mode:'test',     score:3.0, scoreAvailable:true,  date:'2025-12-15T09:00:00', details:{'Part 1':'7/12','Part 2':'6/12'} },
		{ id:'r1',  section:'Reading', testNumber:1, mode:'practice', score:3.0, scoreAvailable:true,  date:'2026-01-10T09:15:00', details:{'Part 1':'7/12','Part 2':'6/12'} },
		{ id:'r2',  section:'Reading', testNumber:1, mode:'test',     score:3.5, scoreAvailable:true,  date:'2026-01-20T11:30:00', details:{'Part 1':'8/12','Part 2':'7/12'} },
		{ id:'r3',  section:'Reading', testNumber:1, mode:'test',     score:4.0, scoreAvailable:true,  date:'2026-02-14T10:00:00', details:{'Part 1':'9/12','Part 2':'9/12'} },
		{ id:'r4',  section:'Reading', testNumber:2, mode:'test',     score:3.5, scoreAvailable:true,  date:'2026-01-28T13:00:00', details:{'Part 1':'8/12','Part 2':'7/12'} },
		{ id:'r5',  section:'Reading', testNumber:2, mode:'test',     score:4.0, scoreAvailable:true,  date:'2026-02-05T10:00:00', details:{'Part 1':'9/12','Part 2':'8/12'} },
		{ id:'r6',  section:'Reading', testNumber:2, mode:'practice', score:4.0, scoreAvailable:true,  date:'2026-02-12T14:00:00', details:{'Part 1':'9/12','Part 2':'9/12'} },
		{ id:'r7',  section:'Reading', testNumber:2, mode:'test',     score:4.5, scoreAvailable:true,  date:'2026-03-02T09:30:00', details:{'Part 1':'10/12','Part 2':'9/12'} },
		{ id:'r8',  section:'Reading', testNumber:3, mode:'test',     score:4.0, scoreAvailable:true,  date:'2026-02-18T14:20:00', details:{'Part 1':'10/12','Part 2':'8/12'} },
		{ id:'r9',  section:'Reading', testNumber:3, mode:'practice', score:3.5, scoreAvailable:true,  date:'2026-02-25T09:45:00', details:{'Part 1':'9/12','Part 2':'7/12'} },
		{ id:'r10', section:'Reading', testNumber:3, mode:'test',     score:4.5, scoreAvailable:true,  date:'2026-03-05T10:00:00', details:{'Part 1':'11/12','Part 2':'9/12'} },
		{ id:'r11', section:'Reading', testNumber:3, mode:'practice', score:4.0, scoreAvailable:true,  date:'2026-03-10T10:15:00', details:{'Part 1':'10/12','Part 2':'9/12'} },
		{ id:'r12', section:'Reading', testNumber:4, mode:'test',     score:4.0, scoreAvailable:true,  date:'2026-03-18T09:00:00', details:{'Part 1':'10/12','Part 2':'8/12'} },
		{ id:'r13', section:'Reading', testNumber:4, mode:'practice', score:4.0, scoreAvailable:true,  date:'2026-03-22T15:00:00', details:{'Part 1':'10/12','Part 2':'8/12'} },
		{ id:'r14', section:'Reading', testNumber:4, mode:'test',     score:4.5, scoreAvailable:true,  date:'2026-04-05T09:00:00', details:{'Part 1':'11/12','Part 2':'9/12'} },
		{ id:'r15', section:'Reading', testNumber:5, mode:'test',     score:4.5, scoreAvailable:true,  date:'2026-04-01T09:30:00', details:{'Part 1':'11/12','Part 2':'10/12'} },
		{ id:'r16', section:'Reading', testNumber:5, mode:'practice', score:4.0, scoreAvailable:true,  date:'2026-04-08T10:00:00', details:{'Part 1':'10/12','Part 2':'10/12'} },
		{ id:'r17', section:'Reading', testNumber:5, mode:'test',     score:5.0, scoreAvailable:true,  date:'2026-04-14T09:15:00', details:{'Part 1':'12/12','Part 2':'11/12'} },
		{ id:'r18', section:'Reading', testNumber:6, mode:'test',     score:4.5, scoreAvailable:true,  date:'2026-03-25T11:00:00', details:{'Part 1':'11/12','Part 2':'9/12'} },
		{ id:'r19', section:'Reading', testNumber:6, mode:'practice', score:4.0, scoreAvailable:true,  date:'2026-04-02T14:00:00', details:{'Part 1':'10/12','Part 2':'9/12'} },
		{ id:'r20', section:'Reading', testNumber:6, mode:'test',     score:5.0, scoreAvailable:true,  date:'2026-04-09T10:30:00', details:{'Part 1':'12/12','Part 2':'11/12'} },
		{ id:'r21', section:'Reading', testNumber:7, mode:'test',     score:5.0, scoreAvailable:true,  date:'2026-04-06T09:00:00', details:{'Part 1':'12/12','Part 2':'11/12'} },
		{ id:'r22', section:'Reading', testNumber:7, mode:'practice', score:4.5, scoreAvailable:true,  date:'2026-04-10T11:00:00', details:{'Part 1':'11/12','Part 2':'10/12'} },
		{ id:'r23', section:'Reading', testNumber:8, mode:'test',     score:5.0, scoreAvailable:true,  date:'2026-04-12T09:00:00', details:{'Part 1':'12/12','Part 2':'11/12'} },
		{ id:'r24', section:'Reading', testNumber:8, mode:'practice', score:4.5, scoreAvailable:true,  date:'2026-04-13T14:00:00', details:{'Part 1':'11/12','Part 2':'10/12'} },
		// ── Listening ──
		{ id:'l0',  section:'Listening', testNumber:1, mode:'test',     score:3.0, scoreAvailable:true, date:'2025-12-20T10:00:00', details:{'Part 1':'9/14','Part 2':'8/14'} },
		{ id:'l1',  section:'Listening', testNumber:1, mode:'practice', score:3.0, scoreAvailable:true, date:'2026-01-12T10:00:00', details:{'Part 1':'10/14','Part 2':'8/14'} },
		{ id:'l2',  section:'Listening', testNumber:1, mode:'test',     score:3.5, scoreAvailable:true, date:'2026-01-25T14:00:00', details:{'Part 1':'10/14','Part 2':'9/14'} },
		{ id:'l3',  section:'Listening', testNumber:1, mode:'test',     score:4.0, scoreAvailable:true, date:'2026-02-20T09:00:00', details:{'Part 1':'12/14','Part 2':'10/14'} },
		{ id:'l4',  section:'Listening', testNumber:2, mode:'practice', score:3.0, scoreAvailable:true, date:'2026-01-28T13:30:00', details:{'Part 1':'8/14','Part 2':'9/14'} },
		{ id:'l5',  section:'Listening', testNumber:2, mode:'test',     score:3.5, scoreAvailable:true, date:'2026-02-10T11:00:00', details:{'Part 1':'10/14','Part 2':'9/14'} },
		{ id:'l6',  section:'Listening', testNumber:2, mode:'practice', score:3.5, scoreAvailable:true, date:'2026-02-18T10:00:00', details:{'Part 1':'10/14','Part 2':'9/14'} },
		{ id:'l7',  section:'Listening', testNumber:2, mode:'test',     score:4.0, scoreAvailable:true, date:'2026-03-14T14:00:00', details:{'Part 1':'12/14','Part 2':'10/14'} },
		{ id:'l8',  section:'Listening', testNumber:3, mode:'test',     score:4.0, scoreAvailable:true, date:'2026-02-20T09:15:00', details:{'Part 1':'12/14','Part 2':'10/14'} },
		{ id:'l9',  section:'Listening', testNumber:3, mode:'practice', score:3.5, scoreAvailable:true, date:'2026-03-01T11:00:00', details:{'Part 1':'11/14','Part 2':'9/14'} },
		{ id:'l10', section:'Listening', testNumber:3, mode:'test',     score:4.5, scoreAvailable:true, date:'2026-03-20T09:00:00', details:{'Part 1':'13/14','Part 2':'11/14'} },
		{ id:'l11', section:'Listening', testNumber:4, mode:'practice', score:3.5, scoreAvailable:true, date:'2026-03-05T14:00:00', details:{'Part 1':'11/14','Part 2':'9/14'} },
		{ id:'l12', section:'Listening', testNumber:4, mode:'test',     score:4.0, scoreAvailable:true, date:'2026-03-15T10:30:00', details:{'Part 1':'12/14','Part 2':'10/14'} },
		{ id:'l13', section:'Listening', testNumber:4, mode:'test',     score:4.5, scoreAvailable:true, date:'2026-04-03T09:00:00', details:{'Part 1':'13/14','Part 2':'11/14'} },
		{ id:'l14', section:'Listening', testNumber:5, mode:'test',     score:4.0, scoreAvailable:true, date:'2026-03-15T10:30:00', details:{'Part 1':'12/14','Part 2':'11/14'} },
		{ id:'l15', section:'Listening', testNumber:5, mode:'practice', score:4.5, scoreAvailable:true, date:'2026-03-29T09:00:00', details:{'Part 1':'13/14','Part 2':'11/14'} },
		{ id:'l16', section:'Listening', testNumber:5, mode:'test',     score:4.5, scoreAvailable:true, date:'2026-04-08T10:00:00', details:{'Part 1':'13/14','Part 2':'12/14'} },
		{ id:'l17', section:'Listening', testNumber:6, mode:'test',     score:4.5, scoreAvailable:true, date:'2026-04-05T11:15:00', details:{'Part 1':'13/14','Part 2':'12/14'} },
		{ id:'l18', section:'Listening', testNumber:6, mode:'practice', score:4.0, scoreAvailable:true, date:'2026-04-10T14:00:00', details:{'Part 1':'12/14','Part 2':'11/14'} },
		{ id:'l19', section:'Listening', testNumber:6, mode:'test',     score:5.0, scoreAvailable:true, date:'2026-04-14T09:00:00', details:{'Part 1':'14/14','Part 2':'12/14'} },
		{ id:'l20', section:'Listening', testNumber:7, mode:'test',     score:5.0, scoreAvailable:true, date:'2026-04-07T10:00:00', details:{'Part 1':'14/14','Part 2':'13/14'} },
		{ id:'l21', section:'Listening', testNumber:7, mode:'practice', score:4.5, scoreAvailable:true, date:'2026-04-11T11:00:00', details:{'Part 1':'13/14','Part 2':'12/14'} },
		// ── Writing ──
		{ id:'wh0',  section:'Writing', testNumber:1, mode:'test',     score:5.0, scoreAvailable:true, date:'2024-08-10T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh1',  section:'Writing', testNumber:2, mode:'test',     score:5.0, scoreAvailable:true, date:'2024-08-24T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh2',  section:'Writing', testNumber:3, mode:'test',     score:5.5, scoreAvailable:true, date:'2024-09-07T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'5/5'} },
		{ id:'wh3',  section:'Writing', testNumber:4, mode:'test',     score:5.0, scoreAvailable:true, date:'2024-09-21T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh4',  section:'Writing', testNumber:5, mode:'test',     score:5.0, scoreAvailable:true, date:'2024-10-05T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh5',  section:'Writing', testNumber:6, mode:'test',     score:5.5, scoreAvailable:true, date:'2024-10-19T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'5/5'} },
		{ id:'wh6',  section:'Writing', testNumber:7, mode:'test',     score:5.0, scoreAvailable:true, date:'2024-11-02T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh7',  section:'Writing', testNumber:8, mode:'test',     score:6.0, scoreAvailable:true, date:'2024-11-16T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'5/5'} },
		{ id:'wh8',  section:'Writing', testNumber:1, mode:'practice', score:5.0, scoreAvailable:true, date:'2024-11-30T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh9',  section:'Writing', testNumber:2, mode:'practice', score:5.5, scoreAvailable:true, date:'2024-12-14T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'5/5'} },
		{ id:'wh10', section:'Writing', testNumber:3, mode:'test',     score:5.0, scoreAvailable:true, date:'2025-01-11T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh11', section:'Writing', testNumber:4, mode:'test',     score:5.5, scoreAvailable:true, date:'2025-01-25T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'5/5'} },
		{ id:'wh12', section:'Writing', testNumber:5, mode:'test',     score:5.0, scoreAvailable:true, date:'2025-02-08T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh13', section:'Writing', testNumber:6, mode:'test',     score:5.0, scoreAvailable:true, date:'2025-02-22T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'4/5'} },
		{ id:'wh14', section:'Writing', testNumber:7, mode:'test',     score:5.5, scoreAvailable:true, date:'2025-03-08T10:00:00', details:{'Build a Sentence':'10/10','Write an Email':'5/5','Academic Discussion':'5/5'} },
		{ id:'w0', section:'Writing', testNumber:1, mode:'test',     score:3.0,  scoreAvailable:true,  date:'2026-01-14T10:30:00', details:{'Build a Sentence':'6/10','Write an Email':'3/5','Academic Discussion':'2/5'} },
		{ id:'w1', section:'Writing', testNumber:1, mode:'practice', score:null, scoreAvailable:false, date:'2026-01-22T14:00:00', details:{'Build a Sentence':'7/10','Write an Email':'not graded','Academic Discussion':'not graded'} },
		{ id:'w2', section:'Writing', testNumber:2, mode:'test',     score:3.5,  scoreAvailable:true,  date:'2026-02-08T09:30:00', details:{'Build a Sentence':'7/10','Write an Email':'3/5','Academic Discussion':'3/5'} },
		{ id:'w3', section:'Writing', testNumber:3, mode:'test',     score:null, scoreAvailable:false, date:'2026-02-22T11:45:00', details:{'Build a Sentence':'8/10','Write an Email':'not graded','Academic Discussion':'not graded'} },
		{ id:'w4', section:'Writing', testNumber:3, mode:'practice', score:4.0,  scoreAvailable:true,  date:'2026-03-01T10:00:00', details:{'Build a Sentence':'8/10','Write an Email':'4/5','Academic Discussion':'3/5'} },
		{ id:'w5', section:'Writing', testNumber:4, mode:'test',     score:4.0,  scoreAvailable:true,  date:'2026-03-18T09:15:00', details:{'Build a Sentence':'9/10','Write an Email':'4/5','Academic Discussion':'3/5'} },
		{ id:'w6', section:'Writing', testNumber:5, mode:'test',     score:null, scoreAvailable:false, date:'2026-03-28T14:30:00', details:{'Build a Sentence':'9/10','Write an Email':'not graded','Academic Discussion':'not graded'} },
		{ id:'w7', section:'Writing', testNumber:5, mode:'practice', score:4.0,  scoreAvailable:true,  date:'2026-04-06T11:00:00', details:{'Build a Sentence':'9/10','Write an Email':'4/5','Academic Discussion':'4/5'} },
		// ── Speaking ──
		{ id:'s0', section:'Speaking', testNumber:1, mode:'test',     score:null, scoreAvailable:false, date:'2026-01-16T11:00:00', details:{'Listen and Repeat':'not graded','Take an Interview':'not graded'} },
		{ id:'s1', section:'Speaking', testNumber:2, mode:'practice', score:3.0,  scoreAvailable:true,  date:'2026-02-01T10:15:00', details:{'Listen and Repeat':'5/7','Take an Interview':'3/4'} },
		{ id:'s2', section:'Speaking', testNumber:2, mode:'test',     score:null, scoreAvailable:false, date:'2026-02-15T13:00:00', details:{'Listen and Repeat':'not graded','Take an Interview':'not graded'} },
		{ id:'s3', section:'Speaking', testNumber:3, mode:'test',     score:3.5,  scoreAvailable:true,  date:'2026-03-05T09:30:00', details:{'Listen and Repeat':'6/7','Take an Interview':'3/4'} },
		{ id:'s4', section:'Speaking', testNumber:4, mode:'practice', score:null, scoreAvailable:false, date:'2026-03-20T14:45:00', details:{'Listen and Repeat':'not graded','Take an Interview':'not graded'} },
		{ id:'s5', section:'Speaking', testNumber:5, mode:'test',     score:4.0,  scoreAvailable:true,  date:'2026-04-04T10:00:00', details:{'Listen and Repeat':'7/7','Take an Interview':'4/4'} },
		{ id:'s6',  section:'Speaking', testNumber:3, mode:'practice', score:3.5,  scoreAvailable:true,  date:'2026-04-10T09:00:00', details:{'Listen and Repeat':'6/7','Take an Interview':'3/4'} },
		// extra Speaking test-2 entries — demo for load-more
		{ id:'s7',  section:'Speaking', testNumber:2, mode:'test',     score:3.5,  scoreAvailable:true,  date:'2026-02-20T11:00:00', details:{'Listen and Repeat':'6/7','Take an Interview':'3/4'} },
		{ id:'s8',  section:'Speaking', testNumber:2, mode:'practice', score:3.0,  scoreAvailable:true,  date:'2026-03-01T10:00:00', details:{'Listen and Repeat':'5/7','Take an Interview':'3/4'} },
		{ id:'s9',  section:'Speaking', testNumber:2, mode:'test',     score:null, scoreAvailable:false, date:'2026-03-12T14:00:00', details:{'Listen and Repeat':'not graded','Take an Interview':'not graded'} },
		{ id:'s10', section:'Speaking', testNumber:2, mode:'test',     score:3.5,  scoreAvailable:true,  date:'2026-03-20T09:30:00', details:{'Listen and Repeat':'6/7','Take an Interview':'3/4'} },
		{ id:'s11', section:'Speaking', testNumber:2, mode:'practice', score:4.0,  scoreAvailable:true,  date:'2026-04-01T11:00:00', details:{'Listen and Repeat':'7/7','Take an Interview':'3/4'} },
		{ id:'s12', section:'Speaking', testNumber:2, mode:'test',     score:4.0,  scoreAvailable:true,  date:'2026-04-08T10:30:00', details:{'Listen and Repeat':'7/7','Take an Interview':'4/4'} },
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
		{ id:'ct1a', testNumber:1, date:'2026-01-18T10:00:00', duration:'1h 32m', scores:{Reading:3.5,Listening:3.5,Speaking:null,Writing:3.0}, composite:null },
		{ id:'ct1b', testNumber:1, date:'2026-03-10T09:30:00', duration:'1h 28m', scores:{Reading:4.0,Listening:3.5,Speaking:null,Writing:3.5}, composite:null },
		{ id:'ct2a', testNumber:2, date:'2026-02-12T11:00:00', duration:'1h 35m', scores:{Reading:4.0,Listening:3.5,Speaking:3.0,Writing:3.5}, composite:roundHalf((4.0+3.5+3.0+3.5)/4) },
		{ id:'ct2b', testNumber:2, date:'2026-03-29T10:15:00', duration:'1h 31m', scores:{Reading:4.5,Listening:4.0,Speaking:3.5,Writing:4.0}, composite:roundHalf((4.5+4.0+3.5+4.0)/4) },
		{ id:'ct3a', testNumber:3, date:'2026-02-25T14:00:00', duration:'1h 40m', scores:{Reading:4.0,Listening:4.0,Speaking:3.5,Writing:null}, composite:null },
		{ id:'ct3b', testNumber:3, date:'2026-04-01T09:00:00', duration:'1h 33m', scores:{Reading:4.5,Listening:4.5,Speaking:4.0,Writing:4.0}, composite:roundHalf((4.5+4.5+4.0+4.0)/4) },
		{ id:'ct4a', testNumber:4, date:'2026-03-18T09:00:00', duration:'1h 29m', scores:{Reading:4.5,Listening:3.5,Speaking:null,Writing:4.0}, composite:null },
		{ id:'ct4b', testNumber:4, date:'2026-04-07T10:30:00', duration:'1h 26m', scores:{Reading:4.5,Listening:4.0,Speaking:4.0,Writing:4.0}, composite:roundHalf((4.5+4.0+4.0+4.0)/4) },
		{ id:'ct5a', testNumber:5, date:'2026-04-02T10:30:00', duration:'1h 27m', scores:{Reading:4.5,Listening:4.0,Speaking:4.0,Writing:null}, composite:null },
		{ id:'ct5b', testNumber:5, date:'2026-04-13T09:00:00', duration:'1h 25m', scores:{Reading:5.0,Listening:4.5,Speaking:4.0,Writing:4.0}, composite:roundHalf((5.0+4.5+4.0+4.0)/4) },
		{ id:'ct6a', testNumber:6, date:'2026-04-09T10:00:00', duration:'1h 30m', scores:{Reading:5.0,Listening:4.5,Speaking:4.0,Writing:4.5}, composite:roundHalf((5.0+4.5+4.0+4.5)/4) },
		{ id:'ct7a', testNumber:7, date:'2026-04-14T11:00:00', duration:'1h 28m', scores:{Reading:5.0,Listening:5.0,Speaking:4.5,Writing:4.5}, composite:roundHalf((5.0+5.0+4.5+4.5)/4) },
	];

	const SEC4: Sec4[] = ['Reading', 'Listening', 'Speaking', 'Writing'];

	/* ─── Icon paths ─── */
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

	/* ─── Trend helper ─── */
	function buildTrend(pts: { v: number }[], allTimeAvg?: number | null) {
		if (!pts || pts.length < 2) return null;
		const W = 180, H = 42, px = 4, py = 4;
		const mn = 0.5, mx = 6.5;
		const coords = pts.map((p, i) => ({
			x: px + (i / (pts.length - 1)) * (W - px * 2),
			y: py + (1 - (p.v - mn) / (mx - mn)) * (H - py * 2)
		}));
		const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
		const last10avg = pts.reduce((a, p) => a + p.v, 0) / pts.length;
		const diff  = allTimeAvg != null
			? roundHalf(last10avg - allTimeAvg)
			: roundHalf(pts[pts.length - 1].v - pts[0].v);
		const color = diff >= 0 ? '#00b189' : '#ff5859';
		return {
			W, H, coords, d, color,
			area: `${d}L${coords[coords.length - 1].x},${H}L${coords[0].x},${H}Z`,
			diffLabel: (diff >= 0 ? '+' : '') + fmtScore(diff)
		};
	}

	/* ─── State ─── */
	/* Note: 'Complete Tests' is hidden from the section selector pre-launch — feature still in dev.
	   Keep route handling intact so /submission-history/complete-tests still works for development. */
	const secs = ['Reading', 'Listening', 'Writing', 'Speaking'];
	const PAGE_SIZE  = 20;
	let mode       = $state<'all' | 'test' | 'practice'>('all');
	const sec      = $derived(SLUG_TO_NAME[page.params.section] ?? 'Reading');
	let testFilter = $state<number | 'all'>('all');
	let datePage   = $state(1);
	let modeOpen   = $state(false);
	let testOpen   = $state(false);
	let trendOpen  = $state(false);
	let trendHovIdx = $state<number | null>(null);

	const modeOptions = [
		{ value: 'all'      as const, label: 'All' },
		{ value: 'test'     as const, label: 'Test Mode' },
		{ value: 'practice' as const, label: 'Practice Mode' },
	];
	const testOptions: { value: number | 'all'; label: string }[] = [
		{ value: 'all', label: 'All' },
		...Array.from({length: 15}, (_, i) => ({ value: i + 1, label: String(i + 1) }))
	];
	const modeLabel = $derived(modeOptions.find(o => o.value === mode)!.label);
	const testLabel = $derived(testFilter === 'all' ? 'All' : String(testFilter));

	/* ─── Derived — section stats ─── */
	const data = $derived(MOCK.filter(s => mode === 'all' || s.mode === mode));

	const stats = $derived.by(() => {
		const o: Record<string, { avg: number | null; best: number | null; count: number; aiCount: number; trend: { v: number; date: string; testNumber: number }[] }> = {};
		secs.forEach(sc => {
			const all = data.filter(s => s.section === sc);
			const ws  = all.filter(s => s.scoreAvailable && s.score !== null);
			const avg  = ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null;
			const best = ws.length ? Math.max(...ws.map(s => s.score as number)) : null;
			const trend = [...ws].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => ({ v: s.score as number, date: s.date as string, testNumber: s.testNumber as number }));
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

	/* Card stats — mode-agnostic, includes per-mode avgs. Used by the header section cards
	   and overall gauge so they stay constant regardless of the mode filter applied to rows. */
	const cardStats = $derived.by(() => {
		const avgOf = (arr: { score: number | null; scoreAvailable: boolean }[]) => {
			const ws = arr.filter(s => s.scoreAvailable && s.score !== null);
			return ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null;
		};
		const o: Record<string, {
			avg: number | null; best: number | null; count: number;
			testAvg: number | null; testCount: number;
			practiceAvg: number | null; practiceCount: number;
		}> = {};
		secs.forEach(sc => {
			const all = MOCK.filter(s => s.section === sc);
			const ws  = all.filter(s => s.scoreAvailable && s.score !== null);
			const testArr = all.filter(s => s.mode === 'test');
			const pracArr = all.filter(s => s.mode === 'practice');
			o[sc] = {
				avg: ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null,
				best: ws.length ? Math.max(...ws.map(s => s.score as number)) : null,
				count: all.length,
				testAvg: avgOf(testArr), testCount: testArr.length,
				practiceAvg: avgOf(pracArr), practiceCount: pracArr.length,
			};
		});
		return o;
	});

	const allAvg   = $derived((['Reading','Listening','Writing','Speaking'] as const).map(s => cardStats[s].avg));
	const secAvg   = $derived(allAvg.every(v => v !== null) ? roundHalf((allAvg as number[]).reduce((a, b) => a + b, 0) / 4) : null);
	const genScore = $derived(secAvg);
	const genBest  = $derived((['Reading','Listening','Writing','Speaking'] as const).every(s => cardStats[s].best !== null)
		? roundHalf((['Reading','Listening','Writing','Speaking'] as const).reduce((a, s) => a + (cardStats[s].best as number), 0) / 4)
		: null);

	/* ─── Derived — section rows ─── */
	const rows = $derived(
		data.filter(s => s.section === sec)
			.sort((a, b) => a.testNumber !== b.testNumber ? a.testNumber - b.testNumber : new Date(b.date).getTime() - new Date(a.date).getTime())
	);
	const byDateRows = $derived([...rows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

	/* ─── Derived — complete test rows ─── */
	const ctData   = $derived(mode === 'practice' ? [] : COMPLETE);
	const ctByDate = $derived([...ctData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

	/* ─── Derived — test-number filter ─── */
	const filteredByDate   = $derived(testFilter === 'all' ? byDateRows : byDateRows.filter(s => s.testNumber === (testFilter as number)));
	const filteredCtByDate = $derived(testFilter === 'all' ? ctByDate   : ctByDate.filter(t => t.testNumber  === (testFilter as number)));

	/* ─── Derived — panel helpers ─── */
	const isComplete     = $derived(sec === 'Complete Tests');
	const needsAI        = $derived(sec === 'Writing' || sec === 'Speaking');
	const st             = $derived(stats[sec]);
	const trendAllPts    = $derived(testFilter === 'all' ? st.trend : st.trend.filter(p => p.testNumber === (testFilter as number)));
	const trendAllAvg    = $derived(trendAllPts.length ? roundHalf(trendAllPts.reduce((a, p) => a + p.v, 0) / trendAllPts.length) : null);
	const trendData      = $derived(buildTrend(trendAllPts.slice(-10), trendAllAvg));
	const trendPopupData = $derived.by(() => {
		const pts = trendAllPts.slice(-10);
		if (pts.length < 2) return null;
		const last10avg   = roundHalf(pts.reduce((a, p) => a + p.v, 0) / pts.length);
		const allTimeAvg  = trendAllAvg;
		const diff        = allTimeAvg !== null ? roundHalf(last10avg - allTimeAvg) : null;
		const color       = diff === null || diff >= 0 ? '#00b189' : '#ff5859';
		const CW = 400, CH = 160, pL = 32, pR = 14, pT = 16, pB = 32;
		const iW = CW - pL - pR, iH = CH - pT - pB;
		const mn = 0.5, mx = 6.5;
		const yFor = (v: number) => pT + (1 - (v - mn) / (mx - mn)) * iH;
		const coords = pts.map((p, i) => ({
			x: pL + (pts.length > 1 ? (i / (pts.length - 1)) * iW : iW / 2),
			y: yFor(p.v),
			v: p.v, date: p.date
		}));
		const d = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
		return {
			CW, CH, pL, pR, pT, pB,
			color, coords, d,
			area: `${d}L${coords.at(-1)!.x.toFixed(1)},${(CH - pB).toFixed(1)}L${coords[0].x.toFixed(1)},${(CH - pB).toFixed(1)}Z`,
			last10avg, allTimeAvg, diff,
			yLast10:  yFor(last10avg),
			yAllTime: allTimeAvg !== null ? yFor(allTimeAvg) : null,
			yTicks:   [1, 2, 3, 4, 5, 6].map(v => ({ v, y: yFor(v) })),
			lx1: pL, lx2: CW - pR,
		};
	});
	const gaugeScore     = $derived(genScore);
	const gaugeNA        = $derived(gaugeScore === null || gaugeScore === undefined);
	const gaugeColor     = $derived(gaugeNA ? '#ddd' : scoreColor(gaugeScore as number));
	const gaugeFillAngle = $derived(gaugeNA ? SA : SA + (((gaugeScore as number) - 1) / 5) * TA);
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
		const r  = data.filter(s => s.section === sec && s.testNumber === n);
		const sc = r.filter(s => s.scoreAvailable && s.score !== null);
		return {
			avg:  sc.length ? roundHalf(sc.reduce((a, s) => a + (s.score as number), 0) / sc.length) : null,
			best: sc.length ? Math.max(...sc.map(s => s.score as number)) : null,
		};
	});

	$effect(() => { void sec; testFilter = 'all'; });
	$effect(() => { void sec; void mode; void testFilter; datePage = 1; });

	/* Scroll list back into view when paginating (smooth, respects scroll-margin-top on the list element) */
	let listEl = $state<HTMLDivElement | undefined>();
	function changePage(delta: number) {
		datePage += delta;
		listEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	/* Track when the original section bar is on/off screen, so the mobile sticky indicator
	   only shows once the original has scrolled out of view (and hides again when it returns). */
	let sectionBarEl = $state<HTMLDivElement | undefined>();
	let sectionBarVisible = $state(true);
	$effect(() => {
		if (!sectionBarEl) return;
		const observer = new IntersectionObserver(
			([entry]) => { sectionBarVisible = entry.isIntersecting; },
			{ rootMargin: '-56px 0px 0px 0px' } // account for fixed 56px global header
		);
		observer.observe(sectionBarEl);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Submission History – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div
	class="font-dmsans relative px-4 pb-5 md:px-8 md:pb-7 text-gray-800
		min-h-[calc(100vh-3.5rem)]
		bg-gray-50
		bg-[radial-gradient(55%_22%_at_100%_0%,rgba(0,177,137,0.11),transparent_70%),radial-gradient(50%_18%_at_0%_18%,rgba(0,177,137,0.07),transparent_70%),radial-gradient(60%_20%_at_100%_38%,rgba(0,177,137,0.08),transparent_70%),radial-gradient(55%_18%_at_0%_58%,rgba(0,177,137,0.06),transparent_70%),radial-gradient(50%_20%_at_100%_78%,rgba(0,177,137,0.07),transparent_70%),radial-gradient(60%_18%_at_0%_96%,rgba(0,177,137,0.06),transparent_70%)]"
>
	<!-- ─── Header (sticky only on md+, mobile lets it scroll away) ─── -->
	<div class="relative md:sticky md:top-14 z-40 bg-gray-50/75 backdrop-blur-md pt-2.5 px-4 -mx-4 mb-3.5 border-b border-gray-200/70 md:pt-3.5 md:px-8 md:-mx-8">
		<!-- Title row — compact on mobile, inline overall score chip -->
		<div class="flex items-center justify-between gap-2 mb-2 md:mb-2.5">
			<div class="min-w-0">
				<h1 class="text-base md:text-lg font-extrabold tracking-[-0.5px] leading-tight"><span class="text-brand-green">Submission</span> History</h1>
				<p class="hidden md:block text-[11px] text-gray-400 mt-px">Track your TOEFL 2026 scores across all sections</p>
			</div>
			<!-- Mobile-only inline overall chip -->
			<div class="md:hidden flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 shadow-[0_1px_3px_rgba(0,0,0,.05)] flex-shrink-0">
				<span class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Overall</span>
				<span class="text-sm font-extrabold leading-none" style="color:{gaugeNA ? '#d0d5dd' : gaugeColor}">{gaugeNA ? '—' : fmtScore(gaugeScore)}</span>
				<span class="text-[10px] text-gray-400 leading-none">/6</span>
			</div>
		</div>

		<!-- Score grid — 2-col on mobile & tablet (section cards only), 5-col on xl+ (with gauge) -->
		<div class="grid grid-cols-2 gap-2 xl:grid-cols-[0.72fr_repeat(4,1fr)] items-stretch pb-1">
			<!-- Overall Score — hero card, only shown when there's room for the 5-col layout -->
			<div class="hidden xl:flex relative rounded-xl bg-gradient-to-br from-brand-green-light via-white to-white shadow-[0_1px_4px_rgba(0,0,0,.05)] overflow-hidden flex-col items-center justify-center text-center px-3 py-3">
				<!-- subtle decorative ring in the corner -->
				<div class="pointer-events-none absolute -top-6 -right-6 w-16 h-16 rounded-full bg-brand-green/10"></div>

				<div class="text-[9px] font-bold text-brand-green-dark uppercase tracking-[.6px] mb-1 relative">Overall Avg</div>

				<!-- Gauge -->
				<div class="relative w-[88px] mx-auto">
					<svg viewBox="0 0 120 86" class="w-[88px] h-[63px] block">
						<path d={arcPath(SA, EA)} fill="none" stroke="#eaf2ee" stroke-width="10" stroke-linecap="round" />
						{#if !gaugeNA}
							<path d={arcPath(SA, gaugeFillAngle)} fill="none" stroke={gaugeColor} stroke-width="10" stroke-linecap="round" style="transition:all .6s ease" />
						{/if}
					</svg>
					<div class="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-baseline gap-0.5 leading-none whitespace-nowrap">
						<span class="text-[22px] font-extrabold tracking-[-1.2px]" style="color:{gaugeNA ? '#d0d5dd' : gaugeColor}">{gaugeNA ? '—' : fmtScore(gaugeScore)}</span>
						{#if !gaugeNA}<span class="text-[10px] font-semibold text-gray-400">/6</span>{/if}
					</div>
				</div>

				<!-- Best badge -->
				{#if gaugeBest !== null}
					<div class="inline-flex items-center gap-1 mt-1 px-2 py-[3px] rounded-full bg-white border border-brand-green/25 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
						<svg class="w-3 h-3 text-brand-green -translate-y-px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>
						<span class="text-[9px] uppercase tracking-[.4px] font-semibold text-gray-500">Best</span>
						<b class="text-[11px] font-extrabold text-brand-green leading-none">{fmtScore(gaugeBest)}</b>
					</div>
				{:else}
					<div class="text-[10px] text-gray-400 mt-1.5 italic">Need all 4 sections</div>
				{/if}
			</div>

			<!-- Section cards — green header + body, overlapping markers on a shared 1–6 ruler -->
			{#each secs as sc}
				{@const s = cardStats[sc]}
				{@const act = sec === sc}
				{@const pct = (v: number) => ((v - 1) / 5) * 100}
				<a
					href="{base}/submission-history/{NAME_TO_SLUG[sc]}"
					class="flex flex-col no-underline rounded-xl relative overflow-hidden cursor-pointer text-left transition-shadow duration-150 bg-white
						{act
							? 'ring-2 ring-brand-green ring-offset-2 ring-offset-gray-50 shadow-[0_6px_20px_rgba(0,177,137,.18)]'
							: 'shadow-[0_1px_4px_rgba(0,0,0,.05)] hover:shadow-[0_3px_10px_rgba(0,0,0,.1)]'}"
				>
					<!-- Green header strip -->
					<div class="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 {act ? 'bg-brand-green-dark' : 'bg-brand-green'}">
						<div class="w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-md flex items-center justify-center flex-shrink-0 bg-white/20 text-white">
							<svg class="w-[11px] h-[11px] md:w-[13px] md:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								{#each iconPaths[sc] as d}<path {d} />{/each}
								{#if sc === 'Speaking'}<line x1="12" x2="12" y1="19" y2="22" />{/if}
							</svg>
						</div>
						<span class="text-[11px] md:text-[12px] font-bold text-white truncate">{sc}</span>
						<span class="ml-auto text-[10px] text-white/75 flex-shrink-0">{s.count}<span class="hidden md:inline xl:hidden"> submission{s.count !== 1 ? 's' : ''}</span><span class="hidden xl:inline 2xl:hidden"> sub.</span><span class="hidden 2xl:inline"> submission{s.count !== 1 ? 's' : ''}</span></span>
					</div>

					<!-- Body -->
					<div class="flex flex-col flex-1 px-2.5 md:px-3 pt-2 pb-2 md:pt-2.5 md:pb-2.5">

					<!-- Hero avg + Best -->
					<div class="flex items-baseline gap-1 mb-2 md:mb-3 flex-wrap">
						<span class="text-[20px] md:text-[28px] font-extrabold tracking-[-1px] md:tracking-[-1.5px] leading-none" style="color:{s.avg === null ? '#d0d5dd' : '#1a1a1a'}">{s.avg === null ? '—' : fmtScore(s.avg)}</span>
						<span class="text-[10px] md:text-[12px] font-semibold text-gray-300 leading-none">/6</span>
						<span class="text-[8.5px] md:text-[9px] uppercase tracking-[.5px] text-gray-400 leading-none ml-0.5">avg</span>
						{#if s.best !== null}
							<span class="ml-auto inline-flex items-baseline gap-1 text-[10px] text-gray-400 leading-none">
								<svg class="w-3 h-3 text-brand-green self-center -translate-y-px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.3 5.8 22l2.4-8.1L2 9.4h7.6z"/></svg>
								<span>Best</span>
								<b class="text-[10.5px] md:text-[12px] font-bold" style="color:#00b189">{fmtScore(s.best)}</b>
							</span>
						{/if}
					</div>

					<!-- Shared 1–6 ruler with Test + Practice markers -->
					{#if s.testAvg !== null || s.practiceAvg !== null}
						<div class="mt-auto">
							<!-- Ruler rendered as SVG so every tick is pixel-crisp at the same width -->
							<div class="relative h-4">
								<svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
									<!-- baseline -->
									<line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#f3f4f6" stroke-width="1" vector-effect="non-scaling-stroke" />
									<!-- half-step ticks (1.5, 2.5, 3.5, 4.5, 5.5) -->
									{#each [1.5, 2.5, 3.5, 4.5, 5.5] as t}
										<line x1="{((t - 1) / 5) * 100}%" y1="38%" x2="{((t - 1) / 5) * 100}%" y2="62%" stroke="#e5e7eb" stroke-width="1" vector-effect="non-scaling-stroke" />
									{/each}
									<!-- integer ticks (1, 2, 3, 4, 5, 6) -->
									{#each [1, 2, 3, 4, 5, 6] as t}
										<line x1="{((t - 1) / 5) * 100}%" y1="22%" x2="{((t - 1) / 5) * 100}%" y2="78%" stroke="#d1d5db" stroke-width="1" vector-effect="non-scaling-stroke" />
									{/each}
								</svg>
								<!-- Practice marker (amber) -->
								{#if s.practiceAvg !== null}
									<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white bg-[#f0a030] shadow-[0_1px_3px_rgba(0,0,0,.25)]" style="left:{pct(s.practiceAvg)}%" title="Practice avg {fmtScore(s.practiceAvg)}/6"></div>
								{/if}
								<!-- Test marker (green) on top -->
								{#if s.testAvg !== null}
									<div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white bg-brand-green shadow-[0_1px_3px_rgba(0,0,0,.25)]" style="left:{pct(s.testAvg)}%" title="Test avg {fmtScore(s.testAvg)}/6"></div>
								{/if}
							</div>

							<!-- Legend with values -->
							<div class="flex items-center justify-between mt-1 md:mt-1.5 gap-1.5">
								<div class="flex items-center gap-1 min-w-0 leading-none">
									<span class="block w-[7px] h-[7px] rounded-full bg-brand-green flex-shrink-0 -translate-y-px"></span>
									<span class="text-[8.5px] uppercase tracking-[.4px] font-semibold text-gray-500">Test</span>
									<b class="text-[11px] font-extrabold" style="color:{s.testAvg === null ? '#d0d5dd' : '#00876c'}">{s.testAvg === null ? '—' : fmtScore(s.testAvg)}</b>
									<span class="hidden md:inline xl:hidden 2xl:inline text-[8px] uppercase tracking-[.4px] text-gray-400">avg</span>
								</div>
								<div class="flex items-center gap-1 min-w-0 leading-none">
									<span class="block w-[7px] h-[7px] rounded-full bg-[#f0a030] flex-shrink-0 -translate-y-px"></span>
									<span class="text-[8.5px] uppercase tracking-[.4px] font-semibold text-gray-500 truncate"><span class="hidden md:inline xl:hidden 2xl:inline">Practice</span><span class="md:hidden xl:inline 2xl:hidden">Prac</span></span>
									<b class="text-[11px] font-extrabold" style="color:{s.practiceAvg === null ? '#d0d5dd' : '#a87a08'}">{s.practiceAvg === null ? '—' : fmtScore(s.practiceAvg)}</b>
									<span class="hidden md:inline xl:hidden 2xl:inline text-[8px] uppercase tracking-[.4px] text-gray-400">avg</span>
								</div>
							</div>
						</div>
					{/if}
					</div>
				</a>
			{/each}
		</div>

		<!-- Section bar -->
		<div bind:this={sectionBarEl} class="flex items-center gap-2.5 pt-2 pb-2 border-t border-gray-200 mt-2 flex-wrap max-md:gap-y-2">
			<div class="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
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
			<button
				onclick={() => { if (trendData) { trendOpen = true; trendHovIdx = null; } }}
				disabled={!trendData}
				class="flex items-center gap-1.5 flex-shrink-0 bg-transparent border-0 py-1 px-1.5 -my-1 -mx-1.5 rounded-lg cursor-pointer transition-colors hover:enabled:bg-black/5 disabled:cursor-default"
				title="View progress chart"
			>
				{#if trendData}
					<svg width="72" height="22" viewBox="0 0 {trendData.W} {trendData.H}">
						<defs><linearGradient id="sbg2" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color={trendData.color} stop-opacity=".12" />
							<stop offset="100%" stop-color={trendData.color} stop-opacity="0" />
						</linearGradient></defs>
						<path d={trendData.area} fill="url(#sbg2)" />
						<path d={trendData.d} fill="none" stroke={trendData.color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
						{#each trendData.coords as c}
							<circle cx={c.x} cy={c.y} r="2" fill="#fff" stroke={trendData.color} stroke-width="1.4" />
						{/each}
					</svg>
					<span class="text-[11px] font-bold whitespace-nowrap" style="color:{trendData.color}">{trendData.diffLabel}</span>
				{:else}
					<span class="text-[10px] text-gray-300 italic">No trend yet</span>
				{/if}
			</button>
			<div class="w-px h-5 bg-gray-200 flex-shrink-0 max-md:hidden"></div>
			<div class="flex items-center gap-2 flex-shrink-0 max-md:basis-full max-md:justify-end">
				<!-- Test no. dropdown -->
				<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-[.4px] whitespace-nowrap">Test no.</span>
				<div class="relative">
					<button
						onclick={() => { testOpen = !testOpen; modeOpen = false; }}
						class="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] border-[1.5px] bg-white text-gray-700 text-[11px] font-semibold cursor-pointer transition-[border-color,box-shadow] duration-150 shadow-[0_1px_3px_rgba(0,0,0,.05)] whitespace-nowrap hover:border-gray-300 hover:bg-gray-50
							{testOpen ? 'border-brand-green shadow-[0_0_0_3px_rgba(0,177,137,.1)]' : 'border-gray-200'}"
					>
						{testLabel}
						<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
					</button>
					{#if testOpen}
						<div class="absolute top-[calc(100%+6px)] right-0 bg-white rounded-xl shadow-[0_6px_24px_rgba(0,0,0,.13)] border border-gray-100 min-w-[150px] overflow-hidden z-[100]">
							{#each testOptions as opt}
								<button
									onclick={() => { testFilter = opt.value; testOpen = false; }}
									class="block w-full px-3.5 py-[9px] border-0 bg-transparent text-xs cursor-pointer text-left transition-colors duration-100 hover:bg-gray-100
										{testFilter === opt.value ? 'font-bold text-brand-green bg-brand-green/5' : 'font-medium text-gray-700'}"
								>
									{opt.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<!-- Mode dropdown -->
				<span class="text-[10px] font-semibold text-gray-400 uppercase tracking-[.4px] whitespace-nowrap">Mode</span>
				<div class="relative">
					<button
						onclick={() => { modeOpen = !modeOpen; testOpen = false; }}
						class="inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] border-[1.5px] bg-white text-gray-700 text-[11px] font-semibold cursor-pointer transition-[border-color,box-shadow] duration-150 shadow-[0_1px_3px_rgba(0,0,0,.05)] whitespace-nowrap hover:border-gray-300 hover:bg-gray-50
							{modeOpen ? 'border-brand-green shadow-[0_0_0_3px_rgba(0,177,137,.1)]' : 'border-gray-200'}"
					>
						{modeLabel}
						<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
					</button>
					{#if modeOpen}
						<div class="absolute top-[calc(100%+6px)] right-0 bg-white rounded-xl shadow-[0_6px_24px_rgba(0,0,0,.13)] border border-gray-100 min-w-[150px] overflow-hidden z-[100]">
							{#each modeOptions as opt}
								<button
									onclick={() => { mode = opt.value; modeOpen = false; }}
									class="block w-full px-3.5 py-[9px] border-0 bg-transparent text-xs cursor-pointer text-left transition-colors duration-100 hover:bg-gray-100
										{mode === opt.value ? 'font-bold text-brand-green bg-brand-green/5' : 'font-medium text-gray-700'}"
								>
									{opt.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		{#if testOpen || modeOpen}
			<button
				type="button"
				class="fixed inset-0 z-[99] cursor-default"
				onclick={() => { testOpen = false; modeOpen = false; }}
				aria-label="Close dropdowns"
			></button>
		{/if}
	</div>

	<!-- Mobile-only floating section indicator — fades in once the original section bar leaves view -->
	{#if !sectionBarVisible}
		<div
			class="md:hidden fixed top-14 left-0 right-0 z-30 px-4 py-2 bg-gray-50/85 backdrop-blur-md border-b border-gray-200/70"
			transition:fade={{ duration: 180 }}
		>
			<div class="flex items-center gap-2">
				<div class="w-[22px] h-[22px] rounded-md bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						{#each iconPaths[sec] as d}<path {d} />{/each}
						{#if sec === 'Speaking'}<line x1="12" x2="12" y1="19" y2="22" />{/if}
					</svg>
				</div>
				<span class="text-[13px] font-bold text-gray-800">{sec}</span>
				<span class="text-gray-300 text-xs">·</span>
				<span class="text-[11px] text-gray-500">{isComplete ? filteredCtByDate.length : filteredByDate.length} {isComplete ? 'attempt' : 'submission'}{(isComplete ? filteredCtByDate.length : filteredByDate.length) !== 1 ? 's' : ''}</span>
			</div>
		</div>
	{/if}

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
				<div bind:this={listEl} class="flex flex-col gap-2 scroll-mt-20 md:scroll-mt-72">
					{#each pagedDateRows as sub}
						<!-- Mobile card / desktop row -->
						<div class="bg-white rounded-xl ring-1 ring-gray-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] px-3.5 py-3 md:flex md:items-center md:px-5 md:py-2.5 md:gap-3 md:flex-nowrap transition-shadow hover:shadow-[0_3px_10px_rgba(0,0,0,.06)]">
							<!-- Header: test# + mode chip + date -->
							<div class="flex items-center gap-1.5 flex-wrap min-w-0 md:w-[470px] md:flex-shrink-0 md:flex-nowrap">
								<span class="text-[11px] md:text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap">Test #{sub.testNumber}</span>
								<span class="text-[10px] md:text-[9px] font-bold py-px px-[7px] rounded-full uppercase tracking-[.4px] whitespace-nowrap
									{sub.mode==='test' ? 'bg-brand-green/10 text-brand-green' : 'bg-[#f0a030]/10 text-[#c8920a]'}">
									{sub.mode==='test'?'Test Mode':'Practice Mode'}
								</span>
								{#if !sub.scoreAvailable}
									<span class="text-[10px] md:text-[9px] font-medium py-px px-[7px] rounded-full uppercase tracking-[.4px] bg-gray-100 text-gray-400 whitespace-nowrap">AI off</span>
								{/if}
								<span class="text-[12px] md:text-xs text-gray-500 whitespace-nowrap ml-auto md:ml-0">{fmtD(sub.date)} <span class="text-gray-300">·</span> {fmtT(sub.date)}</span>
							</div>
							<!-- Detail chips -->
							<div class="flex gap-1 flex-wrap mt-2 md:mt-0 md:flex-1 md:min-w-0 md:order-3">
								{#each Object.entries(sub.details) as [k,v]}
									<span class="text-[11px] md:text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap
										{v==='not graded' ? 'bg-gray-50 text-gray-300' : 'bg-[#f4f7f5] text-gray-500'}">
										{k}: <b>{v}</b>
									</span>
								{/each}
							</div>
							<!-- Score + View row (mobile: full width row; desktop: fixed slot) -->
							<div class="flex items-center gap-2 mt-3 md:mt-0 md:gap-1.5 md:flex-[0_0_140px] md:order-2">
								{#if sub.score===null}
									<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-[repeating-linear-gradient(90deg,_#e8e8e8_0px,_#e8e8e8_3px,_transparent_3px,_transparent_6px)]"></div>
									<span class="text-[12px] md:text-[11px] text-gray-400 italic">N/A</span>
								{:else}
									<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-gray-200 overflow-hidden">
										<div class="h-full rounded-full transition-[width] duration-500" style="width:{((sub.score-1)/5)*100}%;background:{scoreColor(sub.score)}"></div>
									</div>
									<span class="text-sm md:text-xs font-bold min-w-[42px] md:min-w-[38px] text-right md:text-left" style="color:{scoreColor(sub.score)}">{fmtScoreFull(sub.score)}</span>
								{/if}
								<button class="md:hidden flex-shrink-0 py-1.5 px-3.5 rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-xs font-bold cursor-pointer hover:bg-brand-green hover:text-white transition-colors">
									View →
								</button>
							</div>
							<button class="hidden md:inline-block flex-shrink-0 py-1 px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-brand-green hover:text-white md:order-4">
								View →
							</button>
						</div>
					{/each}
				</div>
				{#if totalDatePages > 1}
					<div class="flex items-center justify-center gap-3 py-3 mt-3">
						<button disabled={datePage===1} onclick={() => changePage(-1)}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							← Prev
						</button>
						<span class="text-[11px] text-gray-400">Page {datePage} of {totalDatePages} · {filteredByDate.length} submissions</span>
						<button disabled={datePage===totalDatePages} onclick={() => changePage(1)}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							Next →
						</button>
					</div>
				{/if}
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
				<div bind:this={listEl} class="flex flex-col gap-2 scroll-mt-20 md:scroll-mt-72">
					{#each pagedCtRows as t}
						<div class="bg-white rounded-xl ring-1 ring-gray-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] px-3.5 py-3 md:flex md:items-center md:px-5 md:py-2.5 md:gap-3 md:flex-nowrap transition-shadow hover:shadow-[0_3px_10px_rgba(0,0,0,.06)]">
							<div class="flex items-center gap-1.5 flex-wrap min-w-0 md:w-[470px] md:flex-shrink-0 md:flex-nowrap">
								<span class="text-[11px] md:text-[10px] font-bold py-0.5 px-2 rounded-md bg-gray-100 text-gray-600 whitespace-nowrap">Test #{t.testNumber}</span>
								<span class="text-[11px] md:text-xs text-gray-400 whitespace-nowrap">{t.duration}</span>
								<span class="text-[12px] md:text-xs text-gray-500 whitespace-nowrap ml-auto md:ml-0">{fmtD(t.date)} <span class="text-gray-300">·</span> {fmtT(t.date)}</span>
							</div>
							<div class="flex gap-1 flex-wrap mt-2 md:mt-0 md:flex-1 md:min-w-0 md:order-3">
								{#each SEC4 as s}
									{@const v=t.scores[s]}
									<span class="text-[11px] md:text-[10px] font-bold py-0.5 px-[7px] rounded whitespace-nowrap" style="color:{v!==null?scoreColor(v):'#ccc'};background:{v!==null?scoreColor(v)+'18':'#f5f5f5'}">{s.slice(0,1)}: {v!==null?fmtScore(v):'—'}</span>
								{/each}
							</div>
							<div class="flex items-center gap-2 mt-3 md:mt-0 md:gap-1.5 md:flex-[0_0_140px] md:order-2">
								{#if t.composite!==null}
									<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-gray-200 overflow-hidden">
										<div class="h-full rounded-full transition-[width] duration-500" style="width:{((t.composite-1)/5)*100}%;background:{scoreColor(t.composite)}"></div>
									</div>
									<span class="text-sm md:text-xs font-bold min-w-[42px] md:min-w-[38px] text-right md:text-left" style="color:{scoreColor(t.composite)}">{fmtScoreFull(t.composite)}</span>
								{:else}
									<div class="flex-1 md:flex-none md:w-[70px] h-[5px] rounded-full bg-[repeating-linear-gradient(90deg,_#e8e8e8_0px,_#e8e8e8_3px,_transparent_3px,_transparent_6px)]"></div>
									<span class="text-[12px] md:text-[11px] text-gray-400 italic">Pending</span>
								{/if}
								<button class="md:hidden flex-shrink-0 py-1.5 px-3.5 rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-xs font-bold cursor-pointer hover:bg-brand-green hover:text-white transition-colors">
									View →
								</button>
							</div>
							<button class="hidden md:inline-block flex-shrink-0 py-1 px-[13px] rounded-full border-[1.5px] border-brand-green bg-transparent text-brand-green text-[11px] font-bold cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-brand-green hover:text-white md:order-4">
								View →
							</button>
						</div>
					{/each}
				</div>
				{#if totalCtPages > 1}
					<div class="flex items-center justify-center gap-3 py-3 mt-3">
						<button disabled={datePage===1} onclick={() => changePage(-1)}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							← Prev
						</button>
						<span class="text-[11px] text-gray-400">Page {datePage} of {totalCtPages} · {filteredCtByDate.length} attempts</span>
						<button disabled={datePage===totalCtPages} onclick={() => changePage(1)}
							class="py-[5px] px-3.5 rounded-lg border-[1.5px] border-gray-200 bg-white text-gray-700 text-xs font-semibold cursor-pointer transition-all duration-150 hover:enabled:border-brand-green hover:enabled:text-brand-green disabled:opacity-40 disabled:cursor-default">
							Next →
						</button>
					</div>
				{/if}
			{/if}
		{/if}
	</div>

	<div class="text-center py-3.5 text-[10px] text-gray-300">
		Scores follow the TOEFL 2026 scale (1–6){#if needsAI && !isComplete} · Non-AI submissions excluded from averages{/if}{#if isComplete} · Composite = average of all 4 section scores{/if}
	</div>
</div>

<!-- ─── Trend popup ──────────────────────────────────────────────────────── -->
{#if trendOpen && trendPopupData}
	{@const d = trendPopupData}
	<button
		type="button"
		class="fixed inset-0 z-[200] bg-black/25 backdrop-blur-sm cursor-default"
		onclick={() => { trendOpen = false; trendHovIdx = null; }}
		aria-label="Close trend"
	></button>
	<div class="fixed z-[201] bg-white rounded-[18px] shadow-[0_24px_64px_rgba(0,0,0,.18),0_4px_16px_rgba(0,0,0,.08)] w-[472px] max-w-[calc(100vw-32px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
		<!-- Header -->
		<div class="flex justify-between items-start p-[18px] pb-3.5 border-b border-gray-100">
			<div class="flex flex-col gap-[3px]">
				<span class="text-[15px] font-extrabold text-gray-900 tracking-[-0.3px]">{sec}</span>
				<span class="text-[11px] text-gray-400">Last {d.coords.length} scored submissions · progress vs baseline</span>
			</div>
			<button
				type="button"
				onclick={() => { trendOpen = false; trendHovIdx = null; }}
				aria-label="Close"
				class="w-7 h-7 rounded-lg border-0 bg-gray-100 text-gray-500 cursor-pointer flex items-center justify-center flex-shrink-0 transition-colors hover:bg-gray-200 hover:text-gray-700"
			>
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
			</button>
		</div>

		<!-- Chart -->
		<div class="px-4 pt-4 pb-1">
			<div class="relative inline-block">
				<svg width={d.CW} height={d.CH} style="display:block;overflow:visible">
					<defs>
						<linearGradient id="tpgrd" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color={d.color} stop-opacity=".13" />
							<stop offset="100%" stop-color={d.color} stop-opacity="0" />
						</linearGradient>
					</defs>

					{#each d.yTicks as t}
						<line x1={d.lx1} y1={t.y} x2={d.lx2} y2={t.y} stroke="#f0f0f0" stroke-width="1" />
						<text x={d.pL - 7} y={t.y + 3.5} text-anchor="end" font-size="9" fill="#ccc" font-family="DM Sans,sans-serif">{t.v}</text>
					{/each}

					{#if d.yAllTime !== null}
						<line x1={d.lx1} y1={d.yAllTime} x2={d.lx2} y2={d.yAllTime} stroke="#cbd5e1" stroke-width="1.3" stroke-dasharray="5,4" />
						<text x={d.lx2 + 5} y={d.yAllTime + 3.5} font-size="8.5" fill="#94a3b8" font-family="DM Sans,sans-serif" font-weight="600">{fmtScore(d.allTimeAvg)}</text>
					{/if}

					<line x1={d.lx1} y1={d.yLast10} x2={d.lx2} y2={d.yLast10} stroke={d.color} stroke-width="1.3" stroke-dasharray="5,4" opacity=".55" />
					<text x={d.lx2 + 5} y={d.yLast10 + 3.5} font-size="8.5" fill={d.color} font-family="DM Sans,sans-serif" font-weight="600">{fmtScore(d.last10avg)}</text>

					<path d={d.area} fill="url(#tpgrd)" />
					<path d={d.d} fill="none" stroke={d.color} stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />

					{#each d.coords as c, i}
						<circle
							cx={c.x} cy={c.y}
							r={trendHovIdx === i ? 5.5 : 3.5}
							fill={trendHovIdx === i ? d.color : '#fff'}
							stroke={d.color} stroke-width="2"
							style="cursor:pointer;transition:r .1s,fill .1s"
							role="img"
							aria-label="Data point {i + 1}: {fmtScore(c.v)} of 6"
							onmouseenter={() => trendHovIdx = i}
							onmouseleave={() => trendHovIdx = null}
						/>
					{/each}

					{#each d.coords as c, i}
						{#if i === 0 || i === d.coords.length - 1 || i === Math.floor((d.coords.length - 1) / 2)}
							<text x={c.x} y={d.CH - d.pB + 17} text-anchor="middle" font-size="8.5" fill="#bbb" font-family="DM Sans,sans-serif">
								{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
							</text>
						{/if}
					{/each}
				</svg>

				{#if trendHovIdx !== null}
					{@const c = d.coords[trendHovIdx]}
					<div class="absolute pointer-events-none -translate-x-1/2 -translate-y-[calc(100%+10px)] bg-gray-900 text-white rounded-lg py-1.5 px-2.5 text-[11px] whitespace-nowrap flex flex-col items-center gap-px z-10 font-dmsans" style="left:{c.x}px; top:{c.y}px">
						<b class="text-[13px] font-extrabold leading-[1.2]" style="color:{d.color}">{fmtScore(c.v)}/6</b>
						<span class="text-[10px] leading-[1.2] text-white/60">{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Legend -->
		<div class="flex items-center gap-3.5 py-3 px-[18px] border-t border-gray-100 flex-wrap">
			<div class="flex items-center gap-1.5 text-[11px] text-gray-500">
				<span class="inline-block w-5 h-0.5 rounded-sm flex-shrink-0 bg-slate-300"></span>
				All-time avg&nbsp;<b class="text-gray-800 font-bold">{fmtScore(d.allTimeAvg)}/6</b>
			</div>
			<div class="flex items-center gap-1.5 text-[11px] text-gray-500">
				<span class="inline-block w-5 h-0.5 rounded-sm flex-shrink-0" style="background:{d.color};opacity:.55"></span>
				Last {d.coords.length} avg&nbsp;<b class="font-bold" style="color:{d.color}">{fmtScore(d.last10avg)}/6</b>
			</div>
			{#if d.diff !== null}
				<div class="ml-auto text-[13px] font-extrabold tracking-[-0.4px]" style="color:{d.color}">
					{d.diff >= 0 ? '+' : ''}{fmtScore(d.diff)} vs baseline
				</div>
			{/if}
		</div>
	</div>
{/if}
