/* Repère - extras.js : modules supplémentaires (se charge après index.html) */
const x=()=>S.x;
S.x=Object.assign({meds:[],mt:{},th:[],sl:[],win:[],rdv:[],gifts:[]},S.x||{});
const dayKey=k=>{const d=new Date();d.setDate(d.getDate()-k);return d.toISOString().slice(0,10)};
TABS.splice(5,0,["meds","💊","Médic."],["pens","🧠","Pensées"],["sommeil","😴","Sommeil"],["wins","🏆","Victoires"],["rdv","📅","RDV"],["histoire","📖","Histoires"],["bilan","📊","Bilan"]);
{const st=document.createElement("style");st.textContent="@media print{nav,button,input,select{display:none!important}}";document.head.appendChild(st)}

/* --- Médicaments --- */
function addMed(){const n=$("mn").value.trim();if(!n)return;x().meds.push({id:Date.now(),n,d:$("md").value});save();render()}
function tMed(id){const m=x().mt,k=today()+"|"+id;m[k]?delete m[k]:m[k]=1;save();render()}
function dMed(id){x().meds=x().meds.filter(m=>m.id!=id);save();render()}
function adh(){const m=x().meds;if(!m.length)return 0;let c=0;for(let k=0;k<7;k++)m.forEach(e=>{if(x().mt[dayKey(k)+"|"+e.id])c++});return Math.round(c/(7*m.length)*100)}
function meds(){return `<h1>💊 Médicaments</h1><div class="card"><div class="mu">Régularité sur 7 jours</div><div class="big">${adh()}%</div><div class="bar"><i style="width:${adh()}%"></i></div><div class="mu">Ne change jamais un traitement sans l'avis de ton médecin.</div></div>
<div class="card"><input id="mn" placeholder="Nom du médicament"><input id="md" placeholder="Dose et moment (ex. 1 cp le matin)"><button onclick="addMed()">Ajouter</button></div>
<div class="card">${x().meds.map(m=>{const ok=x().mt[today()+"|"+m.id];return `<div class="item ${ok?"d":""}"><input type="checkbox" ${ok?"checked":""} onchange="tMed(${m.id})"><span style="flex:1">${esc(m.n)}<div class="mu">${esc(m.d)}</div></span><button class="x" onclick="dMed(${m.id})">✕</button></div>`}).join("")||'<div class="mu">Aucun médicament</div>'}</div>`}

/* --- Journal de pensées --- */
function addTh(){const p=$("tp").value.trim();if(!p)return;x().th.unshift({d:today(),s:$("ts").value,p,e:$("te").value,i:+$("ti").value,a:$("ta").value});save();render()}
function pens(){return `<h1>🧠 Journal de pensées</h1><div class="mu">Pour prendre du recul quand une pensée noire ou anxieuse s'installe.</div><br>
<div class="card"><input id="ts" placeholder="Situation : que s'est-il passé ?"><textarea id="tp" rows="2" placeholder="Pensée automatique"></textarea><select id="te">${["Tristesse","Anxiété","Colère","Honte","Peur du jugement","Vide"].map(e=>`<option>${e}</option>`).join("")}</select><label class="mu">Intensité (0-100)</label><input id="ti" type="range" min="0" max="100" value="50"><textarea id="ta" rows="2" placeholder="Pensée plus juste (ce que je dirais à un ami)"></textarea><button onclick="addTh()">Enregistrer</button></div>
<div class="card"><h2>Pièges de pensée fréquents</h2>${["Tout ou rien","Lire dans les pensées","Catastrophe","« Je dois »","Généraliser"].map(c=>`<span class="chip">${c}</span>`).join("")}</div>
<div class="card">${x().th.slice(0,6).map(t=>`<div class="item"><div><b>${esc(t.p)}</b><div class="mu">${t.d} · ${esc(t.e)} ${t.i}/100</div>${t.a?`<div>💡 ${esc(t.a)}</div>`:""}</div></div>`).join("")||'<div class="mu">Rien pour l\'instant</div>'}</div>`}

