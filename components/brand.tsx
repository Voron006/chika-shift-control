'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useLanguage} from './language';
export function Brand(){
 const {t}=useLanguage();
 const [logo,setLogo]=useState('/chika-logo.png');
 useEffect(()=>{try{const saved=localStorage.getItem('shift-control:logo:v1');if(saved&&/^data:image\/(png|jpeg|webp);base64,/.test(saved))setLogo(saved);}catch{/* Встроенный логотип доступен без хранилища. */}},[]);
 return <div className="brand-area"><Link href="/" className="brand" aria-label={t('Chika — обзор смены')}><img className="custom-logo" src={logo} alt={t('Chika — логотип кофейни')} onError={()=>setLogo('/chika-logo.png')}/></Link><span className="brand-caption">{t('КОФЕ. ЛЮДИ. ХОРОШИЙ ДЕНЬ.')}</span></div>;
}
