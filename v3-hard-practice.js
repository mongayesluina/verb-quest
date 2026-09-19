/*
 * Verb Quest — contextual hard practice
 * ------------------------------------------------------------
 * Student exercises do not reveal the target tense with labels or
 * simple time markers such as "yesterday" / "every day".
 * The learner must infer the correct form from the grammar and the
 * surrounding English context.
 */

const HardPractice=(()=>{
  function midSubject(subject){
    const s=String(subject||'They').trim();
    if(s==='I')return 'I';
    if(['You','He','She','It','We','They'].includes(s))return s.toLowerCase();
    return s.charAt(0).toLowerCase()+s.slice(1);
  }

  function regularPastGuess(base){
    const b=base.toLowerCase();
    if(b==='be')return 'beed';
    if(/e$/.test(b))return b+'d';
    if(/[^aeiou]y$/.test(b))return b.slice(0,-1)+'ied';
    return b+'ed';
  }

  function gerund(base){
    const b=base.toLowerCase();
    if(b==='be')return 'being';
    if(/ie$/.test(b))return b.slice(0,-2)+'ying';
    if(/e$/.test(b)&&!/(ee|ye|oe)$/.test(b))return b.slice(0,-1)+'ing';
    return b+'ing';
  }

  function contextSentence(v,tense){
    const c=Grammar.context(v);
    const subject=c.subject;
    const complement=c.complement;
    const pairs=[
      {
        present:`${subject} ____ ${complement}, and this affects what happens next.`,
        past:`${subject} ____ ${complement}, and this affected what happened next.`
      },
      {
        present:`${subject} ____ ${complement}, so the situation changes.`,
        past:`${subject} ____ ${complement}, so the situation changed.`
      },
      {
        present:`The situation becomes clearer when ${midSubject(subject)} ____ ${complement}.`,
        past:`The situation became clearer when ${midSubject(subject)} ____ ${complement}.`
      },
      {
        present:`The group continues after ${midSubject(subject)} ____ ${complement}.`,
        past:`The group continued after ${midSubject(subject)} ____ ${complement}.`
      },
      {
        present:`People react differently when ${midSubject(subject)} ____ ${complement}.`,
        past:`People reacted differently when ${midSubject(subject)} ____ ${complement}.`
      }
    ];

    /* More natural contexts for verbs whose default complement is less
       suitable for a generic frame. */
    const special={
      be:{
        present:`The lights are on because ${midSubject(subject)} ____ ${complement}.`,
        past:`The lights were on because ${midSubject(subject)} ____ ${complement}.`
      },
      mean:{
        present:`The explanation is clear because ${midSubject(subject)} ____ ${complement} in this context.`,
        past:`The explanation was clear because ${midSubject(subject)} ____ ${complement} in that context.`
      },
      cost:{
        present:`The customer hesitates because ${midSubject(subject)} ____ ${complement}.`,
        past:`The customer hesitated because ${midSubject(subject)} ____ ${complement}.`
      },
      rain:{
        present:`The streets become slippery when ${midSubject(subject)} ____ ${complement}.`,
        past:`The streets became slippery when ${midSubject(subject)} ____ ${complement}.`
      },
      happen:{
        present:`People become worried when ${midSubject(subject)} ____ ${complement}.`,
        past:`People became worried when ${midSubject(subject)} ____ ${complement}.`
      },
      begin:{
        present:`The students take their seats before ${midSubject(subject)} ____ ${complement}.`,
        past:`The students took their seats before ${midSubject(subject)} ____ ${complement}.`
      },
      start:{
        present:`The students get ready before ${midSubject(subject)} ____ ${complement}.`,
        past:`The students got ready before ${midSubject(subject)} ____ ${complement}.`
      },
      ring:{
        present:`Everyone looks toward the phone when ${midSubject(subject)} ____ ${complement}.`,
        past:`Everyone looked toward the phone when ${midSubject(subject)} ____ ${complement}.`
      },
      rise:{
        present:`The sky becomes brighter as ${midSubject(subject)} ____ ${complement}.`,
        past:`The sky became brighter as ${midSubject(subject)} ____ ${complement}.`
      },
      freeze:{
        present:`The surface becomes solid when ${midSubject(subject)} ____ ${complement}.`,
        past:`The surface became solid when ${midSubject(subject)} ____ ${complement}.`
      },
      sink:{
        present:`The passengers become frightened when ${midSubject(subject)} ____ ${complement}.`,
        past:`The passengers became frightened when ${midSubject(subject)} ____ ${complement}.`
      },
      grow:{
        present:`The gardener is pleased because ${midSubject(subject)} ____ ${complement}.`,
        past:`The gardener was pleased because ${midSubject(subject)} ____ ${complement}.`
      },
      blow:{
        present:`The windows shake when ${midSubject(subject)} ____ ${complement}.`,
        past:`The windows shook when ${midSubject(subject)} ____ ${complement}.`
      },
      shine:{
        present:`The room becomes brighter when ${midSubject(subject)} ____ ${complement}.`,
        past:`The room became brighter when ${midSubject(subject)} ____ ${complement}.`
      },
      appear:{
        present:`People stop to look when ${midSubject(subject)} ____ ${complement}.`,
        past:`People stopped to look when ${midSubject(subject)} ____ ${complement}.`
      },
      fall:{
        present:`Everyone looks down when ${midSubject(subject)} ____ ${complement}.`,
        past:`Everyone looked down when ${midSubject(subject)} ____ ${complement}.`
      }
    };

    if(special[v.base])return special[v.base][tense];
    return sample(pairs,1)[0][tense];
  }

  function options(v,subject,correct){
    const candidates=[
      v.base,
      Grammar.present3(v.base),
      Grammar.present(v,subject),
      Grammar.past(v,subject),
      ...v.past.split('/').map(x=>x.trim()),
      v.participle.split('/')[0].trim(),
      gerund(v.base),
      regularPastGuess(v.base)
    ].filter(Boolean);

    const unique=[];
    [correct,...candidates].forEach(x=>{
      const value=String(x).trim();
      if(value&&!unique.some(y=>y.toLowerCase()===value.toLowerCase()))unique.push(value);
    });

    /* If a highly irregular verb collapses several forms into one spelling,
       keep the distractors within the same verb family rather than inserting
       an unrelated verb. */
    while(unique.length<4){
      const fallback=[v.base+'s',v.base+'ed',v.base+'ing','did '+v.base];
      const item=fallback.find(x=>!unique.some(y=>y.toLowerCase()===x.toLowerCase()));
      if(!item)break;
      unique.push(item);
    }

    return shuffle([correct,...shuffle(unique.filter(x=>x.toLowerCase()!==String(correct).toLowerCase())).slice(0,3)]);
  }

  function accepted(v,tense,subject,value){
    const val=Grammar.normalize(value);
    if(tense==='present')return val===Grammar.normalize(Grammar.present(v,subject));
    if(v.base==='be')return val===Grammar.normalize(Grammar.past(v,subject));
    return v.past.split('/').some(x=>Grammar.normalize(x)===val);
  }

  return {contextSentence,options,accepted};
})();

