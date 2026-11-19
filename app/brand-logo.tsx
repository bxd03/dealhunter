'use client';
import {useEffect,useState} from 'react';
import {restaurantByName} from '../lib/restaurant-brands';

type Props={brand:string;variant?:'small'|'tile'|'official'};

/**
 * A brand mark is shown only when its actual asset loads.
 * Failed or unknown logos fall back to a readable name, never a fuzzy favicon.
 */
export default function BrandLogo({brand,variant='small'}:Props){
 const [failed,setFailed]=useState(false);
 const known=restaurantByName(brand);
 useEffect(()=>setFailed(false),[brand]);
 return <span className={`brand-logo brand-logo--${variant}${known?.logoBackground?' brand-logo--dark':''}`}
  style={known?.logoBackground?{backgroundColor:known.logoBackground}:undefined}
  title={brand}>
  {known?.logo&&!failed
   ?<img src={known.logo} alt={brand+' logo'} loading="lazy" decoding="async"
      draggable={false} onError={()=>setFailed(true)}/>
   :<span className="brand-logo-fallback" aria-label={brand}>{brand}</span>}
 </span>;
}
