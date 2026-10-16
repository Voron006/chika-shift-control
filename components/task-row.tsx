'use client';
import {Pencil} from 'lucide-react';
import {seed,type Task} from '@/lib/data';
import {useStore} from './store';
import {useLanguage} from './language';
export function TaskRow({task,onEdit}:{task:Task;onEdit?:(task:Task)=>void}){
 const {update}=useStore();const {t}=useLanguage();
 const demo=seed.tasks.some(item=>item.id===task.id&&item.title===task.title);
 return <div className={'task-row '+(task.done?'completed':'')}><label className="task-toggle"><input type="checkbox" checked={task.done} onChange={()=>update(d=>({...d,tasks:d.tasks.map(item=>item.id===task.id?{...item,done:!item.done}:item)}))}/><span className="task-copy"><strong>{demo?t(task.title):task.title}</strong><small>{t(task.role)}</small></span></label><span className="time">{task.time}</span>{onEdit&&<button type="button" className="edit-task" aria-label={t('Изменить задачу')+': '+(demo?t(task.title):task.title)} onClick={()=>onEdit(task)}><Pencil size={14}/></button>}</div>;
}