/* Home copy: the activity no longer announces "Present or Past" as a hint. */
function home(){
  const groups=[
    {title:'LEARN',subtitle:'Understand the verb through English forms and context.',games:[
      ['verbExplorer','📚','Verb Explorer','Present, past, participle and complete English examples.','STUDY'],
      ['tenseChoice','🧠','Context Choice','Choose the correct verb form by analyzing the complete sentence.','CONTEXT'],
      ['fillSentence','✍️','Complete the Sentence','Write the correct form. The tense is not shown.','TYPE']
    ]},
    {title:'BUILD',subtitle:'Create and transform complete English sentences.',games:[
      ['sentenceBuilder','🧱','Build the Sentence','Put shuffled English words in the correct order.','BUILD'],
      ['transformTense','🔁','Change the Tense','Rewrite a complete sentence from present to past or past to present.','WRITE'],
      ['grammarLab','🧪','Grammar Lab','Practice affirmative, negative and question structures.','GRAMMAR']
    ]},
    {title:'CHALLENGE',subtitle:'Use English only: no translations and no shortcuts.',games:[
      ['memory','🧠','Memory Pro','Match base, present and past forms.','HARDER'],
      ['robot','🤖','Save the Robot','Spell the requested verb form. Two mistakes end the round.','2 LIVES'],
      ['matchGame','🔗','Match Rush','Match English verb forms as quickly as possible.','8 PAIRS'],
      ['ladderGame','🪜','Verb Ladder','Base → present → past → participle → sentences.','5 STEPS'],
      ['speedGame','⚡','Speed Run','45 seconds of typed present and past forms.','TIMED'],
      ['finalGame','🏆','Final Challenge','A mixed English grammar exam with forms and sentences.','20 Q']
    ]}
  ];

  app.innerHTML=`<section class="hero"><div><div class="eyebrow">200 verbs • English only • contextual grammar</div><h1>Read the sentence. <span>Think before you answer.</span></h1><p>Verb forms are not identified for you. Analyze agreement, surrounding verbs and sentence context to choose the correct answer.</p><div class="row"><button class="btn primary" onclick="verbExplorer()">Start learning</button><button class="btn secondary" onclick="levels()">Choose level</button><button class="btn darkBtn" onclick="teacher()">Teacher Mode</button></div></div><div class="heroArt"><span class="orb one"></span><span class="orb two"></span><div class="heroCard grammarHero"><div class="e">🧩</div><b>READ → ANALYZE → ANSWER</b><small>No tense labels.<br>No translation clues.</small></div></div></section>${groups.map(g=>`<section class="gameGroup"><div class="sectionTitle"><div><span class="eyebrow">${g.title}</span><h2>${g.title==='LEARN'?'Learn through context':g.title==='BUILD'?'Build correct English':'Challenge yourself'}</h2><p>${g.subtitle}</p></div></div><div class="games">${g.games.map(c=>`<button class="game" onclick="${c[0]}()"><div class="i">${c[1]}</div><span class="tag">${c[4]}</span><h3>${c[2]}</h3><p>${c[3]}</p></button>`).join('')}</div></section>`).join('')}`;
  updateTopbar();
}

