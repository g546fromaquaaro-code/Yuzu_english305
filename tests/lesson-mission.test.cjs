const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const data=require('../assets/lesson-mission-bank.js');
const read=p=>fs.readFileSync(p,'utf8');
function boot(part='2'){
 const els=new Map(),values=new Map([['eigo305-sound-v1','off'],['eigo305-mastered-v1','["pronoun-1"]']]);
 function el(k){if(!els.has(k))els.set(k,{innerHTML:'',textContent:'',value:'',checked:false,style:{setProperty(){}},appendChild(){},remove(){},classList:{add(){},remove(){},toggle(){},contains(){return false}},before(){},after(){},prepend(){},addEventListener(){},scrollIntoView(){}});return els.get(k);}
 const c={console,URLSearchParams,location:{search:'?part='+part},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},performance:{now:()=>1000},setInterval:()=>1,clearInterval(){},setTimeout:()=>1,scrollTo(){},addEventListener(){},document:{querySelector:el,querySelectorAll:()=>[],createElement:()=>el('new-'+els.size),body:el('body'),addEventListener(){}},speechSynthesis:{cancel(){},getVoices:()=>[],speak(){}},fetch:()=>Promise.reject(Error('Part 2 must not fetch legacy data'))};c.window=c;vm.createContext(c);
 for(const f of ['assets/learning-progress.js','assets/lesson-mission-bank.js'])vm.runInContext(read(f),c);
 vm.runInContext([...read('hayamihyo.html').matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],c);
 vm.runInContext(read('assets/lesson-mission.js'),c);vm.runInContext(read('assets/mission-review.js'),c);
 return {c,el,values,run:s=>vm.runInContext(s,c)};
}
test('deduplicated bank covers both 30-lesson tracks with provenance and corrected meanings',()=>{
 assert.equal(data.words.length,515);assert.equal(new Set(data.words.map(w=>w.id)).size,515);
 assert.equal(new Set(data.words.map(w=>w.en.toLowerCase().replace(/[.!?]$/,''))).size,515);
 for(const track of ['合格','フレーズ'])assert.equal(new Set(data.words.flatMap(w=>w.sources.filter(s=>s.track===track).map(s=>s.n))).size,30);
 assert.equal(data.words.filter(w=>w.existing).length,82);
 assert.equal(data.words.find(w=>w.en==='a sheep farmer').ja,'羊を育てる農家');
 assert.equal(data.words.find(w=>w.en==='She is baking a cake.').ja,'彼女はケーキを焼いています');
 for(const g of data.groups)assert.ok(data.words.filter(w=>w.groups.includes(g.id)).length>=20);
});
test('Part 2 uses shared game, keeps Part 1 records separate, and retries with enough cards',()=>{
 const b=boot();b.run("selectedCat='core-0';updateSelection();start()");assert.equal(b.run('round.length'),20);
 b.run('finish()');assert.equal(b.run('graded'),false);
 b.run('round.forEach((w,i)=>{fill[i]=bank.find(x=>x.en===w.en).id});[fill[0],fill[1]]=[fill[1],fill[0]];finish()');
 assert.equal(JSON.parse(b.values.get('eigo305-lesson-mission-mastered-v1')).length,18);
 assert.equal(b.values.get('eigo305-mastered-v1'),'["pronoun-1"]');
 assert.ok(JSON.parse(b.values.get('eigo305-practice-v1'))['lesson-mission']);
 b.el('#again').onclick();assert.equal(b.run('round.length'),2);assert.ok(b.run('bank.length')>=4);
 b.run('round.forEach((w,i)=>{fill[i]=bank.find(x=>x.en===w.en).id});finish()');assert.match(b.el('#result').innerHTML,/解き直しクリア/);
 assert.equal(b.values.get('eigo305-lesson-mission-records-v1'),undefined);
});
test('lesson and new-expression filters drive both guide and mission with separate best records',()=>{
 const b=boot();b.run("selectedCat='phrases-5';updateSelection()");
 assert.match(b.el('#lesson-filter').innerHTML,/Lesson 30/);assert.doesNotMatch(b.el('#lesson-filter').innerHTML,/Lesson 22/);
 b.el('#lesson-filter').value='30';b.el('#lesson-new').checked=true;b.el('#lesson-filter').onchange();
 assert.ok(b.run("wordsFor(selectedCat).every(w=>!w.existing && w.sources.some(s=>s.track==='フレーズ'&&s.n===30))"));
 assert.match(b.el('#lesson-table').innerHTML,/Are you watching an action movie/);
 assert.equal(b.run('recKey()'),'normal-phrases-5-lesson-30-new');b.run('start()');assert.ok(b.run('round.length')>0);
});
