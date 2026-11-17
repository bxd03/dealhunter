import {env} from 'cloudflare:workers';
import {validateDeals,Deal} from './deals';
export const db=()=>{if(!env.DB)throw Error('Database unavailable');return env.DB;};
export function isAdmin(req:Request){const configured=(env as any).ADMIN_EMAILS||(env as any).ADMIN_EMAIL;const email=req.headers.get('oai-authenticated-user-email');return !!configured&&!!req.headers.get('oai-authenticated-user-id')&&!!email&&String(configured).split(',').map(s=>s.trim().toLowerCase()).includes(email.toLowerCase());}
export const sameOrigin=(req:Request)=>req.headers.get('origin')===new URL(req.url).origin;
export async function persist(ds:Deal[]){await db().batch(ds.map(d=>db().prepare('INSERT INTO catalog(id,data,updated) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated=excluded.updated').bind(d.id,JSON.stringify(d),d.updated)));}
let collecting:Promise<number>|null=null;
export async function collect(force=false){
 const u=(env as any).PROMOTION_FEED_URL;if(!u){if(force)throw Error('No authorized feed configured. Import verified offers or configure PROMOTION_FEED_URL.');return 0;}
 if(collecting)return collecting;
 const row=await db().prepare('SELECT data FROM collection WHERE id=?').bind('feed').first<{data:string}>();const last=row?JSON.parse(row.data):{};
 if(!force&&(Date.now()-(last.success||0)<86400000||Date.now()-(last.attempt||0)<900000))return 0;
 collecting=(async()=>{await db().prepare('INSERT INTO collection(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind('feed',JSON.stringify({...last,attempt:Date.now()})).run();const url=new URL(u);if(url.protocol!=='https:')throw Error('Feed must use HTTPS');const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(15000),headers:(env as any).PROMOTION_FEED_TOKEN?{Authorization:`Bearer ${(env as any).PROMOTION_FEED_TOKEN}`}:{}});if(!response.ok)throw Error('Authorized feed could not be fetched');const body=await response.text();if(body.length>1000000)throw Error('Feed limit is 1 MB');const ds=validateDeals(JSON.parse(body));await persist(ds);await db().prepare('UPDATE collection SET data=? WHERE id=?').bind(JSON.stringify({attempt:Date.now(),success:Date.now()}),'feed').run();return ds.length;})();try{return await collecting}finally{collecting=null}
}
