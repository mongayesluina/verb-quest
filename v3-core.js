let V=[];
const app=document.querySelector('#app');
const $=s=>document.querySelector(s);
const DATA_URL='https://raw.githubusercontent.com/mongayesluina/verb-quest/data-snapshot/index.html';
const saved=(()=>{try{return JSON.parse(localStorage.verbQuestV3||'{}')}catch{return{}}})();
let state={
  score:+(saved.score||0),
  streak:+(saved.streak||0),
  level:saved.level??1,
  mode:saved.mode||'level',
  custom:Array.isArray(saved.custom)?saved.custom:[],
  sound:saved.sound!==false
};

const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sample=(a,n)=>shuffle(a).slice(0,Math.min(n,a.length));
const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const primaryPast=v=>v.past.split('/')[0].trim();
const pastForms=v=>v.past.split('/').map(x=>x.trim().toLowerCase());
const primaryParticiple=v=>v.participle.split('/')[0].trim();
const typeName=v=>v.type==='i'?'Irregular':'Regular';
const icon=v=>v.icon||'🎯';

function persist(){localStorage.verbQuestV3=JSON.stringify(state);updateTopbar()}
function updateTopbar(){
  if(!V.length)return;
  $('#score').textContent=state.score;
  $('#streak').textContent=state.streak;
  $('#modeChip').textContent=state.mode==='custom'?`Teacher • ${state.custom.length}`:state.level===0?`All verbs • ${V.length}`:`Level ${state.level} • ${pool().length}`;
}
function addXP(points){state.score+=points;state.streak++;persist()}
function resetStreak(){state.streak=0;persist()}
function speak(text){if(!state.sound||!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.88;speechSynthesis.speak(u)}
function pool(){
  if(state.mode==='custom'&&state.custom.length){const ids=new Set(state.custom);return V.filter(v=>ids.has(v.id));}
  return state.level===0?V:V.filter(v=>v.level===state.level);
}
function sentencePool(){const p=pool();return p.length?p:V}
function head(title,subtitle=''){
  return `<div class="sectionHead"><div><button class="back" onclick="home()">← Home</button><h1>${title}</h1>${subtitle?`<p class="muted">${subtitle}</p>`:''}</div></div>`;
}
function answerButton(label,handler,extra=''){return `<button class="option" ${extra} onclick="${handler}">${escapeHtml(label)}</button>`}

async function loadVerbs(){
  try{
    const text=await fetch(DATA_URL+'?grammar=3').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()});
    const match=text.match(/const V=(\[[\s\S]*?\]);let score=/);
    if(!match)throw new Error('Verb dataset not found');
    const raw=Function('"use strict";return ('+match[1]+')')();
    V=raw.map((v,id)=>({id,base:v[0],past:v[1],participle:v[2],meaning:v[3],level:v[4],type:v[5],icon:v[6]}));
    updateTopbar();home();
  }catch(error){
    console.error(error);
    app.innerHTML=`<div class="loading"><div class="spin">⚠️</div><h2>Verb Quest could not load the verb list.</h2><p class="muted">Check your Internet connection and reload.</p><button class="btn primary" onclick="location.reload()">Reload</button></div>`;
  }
}

function home(){
  const groups=[
    {title:'LEARN',subtitle:'Understand the verb before playing.',games:[
      ['verbExplorer','📚','Verb Explorer','Present, past, participle, meaning and examples.','NEW'],
      ['tenseChoice','🔀','Present or Past?','Use the subject and time expression to choose the right form.','GRAMMAR'],
      ['fillSentence','✍️','Fill the Sentence','Type the correct present or past verb.','TYPE']
    ]},
    {title:'BUILD',subtitle:'Work with complete sentences.',games:[
      ['sentenceBuilder','🧱','Build the Sentence','Put shuffled words in the correct order.','NEW'],
      ['transformTense','🔁','Change the Tense','Transform a present sentence into past or past into present.','NEW'],
      ['grammarLab','🧪','Grammar Lab','Affirmative, negative and questions with do / does / did and BE.','NEW']
    ]},
    {title:'CHALLENGE',subtitle:'Practice speed, memory and accuracy.',games:[
      ['memory','🧠','Memory Pro','Match base, present and past forms.','HARDER'],
      ['robot','🤖','Save the Robot','Spell the answer. Two mistakes and the robot loses all energy.','2 LIVES'],
      ['matchGame','🔗','Match Rush','Match verbs and forms as quickly as possible.','8 PAIRS'],
      ['ladderGame','🪜','Verb Ladder','Base → present → past → participle → meaning.','5 STEPS'],
      ['speedGame','⚡','Speed Run','45 seconds of typed present and past forms.','TIMED'],
      ['finalGame','🏆','Final Challenge','A mixed grammar exam with sentences and verb forms.','20 Q']
    ]}
  ];
  app.innerHTML=`<section class="hero"><div><div class="eyebrow">200 verbs • present + past • sentence grammar</div><h1>Learn verbs in <span>real sentences.</span></h1><p>Study present and past forms, build sentences, transform tenses, practice negatives and questions, and then test yourself with classroom games.</p><div class="row"><button class="btn primary" onclick="verbExplorer()">Start learning</button><button class="btn secondary" onclick="levels()">Choose level</button><button class="btn darkBtn" onclick="teacher()">Teacher Mode</button></div></div><div class="heroArt"><span class="orb one"></span><span class="orb two"></span><div class="heroCard grammarHero"><div class="e">🗣️</div><b>GO → GOES → WENT</b><small>She goes every day.<br>She went yesterday.</small></div></div></section>${groups.map(g=>`<section class="gameGroup"><div class="sectionTitle"><div><span class="eyebrow">${g.title}</span><h2>${g.title==='LEARN'?'Learn the forms':g.title==='BUILD'?'Build correct English':'Challenge yourself'}</h2><p>${g.subtitle}</p></div></div><div class="games">${g.games.map(c=>`<button class="game" onclick="${c[0]}()"><div class="i">${c[1]}</div><span class="tag">${c[4]}</span><h3>${c[2]}</h3><p>${c[3]}</p></button>`).join('')}</div></section>`).join('')}`;
  updateTopbar();
}