function tenseChoice(){
  const usable=sentencePool().filter(v=>Grammar.context(v)?.complement);
  const round=Array.from({length:12},()=>sample(usable,1)[0]);
  let index=0,correctCount=0;

  function render(){
    if(index>=round.length){
      const pct=Math.round(correctCount/round.length*100);
      app.innerHTML=head('Context Choice')+resultCard(correctCount,round.length,pct,'tenseChoice()');
      return;
    }

    const v=round[index];
    const tense=Math.random()<.5?'present':'past';
    const c=Grammar.context(v);
    const subject=c.subject;
    const correct=tense==='present'?Grammar.present(v,subject):Grammar.past(v,subject);
    const sentence=HardPractice.contextSentence(v,tense);
    const options=HardPractice.options(v,subject,correct);

    app.innerHTML=head('Context Choice',`Question ${index+1} / ${round.length} • Choose the form that makes the whole sentence grammatically consistent.`)+`<div class="panel quiz"><div class="progress"><span style="width:${index/round.length*100}%"></span></div><div class="tensePrompt"><div class="promptEmoji">${icon(v)}</div><h2>${escapeHtml(sentence)}</h2></div><div class="options">${options.map(o=>`<button class="option" onclick="checkHardChoice(this,decodeURIComponent('${enc(o)}'),decodeURIComponent('${enc(correct)}'))">${escapeHtml(o)}</button>`).join('')}</div><div id="feed" class="feedback"></div></div>`;

    window.hardChoiceRound={v,tense,subject,correct,good:()=>correctCount++,next:()=>{index++;render()}};
  }

  render();
}

