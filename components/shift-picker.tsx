'use client';
import {useRef,useState,type FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {Sun,Sunrise,Moon,TriangleAlert,X} from 'lucide-react';
import {shifts,createId,selectedShift} from '@/lib/data';
import {useStore} from './store';
import {useLanguage} from './language';
export function ShiftPicker(){
 const {data,update}=useStore();const {t}=useLanguage();const dialog=useRef<HTMLDialogElement>(null);const router=useRouter();
 const [message,setMessage]=useState('');const shift=selectedShift(data);
 function report(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;const f=new FormData(form);const input=form.elements.namedItem('title') as HTMLInputElement;const title=String(f.get('title')??'').trim();if(!title){input.setCustomValidity(t('Укажите, что случилось.'));input.reportValidity();return;}
  const id=createId();update(d=>({...d,incidents:[{id,title,description:String(f.get('description')??'').trim(),priority:'Высокий',status:'Новый',created:new Date().toISOString(),shiftId:d.selectedShift},...d.incidents]}));
  dialog.current?.close();form.reset();setMessage(t('Срочная проблема сохранена с высоким приоритетом.'));router.push('/incidents?priority=high&scope=all&report='+encodeURIComponent(id));
 }
 return <><section className="shift-picker" aria-label={t('Выбор смены')}><div className="shift-options">{shifts.map((item,index)=>{const Icon=[Sunrise,Sun,Moon][index];return <button key={item.id} type="button" aria-pressed={data.selectedShift===item.id} className={data.selectedShift===item.id?'shift-option selected':'shift-option'} onClick={()=>update(d=>({...d,selectedShift:item.id}))}><Icon size={17}/><span><strong>{t(item.label)}</strong><small>{item.start}–{item.end}</small></span></button>})}</div><button type="button" className="urgent-button" onClick={()=>dialog.current?.showModal()}><TriangleAlert size={17}/>{t('Срочная проблема')}</button></section><p className="sr-only" role="status">{message}</p>
 <dialog ref={dialog} className="urgent-dialog" aria-labelledby="urgent-title"><div className="section-heading"><h2 id="urgent-title">{t('Срочная проблема')}</h2><button type="button" className="dialog-close" aria-label={t('Закрыть')} onClick={()=>dialog.current?.close()}><X size={20}/></button></div><p className="panel-sub">{t(shift.label)} · {shift.start}–{shift.end} · {t('Высокий')} {t('приоритет')}</p><form onSubmit={report} className="form-panel"><label>{t('Что случилось')}<input autoFocus name="title" required maxLength={120} onInput={event=>event.currentTarget.setCustomValidity('')} placeholder={t('Кратко опишите проблему')}/></label><label>{t('Подробности')}<textarea name="description" maxLength={1500} placeholder={t('Где возникла проблема и что уже проверили?')}/></label><p className="role-note">{t('Проблема сохранится в этом браузере. Уведомления команде пока не отправляются.')}</p><button className="urgent-button">{t('Зарегистрировать инцидент')}</button></form></dialog></>;
}
