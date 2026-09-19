/* Centralized answer validation for grammar-sensitive activities. */
const baseNormalize=Grammar.normalize;
Grammar.normalize=function(text){
  return baseNormalize(String(text||'').replace(/’/g,"'")).replace(/'/g,'');
};
Grammar.sameSentence=function(a,b){return Grammar.normalize(a)===Grammar.normalize(b)};

function checkFillSentence(){
  const r=window.fillRound,input=$('#fillInput');
  if(!r||!input||input.disabled)return;
  const value=input.value.trim().toLowerCase();
  const expected=r.correct.toLowerCase();
  let correct=value===expected;

  // Alternative past forms such as learned/learnt or burned/burnt are accepted.
  // BE is excluded because was/were must agree with the subject.
  if(!correct&&r.v.base!=='be'&&pastForms(r.v).includes(expected)){
    correct=pastForms(r.v).includes(value);
  }

  input.disabled=true;
  if(correct){
    $('#feed').textContent='Correct! +12 XP';
    $('#feed').style.color='var(--green)';
    addXP(12);
    r.good();
  }else{
    $('#feed').textContent='Correct answer: '+r.correct;
    $('#feed').style.color='var(--red)';
    resetStreak();
  }
  setTimeout(r.next,900);
}
