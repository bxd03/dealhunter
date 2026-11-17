import {db,isAdmin} from '../../../lib/server';
import {officialSources,validateOfficial,OfficialPromotion} from '../../../lib/official';
export const dynamic='force-dynamic';
export async function GET(){try{const rows=await db().prepare('SELECT data FROM official_promotions').all<{data:string}>();const status=await db().prepare('SELECT data FROM collection WHERE id=?').bind('official-sources').first<{data:string}>();return Response.json({promotions:rows.results.map(r=>JSON.parse(r.data)),sources:officialSources,checks:status?JSON.parse(status.data):[]},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Official offers could not load. Please retry.'},{status:503})}}
// The hosted Site is owner-private: dispatch authenticates service requests with
// OAI-Sites-Authorization and consumes that token. This writes only shared offer
// records, never user profiles. Disable this service writer before public sharing.
// Browser writes additionally require the administrator's verified identity.
export async function POST(req:Request){
 if(req.headers.get('origin')&&!isAdmin(req))return Response.json({error:'Administrator access required'},{status:403});
 try{const raw=await req.text();if(raw.length>200000)throw Error('Update limit is 200 KB');const {promotions,checks}=validateOfficial(JSON.parse(raw));const existing=await db().prepare('SELECT data FROM official_promotions').all<{data:string}>();const incoming=new Set(promotions.map(p=>p.id));
 const remove=existing.results.map(r=>JSON.parse(r.data) as OfficialPromotion).filter(p=>checks.some(c=>c.sourceId===p.sourceId&&c.status==='checked')&&!incoming.has(p.id));
 const prev=await db().prepare('SELECT data FROM collection WHERE id=?').bind('official-sources').first<{data:string}>();const old=prev?JSON.parse(prev.data):[];const merged=[...checks,...old.filter((c:any)=>!checks.some(n=>n.sourceId===c.sourceId))];
 await db().batch([...remove.map(p=>db().prepare('DELETE FROM official_promotions WHERE id=?').bind(p.id)),...promotions.map(p=>db().prepare('INSERT INTO official_promotions(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(p.id,JSON.stringify(p))),db().prepare('INSERT INTO collection(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind('official-sources',JSON.stringify(merged))]);
 return Response.json({ok:true,stored:promotions.length,removed:remove.length,checks});
 }catch(e){return Response.json({error:(e as Error).message},{status:400})}
}
