'use strict';
(() => {
  const questions = [
    ['where','Where is my bag?',['It is under the desk.','I am ten.','It is Monday.','I like bags.'],'Where は場所。under the desk は「机の下」。'],
    ['when','When is your birthday?',['In May.','At school.','My sister.','Two books.'],'When は時期。月の前には in。'],
    ['time','I get up (     ) seven.',['at','on','in','under'],'時刻の前は at。曜日は on、月は in。'],
    ['does','Does she (     ) tennis?',['play','plays','playing','to play'],'Does の後ろの動詞は原形。'],
    ['negative','He (     ) like milk.',['does not','do not','am not','are not'],'一般動詞 like の否定。主語 he には does not。'],
    ['reply','Are you a student?',['Yes, I am.','Yes, you are.','Yes, I do.','Yes, I can.'],'you と聞かれた本人は I で返す。be動詞の質問には be動詞で。'],
    ['many','How many cats do you have?',['Two.','In May.','My mother.','At seven.'],'How many は数を聞く。'],
    ['can','My sister can (     ) well.',['swim','swims','swimming','to swim'],'can の後ろは主語に関係なく動詞の原形。'],
    ['progressive','Look! She (     ) running.',['is','does','can','are'],'今している動作は be動詞 + ing。she には is。'],
    ['possessive','This is (     ) book.',['my','mine','me','I'],'名詞 book の前には my。mine だけで「私のもの」。'],
    ['there','There (     ) two cats in the room.',['are','is','am','be'],'two cats は複数なので There are。'],
    ['invitation',"Let's play basketball.",["That's a good idea.",'It is under the bed.','I am ten.','You are welcome.'],'誘いには「いいね」と返す。']
  ];
  const key = 'eigo305-guide4-weak-v1';
  const quiz = document.querySelector('#quiz');
  const status = document.querySelector('#saveStatus');
  const validIds = new Set(questions.map(q => q[0]));
  let weak = new Set();
  try { const data = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(data)) weak = new Set(data.filter(id => validIds.has(id))); } catch { status.textContent = '以前の記録を読み込めませんでした。このまま練習できます。'; }
  let queue = [], position = 0, firstCorrect = 0, tried = false;
  function shuffle(a) { a = [...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function save() { try {localStorage.setItem(key, JSON.stringify([...weak]));} catch {status.textContent='記録を保存できませんでした。練習は続けられます。';} }
  function update() { document.querySelector('#weak').disabled = weak.size === 0; document.querySelector('#weak').textContent = `前回の苦手だけ練習（${weak.size}問）`; }
  function node(tag,text,parent=quiz) {const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
  function render() {
    quiz.replaceChildren();
    if(position===queue.length){node('h3',`練習完了！ 初回正解 ${firstCorrect} / ${queue.length}`);node('p','やり直しもよく頑張ったね。間違えた問題は「前回の苦手」に残るよ。次の練習で初回正解すると外れます。翌日も思い出してみよう。');update();return;}
    const q=queue[position]; node('p',`${position+1} / ${queue.length}`);node('h3',q[1]);
    const options=node('div','');options.className='options';const feedback=node('p','');feedback.className='feedback';
    shuffle(q[2]).forEach(answer=>{const b=node('button',answer,options);b.onclick=()=>{
      if(answer!==q[2][0]){tried=true;weak.add(q[0]);save();update();feedback.textContent=`もう一度。${q[3]}`;b.disabled=true;return;}
      if(!tried){firstCorrect++;weak.delete(q[0]);}save();update();options.querySelectorAll('button').forEach(x=>x.disabled=true);feedback.textContent=`正解！ ${q[3]}`;const next=node('button',position+1===queue.length?'結果を見る':'次へ');next.onclick=()=>{position++;tried=false;render();};
    };});
  }
  function start(onlyWeak){queue=shuffle(questions.filter(q=>!onlyWeak||weak.has(q[0])));if(!queue.length)return;position=0;firstCorrect=0;tried=false;render();quiz.scrollIntoView({block:'start'});}
  document.querySelector('#start').onclick=()=>start(false);document.querySelector('#weak').onclick=()=>start(true);update();
})();
