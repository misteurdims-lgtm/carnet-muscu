// Relais Strava pour Carnet de muscu (Cloudflare Workers, gratuit).
// Variables à définir dans Cloudflare : STRAVA_ID, STRAVA_SECRET (en "Secret").
const ALLOW = 'https://misteurdims-lgtm.github.io';
export default {
  async fetch(req, env) {
    const cors = { 'Access-Control-Allow-Origin': ALLOW, 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST,OPTIONS' };
    const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, 'content-type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return j({ error: 'post' }, 405);
    let b; try { b = await req.json(); } catch (e) { return j({ error: 'json' }, 400); }
    const tok = async p => (await fetch('https://www.strava.com/oauth/token', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ client_id: env.STRAVA_ID, client_secret: env.STRAVA_SECRET, ...p }) })).json();
    if (b.op === 'exchange') {
      const t = await tok({ code: b.code, grant_type: 'authorization_code' });
      if (!t.refresh_token) return j({ error: 'exchange' }, 400);
      return j({ refresh: t.refresh_token, name: (t.athlete && t.athlete.firstname) || '' });
    }
    if (b.op === 'sync') {
      const t = await tok({ grant_type: 'refresh_token', refresh_token: String(b.refresh || '') });
      if (!t.access_token) return j({ error: 'refresh' }, 401);
      const a = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=50&after=' + (parseInt(b.after, 10) || 0), { headers: { authorization: 'Bearer ' + t.access_token } });
      if (!a.ok) return j({ error: 'acts' }, 502);
      const l = await a.json();
      return j({ refresh: t.refresh_token, acts: l.map(x => ({ id: x.id, type: x.sport_type || x.type, dist: x.distance, dur: x.moving_time, t0: Date.parse(x.start_date), poly: (x.map && x.map.summary_polyline) || '', manual: !!x.manual })) });
    }
    return j({ error: 'op' }, 400);
  }
};