/* --- Sommeil --- */
function addSl(){const b=$("sb").value,w=$("sw").value;if(!b||!w)return;let h=((+w.slice(0,2))*60+(+w.slice(3))-((+b.slice(0,2))*60+(+b.slice(3))))/60;if(h<=0)h+=24;x().sl=x().sl.filter(s=>s.d!=today());x().sl.push({d:today(),h:Math.round(h*10)/10,q:+$("sq").value});save();render()}
function avgSl(n){const a=x().sl.slice(-n);return a.length?Math.round(a.reduce((s,e)=>s+e.h,0)/a.length*10)/10:0}
function sommeil(){return `<h1>😴 Sommeil</h1><div class="card"><div class="mu">Moyenne sur 7 nuits</div><div class="big">${avgSl(7)||"–"} h</div><div class="bars">${x().sl.slice(-14).map(s=>`<i style="height:${Math.min(100,s.h/12*100)}%"></i>`).join("")}</div></div>
<div class="card"><label class="mu">Coucher</label><input id="sb" type="time" value="23:00"><label class="mu">Lever</label><input id="sw" type="time" value="07:00"><label class="mu">Qualité (1 mauvaise → 5 très bonne)</label><input id="sq" type="range" min="1" max="5" value="3"><button onclick="addSl()">Enregistrer la nuit</button></div>
<div class="card"><h2>Pour mieux dormir</h2><div class="mu">Heures régulières · écrans éteints 1 h avant · chambre fraîche et sombre · pas de café après 14 h. Si ça dure, parles-en à ton médecin.</div></div>`}
/* --- Victoires --- */
function addW(){const t=$("wn").value.trim();if(!t)return;x().win.unshift({d:today(),t});save();render()}
function rW(){const w=x().win;$("wr").textContent=w.length?"🌟 "+w[Math.floor(Math.random()*w.length)].t:"Ajoute ta première victoire."}
function wins(){const wk=x().win.filter(w=>w.d>=dayKey(6)).length;return `<h1>🏆 Mes victoires</h1><div class="mu">Se lever, répondre à un message, sortir 5 minutes : tout compte.</div><br>
<div class="card"><div class="mu">Cette semaine</div><div class="big">${wk}</div><input id="wn" placeholder="Aujourd'hui j'ai réussi à…"><button onclick="addW()">Ajouter</button></div>
<div class="card"><button class="s" onclick="rW()">Me rappeler une victoire</button><div id="wr" style="font-size:19px;margin-top:8px"></div></div>
<div class="card">${x().win.slice(0,15).map(w=>`<div class="item"><span>🌟 ${esc(w.t)}</span><span class="mu">${w.d}</span></div>`).join("")||'<div class="mu">Rien pour l\'instant</div>'}</div>`}

/* --- Rendez-vous --- */
function addRdv(){const w=$("rw").value.trim();if(!w)return;x().rdv.unshift({w,d:$("rd").value,q:$("rq").value,n:""});save();render()}
function rdv(){return `<h1>📅 Mes rendez-vous</h1><div class="card"><input id="rw" placeholder="Avec qui ? (médecin, AI, thérapeute…)"><input id="rd" type="date"><textarea id="rq" rows="3" placeholder="Mes questions et ce que je veux dire"></textarea><button onclick="addRdv()">Préparer</button></div>
${x().rdv.map((r,i)=>`<div class="card"><b>${esc(r.w)}</b> <span class="chip">${esc(r.d)}</span><div class="mu">Mes questions :</div><div style="white-space:pre-wrap">${esc(r.q)}</div><button class="s" onclick="copy(x().rdv[${i}].q)">Copier mes questions</button><textarea rows="3" placeholder="Ce qui a été dit, décisions, prochains pas…" oninput="x().rdv[${i}].n=this.value;save()">${esc(r.n)}</textarea></div>`).join("")}`}

