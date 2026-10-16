'use client';
import {seed,type Task} from '@/lib/data';
import {useStore} from './store';
import {useLanguage} from './language';
export function TaskRow({task}:{task:Task}){
 const {update}=useStore();const {t}=useLanguage();
 const demo=seed.tasks.find(item=>item.id===task.id&&item.title===task.title);
 return <label className={'task-row '+(task.done?'completed':'')}><input type="checkbox" checked={task.done} onChange={()=>update(d=>({...d,tasks:d.tasks.map(item=>item.id===task.id?{...item,done:!item.done}:item)}))}/><span className="task-copy"><strong>{demo?t(task.title):task.title}</strong><small>{t(task.person)}</small></span><span className="time">{task.time}</span></label>;
}
