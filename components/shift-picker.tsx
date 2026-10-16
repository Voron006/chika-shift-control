'use client';
import {Sun,Sunrise,Moon} from 'lucide-react';
import {shifts} from '@/lib/data';
import {useStore} from './store';
import {useLanguage} from './language';
export function ShiftPicker(){
 const {data,update}=useStore();const {t}=useLanguage();
 return <section className="shift-picker" aria-label={t('Выбор смены')}><div className="shift-options">{shifts.map((item,index)=>{const Icon=[Sunrise,Sun,Moon][index];return <button key={item.id} type="button" aria-pressed={data.selectedShift===item.id} className={data.selectedShift===item.id?'shift-option selected':'shift-option'} onClick={()=>update(d=>({...d,selectedShift:item.id}))}><Icon size={17}/><span><strong>{t(item.label)}</strong><small>{item.start}–{item.end}</small></span></button>})}</div></section>;
}
