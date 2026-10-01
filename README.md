<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Repère</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
:root{--bg:#f3f6f4;--card:#fff;--tx:#1f2a27;--mu:#667570;--ac:#3f8f7b;--ac2:#e9f4f0;--bd:#dde6e2;--wa:#c2410c;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px)}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#121816;--card:#1b2420;--tx:#e8efec;--mu:#9baba5;--ac:#5fb59f;--ac2:#22312c;--bd:#2c3a35}}
:root[data-theme="dark"]{--bg:#121816;--card:#1b2420;--tx:#e8efec;--mu:#9baba5;--ac:#5fb59f;--ac2:#22312c;--bd:#2c3a35}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--tx);font:17px/1.45 -apple-system,system-ui,Helvetica,sans-serif}
main{max-width:640px;margin:0 auto;padding:12px 14px 100px}
h1{font-size:22px;margin:6px 0 4px}h2{font-size:17px;margin:0 0 8px}
.card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:14px;margin-bottom:12px}
input,select,textarea,button{font:inherit;color:var(--tx);background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:12px;width:100%;margin:4px 0}
button{background:var(--ac);color:#fff;border:0;font-weight:600;cursor:pointer}
button.s{background:var(--ac2);color:var(--tx);border:1px solid var(--bd)}
button.x{width:auto;padding:4px 10px;background:none;color:var(--mu);border:0}
.row{display:flex;gap:8px}.row>*{flex:1}
.mu{color:var(--mu);font-size:14px}
.moods{display:flex;gap:6px}.moods button{font-size:28px;padding:10px 0;background:var(--ac2)}.moods button.on{outline:3px solid var(--ac)}
.item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--bd)}.item:last-child{border:0}
.item input[type=checkbox]{width:26px;height:26px;margin:0;flex:none}
.item.d span{text-decoration:line-through;color:var(--mu)}
.bars{display:flex;align-items:flex-end;gap:4px;height:70px;margin:8px 0}.bars i{flex:1;background:var(--ac);border-radius:4px 4px 0 0;min-height:4px}
.bar{height:10px;background:var(--bd);border-radius:6px;overflow:hidden;margin:6px 0}.bar i{display:block;height:100%;background:var(--ac)}
.big{font-size:34px;font-weight:700}
.warn{background:rgba(194,65,12,.12);border:1px solid var(--wa);border-radius:12px;padding:10px;margin-bottom:12px}
a.call{display:block;background:var(--wa);color:#fff;text-align:center;text-decoration:none;border-radius:12px;padding:14px;font-weight:600;margin-bottom:6px}
nav{position:fixed;bottom:0;left:0;right:0;display:flex;overflow-x:auto;background:var(--card);border-top:1px solid var(--bd);padding-bottom:env(safe-area-inset-bottom,0px)}
nav button{background:none;color:var(--mu);border:0;border-radius:0;font-size:11px;padding:8px 6px;margin:0;flex:1 0 auto;min-width:68px;width:auto}
nav button.on{color:var(--ac)}nav span{display:block;font-size:22px}
.circle{width:140px;height:140px;border-radius:50%;background:var(--ac);margin:20px auto;animation:br 10s ease-in-out infinite;opacity:.85}
@keyframes br{0%,100%{transform:scale(.6)}40%{transform:scale(1.15)}}
.chip{display:inline-block;background:var(--ac2);border-radius:20px;padding:4px 12px;margin:2px;font-size:14px}
</style>
</head>
<body>
<main id="app"></main>
<nav id="nav"></nav>
<script>
const TABS=[["moi","🌿","Moi"],["energie","🔋","Énergie"],["calme","🫧","Calme"],["defis","🪜","Petits pas"],["parent","👨‍👩‍👧","Parent"],["sos","🆘","Aide"]];
const KEY="repere_v1";
const MIN=["Boire un verre d'eau","Manger quelque chose","Prendre mes médicaments","Me laver ou me rafraîchir","Ouvrir la fenêtre ou sortir 5 min"];
let S={chk:[],minD:"",min:[],sp:{max:10,t:[]},lad:[],kid:"",rout:[{e:"🪥",n:"Se brosser les dents"},{e:"🎒",n:"Préparer le sac"}],routD:"",routDone:[],stars:0,inc:[],cplan:{a:"",p:"",r:""},plan:{s:"",h:"",p:""}};
try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const today=()=>new Date().toISOString().slice(0,10);
let tab="moi",tm=null;
function go(t){tab=t;render();scrollTo(0,0)}
function render(){$("nav").innerHTML=TABS.map(t=>`<button class="${tab==t[0]?"on":""}" onclick="go('${t[0]}')"><span>${t[1]}</span>${t[2]}</button>`).join("");$("app").innerHTML=({moi,energie,calme,defis,parent,sos,...(window.EXT||{})})[tab]()}
function copy(t){try{navigator.clipboard.writeText(t);alert("Copié")}catch(e){alert(t)}}

/* MOI */
let cm=3;
function setM(v){cm=v;document.querySelectorAll(".moods button").forEach((b,i)=>b.classList.toggle("on",i+1==v))}
function saveChk(){S.chk=S.chk.filter(c=>c.d!=today());S.chk.push({d:today(),m:cm,e:+$("ce").value,a:+$("ca").value,n:$("cn").value});save();render()}
function togMin(i){if(S.minD!=today()){S.minD=today();S.min=[]}const k=S.min.indexOf(i);k<0?S.min.push(i):S.min.splice(k,1);save();render()}
function moi(){
  if(S.minD!=today()){S.minD=today();S.min=[];save()}
  const last=S.chk.slice(-14),low=S.chk.slice(-4).length>=4&&S.chk.slice(-4).every(c=>c.m<=2);
  const t=S.chk.find(c=>c.d==today());
  return `<h1>Bonjour 🌿</h1><div class="mu">Pas de pression. Chaque petite chose compte.</div><br>
  ${low?`<div class="warn"><b>Ces derniers jours ont été difficiles.</b> Tu n'as pas à traverser ça seul(e). Parle-en à ton médecin ou thérapeute. Tu peux aussi appeler le <b>143</b> (24h/24) : onglet Aide.</div>`:""}
  <div class="card"><h2>Comment ça va ?</h2><div class="moods">${["😞","😕","😐","🙂","😄"].map((e,i)=>`<button class="${(t?t.m:3)==i+1?"on":""}" onclick="setM(${i+1})">${e}</button>`).join("")}</div>
  <label class="mu">Énergie (1 vide → 5 pleine)</label><input id="ce" type="range" min="1" max="5" value="${t?t.e:3}">
  <label class="mu">Anxiété (1 calme → 5 très forte)</label><input id="ca" type="range" min="1" max="5" value="${t?t.a:2}">
  <input id="cn" placeholder="Une phrase si tu veux (facultatif)" value="${esc(t?t.n:"")}"><button onclick="saveChk()">Enregistrer</button></div>
  <div class="card"><h2>Mes 14 derniers jours</h2><div class="bars">${last.map(c=>`<i style="height:${c.m*20}%" title="${c.d}"></i>`).join("")||'<span class="mu">Pas encore de données</span>'}</div></div>
  <div class="card"><h2>Le minimum du jour</h2><div class="mu">Même un mauvais jour, ça suffit déjà.</div>${MIN.map((m,i)=>`<div class="item ${S.min.includes(i)?"d":""}"><input type="checkbox" ${S.min.includes(i)?"checked":""} onchange="togMin(${i})"><span>${m}</span></div>`).join("")}</div>`;
}

/* ENERGIE */
function addSp(){const n=$("tn").value.trim();if(!n)return;S.sp.t.push({n,c:+$("tc").value,d:today(),ok:false});save();render()}
function togSp(i){S.sp.t[i].ok=!S.sp.t[i].ok;save();render()}
function delSp(i){S.sp.t.splice(i,1);save();render()}
function setMax(){S.sp.max=+$("sm").value||10;save();render()}
function startT(min){clearInterval(tm);let s=min*60;const u=()=>{const e=$("tmr");if(e)e.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");if(s--<=0){clearInterval(tm);if(e)e.textContent="Bravo, c'est fait 🎉"}};u();tm=setInterval(u,1000)}
function energie(){
  const ts=S.sp.t.filter(t=>t.d==today()),used=ts.filter(t=>t.ok).reduce((s,t)=>s+t.c,0),plan=ts.reduce((s,t)=>s+t.c,0),left=S.sp.max-used;
  return `<h1>🔋 Mon énergie</h1><div class="mu">Chaque tâche coûte des points. Quand la réserve est vide, on s'arrête sans culpa.</div><br>
  <div class="card"><div class="mu">Énergie restante aujourd'hui</div><div class="big">${left} / ${S.sp.max}</div><div class="bar"><i style="width:${Math.max(0,left/S.sp.max*100)}%"></i></div>
  ${plan>S.sp.max?`<div class="warn">Ton programme (${plan} points) dépasse ta réserve. Retire une tâche ou reporte-la à demain.</div>`:""}
  <div class="row"><input id="sm" type="number" value="${S.sp.max}"><button class="s" onclick="setMax()">Ma réserve</button></div></div>
  <div class="card"><h2>Ajouter une tâche</h2><input id="tn" placeholder="Ex. : appeler la pharmacie"><select id="tc"><option value="1">1 point : facile</option><option value="2">2 points : moyen</option><option value="3">3 points : fatigant</option><option value="5">5 points : très lourd</option></select><button onclick="addSp()">Ajouter</button></div>
  <div class="card">${ts.map(t=>`<div class="item ${t.ok?"d":""}"><input type="checkbox" ${t.ok?"checked":""} onchange="togSp(${S.sp.t.indexOf(t)})"><span style="flex:1">${esc(t.n)} <span class="chip">${t.c} pt</span></span><button class="x" onclick="delSp(${S.sp.t.indexOf(t)})">✕</button></div>`).join("")||'<div class="mu">Aucune tâche aujourd\'hui</div>'}</div>
  <div class="card"><h2>⏱️ Juste commencer</h2><div class="mu">Tu n'as pas à finir. Seulement commencer, le temps du minuteur.</div><div class="row"><button class="s" onclick="startT(5)">5 min</button><button class="s" onclick="startT(15)">15 min</button><button class="s" onclick="startT(25)">25 min</button></div><div id="tmr" class="big" style="text-align:center"></div></div>`;
}
/* CALME */
let gi=-1;
const GR=["Nomme 5 choses que tu vois","Touche 4 choses autour de toi","Écoute 3 sons","Repère 2 odeurs","Note 1 chose que tu goûtes ou que tu apprécies"];
function nextG(){gi=(gi+1)%GR.length;$("gr").textContent=(gi+1)+"/5 · "+GR[gi]}
function calme(){
  return `<h1>🫧 Se calmer</h1><div class="card"><h2>Respiration</h2><div class="mu" style="text-align:center">Quand le cercle grandit, inspire. Quand il rétrécit, expire lentement.</div><div class="circle"></div></div>
  <div class="card"><h2>Ancrage 5-4-3-2-1</h2><div id="gr" style="font-size:19px;min-height:30px">Touche le bouton pour commencer.</div><button onclick="nextG()">Étape suivante</button></div>
  <div class="card"><h2>Surcharge sensorielle</h2>${["Réduire le bruit : casque ou bouchons","Baisser la lumière ou fermer les yeux","Aller dans un endroit calme","Boire de l'eau, respirer lentement","Ne prendre aucune décision pour le moment","Se balancer ou bouger est autorisé : ça aide"].map(x=>`<div class="item"><span>• ${x}</span></div>`).join("")}</div>
  <div class="card"><h2>Pensées noires ?</h2><div class="mu">Une pensée n'est pas un fait. Écris-la, puis demande-toi : « Qu'est-ce que je dirais à un ami qui pense ça ? »</div></div>`;
}

/* DEFIS */
const SC=["Je suis un peu dépassé(e) en ce moment, je peux avoir un moment ?","J'ai besoin de plus de temps pour répondre.","Je ne peux pas venir, mais merci de m'avoir invité(e).","Peux-tu m'expliquer ça par écrit, s'il te plaît ?","J'ai besoin d'aide pour…","Je suis autiste/TDAH, j'ai besoin de bruit réduit et de clarté."];
function addL(){const n=$("ln").value.trim();if(!n)return;S.lad.push({n,l:+$("ll").value,pre:+$("lp").value,post:null});save();render()}
function doneL(i){const v=prompt("Anxiété réelle (0 à 10) ?");if(v===null)return;S.lad[i].post=Math.max(0,Math.min(10,+v||0));save();render()}
function delL(i){S.lad.splice(i,1);save();render()}
function defis(){
  const L=S.lad.map((x,i)=>({...x,i})).sort((a,b)=>a.l-b.l);
  return `<h1>🪜 Petits pas</h1><div class="mu">On avance doucement vers ce qui fait peur, du plus facile au plus dur. Aucun pas n'est trop petit.</div><br>
  <div class="card"><input id="ln" placeholder="Ex. : dire bonjour au voisin"><label class="mu">Difficulté (1 facile → 10 très dur)</label><input id="ll" type="number" min="1" max="10" value="3"><label class="mu">Anxiété que je prévois (0-10)</label><input id="lp" type="number" min="0" max="10" value="5"><button onclick="addL()">Ajouter à mon échelle</button></div>
  <div class="card">${L.map(x=>`<div class="item"><div style="flex:1"><b>${esc(x.n)}</b> <span class="chip">niveau ${x.l}</span><div class="mu">Prévu ${x.pre}/10${x.post!==null?` · Réel <b>${x.post}/10</b> ${x.post<x.pre?"👏 c'était moins dur que prévu":""}`:""}</div></div>${x.post===null?`<button class="s" style="width:auto" onclick="doneL(${x.i})">Fait</button>`:"✅"}<button class="x" onclick="delL(${x.i})">✕</button></div>`).join("")||'<div class="mu">Aucun défi pour l\'instant</div>'}</div>
  <div class="card"><h2>Phrases toutes prêtes</h2><div class="mu">Touche pour copier.</div>${SC.map(s=>`<button class="s" style="text-align:left" onclick="copy(this.textContent)">${esc(s)}</button>`).join("")}</div>`;
}

/* PARENT */
function setKid(){S.kid=$("kn").value;save()}
function addR(){const n=$("rn").value.trim();if(!n)return;S.rout.push({e:$("re").value||"⭐",n});save();render()}
function delR(i){S.rout.splice(i,1);save();render()}
function togR(i){if(S.routD!=today()){S.routD=today();S.routDone=[]}const k=S.routDone.indexOf(i);if(k<0){S.routDone.push(i);if(S.routDone.length==S.rout.length)S.stars++}else S.routDone.splice(k,1);save();render()}
function addI(){S.inc.unshift({d:today(),t:$("it").value,dur:+$("id").value||0,h:$("ih").value});save();render()}
function saveCP(){S.cplan={a:$("pa").value,p:$("pp").value,r:$("pr").value};save();alert("Enregistré")}
function parent(){
  if(S.routD!=today()){S.routD=today();S.routDone=[]}
  const cnt={};S.inc.forEach(x=>cnt[x.t]=(cnt[x.t]||0)+1);const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
  return `<h1>👨‍👩‍👧 Espace parent</h1><div class="card"><input id="kn" placeholder="Prénom de l'enfant" value="${esc(S.kid)}" oninput="setKid()"></div>
  <div class="card"><h2>Routine visuelle ${S.kid?"de "+esc(S.kid):""} · ⭐ ${S.stars}</h2>${S.rout.map((r,i)=>`<div class="item ${S.routDone.includes(i)?"d":""}"><input type="checkbox" ${S.routDone.includes(i)?"checked":""} onchange="togR(${i})"><span style="font-size:26px">${esc(r.e)}</span><span style="flex:1">${esc(r.n)}</span><button class="x" onclick="delR(${i})">✕</button></div>`).join("")}
  <div class="row"><input id="re" placeholder="😀" style="flex:0 0 70px"><input id="rn" placeholder="Nouvelle étape"></div><button class="s" onclick="addR()">Ajouter</button><div class="mu">Une étoile quand toute la routine est faite.</div></div>
  <div class="card"><h2>Journal des crises</h2><select id="it">${["Bruit / lumière","Changement imprévu","Fatigue","Faim","Transition (passer à autre chose)","Frustration","Autre"].map(x=>`<option>${x}</option>`).join("")}</select><input id="id" type="number" placeholder="Durée en minutes"><input id="ih" placeholder="Ce qui a aidé"><button onclick="addI()">Noter</button>
  ${top?`<div class="warn">Déclencheur le plus fréquent : <b>${esc(top[0])}</b> (${top[1]} fois). Anticiper ce moment peut aider.</div>`:""}
  ${S.inc.slice(0,5).map(x=>`<div class="item"><div><b>${esc(x.t)}</b> · ${x.dur} min<div class="mu">${x.d} · ${esc(x.h)}</div></div></div>`).join("")}</div>
  <div class="card"><h2>Mon plan de crise</h2><label class="mu">Avant : signes qui montent</label><textarea id="pa" rows="2">${esc(S.cplan.a)}</textarea><label class="mu">Pendant : ce que je fais (peu de mots, voix calme, sécurité)</label><textarea id="pp" rows="2">${esc(S.cplan.p)}</textarea><label class="mu">Après : retour au calme</label><textarea id="pr" rows="2">${esc(S.cplan.r)}</textarea><button onclick="saveCP()">Enregistrer</button></div>
  <div class="card"><h2>Et toi, parent ?</h2><div class="mu">Tu as le droit d'être fatigué(e). Prendre soin de toi aide aussi ton enfant. Pense à demander du répit à ton entourage.<br><br>📞 Pro Juventute, conseils aux parents : <a href="tel:0848354555">0848 35 45 55</a> (à vérifier sur projuventute.ch)<br>🔗 autismesuisse.ch · aspedah.ch</div></div>`;
}
/* AIDE */
function saveP(){S.plan={s:$("ps").value,h:$("ph").value,p:$("pp2").value};save();alert("Enregistré")}
function exp(){$("bk").value=JSON.stringify(S)}
function imp(){try{S=Object.assign(S,JSON.parse($("bk").value));save();render()}catch(e){alert("Données invalides")}}
function sos(){
  const N=[["143","La Main Tendue : écoute 24h/24"],["144","Ambulance"],["112","Urgences"],["147","Pro Juventute (enfants et jeunes)"],["145","Tox Info Suisse"]];
  return `<h1>🆘 Aide</h1><div class="card" style="background:var(--ac2)"><b>Si tu penses à te faire du mal ou à mourir, appelle maintenant le 143 ou le 144.</b> Tu mérites de l'aide et tu n'es pas seul(e).</div>
  <div class="card">${N.map(n=>`<a class="call" href="tel:${n[0]}">📞 ${n[0]} · ${n[1]}</a>`).join("")}</div>
  <div class="card"><h2>Mon plan de sécurité</h2><label class="mu">Mes signes d'alerte</label><textarea id="ps" rows="2">${esc(S.plan.s)}</textarea><label class="mu">Ce qui m'aide</label><textarea id="ph" rows="2">${esc(S.plan.h)}</textarea><label class="mu">Personnes à contacter (nom + numéro)</label><textarea id="pp2" rows="2">${esc(S.plan.p)}</textarea><button onclick="saveP()">Enregistrer</button></div>
  <div class="card"><h2>Données et thème</h2><div class="mu">Tout reste sur ton téléphone. Repère ne remplace pas un médecin ni un thérapeute.</div><div class="row"><button class="s" onclick="exp()">Exporter</button><button class="s" onclick="imp()">Importer</button></div><textarea id="bk" rows="2"></textarea><div class="row"><button class="s" onclick="document.documentElement.dataset.theme='light'">☀️ Clair</button><button class="s" onclick="document.documentElement.dataset.theme='dark'">🌙 Sombre</button></div></div>`;
}
render();
</script>
<script src="extras.js"></script>
</body>
</html>