/* --- Histoires sociales + récompenses (parent) --- */
const SIT=["aller chez le médecin","aller à l'école","faire les courses","aller chez le coiffeur","prendre le train","manger au restaurant","rencontrer une nouvelle personne"];
function genSt(){const n=$("hn").value||S.kid||"mon enfant",s=$("hs").value,r=$("hr").value||"se reposer";$("ho").textContent=`Aujourd'hui, ${n} va ${s}. Il y aura peut-être du bruit, de la lumière ou des gens. C'est normal de se sentir un peu stressé(e). Si c'est trop, ${n} peut dire « pause », respirer lentement ou mettre son casque. Un adulte de confiance est là pour aider. Quand c'est fini, ${n} pourra ${r}. ${n} a le droit d'être fier(e) d'avoir essayé.`}
function addG(){const n=$("gn").value.trim();if(!n)return;x().gifts.push({n,c:+$("gc").value||1});save();render()}
function buyG(i){const g=x().gifts[i];if(S.stars>=g.c){S.stars-=g.c;save();render()}else alert("Pas assez d'étoiles")}
function histoire(){return `<h1>📖 Histoires sociales</h1><div class="mu">Préparer un enfant à une situation nouvelle réduit le stress.</div><br>
<div class="card"><input id="hn" placeholder="Prénom (par défaut : ${esc(S.kid||"mon enfant")})"><select id="hs">${SIT.map(s=>`<option>${s}</option>`).join("")}</select><input id="hr" placeholder="Récompense à la fin (ex. jouer 15 min)"><button onclick="genSt()">Créer l'histoire</button><div id="ho" style="white-space:pre-wrap;margin-top:8px"></div><div class="row"><button class="s" onclick="copy($('ho').textContent)">Copier</button><button class="s" onclick="print()">Imprimer</button></div></div>
<div class="card"><h2>Boutique de récompenses · ⭐ ${S.stars}</h2><div class="row"><input id="gn" placeholder="Récompense"><input id="gc" type="number" placeholder="⭐" style="flex:0 0 70px"></div><button class="s" onclick="addG()">Ajouter</button>${x().gifts.map((g,i)=>`<div class="item"><span style="flex:1">${esc(g.n)} <span class="chip">${g.c} ⭐</span></span><button class="s" style="width:auto" onclick="buyG(${i})">Échanger</button></div>`).join("")}</div>`}

/* --- Bilan hebdomadaire (à montrer au médecin) --- */
function bilan(){const c=S.chk.slice(-7),av=k=>c.length?(c.reduce((s,e)=>s+e[k],0)/c.length).toFixed(1):"–";const inc=S.inc.filter(i=>i.d>=dayKey(6)).length,th=x().th.filter(t=>t.d>=dayKey(6)).length,wk=x().win.filter(w=>w.d>=dayKey(6)).length;
return `<h1>📊 Bilan de la semaine</h1><div class="card"><table style="width:100%;font-size:17px">${[["Humeur moyenne (sur 5)",av("m")],["Énergie moyenne (sur 5)",av("e")],["Anxiété moyenne (sur 5)",av("a")],["Sommeil moyen",(avgSl(7)||"–")+" h"],["Régularité médicaments",adh()+"%"],["Pensées notées",th],["Victoires",wk],["Crises de l'enfant",inc]].map(r=>`<tr><td style="padding:6px 0">${r[0]}</td><td style="text-align:right"><b>${r[1]}</b></td></tr>`).join("")}</table></div><button onclick="print()">Imprimer ou enregistrer en PDF</button><div class="mu">Utile à montrer à ton médecin ou thérapeute. Ce n'est pas un diagnostic.</div>`}

window.EXT={meds,pens,sommeil,wins,rdv,histoire,bilan};
render();

