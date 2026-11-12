const V='carnet-muscu-v17';
const CORE=['./','./index.html','./manifest.webmanifest','./config.js','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const rq=e.request;if(rq.method!=='GET')return;
  const u=new URL(rq.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(rq).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(rq,cp))}return r}).catch(()=>caches.match(rq,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(V).then(c=>c.match(rq).then(hit=>hit||fetch(rq).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(rq,r.clone());return r}).catch(()=>new Response('',{status:204})))));
  }
});
