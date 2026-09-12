/* Independent, versioned practice records. No microphone or automatic speech grading. */
(function(root){
  'use strict';
  const themes=[
    {id:'swap',icon:'🧩',name:'ことばを入れ替える',tip:'自分に合うカードを選ぼう。言えたら別のカードでもう一度。',items:[
      {id:'swap-like',scene:'What do you like?（何が好き？）',template:'I like {0}.',slots:[[['cats','猫'],['dogs','犬'],['basketball','バスケ']]],help:'I like の後ろを替えると、好きなものを伝えられるよ。'},
      {id:'swap-can',scene:'What can you do?（何ができる？）',template:'I can {0}.',slots:[[['swim','泳ぐ'],['run fast','速く走る'],['play the piano','ピアノを弾く']]],help:'can の後ろは動詞の原形。できることを選ぼう。'},
      {id:'swap-time',scene:'What time do you get up?（何時に起きる？）',template:'I get up at {0}.',slots:[[['six','6時'],['six thirty','6時半'],['seven','7時']]],help:'at の後ろを替えて時刻を伝えよう。選択肢は練習例。実際の時刻で話してもOK。'}]},
    {id:'echo',icon:'🎧',name:'聞いて、まねする',tip:'短い1文を聞く → まねする → 文字を隠して言う。何度聞いても大丈夫。',items:[
      {id:'echo-again',scene:'聞き取れないときの一言',template:'Please say that again.',slots:[],help:'「もう一度言ってください」。again の音まで聞いてまねしよう。'},
      {id:'echo-together',scene:'友達をバスケに誘おう',template:"Let's play basketball.",slots:[],help:'「バスケをしよう」。単語をばらばらにせず、1文でまねしよう。'},
      {id:'echo-thanks',scene:'レッスンの終わりにお礼',template:'Thank you for the lesson.',slots:[],help:'「レッスンをありがとうございました」。先生に使ってみよう。'}]},
    {id:'plus',icon:'➕',name:'返事にもう1文',tip:'Yes / No のあとに、もう少しだけ自分のことを伝えよう。',items:[
      {id:'plus-swim',scene:'Can you swim?（泳げる？）',template:'{0}',slots:[[['Yes, I can. I like swimming.','泳げるよ。泳ぐのが好き。'],["No, I can't. I can run fast.",'泳げないけど、速く走れるよ。']]],help:'できることに合う返事を選んで、2文で言おう。'},
      {id:'plus-pet',scene:'Do you have a pet?（ペットはいる？）',template:'{0}',slots:[[['Yes, I do. I have a dog.','いるよ。犬を飼っている。'],['Yes, I do. I have a cat.','いるよ。猫を飼っている。'],["No, I don't. I like animals.",'いないけど、動物が好き。']]],help:'ペットがいなくても、好きな動物などを続けられるよ。'},
      {id:'plus-like',scene:'Do you like basketball?（バスケは好き？）',template:'{0}',slots:[[['Yes, I do. I play basketball on Sundays.','好き。日曜日にバスケをする。'],["No, I don't. I like tennis.",'好きではない。テニスが好き。']]],help:'好きかどうかに加えて、いつするか・ほかに何が好きかを話そう。'}]},
    {id:'ask',icon:'🔄',name:'先生に質問を返す',tip:'自分のことを答えたら、先生にも質問して会話を続けよう。',items:[
      {id:'ask-food',scene:'What food do you like?（何の食べ物が好き？）',template:'I like {0}. How about you?',slots:[[['pizza','ピザ'],['apples','りんご'],['ice cream','アイスクリーム']]],help:'How about you? は「先生はどうですか？」。先生の返事も聞こう。'},
      {id:'ask-color',scene:'What is your favorite color?（好きな色は？）',template:'My favorite color is {0}. What is your favorite color?',slots:[[['blue','青'],['pink','ピンク'],['green','緑']]],help:'聞かれた質問を、先生にも返してみよう。'},
      {id:'ask-sport',scene:'What sports can you play?（何のスポーツができる？）',template:'I can play {0}. Can you play {0}?',slots:[[['basketball','バスケ'],['tennis','テニス'],['soccer','サッカー']]],help:'自分ができるスポーツを言ってから、先生にも聞こう。'}]},
    {id:'show',icon:'🎒',name:'身近なものを説明',tip:'身の回りの物を1つ見せて「何か＋特徴」を言ってみよう。',items:[
      {id:'show-ball',scene:'ボールを見せる場面',template:'This is my ball. It is {0}.',slots:[[['orange','オレンジ色'],['white','白'],['small','小さい']]],help:'実物がなければ、ボールを思い浮かべて練習してね。'},
      {id:'show-bag',scene:'かばんを見せる場面',template:'This is my bag. It is {0}.',slots:[[['blue','青'],['red','赤'],['big','大きい']]],help:'色か大きさを1つ足してみよう。'},
      {id:'show-book',scene:'本を見せる場面',template:'This is my book. I like {0}.',slots:[[['animals','動物'],['sports','スポーツ'],['music','音楽']]],help:'どんな内容の本が好きか、続けて話そう。'}]}
  ];
  const items=themes.flatMap(t=>t.items),map=new Map(items.map(q=>[q.id,q])),KEY='eigo305-speaking-lab-v1';
  function fresh(){return{version:1,records:{},session:null};}
  function picksFor(q,picks){return q.slots.map((slot,i)=>Number.isInteger(picks?.[i])&&picks[i]>=0&&picks[i]<slot.length?picks[i]:null);}
  function sentence(q,picks){return q.template.replace(/\{(\d+)\}/g,(_,i)=>q.slots[i][picks?.[i]]?.[0]??'____');}
  function ready(q,picks){return picksFor(q,picks).every(x=>x!==null);}
  function validate(raw){const s=fresh();if(!raw||raw.version!==1)return s;for(const q of items){const r=raw.records?.[q.id];if(r&&typeof r==='object'){const picks=picksFor(q,r.picks);s.records[q.id]={picks,listened:r.listened===true,said:r.said===true&&ready(q,picks),used:r.used===true&&r.said===true&&ready(q,picks)};}}if(raw.session&&themes.some(t=>t.id===raw.session.theme)&&Number.isInteger(raw.session.index)&&raw.session.index>=0&&raw.session.index<3)s.session={theme:raw.session.theme,index:raw.session.index};return s;}
  function record(s,q){return s.records[q.id]||(s.records[q.id]={picks:q.slots.map(()=>null),listened:false,said:false,used:false});}
  function choose(s,q,slot,value){if(!q.slots[slot]?.[value])return;const r=record(s,q);if(r.picks[slot]!==value){r.picks[slot]=value;r.listened=r.said=r.used=false;}}
  const api={themes,items,map,KEY,fresh,validate,record,choose,sentence,ready};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SpeakingLab=api;
})(typeof window!=='undefined'?window:globalThis);
