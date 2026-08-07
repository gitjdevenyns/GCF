
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let currentPage='home', map, markers=[], deferredPrompt;
const savedTheme=localStorage.getItem('theme')||'dark';
document.documentElement.dataset.theme=savedTheme;
themeBtn.textContent=savedTheme==='dark'?'☀️':'🌙';

function renderSpecies(){
 speciesGrid.innerHTML=FISH_DATA.map(f=>`<button class="card species-card" style="--accent:${f.accent};text-align:left;color:inherit" data-fish="${f.id}">
 <div class="fish-icon">${f.emoji}</div><h3>${f.name}</h3><p>${f.where}</p><div class="bar"></div></button>`).join('');
 $$('[data-fish]').forEach(b=>b.onclick=()=>showFish(b.dataset.fish));
 catchSpecies.innerHTML='<option value="">Select species</option>'+FISH_DATA.map(f=>`<option>${f.name}</option>`).join('');
}
function showFish(id){
 const f=FISH_DATA.find(x=>x.id===id); if(!f)return;
 $$('.page').forEach(p=>p.classList.remove('active')); fishDetail.classList.add('active');
 detailContent.innerHTML=`<div style="font-size:3rem">${f.emoji}</div><h2>${f.name}</h2>
 <div class="info-list">
 ${[['Where to find it',f.where],['Best season',f.season],['Baits & lures',f.bait],['Recommended rig',f.rig],['Tide strategy',f.tide],['Local tactic',f.tips],['Regulation quick reference',f.regs],['How to measure',f.measure]].map(([a,b],i)=>`<div class="info ${i===6?'warning':''}"><b>${a}</b>${b}</div>`).join('')}
 </div>`;
 window.scrollTo({top:0,behavior:'smooth'});
}
backBtn.onclick=()=>{fishDetail.classList.remove('active');document.getElementById(currentPage).classList.add('active')};

function nav(page){
 currentPage=page; fishDetail.classList.remove('active'); $$('.page').forEach(p=>p.classList.toggle('active',p.id===page));
 $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 if(page==='mapPage')setTimeout(()=>{initMap();map.invalidateSize()},80);
 window.scrollTo(0,0);
}
$$('.nav-btn').forEach(b=>b.onclick=()=>nav(b.dataset.page));

themeBtn.onclick=()=>{
 const n=document.documentElement.dataset.theme==='dark'?'light':'dark';
 document.documentElement.dataset.theme=n; localStorage.setItem('theme',n); themeBtn.textContent=n==='dark'?'☀️':'🌙';
 if(map) setTimeout(()=>map.invalidateSize(),50);
};

const quickItems=['Saltwater license / exemptions checked','Current FWC regulations checked','PFD, whistle and phone','Pliers and dehooker','Water and sun protection','Leader, hooks and backup lures'];
const gearItems=['15–20 lb fluorocarbon','25–30 lb fluorocarbon','40–60 lb fluorocarbon','1/0–4/0 circle hooks','1/8–1/2 oz jig heads','Popping corks','3–5 in paddletails','Gold spoon','Topwater plug','Landing net and fish grips'];
function renderChecks(el,items,key){
 const saved=JSON.parse(localStorage.getItem(key)||'{}');
 el.innerHTML=items.map((x,i)=>`<label><input type="checkbox" data-k="${i}" ${saved[i]?'checked':''}> ${x}</label>`).join('');
 el.querySelectorAll('input').forEach(c=>c.onchange=()=>{saved[c.dataset.k]=c.checked;localStorage.setItem(key,JSON.stringify(saved))});
}
renderChecks(quickChecklist,quickItems,'quickChecks'); renderChecks(gearChecklist,gearItems,'gearChecks');

const types=['all','shore','pier','launch','kayak','boat'];
spotFilters.innerHTML=types.map((t,i)=>`<button class="chip ${i===0?'active':''}" data-type="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('');
$$('[data-type]').forEach(b=>b.onclick=()=>{$$('[data-type]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderMarkers(b.dataset.type)});

function initMap(){
 if(map||!window.L)return;
 map=L.map('map').setView([26.91,-82.27],10);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
 renderMarkers('all');
}
function renderMarkers(type){
 if(!map)return; markers.forEach(m=>map.removeLayer(m));markers=[];
 SPOT_DATA.filter(s=>type==='all'||s.type===type).forEach(s=>{
  const m=L.marker([s.lat,s.lng]).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.best}<br><small><b>Best:</b> ${s.tide}<br><b>Access:</b> ${s.access}<br>${s.note}</small>`);
  markers.push(m);
 });
}

catchForm.onsubmit=e=>{
 e.preventDefault();
 const item={id:Date.now(),species:catchSpecies.value,length:catchLength.value,location:catchLocation.value,tide:catchTide.value,bait:catchBait.value,notes:catchNotes.value,date:new Date().toLocaleString()};
 const logs=JSON.parse(localStorage.getItem('catchLogs')||'[]');logs.unshift(item);localStorage.setItem('catchLogs',JSON.stringify(logs));catchForm.reset();renderLogs();
};
function renderLogs(){
 const logs=JSON.parse(localStorage.getItem('catchLogs')||'[]');
 catchList.innerHTML=logs.length?logs.map(x=>`<div class="card log-item"><div><b>${x.species}</b><br><small>${x.date}${x.location?' • '+x.location:''}</small><p>${x.length?x.length+' in • ':''}${x.tide||''}${x.bait?' • '+x.bait:''}</p>${x.notes?`<small>${x.notes}</small>`:''}</div><button class="chip" onclick="deleteLog(${x.id})">Delete</button></div>`).join(''):'<div class="empty">No catches saved yet.</div>';
}
window.deleteLog=id=>{const logs=JSON.parse(localStorage.getItem('catchLogs')||'[]').filter(x=>x.id!==id);localStorage.setItem('catchLogs',JSON.stringify(logs));renderLogs()};

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});
installBtn.onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true};
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js');

renderSpecies();renderLogs();