function levels(){
  const meta=[[1,'Essentials','High-frequency verbs and basic sentence patterns.'],[2,'Everyday English','More irregular forms and richer vocabulary.'],[3,'Challenge','Less predictable verbs and more demanding grammar.'],[0,'All 200','Mix every verb in the complete collection.']];
  app.innerHTML=head('Choose a level','The same level controls all learning activities and games.')+`<div class="levelGrid">${meta.map(m=>`<button class="level ${state.mode==='level'&&state.level===m[0]?'active':''}" onclick="setLevel(${m[0]})"><span class="num">${m[0]||'∞'}</span><h3>${m[1]}</h3><p class="muted">${m[2]}</p><b>${m[0]===0?V.length:V.filter(v=>v.level===m[0]).length} verbs →</b></button>`).join('')}</div>`;
}
function setLevel(level){state.level=level;state.mode='level';persist();home()}

let teacherSet=new Set();
function teacher(){
  teacherSet=new Set(state.mode==='custom'?state.custom:pool().map(v=>v.id));
  app.innerHTML=head('Teacher Mode','Create a custom set. Every activity will use only the selected verbs.')+`<div class="toolbar"><input id="search" placeholder="Search: go, goes, went, ir..." oninput="renderTeacherList()"><select id="lev" onchange="renderTeacherList()"><option value="0">All levels</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option></select><select id="tp" onchange="renderTeacherList()"><option value="a">All types</option><option value="i">Irregular</option><option value="r">Regular</option></select></div><div class="teacherButtons"><button class="btn secondary small" onclick="selectTeacherType('i')">All irregular</button><button class="btn secondary small" onclick="selectTeacherType('r')">All regular</button><button class="btn secondary small" onclick="selectTeacherAll()">All 200</button><button class="btn danger small" onclick="teacherSet.clear();renderTeacherList()">Clear</button><button class="btn primary small" onclick="useTeacherSet()">Use selected (<span id="selCount">0</span>)</button></div><div class="verbGrid" id="verbGrid"></div>`;
  renderTeacherList();
}
function renderTeacherList(){
  const q=($('#search')?.value||'').toLowerCase();const l=+($('#lev')?.value||0);const t=$('#tp')?.value||'a';
  const rows=V.filter(v=>(!q||[v.base,Grammar.present3(v.base),v.past,v.participle,v.meaning].join(' ').toLowerCase().includes(q))&&(!l||v.level===l)&&(t==='a'||v.type===t));
  $('#verbGrid').innerHTML=rows.map(v=>`<label class="verbItem ${teacherSet.has(v.id)?'checked':''}"><input type="checkbox" ${teacherSet.has(v.id)?'checked':''} onchange="toggleTeacherVerb(${v.id},this.checked)"><span><strong>${escapeHtml(v.base)} • ${escapeHtml(Grammar.present3(v.base))} • ${escapeHtml(v.past)}</strong><small>${escapeHtml(v.meaning)} • ${typeName(v)} • L${v.level}</small></span></label>`).join('');
  $('#selCount').textContent=teacherSet.size;
}
function toggleTeacherVerb(id,on){on?teacherSet.add(id):teacherSet.delete(id);renderTeacherList()}
function selectTeacherType(type){teacherSet=new Set(V.filter(v=>v.type===type).map(v=>v.id));renderTeacherList()}
function selectTeacherAll(){teacherSet=new Set(V.map(v=>v.id));renderTeacherList()}
function useTeacherSet(){if(teacherSet.size<4)return alert('Select at least 4 verbs.');state.custom=[...teacherSet];state.mode='custom';persist();home()}

loadVerbs();
