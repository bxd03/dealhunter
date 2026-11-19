'use client';
import {useEffect,useState} from 'react';

// Source assets are authentic brand marks, not AI-recreated logos or generated initials.
// Prefer sharp vector files; raster sources are high resolution. Update links when brands rebrand.
type LogoAsset={src:string;backup?:string;dark?:boolean};
const assets:Record<string,LogoAsset>={
  chagee:{
    src:'https://companieslogo.com/img/orig/CHA_BIG-5cfb9c0c.svg',
    backup:'https://cdn.brandfetch.io/id3v_ybgS_/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1789739854370'
  },
  'zus coffee':{
    src:'https://zuscoffee.com/wp-content/uploads/2026/06/Logo-Footer.svg',
    backup:'https://cdn.brandfetch.io/idhm4ON_7q/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1721655662041',
    dark:true
  },
  mcdonalds:{
    src:'https://commons.wikimedia.org/wiki/Special:FilePath/McDonald%27s_square_2020.svg',
    backup:'https://commons.wikimedia.org/wiki/Special:FilePath/McDonald%27s_Golden_Arches.svg'
  },
  tealive:{
    src:'https://cdn.brandfetch.io/id3lswLeDR/w/3255/h/834/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1790585894655',
    backup:'https://commons.wikimedia.org/wiki/Special:FilePath/Tealive_logo.svg'
  },
  kfc:{
    src:'https://commons.wikimedia.org/wiki/Special:FilePath/KFC_logo_wordmark.svg',
    backup:'https://commons.wikimedia.org/wiki/Special:FilePath/KFC_logotype.svg'
  },
  subway:{
    src:'https://commons.wikimedia.org/wiki/Special:FilePath/Subway_2016_logo.svg',
    backup:'https://commons.wikimedia.org/wiki/Special:FilePath/Subway_icon.svg'
  },
  familymart:{
    src:'https://cdn.brandfetch.io/idmayRRNod/w/497/h/73/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1789153229347',
    backup:'https://commons.wikimedia.org/wiki/Special:FilePath/FamilyMart_Logo_(2016-).svg'
  },
  'sushi king':{
    src:'https://www.sunwayvelocitymall.com/static/shops/a04d8ff4032d55fb8f8ddcd771dd2210/w768.png'
  },
  marrybrown:{
    src:'https://cdn.brandfetch.io/idAzaw3Trn/w/3508/h/2481/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1776487627902'
  }
};
function keyOf(brand:string){return brand.toLowerCase().normalize('NFKD').replace(/[’‘']/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim()}
export default function BrandLogo({brand,variant='small'}:{brand:string;variant?:'small'|'tile'|'official'}){
 const asset=assets[keyOf(brand)];
 const [choice,setChoice]=useState(0);
 useEffect(()=>setChoice(0),[brand]);
 const source=choice===0?asset?.src:choice===1?asset?.backup:undefined;
 return <span className={`brand-logo brand-logo--${variant}${asset?.dark?' brand-logo--dark':''}`} title={brand} aria-label={brand+' logo'}>
  {source?<img alt={brand+' logo'} src={source} loading="lazy" decoding="async" draggable={false}
    onError={()=>setChoice(c=>c+(c===0&&asset?.backup?1:2))}/>
  :<span className="brand-logo-fallback" aria-hidden="true">{brand.slice(0,2).toUpperCase()}</span>}
 </span>;
}
