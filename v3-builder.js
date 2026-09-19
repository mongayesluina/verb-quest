/* Sentence Builder module: interactive word-order practice. */
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
    if((state.level===0||state.level>=2)&&Math.random()<.4){
      kind=Math.random()<.5?'negative':'question';
    }

    const c=Grammar.context(v);
    const target=Grammar[kind](v,tense,c.subject,true);
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

function renderBuilder(){
  const b=window.builder;
  const label=b.kind==='affirmative'?'Affirmative':b.kind==='negative'?'Negative':'Question';
  app.innerHTML=head('Build the Sentence',`Sentence ${b.roundIndex+1} / ${b.total} • ${label} • ${b.tense==='present'?'Present':'Past'}`)+`<div class="panel builderPanel"><div class="builderHint"><span class="tenseBadge ${b.tense==='present'?'presentBadge':'pastBadge'}">${b.tense.toUpperCase()}</span><span class="chip">${label.toUpperCase()}</span><span class="chip">${icon(b.v)} ${escapeHtml(b.v.base)} = ${escapeHtml(b.v.meaning)}</span></div><div id="builtSentence" class="builtSentence">${b.chosen.length?b.chosen.map(x=>`<button onclick="removeBuilderWord('${x.key}')">${escapeHtml(x.text)}</button>`).join(''):'<span>Tap the words below to build the sentence</span>'}</div><div class="wordBank">${b.tokens.map(x=>`<button onclick="addBuilderWord('${x.key}')">${escapeHtml(x.text)}</button>`).join('')}</div><div class="row"><button class="btn primary" onclick="checkBuilder()">Check sentence</button><button class="btn secondary" onclick="resetBuilder()">Reset</button></div><div id="feed" class="feedback"></div></div>`;
}

function addBuilderWord(key){
  const b=window.builder,index=b.tokens.findIndex(x=>x.key===key);
  if(index<0)return;
  b.chosen.push(b.tokens.splice(index,1)[0]);
  renderBuilder();
}
function removeBuilderWord(key){
  const b=window.builder,index=b.chosen.findIndex(x=>x.key===key);
  if(index<0)return;
  b.tokens.push(b.chosen.splice(index,1)[0]);
  renderBuilder();
}
function resetBuilder(){
  const b=window.builder;
  b.tokens=shuffle([...b.tokens,...b.chosen]);
  b.chosen=[];
  renderBuilder();
}
function checkBuilder(){
  const b=window.builder,answer=b.chosen.map(x=>x.text).join(' '),feed=$('#feed');
  if(Grammar.sameSentence(answer,b.target)){
    feed.textContent='Excellent! '+b.target;
    feed.style.color='var(--green)';
    addXP(15);
    b.right();
    setTimeout(b.next,1000);
  }else{
    feed.textContent='Not yet. Check word order, auxiliary and verb form.';
    feed.style.color='var(--red)';
    resetStreak();
  }
}
