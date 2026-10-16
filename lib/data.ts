export const roles = ['Бариста', 'Хэд-бариста'] as const;
export type Role = typeof roles[number];
export const shifts = [
  {id:'morning', label:'Утро', start:'07:30', end:'14:30'},
  {id:'middle', label:'Мидл', start:'09:00', end:'16:00'},
  {id:'evening', label:'Вечер', start:'14:30', end:'21:00'},
] as const;
export type ShiftId = typeof shifts[number]['id'];
export type Task = {id:string; title:string; role:Role; shiftId:ShiftId; time:string; group:string; done:boolean};
export type Incident = {id:string; title:string; description:string; priority:'Высокий'|'Средний'|'Низкий'; status:'Новый'|'В работе'|'Решён'; created:string; shiftId:ShiftId};
export type ShiftState = {open:boolean; note:string};
export type Data = {version:2; selectedShift:ShiftId; shiftStates:Record<ShiftId,ShiftState>; tasks:Task[]; incidents:Incident[]};
export const groups = ['Открытие','В течение смены','Закрытие'];
const examples = [
  {title:'Подготовить бар и проверить помол',role:'Бариста',group:'Открытие'},
  {title:'Проверить кассовую смену',role:'Хэд-бариста',group:'Открытие'},
  {title:'Пополнить молоко и расходники',role:'Бариста',group:'В течение смены'},
  {title:'Контролировать качество эспрессо и батча',role:'Хэд-бариста',group:'В течение смены'},
  {title:'Убрать рабочее место и промыть оборудование',role:'Бариста',group:'Закрытие'},
  {title:'Провести полную сдачу смены',role:'Хэд-бариста',group:'Закрытие'},
] as const;
export const seed:Data = {
  version:2, selectedShift:'morning',
  shiftStates:{morning:{open:true,note:''},middle:{open:false,note:''},evening:{open:false,note:''}},
  tasks:shifts.flatMap(shift=>examples.map((item,index)=>({
    ...item,id:shift.id+'-t'+index,shiftId:shift.id,done:false,
    time:index<2?shift.start:index<4?(shift.id==='morning'?'10:30':shift.id==='middle'?'12:00':'17:30'):shift.end,
  }))),
  incidents:[],
};
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
 if(!record(value)||value.version!==2||!isShift(value.selectedShift)||!record(value.shiftStates))return false;
 const states=value.shiftStates;
 return shifts.every(s=>{const state=states[s.id];return record(state)&&typeof state.open==='boolean'&&typeof state.note==='string';})&&Array.isArray(value.tasks)&&value.tasks.every(task=>record(task)&&strings(task,['id','title','time','group'])&&typeof task.done==='boolean'&&isRole(task.role)&&isShift(task.shiftId))&&Array.isArray(value.incidents)&&value.incidents.every(i=>incidentFields(i)&&record(i)&&isShift(i.shiftId));
}
export function migrateData(value:unknown):Data|null{
 if(isData(value))return value;
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
 return {version:2,selectedShift:'morning',shiftStates:{morning:{open:value.shiftOpen,note:value.note},middle:{open:false,note:''},evening:{open:false,note:''}},tasks:[...tasks,...missingShiftTasks],incidents:value.incidents.map(raw=>({...raw as Omit<Incident,'shiftId'>,shiftId:'morning'}))};
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
