
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
window.go=id=>{$$('.tab').forEach(x=>x.classList.toggle('active',x.id===id));$$('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));if(id==='spots')setTimeout(()=>{initMap();map.invalidateSize()},60);scrollTo(0,0)}
$$('nav button').forEach(b=>b.onclick=()=>go(b.dataset.tab));
document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark';theme.textContent=document.documentElement.dataset.theme==='dark'?'☀️':'🌙';
theme.onclick=()=>{let d=document.documentElement;d.dataset.theme=d.dataset.theme==='dark'?'light':'dark';localStorage.setItem('theme',d.dataset.theme);theme.textContent=d.dataset.theme==='dark'?'☀️':'🌙'}

function fishCard(f){return `<article class="card" onclick="showFish('${f.id}')"><img class="photo" src="${f.photo}" alt="${f.name}"><div class="body"><h3>${f.name}</h3><span class="badge">Real reference photo</span><span class="badge">ID + tactics</span><p class="muted">${f.where}</p></div></article>`}
homeFish.innerHTML=FISH.map(fishCard).join('');fishCards.innerHTML=FISH.map(fishCard).join('');
window.showFish=id=>{go('fish');const f=FISH.find(x=>x.id===id);fishDetail.innerHTML=`<div class="detail"><div class="detailHero"><img src="${f.photo}"><div><h2>${f.name}</h2><div class="info"><b>Fast visual ID</b>${f.idtips.map(x=>'• '+x).join('<br>')}</div><p class="source">Reference photo: Florida Museum / credited photographer or agency.</p></div></div>${[['Where to find it',f.where],['How to read the water',f.water],['Baits & lures',f.bait],['Rig',f.rig],['Tide / timing',f.tide],['Regulation note',f.reg]].map(x=>`<div class="info"><b>${x[0]}</b>${x[1]}</div>`).join('')}</div>`;fishDetail.scrollIntoView({behavior:'smooth'})}

habitats.innerHTML=HABITATS.map(h=>`<article class="card"><div class="body"><div class="habicon">${h.emoji}</div><h3>${h.name}</h3><div class="info"><b>What it looks like</b>${h.visual}</div><div class="info"><b>Why you care</b>${h.fish}</div><div class="info"><b>How to fish it</b>${h.how}</div></div></article>`).join('');

function injuryPanel(d){
 const media=(window.INJURY_MEDIA||{})[d.name]||[];
 if(!media.length)return '';
 const id='inj_'+d.name.replace(/\\W+/g,'_');
 return `<div class="injury-warning">
   <div class="iw-head">
     <div>
       <strong class="dont-be-you">⚠️ DON'T LET THIS BE YOU</strong>
       <div style="font-size:.78rem">Real documented injury photos — graphic medical content</div>
     </div>
   </div>
   <div id="${id}" class="injury-gallery open">
    ${media.map(m=>`<div class="injury-shot">
      <img loading="eager" src="${m.image}" alt="Documented ${d.name} injury"
        onerror="this.style.display='none';this.nextElementSibling.insertAdjacentHTML('afterbegin','<div class=&quot;graphic-note&quot;>Image host blocked loading. Use the source link below to view the documented case.</div>')">
      <div class="caption">
        <b>Real injury example</b>${m.caption}<br>
        <a href="${m.sourceUrl}" target="_blank" rel="noopener">${m.source}</a>
      </div>
    </div>`).join('')}
   </div>
 </div>`;
}

dangerGrid.innerHTML=DANGER.map(d=>`<article class="card dangerCard">${d.photo?`<img class="photo" src="${d.photo}" alt="${d.name}">`:''}<div class="body"><div class="risk">${d.risk}</div><h3>${d.name}</h3><div class="info"><b>Recognize it</b>${d.look}</div><div class="info"><b>What can hurt you</b>${d.danger}</div><div class="info"><b>Safest handling</b>${d.handle}</div><div class="info"><b>If injured</b>${d.first}</div>${injuryPanel(d)}<p class="source">${d.source}</p></div></article>`).join('');

let map,markers=[],street,sat;
function initMap(){
 if(map||!window.L)return;
 map=L.map('map').setView([27.18,-82.49],9);
 street=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
 sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Esri World Imagery'});
 L.control.layers({"Street":street,"Satellite":sat}).addTo(map);
 renderSpots();
}
function match(s){let z=zone.value,a=access.value;return (z==='all'||s.zone===z)&&(a==='all'||s.access.includes(a))}
function renderSpots(){
 let arr=SPOTS.filter(match);
 if(map){markers.forEach(m=>map.removeLayer(m));markers=[];arr.forEach(s=>{let m=L.marker([s.lat,s.lng]).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.rating}<br><b>Targets:</b> ${s.species}<br><b>Structure:</b> ${s.structure}<br><b>Tide:</b> ${s.tide}<br>${s.tactic}`);markers.push(m)})}
 spotList.innerHTML=arr.map(s=>`<article class="card spotCard"><div class="body"><h3>${s.name}</h3><div class="stars">${s.rating}</div><div class="spotmeta"><b>${s.zone}</b> • ${s.access}<br><b>Targets:</b> ${s.species}<br><b>Structure:</b> ${s.structure}<br><b>Best water:</b> ${s.tide}</div><p>${s.tactic}</p><a target="_blank" href="https://maps.apple.com/?ll=${s.lat},${s.lng}&q=${encodeURIComponent(s.name)}">Open in Apple Maps</a></div></article>`).join('');
}
zone.onchange=renderSpots;access.onchange=renderSpots;renderSpots();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js');
