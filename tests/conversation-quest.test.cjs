const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../assets/conversation-quest-bank.js');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function boot(values=new Map(),audio=true,autoEnd=true){
  const nodes=new Map(),handlers={},spoken=[];
  const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',addEventListener:(name,fn)=>handlers[name]=fn});return nodes.get(id);};
  const c={document:{getElementById:node,addEventListener(){}},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},addEventListener(){}};
  if(audio){c.speechSynthesis={cancel(){},getVoices:()=>[],speak:u=>{spoken.push(u);if(autoEnd)u.onend?.();}};c.SpeechSynthesisUtterance=function(text){this.text=text;};}c.window=c;vm.createContext(c);
  for(const f of ['conversation-quest-bank.js','conversation-quest.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets',f),'utf8'),c);
  return{values,spoken,html:()=>node('questApp').innerHTML,notice:()=>node('questNotice').textContent,click:(action,id)=>handlers.click({target:{closest:()=>({dataset:{action,id:String(id??'')}})}})};
}
function decode(s){return s.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');}
function choice(h,text){if(!h.html().includes('data-action="choice"'))h.click('listen');const entry=[...h.html().matchAll(/data-action="choice" data-id="(\d+)"[^>]*>(.*?)<\/button>/g)].find(m=>decode(m[2])===text);assert.ok(entry);h.click('choice',entry[1]);}
test('eight complete scenes have unambiguous choices and stable unique records',()=>{
  assert.equal(C.scenes.length,8);assert.equal(C.turns.length,24);
  assert.equal(new Set(C.turns.map(q=>q.id)).size,24);
  for(const s of C.scenes){assert.equal(s.turns.length,3);assert.ok(s.ending&&s.endingJa&&s.challenge);for(const q of s.turns){assert.ok(q.prompt&&q.ja&&q.task&&q.tip);assert.equal(new Set([q.answer,...q.wrong]).size,3);assert.equal(q.answer.split(' ').join(' '),q.answer);}}
});
test('invalid saved records are discarded and each difficulty stays independent',()=>{
  assert.deepEqual(C.read(null),{});
  assert.deepEqual(C.read({'hello-0':{choice:'done',order:'again',speak:'fake'},unknown:{choice:'done'}}),{'hello-0':{choice:'done',order:'again'}});
  const tokens=['I','do','what','I','can.'];assert.deepEqual(C.shuffle(tokens).sort(),tokens.slice().sort());assert.equal(tokens.join(' '),'I do what I can.');
});
test('all 24 exchanges complete in each mode with separate saved achievements',()=>{
 const h=boot();
 for(const mode of C.modes){h.click('home');h.click('mode',mode);for(const s of C.scenes){h.click('start',s.id);for(const q of s.turns){
   h.click('listen');assert.equal(h.spoken.at(-1).text,q.prompt);
   if(mode==='choice')choice(h,q.answer);
   else if(mode==='order'){h.click('check');assert.doesNotMatch(h.html(),/正解の返事/);for(let i=0;i<q.answer.split(' ').length;i++)h.click('word',i);h.click('check');}
   else {assert.doesNotMatch(h.html(),/<b>返事の一例<\/b>/);h.click('said');assert.equal(h.values.has(C.KEY)&&JSON.parse(h.values.get(C.KEY))[q.id]?.speak==='done',false);h.click('reveal');}
   h.click('model');assert.equal(h.spoken.at(-1).text,q.answer);h.click(mode==='speak'?'said':'next');
 }assert.match(h.html(),/3往復、練習できたね/);h.click('ending');assert.equal(h.spoken.at(-1).text,s.ending);h.click('home');}}
 const saved=JSON.parse(h.values.get(C.KEY));for(const q of C.turns)assert.deepEqual(saved[q.id],{choice:'done',order:'done',speak:'done'});
});
test('mistakes survive reload and clear only on a fresh successful retry; audio fallback works',()=>{
 const values=new Map([['unrelated-progress','keep']]);let h=boot(values);h.click('start','hello');choice(h,C.turns[0].wrong[0]);choice(h,C.turns[0].answer);assert.equal(JSON.parse(values.get(C.KEY))['hello-0'].choice,'again');
 h=boot(values);h.click('review');choice(h,C.turns[0].answer);h.click('next');assert.match(h.html(),/1往復/);assert.equal(JSON.parse(values.get(C.KEY))['hello-0'].choice,'done');assert.equal(values.get('unrelated-progress'),'keep');
 h=boot(new Map([[C.KEY,'invalid-json']]),false);assert.match(h.notice(),/読み込めません/);h.click('start','hello');h.click('listen');assert.match(h.notice(),/読み上げが使えません/);
});
test('word removal, repeated tokens and next-stage navigation preserve correct sequence',()=>{
 const h=boot();h.click('start','hello');for(const q of C.scenes[0].turns){choice(h,q.answer);h.click('next');}h.click('advance');h.click('listen');assert.match(h.html(),/② 英文を組み立てる/);h.click('word',1);h.click('undo',1);for(let i=0;i<5;i++)h.click('word',i);h.click('check');assert.match(h.html(),/正解の返事/);
});

test('listening lengths are exactly one sentence or two to four, for every exchange',()=>{
 const count=s=>(s.match(/[.!?]+/g)||[]).length;
 for(const q of C.turns){assert.equal(count(C.prompt(q,1)),1,q.id);assert.ok(count(C.prompt(q,2))>=2&&count(C.prompt(q,2))<=4,q.id);assert.ok(C.translation(q,2));}
});
test('English stays hidden until requested and answers wait for audio completion',()=>{
 const h=boot(new Map(),true,false);h.click('start','hello');
 assert.ok(!h.html().includes(C.turns[0].prompt));assert.ok(!h.html().includes(C.turns[0].answer));
 h.click('listen');assert.ok(!h.html().includes('data-action="choice"'));
 h.spoken.at(-1).onend();assert.ok(h.html().includes('data-action="choice"'));assert.ok(!h.html().includes(C.turns[0].prompt));
 h.click('show');assert.ok(h.html().includes(C.turns[0].prompt));
 h.click('home');h.click('start','food');h.click('listen');const old=h.spoken.at(-1);h.click('home');old.onend();assert.match(h.html(),/今日の場面/);
});
test('level two uses longer audio and separate progress; transcript works without audio',()=>{
 const values=new Map();const h=boot(values);h.click('start','hello');choice(h,C.turns[0].answer);h.click('home');h.click('level',2);h.click('start','hello');h.click('listen');assert.equal(h.spoken.at(-1).text,C.turns[0].longPrompt);choice(h,C.turns[0].wrong[0]);assert.equal(JSON.parse(values.get(C.KEY))['hello-0'].choice,'done');assert.equal(JSON.parse(values.get(C.KEY+'-level2'))['hello-0'].choice,'again');
 const f=boot(new Map(),false);f.click('start','hello');f.click('listen');f.click('show');assert.ok(f.html().includes('data-action="choice"'));
});
