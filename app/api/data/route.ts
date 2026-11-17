import {env} from 'cloudflare:workers';
import {db,collect} from '../../../lib/server';
import {demoDeals} from '../../../lib/deals';
export const dynamic='force-dynamic';
export async function GET(){try{let feedError='';try{await collect()}catch{feedError='Feed unavailable; showing stored offers.'}const rows=await db().prepare('SELECT data FROM catalog').all<{data:string}>();const imported=rows.results.map(r=>JSON.parse(r.data));const ids=new Set(imported.map(d=>d.id));return Response.json({deals:[...imported,...demoDeals.filter(d=>!ids.has(d.id))],feedConfigured:!!(env as any).PROMOTION_FEED_URL,feedError},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Could not load the promotion database. Please retry.'},{status:503});}}
