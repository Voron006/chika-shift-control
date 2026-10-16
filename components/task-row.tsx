'use client';
import {Pencil,LockKeyhole} from 'lucide-react';
import {seed,type Task} from '@/lib/data';
import {useStore} from './store';
import {useLanguage} from './language';
export function TaskRow({task,onEdit}:{task:Task;onEdit?:(task:Task)=>void}){
 const {update}=useStore();const {t}=useLanguage();
 const demo=seed.tasks.some(item=>item.id===task.id&&item.title===task.title);
 const title=demo?t(task.title):task.title;
 const description=task.description&&(seed.tasks.some(item=>item.id===task.id&&item.description===task.description)?t(task.description):task.description);
 function complete(){
  if(task.done||!window.confirm(t('Отметить задачу выполненной? После подтверждения изменить её будет нельзя.')))return;
  update(d=>({...d,tasks:d.tasks.map(item=>item.id===task.id&&!item.done?{...item,done:true}:item)}));
 }
 return <div className={'task-row '+(task.done?'completed':'')}><label className="task-toggle"><input type="checkbox" checked={task.done} disabled={task.done} onChange={complete}/><span className="task-copy"><strong>{title}</strong>{description&&<span className="task-instruction">{description}</span>}<small className="task-labels"><span>{t(task.role)}</span>{task.condition&&<span className="condition-tag">{t(task.condition)}</span>}</small></span></label><span className="time">{task.time}</span>{task.done?<span className="locked-record" title={t('Выполнено. Изменения заблокированы.')}><LockKeyhole size={14} aria-hidden="true"/><span className="sr-only">{t('Выполнено. Изменения заблокированы.')}</span></span>:onEdit&&<button type="button" className="edit-task" aria-label={t('Изменить задачу')+': '+title} onClick={()=>onEdit(task)}><Pencil size={14}/></button>}</div>;
}
