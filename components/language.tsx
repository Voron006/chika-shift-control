'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {english} from '@/lib/translations';
export type Language='ru'|'en';
const Context=createContext<{language:Language;t:(text:string)=>string;setLanguage:(language:Language)=>void;languageError:boolean}|null>(null);
export function LanguageProvider({children}:{children:ReactNode}){
 const [language,setValue]=useState<Language>('ru');
 const [languageError,setError]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem('shift-control:language');if(saved==='ru'||saved==='en')setValue(saved);}catch{setError(true);}},[]);
 useEffect(()=>{document.documentElement.lang=language;document.title=language==='ru'?'Chika — управление сменой':'Chika — Shift Control';},[language]);
 function setLanguage(next:Language){setValue(next);try{localStorage.setItem('shift-control:language',next);setError(false);}catch{setError(true);}}
 const t=(text:string)=>language==='en'?(english[text]??text):text;
 return <Context.Provider value={{language,t,setLanguage,languageError}}>{children}</Context.Provider>;
}
export function useLanguage(){const value=useContext(Context);if(!value)throw new Error('Language provider missing');return value;}
export function LanguageSwitch(){const {language,setLanguage,t}=useLanguage();return <div className="language-control"><span className="language-label">{t('Язык')}</span><button type="button" className={'language-switch '+(language==='en'?'is-english':'')} role="switch" aria-checked={language==='en'} aria-label={t('Английский язык')} onClick={()=>setLanguage(language==='ru'?'en':'ru')}><span className="language-thumb"/><span className="language-option" lang="ru">RU</span><span className="language-option" lang="en">EN</span></button></div>}
