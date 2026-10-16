import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,shifts,roles,isData,migrateData,isTimeInShift,shiftMinutes,headResponsibilities,preserveCompletedRecords,checklistTemplates,taskProgress} from '../lib/data.ts';

test('three real shift windows, including their overlapping hours',()=>{
 assert.deepEqual(shifts.map(({start,end})=>[start,end]),[['07:30','14:30'],['09:00','16:00'],['14:30','21:00']]);
 assert.equal(isTimeInShift('10:00','morning'),true);
 assert.equal(isTimeInShift('10:00','middle'),true);
 assert.equal(isTimeInShift('14:29','evening'),false);
 assert.equal(isTimeInShift('14:30','evening'),true);
 assert.equal(isTimeInShift('21:01','evening'),false);
 assert.equal(isTimeInShift('25:00','morning'),false);
 assert.deepEqual(shifts.map(s=>shiftMinutes(s.id)),[420,420,390]);
});

test('example duties belong to valid shifts and both job roles',()=>{
 assert.equal(isData(seed),true);
 assert.equal(new Set(seed.tasks.map(task=>task.id)).size,seed.tasks.length);
 for(const shift of shifts){
  const tasks=seed.tasks.filter(task=>task.shiftId===shift.id);
  assert.deepEqual([...new Set(tasks.map(task=>task.role))].sort(),[...roles].sort());
  for(const task of tasks)assert.equal(isTimeInShift(task.time,shift.id),true);
 }
 assert.deepEqual(seed.incidents,[]);
 assert.equal(Object.hasOwn(seed,'admin'),false);
});

test('old storage keeps work and replaces named assignments with duties',()=>{
 const old={version:1,shiftOpen:true,note:'Do not lose this handover',tasks:[
  {id:'t1',title:'Custom task',person:'Миша — бариста',time:'08:00',group:'Открытие',done:true},
  {id:'t2',title:'Close safely',person:'Егор — старший смены',time:'20:00',group:'Закрытие',done:false},
 ],incidents:[{id:'i1',title:'Urgent',description:'Keep this',priority:'Высокий',status:'В работе',created:'2026-10-16T08:00:00Z'}]};
 const migrated=migrateData(old);
 assert.equal(isData(migrated),true);
 assert.equal(migrated.tasks.find(task=>task.id==='t1').done,true);
 assert.equal(migrated.tasks.find(task=>task.id==='t1').title,'Custom task');
 assert.equal(migrated.tasks.find(task=>task.id==='t1').role,'Бариста');
 assert.equal(migrated.tasks.find(task=>task.id==='t2').role,'Хэд-бариста');
 assert.equal(migrated.tasks.find(task=>task.id==='t2').shiftId,'evening');
 assert.equal(migrated.shiftStates.morning.note,old.note);
 assert.equal(migrated.shiftStates.morning.open,true);
 assert.equal(migrated.shiftStates.middle.open,false);
 assert.equal(migrated.incidents[0].description,'Keep this');
 assert.equal(migrated.incidents[0].priority,'Высокий');
 assert.equal(migrated.tasks.some(task=>'person' in task),false);
 assert.equal(migrated.tasks.filter(task=>task.shiftId==='middle').length,9);
 assert.equal(old.tasks[0].person,'Миша — бариста');
});

test('new storage round-trips and malformed records are rejected',()=>{
 const copy=JSON.parse(JSON.stringify(seed));
 assert.deepEqual(migrateData(copy),seed);
 copy.shiftStates.evening.note='Evening only';
 assert.equal(migrateData(copy).shiftStates.morning.note,'');
 assert.equal(migrateData({...seed,selectedShift:'night'}),null);
 assert.equal(migrateData({...seed,tasks:[null]}),null);
 assert.equal(migrateData({...seed,shiftStates:{morning:null}}),null);
 assert.equal(migrateData({version:1,tasks:[null],incidents:[],shiftOpen:true,note:''}),null);
});

test('head barista reference contains the 12 supplied responsibilities',()=>{
 assert.equal(headResponsibilities.length,12);
 assert.equal(new Set(headResponsibilities).size,12);
 assert.ok(headResponsibilities.some(item=>item.includes('кассовую')));
 assert.ok(headResponsibilities.some(item=>item.includes('дистрибуции')));
 assert.ok(headResponsibilities.some(item=>item.includes('полиции')));
});

test('completed tasks cannot be reopened, edited, reassigned or removed',()=>{
 const previous=structuredClone(seed);previous.tasks[0].done=true;
 const closed=structuredClone(previous.tasks[0]);
 const proposed=structuredClone(previous);
 Object.assign(proposed.tasks[0],{done:false,title:'Changed',role:'Хэд-бариста',shiftId:'evening',time:'20:30'});
 const next=preserveCompletedRecords(previous,proposed);
 assert.deepEqual(next.tasks[0],closed);
 assert.deepEqual(previous.tasks[0],closed);
 const removed=preserveCompletedRecords(previous,{...previous,tasks:previous.tasks.slice(1)});
 assert.deepEqual(removed.tasks.find(task=>task.id===closed.id),closed);
});

