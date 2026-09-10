const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function boot(saved='[]'){
 class El{constructor(){this.children=[];this.textContent='';this.disabled=false;}append(x){this.children.push(x);}replaceChildren(){this.children=[];}scrollIntoView(){}querySelectorAll(){return this.children.filter(x=>x.tag==='button');}}
 const elements={};for(const id of ['#quiz','#saveStatus','#weak','#start'])elements[id]=new El();
 let value=saved;const context={document:{querySelector:id=>elements[id],createElement:tag=>Object.assign(new El(),{tag})},localStorage:{getItem:()=>value,setItem:(k,v)=>{value=v;}},Set,JSON,Math};
 let source=fs.readFileSync('hayamihyo4.js','utf8').replace('  function start(onlyWeak)', '  globalThis.exposed={questions,getQueue:()=>queue};\n  function start(onlyWeak)');vm.runInNewContext(source,context);return{elements,context,read:()=>JSON.parse(value)};
}
test('all twelve questions require a correct answer; mistakes persist without inflating initial score',()=>{
 const b=boot();b.elements['#start'].onclick();const queue=b.context.exposed.getQueue();assert.equal(queue.length,12);
 queue.forEach((q,i)=>{const quiz=b.elements['#quiz'],opts=quiz.children.find(x=>x.className==='options');if(i===0){opts.children.find(x=>x.textContent!==q[2][0]).onclick();assert.equal(quiz.children.some(x=>x.textContent==='次へ'),false);assert.deepEqual(b.read(),[q[0]]);}opts.children.find(x=>x.textContent===q[2][0]).onclick();quiz.children.at(-1).onclick();});
 assert.match(b.elements['#quiz'].children[0].textContent,/11 \/ 12/);assert.equal(b.read().length,1);
 const again=boot(JSON.stringify(b.read()));again.elements['#weak'].onclick();const q=again.context.exposed.getQueue()[0],quiz=again.elements['#quiz'];quiz.children.find(x=>x.className==='options').children.find(x=>x.textContent===q[2][0]).onclick();assert.equal(again.read().length,0);
});
test('invalid saved shape does not block practice',()=>{for(const raw of ['null','{}','bad']){const b=boot(raw);b.elements['#start'].onclick();assert.equal(b.context.exposed.getQueue().length,12);}});
