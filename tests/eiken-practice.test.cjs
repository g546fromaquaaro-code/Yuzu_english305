const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const bank=require('../assets/eiken-practice-bank.js');
function boot(values=new Map()){
 const elements=new Map();
 function el(s){if(!elements.has(s))elements.set(s,{innerHTML:'',textContent:'',disabled:false,focus(){},querySelectorAll:select});return elements.get(s);}
 function select(query){
  if(query==='button')return [...elements.values()];
  const attr=query.slice(1,-1),all=[...elements.values()].map(e=>e.innerHTML).join('');
  return [...all.matchAll(new RegExp('<button[^>]*'+attr+'="([^"]*)"[^>]*>(.*?)</button>','gs'))].map(m=>{const b=el(query+'='+m[1]);b.dataset={[attr.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:m[1]};b.textContent=m[2];return b;});
 }
 const c={console,localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},document:{querySelector:el,querySelectorAll:select},EikenPracticeBank:bank};vm.createContext(c);vm.runInContext(fs.readFileSync('assets/learning-progress.js','utf8'),c);
 vm.runInContext(fs.readFileSync('assets/eiken-practice.js','utf8').replace('  home();\n})();','  globalThis.api={start,render,home,get:()=>state,set:s=>{state=s;}};\n  home();\n})();'),c);
 return {c,el,select,values};
}
function answer(b,wrong=false){
 const s=b.c.api.get().session,q=bank.questions.find(q=>q.id===s.queue[0].id);
 if(q.type==='order'){
  const order=q.words.map((_,i)=>i);if(wrong)[order[0],order[1]]=[order[1],order[0]];
  for(const i of order)b.el('[data-word]='+i).onclick();b.el('#check').onclick();
 }else{
  const btn=b.select('[data-choice]').find(x=>wrong?x.textContent.slice(3)!==q.answer:x.textContent.slice(3)===q.answer);btn.onclick();
 }
}
test('42 unique questions cover 24 gaps, 8 replies, 10 orders with valid choices',()=>{
 assert.equal(bank.questions.length,42);assert.equal(new Set(bank.questions.map(q=>q.id)).size,42);
 assert.deepEqual(['gap','talk','order'].map(t=>bank.questions.filter(q=>q.type===t).length),[24,8,10]);
 for(const q of bank.questions){assert.ok(q.explanation);if(q.choices){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.choices.includes(q.answer));}else assert.equal(new Set(q.words).size,q.words.length);}
});
test('all 42 questions can be completed through choice and ordering controls',()=>{
 const b=boot();for(const q of bank.questions){b.c.api.set({version:1,done:[],session:{queue:[{id:q.id,retry:false}],total:1,first:0,correct:0,picks:[]}});b.c.api.render();if(q.type==='order'){assert.equal(b.el('#check').disabled,true);b.el('#check').onclick();assert.equal(b.c.api.get().session.correct,0);}answer(b);assert.equal(b.c.api.get().session,null);b.el('#next').onclick();assert.match(b.el('#board').innerHTML,/1 \/ 1問正解/);}
});
test('balanced daily session resumes wrong-only retry and keeps first-attempt score',()=>{
 let b=boot();b.values.set('eigo305-mastered-v1','["old-word"]');b.c.api.start();
 const ids=b.c.api.get().session.queue.map(x=>x.id);assert.equal(ids.filter(x=>x.startsWith('gap')).length,6);
 const failed=ids[0];answer(b,true);b=boot(b.values);b.el('#resume').onclick();let count=0;
 while(b.c.api.get().session){answer(b);b.el('#next').onclick();assert.ok(++count<=12);}
 assert.match(b.el('#board').innerHTML,/11 \/ 12問正解/);
 assert.equal(b.c.LearningSupport.create(b.c.localStorage).get('eiken-foundations',failed).pending,false);
 assert.equal(b.values.get('eigo305-mastered-v1'),'["old-word"]');
});
test('partial word arrangement persists and corrupt sessions are discarded',()=>{
 let b=boot();b.c.api.start('order');const id=b.c.api.get().session.queue[0].id;b.el('[data-word]=1').onclick();b=boot(b.values);assert.equal(b.c.api.get().session.queue[0].id,id);assert.deepEqual(Array.from(b.c.api.get().session.picks),[1]);
 for(const raw of ['null','bad','{"version":1,"done":{},"session":{"queue":[null]}}']){b=boot(new Map([['eigo305-eiken-practice-v1',raw]]));assert.equal(b.c.api.get().session,null);}
});