test('resolved incidents keep every field while active incidents remain editable',()=>{
 const previous=structuredClone(seed);
 const closed={id:'resolved',title:'Fixed',description:'Original details',priority:'Высокий',status:'Решён',created:'2026-10-16T10:00:00Z',shiftId:'morning'};
 const active={...closed,id:'active',status:'Новый'};
 previous.incidents=[closed,active];
 const next=preserveCompletedRecords(previous,{...previous,incidents:[{...closed,status:'Новый',priority:'Низкий',title:'Edited'},{...active,status:'В работе',priority:'Средний'}]});
 assert.deepEqual(next.incidents[0],closed);
 assert.equal(next.incidents[1].status,'В работе');
 assert.equal(next.incidents[1].priority,'Средний');
 const removed=preserveCompletedRecords(previous,{...previous,incidents:[]});
 assert.deepEqual(removed.incidents,[closed]);
});

test('first completion succeeds, all subsequent changes are blocked after storage reload',()=>{
 const previous=structuredClone(seed);
 const completed=preserveCompletedRecords(previous,{...previous,tasks:previous.tasks.map((task,index)=>index===0?{...task,done:true}:task)});
 assert.equal(completed.tasks[0].done,true);
 const reloaded=migrateData(JSON.parse(JSON.stringify(completed)));
 const blocked=preserveCompletedRecords(reloaded,{...reloaded,selectedShift:'evening',tasks:reloaded.tasks.map((task,index)=>index===0?{...task,done:false,title:'Reset'}:task)});
 assert.equal(blocked.selectedShift,'evening');
 assert.deepEqual(blocked.tasks[0],completed.tasks[0]);
});

test('photo checklists have 9 handover and 30 evening items with distinct shift IDs',()=>{
 assert.equal(checklistTemplates.handover.length,9);
 assert.equal(checklistTemplates.evening.length,30);
 assert.deepEqual(shifts.map(shift=>seed.tasks.filter(task=>task.shiftId===shift.id).length),[9,9,30]);
 assert.equal(seed.tasks.length,48);
 assert.equal(new Set(seed.tasks.map(task=>task.id)).size,48);
 const evening=seed.tasks.filter(task=>task.shiftId==='evening');
 assert.equal(evening.filter(task=>!!task.condition).length,4);
 assert.ok(evening.some(task=>task.condition==='По понедельникам'));
 assert.equal(taskProgress(evening).total,26);
 const completedMandatory=evening.map(task=>({...task,done:!task.condition}));
 assert.equal(taskProgress(completedMandatory).percent,100);
 assert.equal(taskProgress(completedMandatory).conditionalDone,0);
});

test('checklist upgrade preserves completions and custom work, replaces only untouched examples',()=>{
 const previous={...structuredClone(seed)};delete previous.checklistRevision;
 const completed={id:'morning-t0',title:'Подготовить бар и проверить помол',role:'Бариста',shiftId:'morning',time:'07:30',group:'Открытие',done:true};
 const untouched={id:'morning-t1',title:'Проверить кассовую смену',role:'Хэд-бариста',shiftId:'morning',time:'07:30',group:'Открытие',done:false};
 const edited={id:'middle-t2',title:'Custom edited milk task',role:'Бариста',shiftId:'middle',time:'12:00',group:'В течение смены',done:false};
 const custom={...edited,id:'custom',title:'My own task'};
 previous.tasks=[completed,untouched,edited,custom];
 previous.shiftStates.middle.note='Keep handover';
 const next=migrateData(previous);
 assert.equal(isData(next),true);
 assert.deepEqual(next.tasks.find(task=>task.id===completed.id),completed);
 assert.deepEqual(next.tasks.find(task=>task.id===edited.id),edited);
 assert.deepEqual(next.tasks.find(task=>task.id===custom.id),custom);
 assert.equal(next.tasks.some(task=>task.id===untouched.id),false);
 assert.equal(next.shiftStates.middle.note,'Keep handover');
 assert.equal(next.tasks.length,51);
 assert.deepEqual(migrateData(JSON.parse(JSON.stringify(next))),next);
});

test('every photo checklist title, instruction and condition has an English translation',async()=>{
 const {english}=await import('../lib/translations.ts');
 for(const list of Object.values(checklistTemplates))for(const item of list){
  for(const text of [item.title,item.description,item.condition].filter(Boolean)){
   assert.equal(typeof english[text],'string',`Missing translation: ${text}`);
   assert.ok(!/[А-Яа-яЁё]/.test(english[text]),`Untranslated checklist: ${text}`);
  }
 }
});
