const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const data=JSON.parse(fs.readFileSync('legacy.html','utf8').match(/const DATA=(\{.*?\}),W=DATA.words/s)[1]);
 const values=new Map(),els=new Map();
 const el=id=>{if(!els.has(id))els.set(id,{innerHTML:'',textContent:'',value:'',className:'',before(){},classList:{add(){}},disabled:true});return els.get(id)};
 const buttons=Array.from({length:4},()=>({disabled:true,classList:{add(){}}}));
 const c={W:data.words,LearningSupport:null,localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},home(){},start(){c.normalStarted=true},answer(){},nextQuestion(){},speakWord(){},quizMode:'listening',timer:null,category:'all',choices:[],stars:0,mastered:new Set(),LISTEN_SHOP_KEY:'listen',STAR_KEY:'stars',shopSet:k=>new Set(JSON.parse(values.get(k)||'[]')),save(){},visitDay(){},stopBgm(){},sparkle(){},clearInterval(){},shuffle:a=>[...a],document:{querySelector:el,querySelectorAll:()=>buttons,addEventListener(){}},addEventListener(){},SpeechSynthesisUtterance:function(t){this.text=t},speechSynthesis:{cancel(){},getVoices:()=>[],speak:u=>{c.utterance=u}}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('assets/learning-progress.js','utf8'),c);vm.runInContext(fs.readFileSync('assets/listening-upgrade.js','utf8'),c);return {c,el,values,buttons};
}
test('listening requires completed audio, retries mistakes, and preserves first score',()=>{
 const {c,el}=setup();c.start('weather');
 c.answer(0);assert.equal(el('#feedback').innerHTML,'');
 el('#listen-play').onclick();c.utterance.onend();
 const q=c.W.find(w=>w.en===c.utterance.text);c.answer(c.choices.findIndex(x=>x!==q.ja));c.nextQuestion();
 let attempts=1;
 while(!el('#app').innerHTML.includes('全問できた')){
  el('#listen-play').onclick();c.utterance.onend();const q=c.W.find(w=>w.en===c.utterance.text);
  c.answer(c.choices.findIndex(x=>x===q.ja));c.nextQuestion();attempts++;assert.ok(attempts<20);
 }
 assert.match(el('#app').innerHTML,/最初の答え：9 \/ 10/);assert.equal(attempts,11);
 assert.equal(c.LearningSupport.create(c.localStorage).get('listening-meaning','weather-1').pending,false);
});
test('leaving prevents late audio callbacks; normal mode still delegates; repeated rounds do not farm stars',()=>{
 const {c,el,buttons}=setup();c.start('weather');el('#listen-play').onclick();const stale=c.utterance;c.home();stale.onend();assert.equal(buttons[0].disabled,true);
 function complete(){c.start('weather');for(let n=0;n<10;n++){el('#listen-play').onclick();c.utterance.onend();let q=c.W.find(w=>w.en===c.utterance.text);c.answer(c.choices.indexOf(q.ja));c.nextQuestion();}}
 complete();complete();let stars=c.stars;complete();assert.equal(c.stars,stars);
 c.quizMode='normal';c.start('weather');assert.equal(c.normalStarted,true);
});
test('identical spoken words merge meanings and homophones never compete',()=>{
 const {c}=setup(),s=c.LearningSupport,p=s.listeningWords(c.W),you=p.find(q=>q.en==='you');assert.ok(you.wordIds.length>1);
 const sea=p.find(q=>q.en==='sea');assert.ok(!s.listeningChoices(sea,p,'en',a=>a).includes('see'));
});
