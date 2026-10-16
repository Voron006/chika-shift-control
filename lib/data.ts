export const roles = ['Бариста', 'Хэд-бариста'] as const;
export type Role = typeof roles[number];
export const shifts = [
  {id:'morning', label:'Утро', start:'07:30', end:'14:30'},
  {id:'middle', label:'Мидл', start:'09:00', end:'16:00'},
  {id:'evening', label:'Вечер', start:'14:30', end:'21:00'},
] as const;
export type ShiftId = typeof shifts[number]['id'];
export type Task = {id:string; title:string; role:Role; shiftId:ShiftId; time:string; group:string; done:boolean; description?:string; condition?:string; templateId?:string};
export type Incident = {id:string; title:string; description:string; priority:'Высокий'|'Средний'|'Низкий'; status:'Новый'|'В работе'|'Решён'; created:string; shiftId:ShiftId};
export type ShiftState = {open:boolean; note:string};
export type Data = {version:2; checklistRevision?:1; selectedShift:ShiftId; shiftStates:Record<ShiftId,ShiftState>; tasks:Task[]; incidents:Incident[]};
export const groups = ['Передача смены','Вечерние задачи','Дополнительные задачи'];
const legacyExamples = [
  {title:'Подготовить бар и проверить помол',role:'Бариста',group:'Открытие'},
  {title:'Проверить кассовую смену',role:'Хэд-бариста',group:'Открытие'},
  {title:'Пополнить молоко и расходники',role:'Бариста',group:'В течение смены'},
  {title:'Контролировать качество эспрессо и батча',role:'Хэд-бариста',group:'В течение смены'},
  {title:'Убрать рабочее место и промыть оборудование',role:'Бариста',group:'Закрытие'},
  {title:'Провести полную сдачу смены',role:'Хэд-бариста',group:'Закрытие'},
] as const;
type ChecklistTemplate={id:string;title:string;role:Role;description?:string;condition?:string};
export const checklistTemplates:{handover:readonly ChecklistTemplate[];evening:readonly ChecklistTemplate[]} = {
 handover: [
  {"id": "handover-1", "title": "Протереть все загрязнённые поверхности", "role": "Бариста"},
  {"id": "handover-2", "title": "Протереть кофемашину", "role": "Бариста"},
  {"id": "handover-3", "title": "Очистить ринзер", "role": "Бариста"},
  {"id": "handover-4", "title": "Пополнить зерно в кофемолках", "role": "Бариста"},
  {"id": "handover-5", "title": "Проверить, что оба фильтра заварены", "role": "Бариста"},
  {"id": "handover-6", "title": "Убрать мусор", "role": "Бариста"},
  {"id": "handover-7", "title": "Передать информацию по кассе", "role": "Хэд-бариста", "description": "Наличные, записи, кассовая программа и доставки."},
  {"id": "handover-8", "title": "Актуализировать стоп-лист и профили кофе", "role": "Хэд-бариста"},
  {"id": "handover-9", "title": "Протереть витрину и аккуратно расставить десерты", "role": "Бариста"},
 ],
 evening: [
  {"id": "evening-1", "title": "Промыть ринзер и металлическую решётку", "role": "Бариста", "description": "Промыть ринзер кипятком, очистить губкой и тряпкой; промыть металлическую решётку."},
  {"id": "evening-2", "title": "Очистить питчеры, кофемолки и задний бар", "role": "Бариста", "description": "Фреш-станция, все резиновые коврики и зона кофемолок."},
  {"id": "evening-3", "title": "Оформить заказ для Костава в чате Drivers", "role": "Хэд-бариста", "description": "Отметить водителей, если нужны коричневый сахар, маркеры и другие позиции.", "condition": "По необходимости"},
  {"id": "evening-4", "title": "Оставить заявку в Distribution", "role": "Хэд-бариста", "description": "Указать недостающие расходники, молоко, тоник, средство для посуды и другое.", "condition": "По необходимости"},
  {"id": "evening-5", "title": "Провести все необходимые списания", "role": "Хэд-бариста", "description": "Десерты, напитки сотрудников, переделки и корректировки."},
  {"id": "evening-6", "title": "Сфотографировать витрину и отправить в чат", "role": "Бариста", "description": "Указать, что осталось в холодильнике."},
  {"id": "evening-7", "title": "Убрать десерты по протоколу", "role": "Бариста", "description": "Накрыть крышками или убрать в закрывающиеся контейнеры."},
  {"id": "evening-8", "title": "Вымыть витрину и сервировочные доски", "role": "Бариста", "description": "Протереть витрину внутри и снаружи; вымыть и вытереть доски."},
  {"id": "evening-9", "title": "Заменить мусорные пакеты", "role": "Бариста"},
  {"id": "evening-10", "title": "Провести чистку Cafiza и раковины", "role": "Бариста", "description": "Выполнить чистку согласно графику.", "condition": "По расписанию"},
  {"id": "evening-11", "title": "Промыть термосы", "role": "Бариста", "description": "Промыть тёплой водой и протереть снаружи."},
  {"id": "evening-12", "title": "Вымыть кофемашину и паровые трубки", "role": "Бариста"},
  {"id": "evening-13", "title": "Проверить стоп-лист Wolt на ночь", "role": "Хэд-бариста", "description": "Обновить ночные стопы для круассанов и десертов, чтобы избежать предзаказов."},
  {"id": "evening-14", "title": "Закрыть кассовую смену и записать итог", "role": "Хэд-бариста", "description": "Закрыть смену в кассовой программе, пересчитать наличные, проверить оплаты картой и записать итог в Notes."},
  {"id": "evening-15", "title": "Сфотографировать отчёты и записи", "role": "Хэд-бариста", "description": "Отчёты терминалов, записи, отчёт iiko, Wolt и Glovo."},
  {"id": "evening-16", "title": "Закрыть оба терминала BOG и TBC", "role": "Хэд-бариста"},
  {"id": "evening-17", "title": "Очистить оба холодильника", "role": "Бариста"},
  {"id": "evening-18", "title": "Проверить чистоту зала", "role": "Бариста", "description": "Столы, окна и нижние поверхности."},
  {"id": "evening-19", "title": "Аккуратно протереть все экраны", "role": "Бариста", "description": "Удалить отпечатки пальцев."},
  {"id": "evening-20", "title": "Поставить все устройства на зарядку", "role": "Бариста"},
  {"id": "evening-21", "title": "Выключить свет по инструкции", "role": "Бариста"},
  {"id": "evening-22", "title": "Убрать грязные тряпки в мешок для клининга", "role": "Бариста"},
  {"id": "evening-23", "title": "Выключить кондиционеры", "role": "Бариста"},
  {"id": "evening-24", "title": "Включить лампу для растений", "role": "Бариста"},
  {"id": "evening-25", "title": "Опрыскать растения и убрать лишнюю воду", "role": "Бариста"},
  {"id": "evening-26", "title": "Поменять воду в вазах", "role": "Бариста"},
  {"id": "evening-27", "title": "Полить растения", "role": "Бариста", "description": "Выполнять по понедельникам; в остальные дни оставлять этот пункт без отметки.", "condition": "По понедельникам"},
  {"id": "evening-28", "title": "Закрыть кофейню", "role": "Хэд-бариста"},
  {"id": "evening-29", "title": "Вынести мусор, повреждённые коробки и ящики", "role": "Бариста"},
  {"id": "evening-30", "title": "Отметить приход и уход в программе учёта времени", "role": "Бариста"},
 ],
};
export const seed:Data = {
 version:2,checklistRevision:1,selectedShift:'morning',
 shiftStates:{morning:{open:true,note:''},middle:{open:false,note:''},evening:{open:false,note:''}},
 tasks:shifts.flatMap(shift=>{
  const list=shift.id==='evening'?checklistTemplates.evening:checklistTemplates.handover;
  return list.map(item=>({id:shift.id+'-'+item.id,templateId:item.id,title:item.title,role:item.role,...(item.description?{description:item.description}:{}),...(item.condition?{condition:item.condition}:{}),shiftId:shift.id,time:shift.end,group:shift.id==='evening'?'Вечерние задачи':'Передача смены',done:false}));
 }),incidents:[],
};
function isUntouchedLegacyExample(task:Task){
 const match=/^(morning|middle|evening)-t([0-5])$/.exec(task.id);
 if(!match)return false;
 const index=Number(match[2]);const sample=legacyExamples[index];const shift=shifts.find(s=>s.id===match[1])!;
 const time=index<2?shift.start:index<4?(shift.id==='morning'?'10:30':shift.id==='middle'?'12:00':'17:30'):shift.end;
 return !task.done&&task.title===sample.title&&task.role===sample.role&&task.group===sample.group&&task.time===time&&task.shiftId===shift.id;
}
export function upgradeChecklists(data:Data):Data{
 if(data.checklistRevision===1)return data;
 // Only replace untouched, unfinished examples. Preserve custom work and all completions.
 const kept=data.tasks.filter(task=>!isUntouchedLegacyExample(task));
 const ids=new Set(kept.map(task=>task.id));
 return {...data,checklistRevision:1,tasks:[...seed.tasks.filter(task=>!ids.has(task.id)).map(task=>({...task})),...kept]};
}
export function selectedShift(data:Data){return shifts.find(s=>s.id===data.selectedShift)!;}
export function shiftMinutes(id:ShiftId){const s=shifts.find(s=>s.id===id)!;return toMinutes(s.end)-toMinutes(s.start);}
export function toMinutes(time:string){const [hours,minutes]=time.split(':').map(Number);return hours*60+minutes;}
export function isTimeInShift(time:string,id:ShiftId){const shift=shifts.find(s=>s.id===id);return !!shift&&/^([01]\d|2[0-3]):[0-5]\d$/.test(time)&&toMinutes(time)>=toMinutes(shift.start)&&toMinutes(time)<=toMinutes(shift.end);}
export function createId(){if(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')return crypto.randomUUID();return 'local-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
function record(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==='object'&&!Array.isArray(value);}
function strings(value:Record<string,unknown>,keys:string[]){return keys.every(k=>typeof value[k]==='string');}
function isShift(value:unknown):value is ShiftId{return shifts.some(s=>s.id===value);}
function isRole(value:unknown):value is Role{return roles.some(r=>r===value);}
function incidentFields(value:unknown){return record(value)&&strings(value,['id','title','description','created'])&&['Высокий','Средний','Низкий'].includes(value.priority as string)&&['Новый','В работе','Решён'].includes(value.status as string);}
export function isData(value:unknown):value is Data{
 if(!record(value)||value.version!==2||(value.checklistRevision!==undefined&&value.checklistRevision!==1)||!isShift(value.selectedShift)||!record(value.shiftStates))return false;
 const states=value.shiftStates;
 return shifts.every(s=>{const state=states[s.id];return record(state)&&typeof state.open==='boolean'&&typeof state.note==='string';})&&Array.isArray(value.tasks)&&value.tasks.every(task=>record(task)&&strings(task,['id','title','time','group'])&&typeof task.done==='boolean'&&['description','condition','templateId'].every(key=>task[key]===undefined||typeof task[key]==='string')&&isRole(task.role)&&isShift(task.shiftId))&&Array.isArray(value.incidents)&&value.incidents.every(i=>incidentFields(i)&&record(i)&&isShift(i.shiftId));
}
export function migrateData(value:unknown):Data|null{
 if(isData(value))return upgradeChecklists(value);
 if(!record(value)||value.version!==1||typeof value.shiftOpen!=='boolean'||typeof value.note!=='string'||!Array.isArray(value.tasks)||!Array.isArray(value.incidents))return null;
 if(!value.tasks.every(task=>record(task)&&strings(task,['id','title','person','time','group'])&&typeof task.done==='boolean')||!value.incidents.every(incidentFields))return null;
 // Preserve old work; remove named assignees rather than adding pretend accounts.
 const tasks=value.tasks.map(raw=>{
  const task=raw as Record<string,unknown>;
  const person=String(task.person);
  const role:Role=/Егор|Женя|старший|head|хэд/i.test(person)?'Хэд-бариста':'Бариста';
  const shiftId:ShiftId=task.group==='Закрытие'?'evening':'morning';
  return {id:String(task.id),title:String(task.title),role,shiftId,time:String(task.time),group:String(task.group),done:task.done as boolean};
 });
 const missingShiftTasks=seed.tasks.filter(example=>!tasks.some(task=>task.shiftId===example.shiftId));
 return upgradeChecklists({version:2,selectedShift:'morning',shiftStates:{morning:{open:value.shiftOpen,note:value.note},middle:{open:false,note:''},evening:{open:false,note:''}},tasks:[...tasks,...missingShiftTasks],incidents:value.incidents.map(raw=>({...raw as Omit<Incident,'shiftId'>,shiftId:'morning'}))});
}

export const headResponsibilities = [
 'Ответственность за кассовую смену',
 'Общение с конфликтными гостями',
 'Приём поставок',
 'Ответы на вопросы команды и передача проблем и вопросов руководству',
 'Полная сдача смены',
 'Решение ситуаций с агрессивными гостями: спокойный разговор, при необходимости — вызов полиции',
 'Решение вопросов с собаками',
 'Решение вопросов с гостями, работающими за ноутбуками',
 'Порядок на складе',
 'Качество эспрессо и батча',
 'Порядок в залах и координация хелперов',
 'Заявки дистрибуции и передача менеджерам списка недостающего',
];
export const baristaResponsibilities = ['Подготовить бар и проверить помол','Пополнить молоко и расходники','Убрать рабочее место и промыть оборудование'];

// Local prototype rule, not an authorization boundary. Real admin overrides
// must be checked on the server after authenticated accounts are connected.
export function preserveCompletedRecords(previous:Data,proposed:Data):Data{
 function preserve<T extends {id:string}>(oldItems:T[],newItems:T[],isClosed:(item:T)=>boolean):T[]{
  const closed=new Map(oldItems.filter(isClosed).map(item=>[item.id,item]));
  const next=newItems.map(item=>closed.get(item.id)??item);
  for(const [id,item] of closed)if(!next.some(candidate=>candidate.id===id))next.push(item);
  return next;
 }
 return {...proposed,tasks:preserve(previous.tasks,proposed.tasks,task=>task.done),incidents:preserve(previous.incidents,proposed.incidents,incident=>incident.status==='Решён')};
}

export function taskProgress(tasks:Task[]){
 const required=tasks.filter(task=>!task.condition);
 const conditional=tasks.filter(task=>!!task.condition);
 const done=required.filter(task=>task.done).length;
 return {done,total:required.length,percent:required.length?Math.round(done/required.length*100):0,conditionalDone:conditional.filter(task=>task.done).length,conditionalTotal:conditional.length};
}
