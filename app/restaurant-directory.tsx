'use client';
import {useMemo,useState} from 'react';
import {ArrowRight,ArrowUpRight,Search,Store,SlidersHorizontal,X} from 'lucide-react';
import {Deal,active} from '../lib/deals';
import {RestaurantBrand,RestaurantCategory,restaurantBrands,restaurantKey} from '../lib/restaurant-brands';
import BrandLogo from './brand-logo';

type Props={deals:Deal[];now:number;onExplore:(brand:string)=>void};
type Entry=RestaurantBrand&{menuCount:number;offerCount:number;isDemo:boolean};
const filters:Array<'All'|RestaurantCategory>=['All','Fast food','Coffee & tea','Pizza','Desserts & dining','Convenience'];

export default function RestaurantDirectory({deals,now,onExplore}:Props){
 const [search,setSearch]=useState('');
 const [category,setCategory]=useState<'All'|RestaurantCategory>('All');

 const entries=useMemo(()=>{
  const brands=[...restaurantBrands];
  // Imported restaurants remain discoverable even if not in the curated directory.
  const indexed=new Set(brands.map(b=>restaurantKey(b.name)));
  for(const deal of deals){
   const key=restaurantKey(deal.brand);
   if(!indexed.has(key)){
    indexed.add(key);
    brands.push({name:deal.brand,category:'Desserts & dining',website:'',logo:'',tagline:'Discover available menus'});
   }
  }
  return brands.map(b=>{
   const items=deals.filter(d=>restaurantKey(d.brand)===restaurantKey(b.name));
   return {...b,menuCount:items.length,offerCount:items.reduce((total,d)=>total+d.offers.filter(o=>active(o,now)).length,0),
     isDemo:items.length>0&&items.every(d=>d.sample)};
  });
 },[deals,now]);

 const visible=entries.filter(e=>
  (category==='All'||category===e.category)&&
  `${e.name} ${e.category} ${e.tagline}`.toLowerCase().includes(search.trim().toLowerCase())
 );
 const withMenus=entries.filter(e=>e.menuCount>0).length;

 return <section className="dh-restaurants" aria-label="Restaurant directory">
  <div className="dh-restaurants__header">
   <div>
    <p className="dh-restaurants__eyebrow">YOUR CRAVINGS, ALL IN ONE PLACE</p>
    <h1>Explore your <span>favourite brands.</span></h1>
    <p>Discover Malaysia’s food and drink favourites, then compare available menu offers in DealHunter.</p>
   </div>
   <div className="dh-restaurants__count"><Store size={21}/><b>{entries.length}</b><span>brands to explore</span></div>
  </div>

  <div className="dh-restaurants__toolbar">
   <label className="dh-restaurants__search">
    <Search size={19} aria-hidden="true"/>
    <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
      placeholder="Search McDonald’s, ZUS, pizza, coffee…" aria-label="Search restaurants"/>
    {search&&<button type="button" aria-label="Clear restaurant search" onClick={()=>setSearch('')}><X size={17}/></button>}
   </label>
   <div className="dh-restaurants__filter-label"><SlidersHorizontal size={17}/> Find your craving</div>
  </div>

  <div className="dh-restaurants__filters" role="group" aria-label="Filter by restaurant category">
   {filters.map(f=><button key={f} type="button" aria-pressed={category===f}
      className={category===f?'is-active':''} onClick={()=>setCategory(f)}>
      {f==='All'?'All brands':f}
   </button>)}
  </div>

  <div className="dh-restaurants__result-bar">
   <h2>{category==='All'?'All restaurants':category}</h2>
   <span>{visible.length} brands <i/> {withMenus} with comparison menus</span>
  </div>

  {visible.length===0?
   <div className="dh-restaurants__empty"><Store size={28}/><h3>No matching restaurants</h3>
    <p>Try another search or choose All brands.</p>
    <button type="button" onClick={()=>{setSearch('');setCategory('All')}}>Show all brands <ArrowRight size={16}/></button>
   </div>:
   <div className="dh-restaurants__grid">
    {visible.map(e=><article className="dh-restaurant" key={restaurantKey(e.name)}>
     <div className="dh-restaurant__top">
      <div className="dh-restaurant__logo"><BrandLogo brand={e.name} variant="tile"/></div>
      <div className="dh-restaurant__identity">
       <span className="dh-restaurant__type">{e.category}</span>
       <h3>{e.name}</h3>
       <p>{e.tagline}</p>
      </div>
     </div>

     <div className="dh-restaurant__status">
      <span className={e.menuCount?'dh-restaurant__availability has-menus':'dh-restaurant__availability'}>
       <i/>{e.menuCount?`${e.menuCount} menu ${e.menuCount===1?'item':'items'}`:'Coming to comparison'}
      </span>
      {e.menuCount>0&&<small>{e.isDemo?'Demo prices':'Menu comparisons'}</small>}
     </div>

     <div className="dh-restaurant__actions">
      {e.menuCount>0?<button type="button" className="dh-restaurant__explore" onClick={()=>onExplore(e.name)}>
       Explore menu <ArrowRight size={16}/>
      </button>:<span className="dh-restaurant__pending">Menu comparison not available yet</span>}
      {e.website&&<a className="dh-restaurant__website" href={e.website} target="_blank" rel="noopener noreferrer"
        aria-label={`Visit ${e.name} official website`}>
       Official site <ArrowUpRight size={16}/>
      </a>}
     </div>
    </article>)}
   </div>}
  <p className="dh-restaurants__note">Brand logos identify their respective owners. DealHunter is an independent comparison directory; an appearance here does not imply partnership. Menu prices marked Demo are illustrative.</p>
 </section>;
}
