/*
 * Verb Quest — English-only student interface
 * ------------------------------------------------------------
 * The original dataset keeps Spanish translations internally for
 * possible future bilingual/teacher features, but student-facing
 * activities never reveal them. Learners must solve activities from
 * English context, tense markers, subject agreement and verb forms.
 */

function home(){
  const groups=[
    {title:'LEARN',subtitle:'Understand the verb through English forms and context.',games:[
      ['verbExplorer','📚','Verb Explorer','Present, past, participle and complete English examples.','STUDY'],
      ['tenseChoice','🔀','Present or Past?','Read the subject and time expression, then choose the correct form.','GRAMMAR'],
      ['fillSentence','✍️','Fill the Sentence','Type the correct present or past form without translation help.','TYPE']
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

  app.innerHTML=`<section class="hero"><div><div class="eyebrow">200 verbs • English only • present + past</div><h1>Think directly in <span>English.</span></h1><p>Use context, subjects and time expressions to solve each activity. No Spanish translations are shown during practice.</p><div class="row"><button class="btn primary" onclick="verbExplorer()">Start learning</button><button class="btn secondary" onclick="levels()">Choose level</button><button class="btn darkBtn" onclick="teacher()">Teacher Mode</button></div></div><div class="heroArt"><span class="orb one"></span><span class="orb two"></span><div class="heroCard grammarHero"><div class="e">🗣️</div><b>GO → GOES → WENT</b><small>She goes every day.<br>She went yesterday.</small></div></div></section>${groups.map(g=>`<section class="gameGroup"><div class="sectionTitle"><div><span class="eyebrow">${g.title}</span><h2>${g.title==='LEARN'?'Learn through context':g.title==='BUILD'?'Build correct English':'Challenge yourself'}</h2><p>${g.subtitle}</p></div></div><div class="games">${g.games.map(c=>`<button class="game" onclick="${c[0]}()"><div class="i">${c[1]}</div><span class="tag">${c[4]}</span><h3>${c[2]}</h3><p>${c[3]}</p></button>`).join('')}</div></section>`).join('')}`;
  updateTopbar();
}

function teacher(){
  teacherSet=new Set(state.mode==='custom'?state.custom:pool().map(v=>v.id));
  app.innerHTML=head('Teacher Mode','Create a custom English verb set. Every activity will use only the selected verbs.')+`<div class="toolbar"><input id="search" placeholder="Search: go, goes, went, gone..." oninput="renderTeacherList()"><select id="lev" onchange="renderTeacherList()"><option value="0">All levels</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option></select><select id="tp" onchange="renderTeacherList()"><option value="a">All types</option><option value="i">Irregular</option><option value="r">Regular</option></select></div><div class="teacherButtons"><button class="btn secondary small" onclick="selectTeacherType('i')">All irregular</button><button class="btn secondary small" onclick="selectTeacherType('r')">All regular</button><button class="btn secondary small" onclick="selectTeacherAll()">All 200</button><button class="btn danger small" onclick="teacherSet.clear();renderTeacherList()">Clear</button><button class="btn primary small" onclick="useTeacherSet()">Use selected (<span id="selCount">0</span>)</button></div><div class="verbGrid" id="verbGrid"></div>`;
  renderTeacherList();
}

function renderTeacherList(){
  const q=($('#search')?.value||'').toLowerCase();
  const level=+($('#lev')?.value||0);
  const type=$('#tp')?.value||'a';
  const rows=V.filter(v=>(!q||[v.base,Grammar.present3(v.base),v.past,v.participle].join(' ').toLowerCase().includes(q))&&(!level||v.level===level)&&(type==='a'||v.type===type));
  $('#verbGrid').innerHTML=rows.map(v=>`<label class="verbItem ${teacherSet.has(v.id)?'checked':''}"><input type="checkbox" ${teacherSet.has(v.id)?'checked':''} onchange="toggleTeacherVerb(${v.id},this.checked)"><span><strong>${escapeHtml(v.base)} • ${escapeHtml(Grammar.present3(v.base))} • ${escapeHtml(v.past)}</strong><small>${escapeHtml(v.participle)} • ${typeName(v)} • Level ${v.level}</small></span></label>`).join('');
  $('#selCount').textContent=teacherSet.size;
}

function verbExplorer(){
  const verbs=pool();
  explorerIndex=(explorerIndex+verbs.length)%verbs.length;
  const v=verbs[explorerIndex];
  const c=Grammar.context(v);
  const presentExample=Grammar.affirmative(v,'present',c.subject,true);
  const pastExample=Grammar.affirmative(v,'past',c.subject,true);

  app.innerHTML=head('Verb Explorer','Study the forms and understand the verb from English examples.')+`<div class="panel studyCard"><div class="studyVisual"><div class="studyEmoji">${icon(v)}</div><span class="chip">${typeName(v)} • Level ${v.level}</span><h2>English context</h2><p class="muted">Notice how the verb changes with the subject and tense.</p></div><div class="studyBody"><div class="verbHeadline"><span class="eyebrow">BASE FORM</span><h2>${escapeHtml(v.base)}</h2></div><div class="formGrid"><div><small>I / YOU / WE / THEY</small><b>${escapeHtml(Grammar.present(v,'They'))}</b><span>Present simple</span></div><div><small>HE / SHE / IT</small><b>${escapeHtml(Grammar.present(v,'She'))}</b><span>Present simple</span></div><div><small>PAST SIMPLE</small><b>${escapeHtml(v.base==='be'?'was / were':v.past)}</b><span>Past form</span></div><div><small>PAST PARTICIPLE</small><b>${escapeHtml(v.participle)}</b><span>Participle form</span></div></div><div class="exampleBox presentExample"><span class="tenseBadge presentBadge">PRESENT</span><p>${escapeHtml(presentExample)}</p></div><div class="exampleBox pastExample"><span class="tenseBadge pastBadge">PAST</span><p>${escapeHtml(pastExample)}</p></div><div class="grammarMini"><div><b>Past negative:</b> ${escapeHtml(Grammar.negative(v,'past',c.subject,true))}</div><div><b>Past question:</b> ${escapeHtml(Grammar.question(v,'past',c.subject,true))}</div></div><div class="row"><button class="btn primary" onclick="speak('${v.base.replace(/'/g,"\\'")}');setTimeout(()=>speak('${primaryPast(v).replace(/'/g,"\\'")}'),700)">🔊 Listen</button><button class="btn secondary" onclick="explorerIndex--;verbExplorer()">← Previous</button><button class="btn secondary" onclick="explorerIndex++;verbExplorer()">Next →</button></div></div></div>`;
}

function tenseChoice(){
  const round=Array.from({length:12},()=>sample(sentencePool(),1)[0]);
  let index=0,correctCount=0;

  function render(){
    if(index>=round.length){
      const pct=Math.round(correctCount/round.length*100);
      app.innerHTML=head('Present or Past?')+resultCard(correctCount,round.length,pct,'tenseChoice()');
      return;
    }

    const v=round[index];
    const tense=Math.random()<.5?'present':'past';
    const subject=sample(['I','You','He','She','We','They'],1)[0];
    const correct=tense==='present'?Grammar.present(v,subject):Grammar.past(v,subject);
    const marker=tense==='present'?'every day':'yesterday';
    const c=Grammar.context(v);
    let options=[correct,...(tense==='present'?Grammar.presentOptions(v,subject):Grammar.pastOptions(v,subject))].filter((x,n,a)=>a.indexOf(x)===n);
    while(options.length<4){
      const other=sample(V,1)[0];
      options.push(tense==='present'?Grammar.present(other,subject):Grammar.past(other,subject));
      options=[...new Set(options)];
    }
    options=shuffle(options).slice(0,4);
    const sentence=`${subject} ____ ${c.complement} ${marker}.`;

    app.innerHTML=head('Present or Past?',`Question ${index+1} / ${round.length} • Use the subject and time expression.`)+`<div class="panel quiz"><div class="progress"><span style="width:${index/round.length*100}%"></span></div><div class="tensePrompt"><span class="tenseBadge ${tense==='present'?'presentBadge':'pastBadge'}">${tense.toUpperCase()}</span><div class="promptEmoji">${icon(v)}</div><h2>${escapeHtml(sentence)}</h2><p class="muted">Base verb: <b>${escapeHtml(v.base)}</b></p></div><div class="options">${options.map(o=>`<button class="option" onclick="checkTenseChoice(this,decodeURIComponent('${enc(o)}'),decodeURIComponent('${enc(correct)}'))">${escapeHtml(o)}</button>`).join('')}</div><div id="feed" class="feedback"></div></div>`;
    window.tenseRound={good:()=>correctCount++,next:()=>{index++;render()}};
  }
  render();
}

function fillSentence(){
  const round=Array.from({length:10},()=>sample(sentencePool(),1)[0]);
  let index=0,correctCount=0;

  function render(){
    if(index>=round.length){
      app.innerHTML=head('Fill the Sentence')+resultCard(correctCount,round.length,Math.round(correctCount/round.length*100),'fillSentence()');
      return;
    }

    const v=round[index];
    const tense=Math.random()<.5?'present':'past';
    const subject=sample(Grammar.SUBJECTS,1)[0];
    const c=Grammar.context(v);
    const correct=tense==='present'?Grammar.present(v,subject):Grammar.past(v,subject);
    const marker=tense==='present'?'every day':'yesterday';

    app.innerHTML=head('Fill the Sentence',`Question ${index+1} / ${round.length} • Type the correct English verb form.`)+`<div class="panel finalBox"><div class="tensePrompt"><span class="tenseBadge ${tense==='present'?'presentBadge':'pastBadge'}">${tense.toUpperCase()}</span><div class="promptEmoji">${icon(v)}</div><h2>${escapeHtml(subject)} <span class="blankWord">______</span> ${escapeHtml(c.complement)} ${marker}.</h2><p class="muted">Base verb: <b>${escapeHtml(v.base)}</b></p></div><div class="answerRow"><input id="fillInput" class="answerInput bigInput" autocomplete="off" placeholder="Type the correct form"><button class="btn primary" onclick="checkFillSentence()">Check</button></div><div id="feed" class="feedback"></div></div>`;
    window.fillRound={v,correct,good:()=>correctCount++,next:()=>{index++;render()}};
    const input=$('#fillInput');
    input.focus();
    input.onkeydown=e=>{if(e.key==='Enter')checkFillSentence()};
  }
  render();
}

function renderBuilder(){
  const b=window.builder;
  const label=b.kind==='affirmative'?'Affirmative':b.kind==='negative'?'Negative':'Question';
  app.innerHTML=head('Build the Sentence',`Sentence ${b.roundIndex+1} / ${b.total} • ${label} • ${b.tense==='present'?'Present':'Past'}`)+`<div class="panel builderPanel"><div class="builderHint"><span class="tenseBadge ${b.tense==='present'?'presentBadge':'pastBadge'}">${b.tense.toUpperCase()}</span><span class="chip">${label.toUpperCase()}</span><span class="chip">${icon(b.v)} BASE VERB: ${escapeHtml(b.v.base)}</span></div><div id="builtSentence" class="builtSentence">${b.chosen.length?b.chosen.map(x=>`<button onclick="removeBuilderWord('${x.key}')">${escapeHtml(x.text)}</button>`).join(''):'<span>Tap the words below to build the sentence</span>'}</div><div class="wordBank">${b.tokens.map(x=>`<button onclick="addBuilderWord('${x.key}')">${escapeHtml(x.text)}</button>`).join('')}</div><div class="row"><button class="btn primary" onclick="checkBuilder()">Check sentence</button><button class="btn secondary" onclick="resetBuilder()">Reset</button></div><div id="feed" class="feedback"></div></div>`;
}

function robot(){
  const v=sample(pool(),1)[0];
  const mode=Math.random()<.5?'past':'present';
  const subject=mode==='present'?'She':'They';
  const word=(mode==='past'?Grammar.past(v,subject):Grammar.present(v,subject)).toUpperCase();
  const letters=new Set();
  window.rob={v,mode,subject,word,letters,errors:0,max:2,over:false};

  app.innerHTML=head('Save the Robot','Only TWO wrong letters. Use the base verb and tense to solve it.')+`<div class="panel robot"><div class="robotBox"><div class="robotFace" id="face">🤖</div><div class="lives" id="lives">❤️ ❤️</div><div class="energy"><span id="energy"></span></div><p><b>2 ERRORS ONLY</b></p></div><div><span class="tenseBadge ${mode==='present'?'presentBadge':'pastBadge'}">${mode.toUpperCase()}</span><h2>${mode==='present'?`Present form for SHE: ${escapeHtml(v.base)}`:`Past form: ${escapeHtml(v.base)}`}</h2><p class="muted">No translation. Use the tense and spelling pattern.</p><div class="hangWord" id="hang"></div><div class="keyboard">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(k=>`<button class="key" onclick="guessRobot(this,'${k}')">${k}</button>`).join('')}</div><div id="feed" class="feedback"></div><button id="robotNext" class="btn primary" style="display:none" onclick="robot()">Next verb</button></div></div>`;
  drawRobot();
}

function ladderGame(){
  const v=sample(pool(),1)[0];
  let step=0,points=0;
  const c=Grammar.context(v);
  const presentSentence=Grammar.affirmative(v,'present',c.subject,true);
  const pastSentence=Grammar.affirmative(v,'past',c.subject,true);
  const steps=[
    {label:'PRESENT (SHE)',answer:Grammar.present(v,'She'),choices:()=>sample(V.filter(x=>Grammar.present(x,'She')!==Grammar.present(v,'She')),3).map(x=>Grammar.present(x,'She'))},
    {label:'PAST SIMPLE',answer:Grammar.past(v,'They'),choices:()=>sample(V.filter(x=>Grammar.past(x,'They')!==Grammar.past(v,'They')),3).map(x=>Grammar.past(x,'They'))},
    {label:'PAST PARTICIPLE',answer:primaryParticiple(v),choices:()=>sample(V.filter(x=>primaryParticiple(x)!==primaryParticiple(v)),3).map(primaryParticiple)},
    {label:'PRESENT SENTENCE',answer:presentSentence,choices:()=>sample(V.filter(x=>x.id!==v.id),3).map(x=>Grammar.affirmative(x,'present',Grammar.context(x).subject,true))},
    {label:'PAST SENTENCE',answer:pastSentence,choices:()=>sample(V.filter(x=>x.id!==v.id),3).map(x=>Grammar.affirmative(x,'past',Grammar.context(x).subject,true))}
  ];

  function render(){
    if(step>=steps.length){
      app.innerHTML=head('Verb Ladder')+`<div class="panel result"><div style="font-size:72px">🪜✨</div><div class="score">${points}/5</div><h2>${escapeHtml(v.base.toUpperCase())} → ${escapeHtml(v.past.toUpperCase())}</h2><p class="muted">Completed entirely in English.</p><button class="btn primary" onclick="ladderGame()">Another ladder</button></div>`;
      return;
    }
    const current=steps[step];
    const options=shuffle([current.answer,...current.choices()]);
    app.innerHTML=head('Verb Ladder',`Step ${step+1} / 5 • One wrong answer sends you back to step 1.`)+`<div class="panel finalBox"><div class="ladder"><div class="ladderStep done"><span class="n">✓</span><div><small>BASE</small><b>${escapeHtml(v.base.toUpperCase())}</b></div></div>${steps.map((x,n)=>`<div class="ladderStep ${n<step?'done':''}"><span class="n">${n<step?'✓':n+1}</span><div><small>${escapeHtml(x.label)}</small><b>${n<step?escapeHtml(x.answer):'???'}</b></div></div>`).join('')}</div><h2>Choose: ${escapeHtml(current.label)}</h2><div class="options">${options.map(o=>`<button class="option" style="text-transform:none" onclick="pickLadder(this,decodeURIComponent('${enc(o)}'),decodeURIComponent('${enc(current.answer)}'))">${escapeHtml(o)}</button>`).join('')}</div><div id="feed" class="feedback"></div></div>`;
    window.ladder={right:()=>{points++;step++;render()},wrong:()=>{step=0;points=0;setTimeout(render,900)}};
  }

  window.pickLadder=(button,answer,correct)=>{
    document.querySelectorAll('.option').forEach(x=>x.disabled=true);
    if(answer===correct){
      button.classList.add('ok');
      $('#feed').textContent='Correct! Keep climbing.';
      $('#feed').style.color='var(--green)';
      addXP(8);
      setTimeout(window.ladder.right,650);
    }else{
      button.classList.add('bad');
      $('#feed').textContent='Wrong. Back to step 1.';
      $('#feed').style.color='var(--red)';
      resetStreak();
      window.ladder.wrong();
    }
  };
  render();
}

function speedGame(){
  clearInterval(speedTimer);
  let left=45,correct=0,total=0,combo=0,current=null,mode=null,subject=null;

  function newPrompt(){
    current=sample(pool(),1)[0];
    mode=Math.random()<.5?'present':'past';
    subject=sample(Grammar.SUBJECTS,1)[0];
    $('#speedLabel').textContent=mode==='present'?`Present for ${subject}`:'Past simple';
    $('#speedBase').textContent=current.base;
    $('#speedContext').textContent=mode==='present'?`${subject} ____ ${Grammar.context(current).complement} every day.`:`${subject} ____ ${Grammar.context(current).complement} yesterday.`;
    $('#speedEmoji').textContent=icon(current);
    $('#speedInput').value='';
    $('#speedInput').focus();
  }

  function finish(){
    clearInterval(speedTimer);
    app.innerHTML=head('Speed Run')+`<div class="panel result"><div style="font-size:72px">⚡</div><div class="score">${correct}</div><h2>correct answers in 45 seconds</h2><p>${total} attempts</p><button class="btn primary" onclick="speedGame()">Run again</button></div>`;
  }

  app.innerHTML=head('Speed Run','Use English context only. Type the requested form and press Enter.')+`<div class="panel speedBox"><div class="timerRing" id="timerRing" style="--deg:360deg"><b id="time">45</b></div><div class="speedPrompt"><span id="speedLabel" class="tenseBadge presentBadge"></span><div class="combo">COMBO ×<span id="combo">0</span></div><div class="emoji" id="speedEmoji">⚡</div><h2 id="speedBase"></h2><p id="speedContext" class="muted"></p><input id="speedInput" class="answerInput bigInput" autocomplete="off" placeholder="Type the form"><div id="feed" class="feedback"></div><p><b id="speedCorrect">0</b> correct • <b id="speedTotal">0</b> attempts</p></div></div>`;

  window.speedState={answer(){
    const val=$('#speedInput').value.trim().toLowerCase();
    if(!val)return;
    const expected=mode==='present'?Grammar.present(current,subject):Grammar.past(current,subject);
    total++;
    if(val===expected.toLowerCase()){
      correct++;combo++;addXP(5+Math.min(combo,5));
      $('#feed').textContent='Correct!';
      $('#feed').style.color='var(--green)';
    }else{
      combo=0;resetStreak();
      $('#feed').textContent='Answer: '+expected;
      $('#feed').style.color='var(--red)';
    }
    $('#speedCorrect').textContent=correct;
    $('#speedTotal').textContent=total;
    $('#combo').textContent=combo;
    setTimeout(newPrompt,220);
  }};

  $('#speedInput').onkeydown=e=>{if(e.key==='Enter')window.speedState.answer()};
  newPrompt();
  speedTimer=setInterval(()=>{
    left--;
    $('#time').textContent=left;
    $('#timerRing').style.setProperty('--deg',(left/45*360)+'deg');
    if(left<=0)finish();
  },1000);
}
