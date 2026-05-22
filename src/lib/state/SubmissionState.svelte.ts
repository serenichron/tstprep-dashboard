import type {
  CompleteSub,
  QuizMode,
  QuizSubmission,
  QuizType,
  StatsPart,
  StatsPartWithMode,
  SubmissionGeneralStats,
} from "$lib/types";
import { createQuery } from "@tanstack/svelte-query";

// prettier-ignore
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

// prettier-ignore
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

export const PAGE_SIZE = 20;
export const CHART_DATAPOINTS = 10;
export const CHART_BASELINE = 20;

export default class SubmissionState {
  public stats: SubmissionGeneralStats;

  public constructor() {
    const sum = (quizzes: QuizSubmission[]) =>
      quizzes.reduce((a, q) => a + q.score, 0);
    const average = (quizzes: QuizSubmission[]) =>
      quizzes.length
        ? quizzes.reduce((a, q) => a + q.score, 0) / quizzes.length
        : null;
    const best = (quizzes: QuizSubmission[]) =>
      quizzes.length ? Math.max(...quizzes.map((q) => q.score)) : null;
    const graded = (quizzes: QuizSubmission[]) =>
      quizzes.filter((q) => q.ai !== false);
    const extract = (type: QuizType): Record<QuizMode | "all", StatsPart> => {
      const d = MOCK.filter((q) => q.quiz_type === type);
      const p = d.filter((q) => q.practice);
      const t = d.filter((q) => !q.practice);

      const dg = graded(d);
      const pg = graded(p);
      const tg = graded(t);

      return {
        practice: {
          sum: sum(pg),
          average: average(pg),
          best: best(pg),
          count: p.length,
          gradedCount: pg.length,
        },
        test: {
          sum: sum(tg),
          average: average(tg),
          best: best(tg),
          count: t.length,
          gradedCount: tg.length,
        },
        all: {
          sum: sum(dg),
          average: average(dg),
          best: best(dg),
          count: d.length,
          gradedCount: dg.length,
        },
      };
    };

    const g = graded(MOCK);
    this.stats = {
      reading: extract("reading"),
      listening: extract("listening"),
      writing: extract("writing"),
      speaking: extract("speaking"),
      all: {
        sum: sum(g),
        average: average(g),
        best: best(g),
        count: MOCK.length,
        gradedCount: g.length,
      },
    };
  }

  public fetchSubmissions({
    type,
    mode,
    test,
    page = 1,
  }: {
    type: QuizType;
    mode?: QuizMode;
    test?: number;
    page?: number;
  }) {
    return createQuery(() => ({
      queryKey: [type, page, mode, test],
      queryFn: async () => {
        const matchesMode = (s: QuizSubmission) =>
          mode === undefined || s.practice === (mode === "practice");
        const matchesTestNumber = (s: QuizSubmission) =>
          test === undefined || s.test_number === test;

        const submissions = MOCK.filter(
          (s) => s.quiz_type === type && matchesMode(s) && matchesTestNumber(s),
        ).sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        const pagedSubmissions = submissions.slice(
          (page - 1) * PAGE_SIZE,
          page * PAGE_SIZE,
        );

        if (page === 1) {
          const missing =
            CHART_DATAPOINTS - submissions.filter((s) => s.ai !== false).length;
          if (missing > 0) {
            return {
              submissions: pagedSubmissions,
              extraSubmissions: submissions
                .slice(PAGE_SIZE)
                .filter((s) => s.ai !== false)
                .slice(0, missing),
            };
          }
        }

        return { submissions: pagedSubmissions };
      },
    }));
  }

  public fetchStats(type: QuizType, test?: number) {
    return createQuery(() => ({
      queryKey: [type, test],
      queryFn: async (): Promise<StatsPartWithMode> => {
        if (test === undefined) {
          return this.stats[type];
        }

        const subs = MOCK.filter(
          (s) => s.quiz_type === type && s.test_number === test,
        );
        const reduce = (subs: QuizSubmission[]) =>
          subs.reduce(
            (acc, s) =>
              s.ai !== false
                ? {
                    sum: acc.sum + s.score,
                    count: acc.count + 1,
                    gradedCount: acc.gradedCount + 1,
                    best: Math.max(acc.best, s.score),
                  }
                : {
                    ...acc,
                    count: acc.count + 1,
                  },
            {
              sum: 0,
              count: 0,
              gradedCount: 0,
              best: 0,
            },
          );

        const stats = (subs: QuizSubmission[]) => {
          const s = reduce(subs);
          if (s.gradedCount === 0) {
            return {
              sum: s.sum,
              average: null,
              best: null,
              count: s.count,
              gradedCount: s.gradedCount,
            };
          }

          return {
            sum: s.sum,
            average: s.sum / s.gradedCount,
            best: s.best,
            count: s.count,
            gradedCount: s.gradedCount,
          };
        };

        return {
          practice: stats(subs.filter((s) => s.practice)),
          test: stats(subs.filter((s) => !s.practice)),
          all: stats(subs),
        };
      },
    }));
  }
}
