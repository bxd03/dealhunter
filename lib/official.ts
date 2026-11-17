export const officialSources=[{id:'mcd',brand:'McDonald’s',url:'https://www.mcdonalds.com.my/en/promotion/',domain:'mcdonalds.com.my'},{id:'tealive',brand:'Tealive',url:'https://www.tealive.com.my/loyalty-app',domain:'tealive.com.my'},{id:'zus',brand:'ZUS Coffee',url:'https://zuscoffee.com/faq/',domain:'zuscoffee.com'}];
export type OfficialPromotion={id:string;sourceId:string;brand:string;title:string;summary:string;conditions:string;url:string;benefit:string;starts:string|null;expires:string|null;availability:string;checkedAt:string};
export type SourceCheck={sourceId:string;status:'checked'|'failed';message:string;checkedAt:string};
export function sourceUrlAllowed(value:string,sourceId:string){try{const u=new URL(value);const s=officialSources.find(s=>s.id===sourceId);return !!s&&u.protocol==='https:'&&!u.username&&!u.password&&(u.hostname===s.domain||u.hostname.endsWith('.'+s.domain))}catch{return false}}
export function promotionStatus(p:OfficialPromotion,now=Date.now()){
 if(p.expires&&Date.parse(p.expires)<=now)return 'Expired';
 if(p.starts&&Date.parse(p.starts)>now)return 'Upcoming';
 if(now-Date.parse(p.checkedAt)>48*3600000)return 'Needs recheck';
 return p.expires?'Published offer':'End date not published';
}
export function validateOfficial(body:any,checkedAt=new Date().toISOString()):{promotions:OfficialPromotion[],checks:SourceCheck[]}{
 if(!body||!Array.isArray(body.promotions)||body.promotions.length>100||!Array.isArray(body.checks)||body.checks.length>officialSources.length)throw Error('Use promotions and checks arrays, with at most 100 offers.');
 const str=(v:any,max:number)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
 const checks:SourceCheck[]=body.checks.map((c:any)=>{if(!officialSources.some(s=>s.id===c.sourceId)||!['checked','failed'].includes(c.status)||!str(c.message,300))throw Error('Invalid source check');return {sourceId:c.sourceId,status:c.status,message:c.message,checkedAt}});
 if(new Set(checks.map(c=>c.sourceId)).size!==checks.length)throw Error('Duplicate source checks');
 const promotions:OfficialPromotion[]=body.promotions.map((p:any)=>{if(!p||!str(p.id,160)||!str(p.title,180)||!str(p.summary,800)||!str(p.conditions,1200)||!str(p.benefit,160)||!str(p.availability,240)||!sourceUrlAllowed(p.url,p.sourceId)||!checks.some(c=>c.sourceId===p.sourceId&&c.status==='checked'))throw Error('Invalid official offer or missing successful source check');
 for(const k of ['starts','expires'])if(p[k]!==null&&(!str(p[k],40)||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(p[k])||!Number.isFinite(Date.parse(p[k]))))throw Error('Dates must be null or ISO-8601 with timezone');
 if(p.starts&&p.expires&&Date.parse(p.starts)>=Date.parse(p.expires))throw Error('End must follow start');
 return {id:p.id,sourceId:p.sourceId,brand:officialSources.find(s=>s.id===p.sourceId)!.brand,title:p.title,summary:p.summary,conditions:p.conditions,url:p.url,benefit:p.benefit,starts:p.starts,expires:p.expires,availability:p.availability,checkedAt};});
 if(new Set(promotions.map(p=>p.id)).size!==promotions.length)throw Error('Duplicate offer IDs');
 return {promotions,checks};
}
