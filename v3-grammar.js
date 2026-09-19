const Grammar=(()=>{
  const THIRD_PERSON_SUBJECTS=new Set(['he','she','it']);
  const SUBJECTS=['I','You','He','She','We','They'];

  const CONTEXTS={
    be:{subject:'She',complement:'at home'}, become:{subject:'He',complement:'a better player'}, begin:{subject:'The class',complement:'at eight o’clock'}, break:{subject:'She',complement:'the glass'}, bring:{subject:'He',complement:'his notebook'}, build:{subject:'They',complement:'a small house'}, buy:{subject:'She',complement:'fresh bread'}, catch:{subject:'He',complement:'the ball'}, choose:{subject:'She',complement:'the blue shirt'}, come:{subject:'They',complement:'to class'}, cost:{subject:'The ticket',complement:'ten dollars'}, cut:{subject:'She',complement:'the paper'}, do:{subject:'He',complement:'his homework'}, draw:{subject:'She',complement:'a picture'}, drink:{subject:'He',complement:'water'}, drive:{subject:'She',complement:'to work'}, eat:{subject:'He',complement:'breakfast'}, fall:{subject:'The book',complement:'on the floor'}, feel:{subject:'She',complement:'happy'}, find:{subject:'He',complement:'his keys'}, forget:{subject:'She',complement:'the answer'}, get:{subject:'He',complement:'a message'}, give:{subject:'She',complement:'a gift'}, go:{subject:'He',complement:'to school'}, grow:{subject:'The plant',complement:'quickly'}, have:{subject:'She',complement:'a new book'}, hear:{subject:'He',complement:'a strange noise'}, hide:{subject:'She',complement:'the key'}, hit:{subject:'He',complement:'the ball'}, hold:{subject:'She',complement:'the box'}, keep:{subject:'He',complement:'the receipt'}, know:{subject:'She',complement:'the answer'}, leave:{subject:'He',complement:'the office'}, let:{subject:'She',complement:'her friend enter'}, lose:{subject:'He',complement:'his wallet'}, make:{subject:'She',complement:'a cake'}, meet:{subject:'He',complement:'his friends'}, pay:{subject:'She',complement:'the bill'}, put:{subject:'He',complement:'the book on the table'}, read:{subject:'She',complement:'a short story'}, run:{subject:'He',complement:'in the park'}, say:{subject:'She',complement:'hello'}, see:{subject:'He',complement:'his teacher'}, sleep:{subject:'She',complement:'well'}, speak:{subject:'He',complement:'English'}, take:{subject:'She',complement:'the bus'}, teach:{subject:'He',complement:'English'}, tell:{subject:'She',complement:'the truth'}, think:{subject:'He',complement:'about the problem'}, understand:{subject:'She',complement:'the lesson'}, wake:{subject:'He',complement:'early'}, wear:{subject:'She',complement:'a red jacket'}, win:{subject:'He',complement:'the game'}, write:{subject:'She',complement:'an email'},
    answer:{subject:'He',complement:'the question'}, ask:{subject:'She',complement:'a question'}, call:{subject:'He',complement:'his mother'}, clean:{subject:'She',complement:'the room'}, close:{subject:'He',complement:'the door'}, cook:{subject:'She',complement:'dinner'}, dance:{subject:'They',complement:'together'}, enjoy:{subject:'She',complement:'the music'}, finish:{subject:'He',complement:'the project'}, help:{subject:'She',complement:'her brother'}, jump:{subject:'He',complement:'over the box'}, like:{subject:'She',complement:'rock music'}, listen:{subject:'He',complement:'to the teacher'}, live:{subject:'She',complement:'in Cochabamba'}, look:{subject:'He',complement:'at the picture'}, love:{subject:'She',complement:'her family'},
    deal:{subject:'He',complement:'with the problem'}, dig:{subject:'They',complement:'a hole'}, dream:{subject:'She',complement:'about traveling'}, feed:{subject:'He',complement:'the dog'}, fight:{subject:'They',complement:'for their team'}, fly:{subject:'The plane',complement:'over the city'}, forgive:{subject:'She',complement:'her friend'}, freeze:{subject:'The water',complement:'quickly'}, hang:{subject:'He',complement:'the picture on the wall'}, hurt:{subject:'She',complement:'her arm'}, lay:{subject:'He',complement:'the book on the desk'}, lead:{subject:'She',complement:'the group'}, learn:{subject:'He',complement:'new words'}, lend:{subject:'She',complement:'her pen'}, lie:{subject:'He',complement:'on the sofa'}, light:{subject:'She',complement:'the candle'}, mean:{subject:'This word',complement:'something important'}, ride:{subject:'He',complement:'his bicycle'}, ring:{subject:'The phone',complement:'at noon'}, rise:{subject:'The sun',complement:'early'}, sell:{subject:'She',complement:'old books'}, send:{subject:'He',complement:'a message'}, set:{subject:'She',complement:'the alarm'}, shake:{subject:'He',complement:'the bottle'}, shine:{subject:'The sun',complement:'brightly'}, shoot:{subject:'He',complement:'the ball'}, show:{subject:'She',complement:'the photo'}, shut:{subject:'He',complement:'the window'}, sing:{subject:'She',complement:'a song'}, sit:{subject:'He',complement:'near the window'}, spend:{subject:'She',complement:'time with her family'}, stand:{subject:'He',complement:'near the door'}, steal:{subject:'The thief',complement:'the bicycle'}, stick:{subject:'She',complement:'the note on the wall'}, swim:{subject:'He',complement:'in the pool'}, tear:{subject:'She',complement:'the paper'}, throw:{subject:'He',complement:'the ball'}, beat:{subject:'Our team',complement:'the other team'}, bite:{subject:'The dog',complement:'the toy'}, blow:{subject:'The wind',complement:'strongly'},
    accept:{subject:'She',complement:'the invitation'}, add:{subject:'He',complement:'some sugar'}, arrive:{subject:'She',complement:'at school'}, believe:{subject:'He',complement:'the story'}, borrow:{subject:'She',complement:'a book'}, carry:{subject:'He',complement:'the bags'}, change:{subject:'She',complement:'her plan'}, check:{subject:'He',complement:'the answer'}, climb:{subject:'She',complement:'the mountain'}, create:{subject:'He',complement:'a new project'}, cry:{subject:'The baby',complement:'loudly'}, decide:{subject:'She',complement:'to stay home'}, describe:{subject:'He',complement:'the picture'}, discover:{subject:'She',complement:'a new place'}, explain:{subject:'He',complement:'the lesson'}, follow:{subject:'She',complement:'the instructions'}, happen:{subject:'The accident',complement:'near the school'}, hope:{subject:'He',complement:'for good news'}, improve:{subject:'She',complement:'her English'}, include:{subject:'The course',complement:'five units'}, invite:{subject:'He',complement:'his friends'}, miss:{subject:'She',complement:'the bus'}, move:{subject:'He',complement:'to a new apartment'}, need:{subject:'She',complement:'more time'}, open:{subject:'He',complement:'the window'}, order:{subject:'She',complement:'a pizza'}, paint:{subject:'He',complement:'the wall'}, pass:{subject:'She',complement:'the exam'}, phone:{subject:'He',complement:'his friend'}, plan:{subject:'She',complement:'the trip'},
    sink:{subject:'The boat',complement:'slowly'}, bend:{subject:'He',complement:'the wire'}, bet:{subject:'She',complement:'on the game'}, bleed:{subject:'His hand',complement:'after the accident'}, burn:{subject:'The wood',complement:'quickly'}, creep:{subject:'The cat',complement:'quietly'}, forbid:{subject:'The teacher',complement:'phones in class'}, kneel:{subject:'He',complement:'on the floor'}, leap:{subject:'The athlete',complement:'over the bar'}, smell:{subject:'They',complement:'the flowers'}, spell:{subject:'She',complement:'the word correctly'}, spill:{subject:'He',complement:'the water'}, spoil:{subject:'The heat',complement:'the food'}, sweep:{subject:'She',complement:'the floor'}, swing:{subject:'The child',complement:'in the park'}, weep:{subject:'She',complement:'quietly'}, kiss:{subject:'He',complement:'his daughter'}, laugh:{subject:'She',complement:'at the joke'}, play:{subject:'He',complement:'soccer'}, practice:{subject:'She',complement:'English'}, prepare:{subject:'He',complement:'breakfast'}, rain:{subject:'It',complement:'a lot'}, receive:{subject:'She',complement:'an email'}, remember:{subject:'He',complement:'the answer'}, repeat:{subject:'She',complement:'the sentence'}, reply:{subject:'He',complement:'to the message'}, return:{subject:'She',complement:'home'}, save:{subject:'He',complement:'the document'}, search:{subject:'She',complement:'for her keys'}, share:{subject:'He',complement:'the information'}, shop:{subject:'She',complement:'at the market'}, smile:{subject:'He',complement:'at the camera'}, start:{subject:'The class',complement:'at nine'}, stay:{subject:'She',complement:'at home'}, stop:{subject:'The bus',complement:'near the school'}, study:{subject:'He',complement:'English'}, talk:{subject:'She',complement:'to her teacher'}, thank:{subject:'He',complement:'his friend'}, touch:{subject:'She',complement:'the screen'}, train:{subject:'He',complement:'at the gym'}, travel:{subject:'She',complement:'by bus'}, try:{subject:'He',complement:'a new method'}, turn:{subject:'She',complement:'the page'}, type:{subject:'He',complement:'the report'}, use:{subject:'She',complement:'the computer'}, visit:{subject:'He',complement:'his grandparents'}, wait:{subject:'She',complement:'for the bus'}, walk:{subject:'He',complement:'to school'}, want:{subject:'She',complement:'a new phone'}, wash:{subject:'He',complement:'the car'}, watch:{subject:'She',complement:'a movie'}, welcome:{subject:'They',complement:'the new students'}, wish:{subject:'He',complement:'for good luck'}, work:{subject:'She',complement:'at a school'}, worry:{subject:'He',complement:'about the exam'}, agree:{subject:'She',complement:'with the idea'}, allow:{subject:'The teacher',complement:'students to enter'}, appear:{subject:'The rainbow',complement:'in the sky'}, celebrate:{subject:'They',complement:'the holiday'}, collect:{subject:'She',complement:'old books'}
  };

  function normalizeSubject(subject){return String(subject||'They').trim()}
  function lowerSubject(subject){return normalizeSubject(subject).toLowerCase()}
  function isThirdPerson(subject){const s=lowerSubject(subject);return THIRD_PERSON_SUBJECTS.has(s)||(!['i','you','we','they'].includes(s)&&!s.includes(' and '))}
  function isPluralSubject(subject){const s=lowerSubject(subject);return ['you','we','they'].includes(s)||s.includes(' and ')}
  function midSentenceSubject(subject){
    const s=normalizeSubject(subject);
    if(s==='I')return 'I';
    if(['You','He','She','It','We','They'].includes(s))return s.toLowerCase();
    if(/^(The|This|That|Our|His|Her)\s/.test(s))return s.charAt(0).toLowerCase()+s.slice(1);
    return s;
  }

  function present3(base){
    const b=base.toLowerCase();
    if(b==='be')return 'is';
    if(b==='have')return 'has';
    if(b==='do')return 'does';
    if(b==='go')return 'goes';
    if(/[^aeiou]y$/.test(b))return b.slice(0,-1)+'ies';
    if(/(s|x|z|ch|sh|o)$/.test(b))return b+'es';
    return b+'s';
  }

  function present(v,subject){
    const s=lowerSubject(subject);
    if(v.base==='be'){
      if(s==='i')return 'am';
      if(isPluralSubject(subject))return 'are';
      return 'is';
    }
    return isThirdPerson(subject)?present3(v.base):v.base;
  }

  function past(v,subject){
    if(v.base==='be')return (lowerSubject(subject)==='i'||(!isPluralSubject(subject)&&isThirdPerson(subject)))?'was':'were';
    return v.past.split('/')[0].trim();
  }

  function context(v){return CONTEXTS[v.base]||{subject:'They',complement:'carefully'}}

  function affirmative(v,tense='present',subject=null,marker=true){
    const c=context(v),s=subject||c.subject,form=tense==='past'?past(v,s):present(v,s),time=marker?(tense==='past'?'yesterday':'every day'):'';
    return [s,form,c.complement,time].filter(Boolean).join(' ').replace(/\s+/g,' ').trim()+'.';
  }

  function negative(v,tense='present',subject=null,marker=true){
    const c=context(v),s=subject||c.subject,time=marker?(tense==='past'?'yesterday':'every day'):'';let parts;
    if(v.base==='be')parts=[s,tense==='past'?past(v,s):present(v,s),'not',c.complement,time];
    else if(tense==='past')parts=[s,'did not',v.base,c.complement,time];
    else parts=[s,isThirdPerson(s)?'does not':'do not',v.base,c.complement,time];
    return parts.filter(Boolean).join(' ').replace(/\s+/g,' ').trim()+'.';
  }

  function question(v,tense='present',subject=null,marker=true){
    const c=context(v),s=subject||c.subject,mid=midSentenceSubject(s),time=marker?(tense==='past'?'yesterday':'every day'):'';let parts;
    if(v.base==='be')parts=[tense==='past'?past(v,s):present(v,s),mid,c.complement,time];
    else if(tense==='past')parts=['Did',mid,v.base,c.complement,time];
    else parts=[isThirdPerson(s)?'Does':'Do',mid,v.base,c.complement,time];
    const out=parts.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
    return out.charAt(0).toUpperCase()+out.slice(1)+'?';
  }

  function normalize(text){
    return String(text||'').toLowerCase()
      .replace(/doesn't/g,'does not').replace(/don't/g,'do not').replace(/didn't/g,'did not')
      .replace(/isn't/g,'is not').replace(/aren't/g,'are not').replace(/wasn't/g,'was not').replace(/weren't/g,'were not')
      .replace(/i'm/g,'i am').replace(/he's/g,'he is').replace(/she's/g,'she is').replace(/it's/g,'it is')
      .replace(/[?.!,]/g,'').replace(/\s+/g,' ').trim();
  }

  function sameSentence(a,b){return normalize(a)===normalize(b)}
  function tokenize(sentence){return sentence.replace(/[?.!]/g,'').split(/\s+/).filter(Boolean)}
  function presentOptions(v,subject){const correct=present(v,subject),d=new Set([v.base,present3(v.base),past(v,subject),v.participle.split('/')[0].trim()]);d.delete(correct);return [correct,...[...d].slice(0,3)]}
  function pastOptions(v,subject){const correct=past(v,subject),d=new Set([v.base,present(v,subject),present3(v.base),v.participle.split('/')[0].trim()]);d.delete(correct);return [correct,...[...d].slice(0,3)]}

  return {SUBJECTS,context,present3,present,past,affirmative,negative,question,normalize,sameSentence,tokenize,presentOptions,pastOptions,isThirdPerson};
})();
