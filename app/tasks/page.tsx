'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Plus,ListChecks} from 'lucide-react';
import {useLanguage} from '@/components/language';
import {useStore} from '@/components/store';
import {TaskRow} from '@/components/task-row';
import {roles,groups,seed,selectedShift,isTimeInShift,createId,type Task,type Role} from '@/lib/data';
export default function Tasks(){
 const {t}=useLanguage();const {data,update}=useStore();const shift=selectedShift(data);
 const [filter,setFilter]=useState('Все');const [role,setRole]=useState('Все роли');const [editing,setEditing]=useState<Task|null>(null);const [adding,setAdding]=useState(false);const [message,setMessage]=useState('');const formRef=useRef<HTMLFormElement>(null);
 const editingIsClosed=!!editing&&data.tasks.some(task=>task.id===editing.id&&task.done);
 useEffect(()=>{if(editingIsClosed){setAdding(false);setEditing(null);setMessage(t('Выполнено. Изменения заблокированы.'));}},[editingIsClosed,t]);
 const tasks=data.tasks.filter(task=>task.shiftId===shift.id);
 const filtered=tasks.filter(task=>(filter==='Все'||(filter==='Выполненные'?task.done:!task.done))&&(role==='Все роли'||task.role===role));
 function save(event:FormEvent<HTMLFormElement>){event.preventDefault();if(editingIsClosed)return;const form=event.currentTarget;const f=new FormData(form);const title=String(f.get('title')??'').trim();const time=String(f.get('time'));const titleInput=form.elements.namedItem('title') as HTMLInputElement;const timeInput=form.elements.namedItem('time') as HTMLInputElement;
  if(!title){titleInput.setCustomValidity(t('Укажите задачу.'));titleInput.reportValidity();return;}
  if(!isTimeInShift(time,shift.id)){timeInput.setCustomValidity(t('Время задачи должно быть в пределах выбранной смены.'));timeInput.reportValidity();return;}
  const values={title,role:String(f.get('role')) as Role,group:String(f.get('group')),time};
  update(d=>({...d,tasks:editing?d.tasks.map(task=>task.id===editing.id?{...task,...values}:task):[...d.tasks,{...values,id:createId(),shiftId:d.selectedShift,done:false}]}));setAdding(false);setEditing(null);setMessage(t(editing?'Задача обновлена.':'Задача добавлена.'));
 }
 function edit(task:Task){if(task.done)return;setEditing(task);setAdding(true);requestAnimationFrame(()=>formRef.current?.scrollIntoView({block:'center',behavior:'smooth'}));}
 return <><div className="page-heading"><div><p className="eyebrow">{t('ШАГ ЗА ШАГОМ')}</p><h1>{t('Задачи и чек-листы')}</h1><p className="muted">{t('У каждого своя роль. У команды — общий результат.')}</p></div><button className="primary-button" onClick={()=>{setAdding(!adding);setEditing(null);}}><Plus size={18}/>{t(adding?'Скрыть форму':'Добавить задачу')}</button></div><p role="status" className="sr-only">{message}</p>
 {adding&&!editingIsClosed&&<form ref={formRef} key={shift.id+(editing?.id??'new')} className="panel form-panel" onSubmit={save}><h2>{t(editing?'Изменить задачу':'Новая задача')}</h2><label>{t('Что нужно сделать')}<input autoFocus name="title" required maxLength={120} defaultValue={editing?(seed.tasks.some(task=>task.id===editing.id&&task.title===editing.title)?t(editing.title):editing.title):''} onInput={e=>e.currentTarget.setCustomValidity('')} placeholder={t('Например, пополнить запас салфеток')}/></label><div className="form-grid"><label>{t('Роль')}<select name="role" defaultValue={editing?.role??roles[0]}>{roles.map(item=><option key={item} value={item}>{t(item)}</option>)}</select></label><label>{t('Чек-лист')}<select name="group" defaultValue={editing?.group??groups[0]}>{groups.map(group=><option key={group} value={group}>{t(group)}</option>)}</select></label><label>{t('Время')}<input name="time" type="time" defaultValue={editing?.time??shift.start} min={shift.start} max={shift.end} onInput={e=>e.currentTarget.setCustomValidity('')} required/></label></div><button className="primary-button">{t('Сохранить задачу')}</button></form>}
 <div className="toolbar"><div className="tabs" aria-label={t('Фильтр задач')}>{['Все','Невыполненные','Выполненные'].map(item=><button key={item} aria-pressed={filter===item} className={filter===item?'selected':''} onClick={()=>setFilter(item)}>{t(item)}</button>)}</div><select aria-label={t('Фильтр по роли')} value={role} onChange={e=>setRole(e.target.value)}><option value="Все роли">{t('Все роли')}</option>{roles.map(item=><option key={item} value={item}>{t(item)}</option>)}</select></div>
 <p className="role-note task-examples">{t('Примеры обязанностей — можно изменить в задачах.')}</p><div className="checklist-grid">{groups.map((group,index)=><section className="panel" key={group}><div className="section-heading"><h2><span className="step">0{index+1}</span>{t(group)}</h2><ListChecks size={20} className="muted"/></div><p className="muted panel-sub">{tasks.filter(task=>task.group===group&&task.done).length} {t('из')} {tasks.filter(task=>task.group===group).length} {t('выполнено')}</p>{filtered.filter(task=>task.group===group).map(task=><TaskRow key={task.id} task={task} onEdit={edit}/>)}{!filtered.some(task=>task.group===group)&&<p className="empty">{t('Нет задач по выбранному фильтру.')}</p>}</section>)}</div></>;
}
