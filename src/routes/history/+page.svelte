<script lang="ts">
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
	const secColors: Record<Sec4, string> = {
		Reading: '#3b82f6', Listening: '#8b5cf6', Speaking: '#f97316', Writing: '#ec4899'
	};

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
	const secs = ['Complete Tests', 'Reading', 'Listening', 'Writing', 'Speaking'];
	const PAGE_SIZE  = 20;
	let mode       = $state<'all' | 'test' | 'practice'>('all');
	let sec        = $state('Reading');
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
		const o: Record<string, { avg: number | null; best: number | null; count: number; aiCount: number; trend: { v: number; date: string }[] }> = {};
		secs.filter(s => s !== 'Complete Tests').forEach(sc => {
			const all = data.filter(s => s.section === sc);
			const ws  = all.filter(s => s.scoreAvailable && s.score !== null);
			const avg  = ws.length ? roundHalf(ws.reduce((a, s) => a + (s.score as number), 0) / ws.length) : null;
			const best = ws.length ? Math.max(...ws.map(s => s.score as number)) : null;
			const trend = [...ws].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(s => ({ v: s.score as number, date: s.date as string }));
			o[sc] = { avg, best, count: all.length, aiCount: ws.length, trend };
		});
		const ctFiltered = mode === 'all' ? COMPLETE : mode === 'test' ? COMPLETE : [];
		const scored = ctFiltered.filter(t => t.composite !== null);
		const avg  = scored.length ? roundHalf(scored.reduce((a, t) => a + (t.composite as number), 0) / scored.length) : null;
		const best = scored.length ? Math.max(...scored.map(t => t.composite as number)) : null;
		const trend = [...scored].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => ({ v: t.composite as number, date: t.date as string }));
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
	const trendData      = $derived(buildTrend(st.trend.slice(-10), st.avg));
	const trendPopupData = $derived.by(() => {
		const pts = st.trend.slice(-10);
		if (pts.length < 2) return null;
		const last10avg   = roundHalf(pts.reduce((a, p) => a + p.v, 0) / pts.length);
		const allTimeAvg  = st.avg;
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

	// Paginated date view (uses filtered rows)
	const pagedDateRows  = $derived(filteredByDate.slice((datePage - 1) * PAGE_SIZE, datePage * PAGE_SIZE));
	const totalDatePages = $derived(Math.ceil(filteredByDate.length / PAGE_SIZE) || 1);
	const pagedCtRows    = $derived(filteredCtByDate.slice((datePage - 1) * PAGE_SIZE, datePage * PAGE_SIZE));
	const totalCtPages   = $derived(Math.ceil(filteredCtByDate.length / PAGE_SIZE) || 1);

	// Stats for the selected test shown in the section bar
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

	// Reset testFilter when section changes; reset datePage when any filter changes
	$effect(() => { void sec; testFilter = 'all'; });
	$effect(() => { void sec; void mode; void testFilter; datePage = 1; });
</script>

<svelte:head>
	<title>Submission History – TST Prep</title>
	<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="dashboard">
	<!-- ─── Sticky header: title row + overview cards ─── -->
	<div class="sticky-header">
		<div class="header">
			<div>
				<h1><span class="green">Submission</span> History</h1>
				<p class="subtitle">Track your TOEFL 2026 scores across all sections</p>
			</div>
		</div>

		<!-- Score Overview: Overall gauge + 5 section cards (incl. Complete Tests) -->
		<div class="overview-row">
			<!-- Overall Score — gauge -->
			<div class="ov-card ov-gauge-card">
				<div class="ov-gw">
					<svg viewBox="0 0 120 86" class="ov-gsv">
						<path d={arcPath(SA, EA)} fill="none" stroke="#ebebeb" stroke-width="9" stroke-linecap="round" />
						{#if !gaugeNA}
							<path d={arcPath(SA, gaugeFillAngle)} fill="none" stroke={gaugeColor} stroke-width="9" stroke-linecap="round" style="transition:all .6s ease" />
						{/if}
						<text x="14" y="82" font-size="8" fill="#ccc" text-anchor="middle">1</text>
						<text x="106" y="82" font-size="8" fill="#ccc" text-anchor="middle">6</text>
					</svg>
					<div class="ov-gnum" style="color:{gaugeNA ? '#d0d5dd' : gaugeColor}">
						{gaugeNA ? '—' : fmtScore(gaugeScore)}{#if !gaugeNA}<span class="ov-gfrac">/6</span>{/if}
					</div>
				</div>
				<div class="ov-label">{isComplete ? 'Composite Avg' : 'Overall Avg'}</div>
				{#if gaugeBest !== null}
					<div class="ov-best">Best <b class="green">{fmtScore(gaugeBest)}/6</b></div>
				{:else}
					<div class="ov-hint">{isComplete ? 'No fully scored tests' : 'Need all 4 sections'}</div>
				{/if}
			</div>

			<!-- Section cards -->
			{#each secs as sc}
				{@const s = stats[sc]}
				{@const act = sec === sc}
				<button class="ov-card ov-sec" class:active={act} class:ov-complete={sc === 'Complete Tests'} onclick={() => (sec = sc)}>
					{#if act}<div class="ov-bar"></div>{/if}
					<div class="ov-head">
						<div class="ov-icon" class:active={act}>
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								{#each iconPaths[sc] as d}<path {d} />{/each}
								{#if sc === 'Speaking'}<line x1="12" x2="12" y1="19" y2="22" />{/if}
							</svg>
						</div>
						<span class="ov-name">{sc}</span>
					</div>
					<div class="ov-score-row">
						<span class="ov-val" style="color:{s.avg === null ? '#d0d5dd' : '#1a1a1a'}">{s.avg === null ? '—' : fmtScore(s.avg)}</span>
						{#if s.avg !== null}<span class="ov-denom">/6</span><span class="ov-unit">{sc === 'Complete Tests' ? 'comp' : 'avg'}</span>{/if}
					</div>
					<div class="ov-foot">
						<span>Best: <b style="color:{s.best === null ? '#ccc' : '#00b189'}">{s.best === null ? '—' : fmtScore(s.best)}</b></span>
						<span class="ov-count">{s.count}</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- Section bar: section info + sparkline (left) | dropdowns (right) -->
		<div class="section-bar">
			<div class="sb-left">
				<div class="sb-icon">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						{#each iconPaths[sec] as d}<path {d} />{/each}
						{#if sec === 'Speaking'}<line x1="12" x2="12" y1="19" y2="22" />{/if}
					</svg>
				</div>
				<span class="sb-name">{sec}</span>
				<span class="sb-dot">·</span>
				<span class="sb-count">
					{isComplete ? filteredCtByDate.length : filteredByDate.length}
					{isComplete ? 'attempt' : 'submission'}{(isComplete ? filteredCtByDate.length : filteredByDate.length) !== 1 ? 's' : ''}
				</span>
				{#if isComplete && st.aiCount < st.count}<span class="sb-ai">· {st.aiCount} fully scored</span>{/if}
				{#if !isComplete && needsAI}<span class="sb-ai">· {st.aiCount} AI-graded</span>{/if}
				{#if testFilter !== 'all' && selectedTestStats}
					<span class="sb-dot">·</span>
					<span class="sb-test-info">
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
			<button class="sb-trend" onclick={() => { if (trendData) { trendOpen = true; trendHovIdx = null; } }} disabled={!trendData} title="View progress chart">
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
					<span class="sb-diff" style="color:{trendData.color}">{trendData.diffLabel}</span>
				{:else}
					<span class="sb-no-trend">No trend yet</span>
				{/if}
			</button>
			<div class="sb-sep-v"></div>
			<div class="sb-right">
				<!-- Test no. dropdown -->
				<span class="sb-ctrl-label">Test no.</span>
				<div class="dd-wrap" class:open={testOpen}>
					<button class="dd-trigger" onclick={() => { testOpen = !testOpen; modeOpen = false; }}>
						{testLabel}
						<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
					</button>
					{#if testOpen}
						<div class="dd-panel">
							{#each testOptions as opt}
								<button class="dd-item" class:sel={testFilter === opt.value}
									onclick={() => { testFilter = opt.value; testOpen = false; }}>
									{opt.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<!-- Mode dropdown -->
				<span class="sb-ctrl-label">Mode</span>
				<div class="dd-wrap" class:open={modeOpen}>
					<button class="dd-trigger" onclick={() => { modeOpen = !modeOpen; testOpen = false; }}>
						{modeLabel}
						<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
					</button>
					{#if modeOpen}
						<div class="dd-panel">
							{#each modeOptions as opt}
								<button class="dd-item" class:sel={mode === opt.value}
									onclick={() => { mode = opt.value; modeOpen = false; }}>
									{opt.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		{#if testOpen || modeOpen}
			<div class="dd-backdrop" onclick={() => { testOpen = false; modeOpen = false; }}></div>
		{/if}
	</div>

	<!-- Detail Panel -->
	<div class="panel">

		<!-- ═══ SECTION VIEW (Reading / Listening / Writing / Speaking) ═══ -->
		{#if !isComplete}
			{#if filteredByDate.length === 0}
				<div class="empty"><div class="empty-icon">📝</div><div class="empty-title">No {sec.toLowerCase()} submissions{testFilter !== 'all' ? ` for Test #${testFilter}` : ''}</div><div class="empty-sub">Complete a practice test to see results here</div></div>
			{:else}
				<div class="date-list-card">
				{#each pagedDateRows as sub, i}
					<div class="sub-row" class:alt={i % 2 !== 0}>
						<div class="sub-info wide">
							<span class="test-pill">Test #{sub.testNumber}</span>
							<span class="sub-date">{fmtD(sub.date)} <span class="dot">·</span> {fmtT(sub.date)}</span>
							<span class="badge" class:test={sub.mode==='test'} class:practice={sub.mode==='practice'}>{sub.mode==='test'?'Test Mode':'Practice Mode'}</span>
							{#if !sub.scoreAvailable}<span class="badge ai-off">AI off</span>{/if}
						</div>
						<div class="sub-score">
							{#if sub.score===null}<div class="bar-na" style="width:70px;height:5px"></div><span class="na-label">N/A</span>
							{:else}<div class="bar-track" style="width:70px;height:5px"><div class="bar-fill" style="width:{((sub.score-1)/5)*100}%;background:{scoreColor(sub.score)}"></div></div><span class="score-val" style="color:{scoreColor(sub.score)}">{fmtScoreFull(sub.score)}</span>{/if}
						</div>
						<div class="sub-details">{#each Object.entries(sub.details) as [k,v]}<span class="detail-pill" class:ungraded={v==='not graded'}>{k}: <b>{v}</b></span>{/each}</div>
						<button class="view-btn-row">View →</button>
					</div>
				{/each}
				{#if totalDatePages > 1}
					<div class="pagination">
						<button class="pg-btn" disabled={datePage===1} onclick={() => datePage--}>← Prev</button>
						<span class="pg-info">Page {datePage} of {totalDatePages} · {filteredByDate.length} submissions</span>
						<button class="pg-btn" disabled={datePage===totalDatePages} onclick={() => datePage++}>Next →</button>
					</div>
				{/if}
				</div>
			{/if}

		<!-- ═══ COMPLETE TESTS VIEW ═══ -->
		{:else}
			{#if filteredCtByDate.length === 0}
				<div class="empty"><div class="empty-icon">🗂️</div><div class="empty-title">No complete test attempts{testFilter !== 'all' ? ` for Test #${testFilter}` : ''}</div><div class="empty-sub">Take a full 4-section practice test to see results here</div></div>
			{:else}
				<div class="date-list-card">
				{#each pagedCtRows as t, i}
					<div class="sub-row" class:alt={i % 2 !== 0}>
						<div class="sub-info wide">
							<span class="test-pill">Test #{t.testNumber}</span>
							<span class="sub-date">{fmtD(t.date)} <span class="dot">·</span> {fmtT(t.date)}</span>
							<span class="sub-date" style="color:#bbb">{t.duration}</span>
						</div>
						<div class="sec-chips">{#each SEC4 as s}{@const v=t.scores[s]}<span class="sec-chip" style="color:{v!==null?scoreColor(v):'#ccc'};background:{v!==null?scoreColor(v)+'18':'#f5f5f5'}">{s.slice(0,1)}: {v!==null?fmtScore(v):'—'}</span>{/each}</div>
						<div class="sub-score">
							{#if t.composite!==null}<div class="bar-track" style="width:70px;height:5px"><div class="bar-fill" style="width:{((t.composite-1)/5)*100}%;background:{scoreColor(t.composite)}"></div></div><span class="score-val" style="color:{scoreColor(t.composite)}">{fmtScoreFull(t.composite)}</span>
							{:else}<div class="bar-na" style="width:70px;height:5px"></div><span class="na-label">Pending</span>{/if}
						</div>
						<button class="view-btn-row">View →</button>
					</div>
				{/each}
				{#if totalCtPages > 1}
					<div class="pagination">
						<button class="pg-btn" disabled={datePage===1} onclick={() => datePage--}>← Prev</button>
						<span class="pg-info">Page {datePage} of {totalCtPages} · {filteredCtByDate.length} attempts</span>
						<button class="pg-btn" disabled={datePage===totalCtPages} onclick={() => datePage++}>Next →</button>
					</div>
				{/if}
				</div>
			{/if}
		{/if}
	</div>

	<div class="footer">
		Scores follow the TOEFL 2026 scale (1–6){#if needsAI && !isComplete} · Non-AI submissions excluded from averages{/if}{#if isComplete} · Composite = average of all 4 section scores{/if}
	</div>
</div>

<!-- ─── Trend popup ──────────────────────────────────────────────────────── -->
{#if trendOpen && trendPopupData}
	{@const d = trendPopupData}
	<div class="tp-backdrop" onclick={() => { trendOpen = false; trendHovIdx = null; }}></div>
	<div class="tp-popup">
		<!-- Header -->
		<div class="tp-head">
			<div class="tp-title">
				<span class="tp-sec-name">{sec}</span>
				<span class="tp-subtitle">Last {d.coords.length} scored submissions · progress vs baseline</span>
			</div>
			<button class="tp-close" onclick={() => { trendOpen = false; trendHovIdx = null; }}>
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
			</button>
		</div>

		<!-- Chart -->
		<div class="tp-chart-wrap">
			<div class="tp-chart-inner">
				<svg width={d.CW} height={d.CH} style="display:block;overflow:visible">
					<defs>
						<linearGradient id="tpgrd" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color={d.color} stop-opacity=".13" />
							<stop offset="100%" stop-color={d.color} stop-opacity="0" />
						</linearGradient>
					</defs>

					<!-- Grid lines + y-axis labels -->
					{#each d.yTicks as t}
						<line x1={d.lx1} y1={t.y} x2={d.lx2} y2={t.y} stroke="#f0f0f0" stroke-width="1" />
						<text x={d.pL - 7} y={t.y + 3.5} text-anchor="end" font-size="9" fill="#ccc" font-family="DM Sans,sans-serif">{t.v}</text>
					{/each}

					<!-- All-time avg reference line -->
					{#if d.yAllTime !== null}
						<line x1={d.lx1} y1={d.yAllTime} x2={d.lx2} y2={d.yAllTime} stroke="#cbd5e1" stroke-width="1.3" stroke-dasharray="5,4" />
						<text x={d.lx2 + 5} y={d.yAllTime + 3.5} font-size="8.5" fill="#94a3b8" font-family="DM Sans,sans-serif" font-weight="600">{fmtScore(d.allTimeAvg)}</text>
					{/if}

					<!-- Last-10 avg reference line -->
					<line x1={d.lx1} y1={d.yLast10} x2={d.lx2} y2={d.yLast10} stroke={d.color} stroke-width="1.3" stroke-dasharray="5,4" opacity=".55" />
					<text x={d.lx2 + 5} y={d.yLast10 + 3.5} font-size="8.5" fill={d.color} font-family="DM Sans,sans-serif" font-weight="600">{fmtScore(d.last10avg)}</text>

					<!-- Area + line -->
					<path d={d.area} fill="url(#tpgrd)" />
					<path d={d.d} fill="none" stroke={d.color} stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />

					<!-- Dots -->
					{#each d.coords as c, i}
						<circle
							cx={c.x} cy={c.y}
							r={trendHovIdx === i ? 5.5 : 3.5}
							fill={trendHovIdx === i ? d.color : '#fff'}
							stroke={d.color} stroke-width="2"
							style="cursor:pointer;transition:r .1s,fill .1s"
							onmouseenter={() => trendHovIdx = i}
							onmouseleave={() => trendHovIdx = null}
						/>
					{/each}

					<!-- X-axis date labels: first, mid, last -->
					{#each d.coords as c, i}
						{#if i === 0 || i === d.coords.length - 1 || i === Math.floor((d.coords.length - 1) / 2)}
							<text x={c.x} y={d.CH - d.pB + 17} text-anchor="middle" font-size="8.5" fill="#bbb" font-family="DM Sans,sans-serif">
								{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
							</text>
						{/if}
					{/each}
				</svg>

				<!-- Hover tooltip -->
				{#if trendHovIdx !== null}
					{@const c = d.coords[trendHovIdx]}
					<div class="tp-tt" style="left:{c.x}px; top:{c.y}px">
						<b style="color:{d.color}">{fmtScore(c.v)}/6</b>
						<span>{new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Legend -->
		<div class="tp-legend">
			<div class="tp-leg-item">
				<span class="tp-leg-dash tp-leg-gray"></span>
				All-time avg&nbsp;<b>{fmtScore(d.allTimeAvg)}/6</b>
			</div>
			<div class="tp-leg-item">
				<span class="tp-leg-dash" style="background:{d.color};opacity:.55"></span>
				Last {d.coords.length} avg&nbsp;<b style="color:{d.color}">{fmtScore(d.last10avg)}/6</b>
			</div>
			{#if d.diff !== null}
				<div class="tp-leg-delta" style="color:{d.color}">
					{d.diff >= 0 ? '+' : ''}{fmtScore(d.diff)} vs baseline
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }

	.dashboard { font-family: 'DM Sans', sans-serif; padding: 0 32px 28px; color: #222; }

	/* ── Sticky header ── */
	.sticky-header { position: sticky; top: 56px; z-index: 40; background: #f9fafb; padding: 14px 32px 0; margin: 0 -32px 14px; border-bottom: 1px solid #ebebeb; }

	.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
	h1 { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
	.green { color: #00b189; }
	.subtitle { font-size: 11px; color: #999; margin-top: 1px; }

	.mode-toggle { display: inline-flex; background: #edeef0; border-radius: 99px; padding: 3px; }
	.mode-btn { padding: 6px 14px; border-radius: 99px; border: none; cursor: pointer; font-size: 12px; font-weight: 400; background: transparent; color: #777; transition: all .2s; font-family: inherit; }
	.mode-btn.active { font-weight: 600; background: #00b189; color: #fff; }

	/* ── Overview row: Overall gauge + 5 section cards (incl. Complete Tests) ── */
	.overview-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; align-items: start; }

	.ov-card { background: #fff; border-radius: 12px; padding: 8px 10px 7px; box-shadow: 0 1px 4px rgba(0,0,0,.05); position: relative; overflow: hidden; }

	/* Gauge card */
	.ov-gauge-card { text-align: center; }
	.ov-gw { position: relative; max-width: 68px; margin: 0 auto; }
	.ov-gsv { width: 68px; height: 49px; display: block; }
	.ov-gnum { position: absolute; top: 42%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; font-weight: 800; letter-spacing: -1px; line-height: 1; white-space: nowrap; }
	.ov-gfrac { font-size: 10px; font-weight: 600; color: #bbb; }
	.ov-label { font-size: 10px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: .5px; margin-top: 1px; display: block; }
	.ov-best { font-size: 11px; color: #999; margin-top: 2px; }
	.ov-hint { font-size: 10px; color: #ccc; margin-top: 2px; }

	/* Section cards */
	.ov-sec { border: 2px solid transparent; cursor: pointer; text-align: left; font-family: inherit; transition: all .15s; }
	.ov-sec.active { border-color: #00b189; box-shadow: 0 3px 12px rgba(0,177,137,.12); }
	.ov-sec.ov-complete { background: linear-gradient(135deg, #00b189 0%, #00c99a 100%); border: none; color: #fff; box-shadow: 0 4px 16px rgba(0,177,137,.30); }
	.ov-sec.ov-complete .ov-name { color: rgba(255,255,255,.85); }
	.ov-sec.ov-complete .ov-val { color: #fff !important; }
	.ov-sec.ov-complete .ov-denom, .ov-sec.ov-complete .ov-unit { color: rgba(255,255,255,.7); }
	.ov-sec.ov-complete .ov-foot { color: rgba(255,255,255,.75); }
	.ov-sec.ov-complete .ov-foot b { color: #fff !important; }
	.ov-sec.ov-complete .ov-icon { background: rgba(255,255,255,.2); color: #fff; }
	.ov-sec.ov-complete .ov-count { background: rgba(255,255,255,.2); color: #fff; }
	.ov-sec.ov-complete .ov-bar { background: rgba(255,255,255,.4); }
	.ov-sec.ov-complete.active { border: 1.5px solid rgba(255,255,255,.5); box-shadow: 0 6px 20px rgba(0,177,137,.4); }
	.ov-sec.ov-complete:hover:not(.active) { background: linear-gradient(135deg, #00a87f 0%, #00b88d 100%); }
	.ov-sec:not(.ov-complete):hover:not(.active) { background: #f8f8f8; }
	.ov-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #00b189; }
	.ov-head { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
	.ov-icon { width: 22px; height: 22px; border-radius: 6px; background: #f0f0f0; color: #999; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.ov-icon.active { background: rgba(0,177,137,.08); color: #00b189; }
	.ov-name { font-size: 11px; font-weight: 600; color: #333; }
	.ov-score-row { display: flex; align-items: baseline; gap: 2px; margin-bottom: 4px; }
	.ov-val { font-size: 20px; font-weight: 800; letter-spacing: -1px; }
	.ov-denom { font-size: 11px; font-weight: 600; color: #bbb; }
	.ov-unit { font-size: 9px; color: #aaa; margin-left: 3px; }
	.ov-foot { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; }
	.ov-count { font-weight: 600; }

	.panel { overflow: visible; }
	.date-list-card { background: #fff; border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
	.panel-header { padding: 14px 20px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
	.panel-title-row { display: flex; align-items: center; gap: 10px; }
	.panel-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(0,177,137,.06); display: flex; align-items: center; justify-content: center; color: #00b189; }
	.panel-section-name { font-size: 16px; font-weight: 700; }
	.panel-sub { font-size: 11px; color: #999; }
	.trend-area { text-align: right; }
	.trend-label { font-size: 9px; color: #aaa; margin-bottom: 2px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
	.no-trend { font-size: 10px; color: #ccc; font-style: italic; }

	.view-toggle-bar { padding: 8px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 6px; background: #fafbfc; }
	.view-label { font-size: 10px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: .4px; margin-right: 4px; }
	.view-btn { padding: 4px 12px; border-radius: 99px; border: none; cursor: pointer; font-size: 11px; font-weight: 400; background: transparent; color: #888; transition: all .15s; font-family: inherit; }
	.view-btn.active { font-weight: 600; background: #222; color: #fff; }

	.empty { padding: 44px 20px; text-align: center; }
	.empty-icon { font-size: 32px; margin-bottom: 6px; opacity: .4; }
	.empty-title { font-size: 13px; font-weight: 600; color: #aaa; }
	.empty-sub { font-size: 11px; color: #ccc; margin-top: 3px; }

	.group-header { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 9px 20px; background: #f8f9fb; border: none; border-bottom: 1px solid #eee; cursor: pointer; font-size: 11px; color: #888; font-weight: 600; font-family: inherit; }
	.group-name { color: #444; }
	.group-count { font-weight: 400; margin-left: 6px; }

	.sub-row { display: flex; align-items: center; padding: 9px 20px; background: #fff; border-bottom: 1px solid #f4f4f4; font-size: 12px; gap: 12px; flex-wrap: wrap; }
	.sub-row.alt { background: #fcfcfd; }
	.sub-info { flex: 1 1 180px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
	.sub-info.wide { flex: 1 1 220px; }
	.sub-date { color: #666; white-space: nowrap; }
	.dot { color: #ddd; }
	.test-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #f0f0f0; color: #555; white-space: nowrap; }

	.badge { font-size: 9px; font-weight: 700; padding: 1px 7px; border-radius: 99px; text-transform: uppercase; letter-spacing: .4px; }
	.badge.test { background: rgba(0,177,137,.08); color: #00b189; }
	.badge.practice { background: rgba(240,160,48,.08); color: #c8920a; }
	.badge.ai-off { font-weight: 500; background: #f5f5f5; color: #b0b0b0; }

	.sub-score { flex: 0 0 140px; display: flex; align-items: center; gap: 6px; }
	.bar-na { border-radius: 99px; background: repeating-linear-gradient(90deg, #e8e8e8 0px, #e8e8e8 3px, transparent 3px, transparent 6px); }
	.na-label { font-size: 11px; color: #bbb; font-style: italic; }
	.bar-track { border-radius: 99px; background: #eee; overflow: hidden; }
	.bar-fill { height: 100%; border-radius: 99px; transition: width .5s ease; }
	.score-val { font-size: 12px; font-weight: 700; min-width: 38px; }

	.sub-details { flex: 1 1 200px; display: flex; gap: 4px; flex-wrap: wrap; }
	.detail-pill { font-size: 10px; background: #f4f7f5; padding: 2px 6px; border-radius: 5px; color: #888; white-space: nowrap; }
	.detail-pill.ungraded { background: #fafafa; color: #ccc; }

	.sec-chips { flex: 1 1 160px; display: flex; gap: 4px; flex-wrap: wrap; }
	.sec-chip { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px; white-space: nowrap; }

	.view-btn-row { flex: 0 0 auto; padding: 4px 13px; border-radius: 99px; border: 1.5px solid #00b189; background: transparent; color: #00b189; font-size: 11px; font-weight: 700; cursor: pointer; transition: all .15s; font-family: inherit; white-space: nowrap; }
	.view-btn-row:hover { background: #00b189; color: #fff; }

	.footer { text-align: center; padding: 14px 0; font-size: 10px; color: #c0c0c0; }

	@media (max-width: 900px) {
		.section-cards { grid-template-columns: repeat(3, 1fr); }
	}
	/* ── Section bar (sticky header strip) ── */
	.section-bar { display: flex; align-items: center; gap: 10px; padding: 7px 0 8px; border-top: 1px solid #ebebeb; margin-top: 8px; }
	.sb-left { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; }
	.sb-icon { width: 22px; height: 22px; border-radius: 6px; background: rgba(0,177,137,.07); color: #00b189; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.sb-name { font-size: 12px; font-weight: 700; color: #222; white-space: nowrap; }
	.sb-dot { color: #ddd; font-size: 12px; }
	.sb-count { font-size: 11px; color: #999; white-space: nowrap; }
	.sb-ai { font-size: 11px; color: #999; white-space: nowrap; }
	.sb-test-info { font-size: 11px; color: #666; white-space: nowrap; }
	.sb-trend { display: flex; align-items: center; gap: 6px; flex-shrink: 0; background: none; border: none; padding: 4px 6px; margin: -4px -6px; border-radius: 8px; cursor: pointer; font-family: inherit; transition: background .15s; }
	.sb-trend:hover:not(:disabled) { background: rgba(0,0,0,.04); }
	.sb-trend:disabled { cursor: default; }
	.sb-diff { font-size: 11px; font-weight: 700; white-space: nowrap; }
	.sb-no-trend { font-size: 10px; color: #ccc; font-style: italic; }
	.sb-sep-v { width: 1px; height: 20px; background: #e5e7eb; flex-shrink: 0; }
	.sb-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
	.sb-ctrl-label { font-size: 10px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }

	/* ── Custom dropdown ── */
	.dd-backdrop { position: fixed; inset: 0; z-index: 99; }
	.dd-wrap { position: relative; }
	.dd-trigger { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; color: #333; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; transition: border-color .15s, box-shadow .15s; box-shadow: 0 1px 3px rgba(0,0,0,.05); white-space: nowrap; }
	.dd-trigger:hover { border-color: #c5c5c5; background: #fafafa; }
	.dd-wrap.open .dd-trigger { border-color: #00b189; box-shadow: 0 0 0 3px rgba(0,177,137,.1); }
	.dd-panel { position: absolute; top: calc(100% + 6px); right: 0; background: #fff; border-radius: 12px; box-shadow: 0 6px 24px rgba(0,0,0,.13); border: 1px solid #efefef; min-width: 150px; overflow: hidden; z-index: 100; }
	.dd-item { display: block; width: 100%; padding: 9px 14px; border: none; background: transparent; color: #333; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; text-align: left; transition: background .1s; }
	.dd-item:hover { background: #f5f5f5; }
	.dd-item.sel { font-weight: 700; color: #00b189; background: rgba(0,177,137,.04); }

	/* ── Test grid (By Test Number view) ── */
	.test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 14px 0 16px; }

	.tc { height: 280px; display: flex; flex-direction: column; background: #fff; border-radius: 12px; border: 1px solid #efefef; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.04); }

	.tc-head { flex-shrink: 0; padding: 9px 12px 8px; border-bottom: 1px solid #f0f0f0; background: #fafbfc; }
	.tc-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; }
	.tc-num { font-size: 12px; font-weight: 700; color: #222; }
	.tc-attempts { font-size: 10px; color: #bbb; font-weight: 500; }
	.tc-stats { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
	.tc-stat { font-size: 10px; color: #888; }
	.tc-stat-na { font-size: 10px; color: #ccc; font-style: italic; }
	.tc-sep { color: #ddd; font-size: 10px; }

	.tc-body { flex: 1; overflow-y: auto; position: relative; min-height: 0; }
	.tc-body::-webkit-scrollbar { width: 3px; }
	.tc-body::-webkit-scrollbar-track { background: transparent; }
	.tc-body::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 99px; }

	.tc-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; background: rgba(249,250,251,.97); border: none; cursor: pointer; font-family: inherit; width: 100%; transition: background .15s; }
	.tc-overlay:hover { background: rgba(240,250,247,.99); }
	.tc-overlay svg { color: #00b189; opacity: .8; }
	.tc-overlay span { font-size: 11px; font-weight: 600; color: #00b189; }

	.tc-empty { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 11px; color: #ccc; font-style: italic; padding: 16px; text-align: center; }

	.tc-sub { display: flex; align-items: flex-start; gap: 8px; padding: 7px 12px; border-bottom: 1px solid #f4f4f4; }
	.tc-sub:last-of-type { border-bottom: none; }
	.tc-sub-body { flex: 1; min-width: 0; }
	.tc-view { flex-shrink: 0; align-self: center; padding: 3px 8px; border-radius: 99px; border: 1.5px solid #00b189; color: #00b189; background: transparent; font-size: 10px; font-weight: 700; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all .15s; }
	.tc-view:hover { background: #00b189; color: #fff; }

	.tc-l1 { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-bottom: 4px; }
	.tc-l2 { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
	.tc-bar { flex: 1; height: 4px; }
	.tc-date { font-size: 10px; color: #555; font-weight: 500; }
	.tc-time { font-size: 10px; color: #bbb; }
	.tc-score { font-size: 11px; font-weight: 700; flex-shrink: 0; }
	.tc-pills { display: flex; gap: 3px; flex-wrap: wrap; }

	.tc-load-more { display: block; width: 100%; padding: 7px; border: none; background: #f8f9fb; color: #00b189; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center; font-family: inherit; border-top: 1px solid #f0f0f0; transition: background .15s; }
	.tc-load-more:hover { background: #f0faf8; }

	/* ── Pagination ── */
	.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 13px 20px; border-top: 1px solid #f0f0f0; }
	.pg-btn { padding: 5px 14px; border-radius: 8px; border: 1.5px solid #e0e0e0; background: #fff; color: #444; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
	.pg-btn:hover:not(:disabled) { border-color: #00b189; color: #00b189; }
	.pg-btn:disabled { opacity: .4; cursor: default; }
	.pg-info { font-size: 11px; color: #aaa; }

	/* ── Badge & pill size variants ── */
	.badge.sm { font-size: 8px; padding: 1px 5px; }
	.detail-pill.xs { font-size: 9px; padding: 1px 5px; }
	.sec-chip.xs { font-size: 9px; padding: 1px 5px; }

	@media (max-width: 767px) {
		.dashboard { padding: 0 16px 20px; }
		.sticky-header { top: 56px; padding: 10px 16px 0; margin: 0 -16px 14px; }
		h1 { font-size: 18px; }
		.header { flex-direction: column; align-items: flex-start; gap: 10px; }
		.overview-row { grid-template-columns: repeat(3, 1fr); }
		.ov-overall { grid-column: 1 / -1; flex-direction: row; text-align: left; gap: 16px; padding: 12px 14px; }
		.ov-big { font-size: 24px; }
		.ov-val { font-size: 20px; }
		.panel-header { flex-direction: column; align-items: flex-start; }
		.trend-area { text-align: left; width: 100%; }
		.sub-row { padding: 8px 14px; gap: 8px; }
		.sub-score { flex: 0 0 120px; }
		.sub-details, .sec-chips { flex-basis: 100%; }
		.group-header { padding: 8px 14px; }
		.view-toggle-bar { padding: 7px 14px; }
		.test-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 12px 0; }
	}
	@media (max-width: 480px) {
		.overview-row { grid-template-columns: repeat(2, 1fr); }
		.ov-card { padding: 10px 10px 9px; }
		.sub-score { flex: 0 0 100px; }
		.view-btn-row { padding: 3px 10px; font-size: 10px; }
		.test-grid { grid-template-columns: 1fr; }
		.tc { height: 260px; }
	}

	/* ── Trend popup ── */
	.tp-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,.28); backdrop-filter: blur(2px); }
	.tp-popup { position: fixed; z-index: 201; background: #fff; border-radius: 18px; box-shadow: 0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08); width: 472px; max-width: calc(100vw - 32px); top: 50%; left: 50%; transform: translate(-50%, -50%); overflow: hidden; }

	.tp-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 18px 18px 14px; border-bottom: 1px solid #f3f4f6; }
	.tp-title { display: flex; flex-direction: column; gap: 3px; }
	.tp-sec-name { font-size: 15px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
	.tp-subtitle { font-size: 11px; color: #aaa; }
	.tp-close { width: 28px; height: 28px; border-radius: 8px; border: none; background: #f5f5f5; color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .15s, color .15s; }
	.tp-close:hover { background: #eee; color: #333; }

	.tp-chart-wrap { padding: 16px 16px 4px; }
	.tp-chart-inner { position: relative; display: inline-block; }
	.tp-tt { position: absolute; pointer-events: none; transform: translate(-50%, calc(-100% - 10px)); background: #1a1a1a; color: #fff; border-radius: 8px; padding: 6px 10px; font-size: 11px; white-space: nowrap; display: flex; flex-direction: column; align-items: center; gap: 1px; z-index: 10; font-family: 'DM Sans', sans-serif; }
	.tp-tt b { font-size: 13px; font-weight: 800; line-height: 1.2; }
	.tp-tt span { font-size: 10px; color: rgba(255,255,255,.55); line-height: 1.2; }

	.tp-legend { display: flex; align-items: center; gap: 14px; padding: 12px 18px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; }
	.tp-leg-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #888; }
	.tp-leg-item b { color: #222; font-weight: 700; }
	.tp-leg-dash { display: inline-block; width: 20px; height: 2px; border-radius: 2px; flex-shrink: 0; }
	.tp-leg-gray { background: #cbd5e1; }
	.tp-leg-delta { margin-left: auto; font-size: 13px; font-weight: 800; letter-spacing: -0.4px; }
</style>