function checkHardChoice(button,answer,correct){
  const r=window.hardChoiceRound;
  document.querySelectorAll('.option').forEach(x=>x.disabled=true);
  const ok=HardPractice.accepted(r.v,r.tense,r.subject,answer);

  if(ok){
    button.classList.add('ok');
    $('#feed').textContent='Correct! +12 XP';
    $('#feed').style.color='var(--green)';
    addXP(12);
    r.good();
  }else{
    button.classList.add('bad');
    const correctButton=[...document.querySelectorAll('.option')].find(x=>HardPractice.accepted(r.v,r.tense,r.subject,x.textContent));
    correctButton?.classList.add('ok');
    $('#feed').textContent='Correct form: '+correct;
    $('#feed').style.color='var(--red)';
    resetStreak();
  }

  setTimeout(r.next,950);
}

function fillSentence(){
  const usable=sentencePool().filter(v=>Grammar.context(v)?.complement);
  const round=Array.from({length:12},()=>sample(usable,1)[0]);
  let index=0,correctCount=0;

  function render(){
    if(index>=round.length){
      app.innerHTML=head('Complete the Sentence')+resultCard(correctCount,round.length,Math.round(correctCount/round.length*100),'fillSentence()');
      return;
    }

    const v=round[index];
    const tense=Math.random()<.5?'present':'past';
    const c=Grammar.context(v);
    const subject=c.subject;
    const correct=tense==='present'?Grammar.present(v,subject):Grammar.past(v,subject);
    const sentence=HardPractice.contextSentence(v,tense);

    app.innerHTML=head('Complete the Sentence',`Question ${index+1} / ${round.length} • Infer the correct form from the sentence.`)+`<div class="panel finalBox"><div class="tensePrompt"><div class="promptEmoji">${icon(v)}</div><h2>${escapeHtml(sentence)}</h2><p class="muted">Use the verb <b>${escapeHtml(v.base.toUpperCase())}</b>.</p></div><div class="answerRow"><input id="fillInput" class="answerInput bigInput" autocomplete="off" placeholder="Type the correct form"><button class="btn primary" onclick="checkFillSentence()">Check</button></div><div id="feed" class="feedback"></div></div>`;

    window.fillRound={v,tense,subject,correct,good:()=>correctCount++,next:()=>{index++;render()}};
    const input=$('#fillInput');
    input.focus();
    input.onkeydown=e=>{if(e.key==='Enter')checkFillSentence()};
  }

  render();
}

function checkFillSentence(){
  const r=window.fillRound;
  const input=$('#fillInput');
  if(!r||!input||input.disabled)return;

  const value=input.value.trim();
  input.disabled=true;

  if(HardPractice.accepted(r.v,r.tense,r.subject,value)){
    $('#feed').textContent='Correct! +14 XP';
    $('#feed').style.color='var(--green)';
    addXP(14);
    r.good();
  }else{
    $('#feed').textContent='Correct form: '+r.correct;
    $('#feed').style.color='var(--red)';
    resetStreak();
  }

  setTimeout(r.next,1000);
}

/* Sentence construction is also harder: no automatic time-word shortcut. */
function sentenceBuilder(){
  const rounds=Array.from({length:8},()=>sample(sentencePool(),1)[0]);
  let index=0,correct=0;

  function next(){
    if(index>=rounds.length){
      app.innerHTML=head('Build the Sentence')+resultCard(correct,rounds.length,Math.round(correct/rounds.length*100),'sentenceBuilder()');
      return;
    }

    const v=rounds[index];
    const tense=Math.random()<.5?'present':'past';
    let kind='affirmative';
    if((state.level===0||state.level>=2)&&Math.random()<.45){
      kind=Math.random()<.5?'negative':'question';
    }

    const c=Grammar.context(v);
    const target=Grammar[kind](v,tense,c.subject,false);
    const tokens=Grammar.tokenize(target).map((text,n)=>({text,key:`${index}-${n}-${Math.random()}`}));

    window.builder={
      target,
      tokens:shuffle(tokens),
      chosen:[],
      tense,
      kind,
      v,
      roundIndex:index,
      total:rounds.length,
      right(){correct++},
      next(){index++;next()}
    };
    renderBuilder();
  }

  next();
}

