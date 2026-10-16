export type Task = { id: string; title: string; person: string; time: string; group: string; done: boolean };
export type Incident = { id: string; title: string; description: string; priority: 'Высокий' | 'Средний' | 'Низкий'; status: 'Новый' | 'В работе' | 'Решён'; created: string };
export type Data = { version: 1; tasks: Task[]; incidents: Incident[]; shiftOpen: boolean; note: string };
export const people = ['Миша — бариста', 'Тома', 'Егор — старший смены'];
export const seed: Data = { version: 1, shiftOpen: true, note: 'Проверить запас овсяного молока перед вечерней сменой. Хорошей смены команде!', tasks: [
{id:'t1',title:'Проверить кофемашину и помол',person:people[0],time:'08:00',group:'Открытие',done:true},
{id:'t2',title:'Подготовить витрину и ценники',person:people[1],time:'08:15',group:'Открытие',done:true},
{id:'t3',title:'Проверить температуру холодильников',person:people[2],time:'09:00',group:'В течение смены',done:false},
{id:'t4',title:'Пополнить молоко и расходники',person:people[0],time:'12:00',group:'В течение смены',done:false},
{id:'t5',title:'Протереть столы и зону выдачи',person:people[1],time:'13:00',group:'В течение смены',done:false},
{id:'t6',title:'Промыть кофемашину',person:people[0],time:'19:30',group:'Закрытие',done:false},
{id:'t7',title:'Пересчитать остатки и закрыть кассу',person:people[2],time:'20:00',group:'Закрытие',done:false}], incidents:[
{id:'i1',title:'Подтекает кран у барной стойки',description:'Небольшая протечка под раковиной. Проверить соединение и подготовить заявку мастеру.',priority:'Средний',status:'В работе',created:'Демо · 10:25'},
{id:'i2',title:'Заканчиваются стаканы 350 мл',description:'В запасе одна упаковка. Добавить в следующую поставку.',priority:'Низкий',status:'Новый',created:'Демо · 11:10'}] };
export function isData(value: unknown): value is Data {
 if (!value || typeof value !== 'object') return false;
 const d = value as Data;
 return d.version === 1 && typeof d.shiftOpen === 'boolean' && typeof d.note === 'string' && Array.isArray(d.tasks) && d.tasks.every(t => t && ['id','title','person','time','group'].every(k => typeof t[k as keyof Task] === 'string') && typeof t.done === 'boolean') && Array.isArray(d.incidents) && d.incidents.every(i => i && ['id','title','description','created'].every(k => typeof i[k as keyof Incident] === 'string') && ['Высокий','Средний','Низкий'].includes(i.priority) && ['Новый','В работе','Решён'].includes(i.status));
}

// Сохраняем выполненные задачи при переименовании демокоманды.
export function migrateDemoNames(data: Data): Data {
 const names: Record<string, string> = { 'Алекс — бариста': people[0], 'Саша — кассир': people[1], 'Тома — кассир': people[1], 'Женя — старший смены': people[2] };
 return { ...data, tasks: data.tasks.map(task => ({ ...task, person: names[task.person] ?? task.person })) };
}
