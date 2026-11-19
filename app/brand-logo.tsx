'use client';
import {useEffect,useState} from 'react';
import {restaurantByName} from '../lib/restaurant-brands';

type Props={brand:string;variant?:'small'|'tile'|'official'};

/**
 * Never upscale a favicon: use a known brand asset, then a sharp text fallback.
 * SVG marks retain their vector quality at any screen scale.
 */
export default function BrandLogo({brand,variant='small'}:Props){
 const [failed,setFailed]=useState(false);
 const known=restaurantByName(brand);
 useEffect(()=>setFailed(false),[brand]);
 return <span className={`brand-logo brand-logo--${variant}${known?.logoBackground?' brand-logo--dark':''}`}
  style={known?.logoBackground?{backgroundColor:known.logoBackground}:undefined}
  title={brand}>
  {known?.logo&&!failed
   ?<img src={known.logo} alt={brand+' logo'} loading="lazy" decoding="async" draggable={false}
      onError={()=>setFailed(true)}
      onLoad={event=>{
       const image=event.currentTarget;
       // Only reject tiny raster images; SVG intrinsic viewBoxes can be small but scale crisply.
       if(!known.logo.toLowerCase().split('?')[0].endsWith('.svg') &&
          (image.naturalWidth<100||image.naturalHeight<60))setFailed(true);
      }}/>
   :<span className="brand-logo-fallback" aria-label={brand}>{brand}</span>}
 </span>;
}