/* Rewriting exercises keep the requested direction, but remove yesterday/every day. */
function transformTense(){
  const round=Array.from({length:8},()=>sample(sentencePool(),1)[0]);
  let index=0,correctCount=0;

  function render(){
    if(index>=round.length){
      app.innerHTML=head('Change the Tense')+resultCard(correctCount,round.length,Math.round(correctCount/round.length*100),'transformTense()');
      return;
    }

    const v=round[index];
    const from=Math.random()<.5?'present':'past';
    const to=from==='present'?'past':'present';
    const c=Grammar.context(v);
    const source=Grammar.affirmative(v,from,c.subject,false);
    const target=Grammar.affirmative(v,to,c.subject,false);

    app.innerHTML=head('Change the Tense',`Sentence ${index+1} / ${round.length} • Rewrite the complete sentence.`)+`<div class="panel finalBox"><div class="transformBox"><span class="tenseBadge ${from==='present'?'presentBadge':'pastBadge'}">${from.toUpperCase()}</span><p class="sourceSentence">${escapeHtml(source)}</p><div class="transformArrow">↓</div><span class="tenseBadge ${to==='present'?'presentBadge':'pastBadge'}">CHANGE TO ${to.toUpperCase()}</span></div><textarea id="transformInput" class="sentenceInput" rows="3" placeholder="Write the complete sentence"></textarea><button class="btn primary" onclick="checkTransform()">Check sentence</button><div id="feed" class="feedback"></div></div>`;

    window.transformRound={target,good:()=>correctCount++,next:()=>{index++;render()}};
    $('#transformInput').focus();
  }

  render();
}

function grammarLab(){
  const round=Array.from({length:10},()=>sample(sentencePool(),1)[0]);
  let index=0,correctCount=0;

  function render(){
    if(index>=round.length){
      app.innerHTML=head('Grammar Lab')+resultCard(correctCount,round.length,Math.round(correctCount/round.length*100),'grammarLab()');
      return;
    }

    const v=round[index];
    const tense=Math.random()<.5?'present':'past';
    const kind=Math.random()<.5?'negative':'question';
    const c=Grammar.context(v);
    const source=Grammar.affirmative(v,tense,c.subject,false);
    const target=Grammar[kind](v,tense,c.subject,false);
    const rule=v.base==='be'
      ?'BE does not use do / does / did. Move BE for questions and add NOT for negatives.'
      :tense==='past'
        ?'After DID / DID NOT, the main verb returns to the BASE FORM.'
        :'Use DO / DOES in questions and negatives. The main verb stays in BASE FORM.';

    app.innerHTML=head('Grammar Lab',`Question ${index+1} / ${round.length}`)+`<div class="panel finalBox"><div class="labRule"><b>Rule:</b> ${escapeHtml(rule)}</div><span class="chip">${tense.toUpperCase()}</span><span class="chip">MAKE IT ${kind.toUpperCase()}</span><p class="sourceSentence">${escapeHtml(source)}</p><textarea id="labInput" class="sentenceInput" rows="3" placeholder="Write the ${kind} sentence"></textarea><button class="btn primary" onclick="checkGrammarLab()">Check grammar</button><div id="feed" class="feedback"></div></div>`;

    window.labRound={target,good:()=>correctCount++,next:()=>{index++;render()}};
    $('#labInput').focus();
  }

  render();
}
