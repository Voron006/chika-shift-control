import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,shifts,roles,isData,migrateData,isTimeInShift,shiftMinutes,headResponsibilities} from '../lib/data.ts';

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
 assert.equal(migrated.tasks.filter(task=>task.shiftId==='middle').length,6);
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
