'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { seed, isData, migrateDemoNames, type Data } from '@/lib/data';
const KEY = 'shift-control:v1';
const Context = createContext<{data: Data; update: (fn: (d: Data) => Data) => void; ready: boolean; error: string} | null>(null);
export function Store({children}: {children: ReactNode}) {
 const [data,setData] = useState<Data>(seed); const [ready,setReady]=useState(false); const [error,setError]=useState('');
 useEffect(() => { try {const raw=localStorage.getItem(KEY); if(raw) {const parsed:unknown=JSON.parse(raw); if(!isData(parsed)) throw new Error(); const migrated=migrateDemoNames(parsed); setData(migrated); if(JSON.stringify(migrated)!==raw) { try { localStorage.setItem(KEY,JSON.stringify(migrated)); } catch { setError('Имена обновлены, но браузер не разрешил сохранить изменения.'); } }}} catch {setError('Не удалось прочитать сохранение. Показаны демоданные; новые изменения попробуем сохранить.');} setReady(true); },[]);
 function update(fn: (d: Data)=>Data) { if (!ready) return; const next=fn(data); setData(next); try {localStorage.setItem(KEY,JSON.stringify(next));setError('');} catch {setError('Браузер не разрешил сохранение. Изменения доступны только до обновления страницы.');} }
 return <Context.Provider value={{data,update,ready,error}}>{children}</Context.Provider>;
}
export function useStore(){const value=useContext(Context);if(!value)throw new Error('Store missing');return value;}
