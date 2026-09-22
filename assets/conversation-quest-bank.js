/* Original practice conversations using beginner vocabulary and present-tense grammar. */
(function(root){
  'use strict';
  const scenes=[
    {id:'hello',icon:'👋',title:'はじめまして',goal:'名前・年齢を伝えて、相手にも聞こう。',turns:[
      ['Hi! What is your name?','こんにちは！名前は？','ゆずという名前で答えよう。','My name is Yuzu.',['I am ten.','I like cats.'],'My name is ～. で名前を伝えるよ。'],
      ['Nice to meet you, Yuzu. How old are you?','はじめまして、ゆず。何歳？','10歳だと答えよう。','I am ten.',['It is ten o’clock.','I have ten pencils.'],'How old は年齢。I am ～. で答えよう。'],
      ['I am ten, too.','私も10歳だよ。','好きなスポーツを質問して、話を続けよう。','What sport do you like?',['What time is it?','Where is my bag?'],'自分から質問できると、会話が続くよ。']
    ],ending:'I like tennis. How about you?',endingJa:'テニスが好き。あなたは？',challenge:'自分の好きなスポーツで I like ～. と答えてみよう。'},
    {id:'food',icon:'🍎',title:'好きな食べ物',goal:'好きなものを答えて、質問を返そう。',turns:[
      ['Do you like apples?','りんごは好き？','好きだと答えよう。','Yes, I do.',['Yes, I can.','Yes, I am.'],'Do you ～? の短い返事は Yes, I do.'],
      ['What food do you like?','どんな食べ物が好き？','ピザが好きだと伝えよう。','I like pizza.',['I play tennis.','It is red.'],'I like の後ろに好きな食べ物を入れよう。'],
      ['I like pizza, too.','私もピザが好き。','アイスクリームも好きか聞こう。','Do you like ice cream?',['Can you swim?','Is this your book?'],'Do you like ～? で相手の好みを聞けるよ。']
    ],ending:'Yes, I do. I like chocolate ice cream.',endingJa:'うん。チョコレートアイスが好き。',challenge:'自分の好きな食べ物をもう1つ言ってみよう。'},
    {id:'school',icon:'🏫',title:'学校の話',goal:'教科・曜日について話そう。',turns:[
      ['What is your favorite subject?','好きな教科は？','英語が好きだと答えよう。','I like English.',['It is Monday.','I am at home.'],'subject は教科。好きな教科を答えよう。'],
      ['When do you have English?','英語の授業はいつ？','月曜日だと答えよう。','On Mondays.',['In my bag.','With my sister.'],'曜日には on を使うよ。'],
      ['I like music.','私は音楽が好き。','ピアノが弾けるか聞こう。','Can you play the piano?',['Do you have a pencil?','What color is it?'],'Can you ～? で、できることを質問しよう。']
    ],ending:'Yes, I can. I play every day.',endingJa:'うん、弾けるよ。毎日弾いているよ。',challenge:'自分の好きな教科で I like ～. と言ってみよう。'},
    {id:'sport',icon:'🏀',title:'一緒に遊ぼう',goal:'誘いに答えて、場所や時刻を決めよう。',turns:[
      ["Let's play basketball.",'バスケをしよう。','いいね、と答えよう。','That sounds good.',['I am fine, thank you.','It is a book.'],'誘われたときの That sounds good. は「いいね」。'],
      ['Where can we play?','どこで遊べる？','公園で遊ぼうと提案しよう。',"Let's play in the park.",['I get up at seven.','My name is Ken.'],'場所を足すと、具体的な約束になるよ。'],
      ['OK. What time?','いいよ。何時？','3時を提案しよう。','At three.',['On Sunday.','Under the desk.'],'What time は時刻。At three. は「3時に」。']
    ],ending:'OK. See you at three!',endingJa:'わかった。3時に会おう！',challenge:'See you! と声に出して会話を終えよう。'},
    {id:'shop',icon:'🛍️',title:'お店で買い物',goal:'欲しいもの・個数を伝えよう。',turns:[
      ['Hello. Can I help you?','こんにちは。何をお探しですか？','りんごが欲しいと伝えよう。','I want some apples.',['I like swimming.','I am from Japan.'],'I want ～. で欲しいものを伝えるよ。'],
      ['How many apples do you want?','りんごはいくつ欲しいですか？','3個お願いします、と答えよう。','Three, please.',['It is three o’clock.','I am three.'],'How many は個数。please も添えよう。'],
      ['Here you are.','はい、どうぞ。','お礼を言おう。','Thank you.',['Good night.','I am ten.'],'品物を受け取ったら Thank you.']
    ],ending:"You're welcome.",endingJa:'どういたしまして。',challenge:'買いたいものを替えて I want ～. と言ってみよう。'},
    {id:'day',icon:'⏰',title:'いつもの一日',goal:'時刻と普段することを話そう。',turns:[
      ['What time do you get up?','何時に起きる？','7時に起きると答えよう。','I get up at seven.',['I have seven books.','It is Sunday.'],'get up は「起きる」。時刻の前は at。'],
      ['What do you do after school?','放課後は何をする？','宿題をすると答えよう。','I do my homework.',['It is sunny.','She is my mother.'],'What do you do ～? は「何をする？」。'],
      ['I read books after school.','私は放課後に本を読むよ。','毎日読むのか質問しよう。','Do you read every day?',['Are you ten?','Where is the park?'],'相手が言ったことを質問すると、話が広がるよ。']
    ],ending:'Yes, I do. I like books about animals.',endingJa:'うん。動物の本が好きなんだ。',challenge:'本当の起きる時刻で I get up at ～. と答えてみよう。'},
    {id:'pet',icon:'🐈',title:'ペットの話',goal:'身近な動物について説明しよう。',turns:[
      ['Do you have a pet?','ペットを飼っている？','猫を飼っている設定で、2文で答えよう。','Yes, I do. I have a cat.',['Yes, I can. I can swim.','No, I am not. I am ten.'],'短い返事のあとに、何を飼っているか足そう。'],
      ['What color is your cat?','猫は何色？','白いと答えよう。','It is white.',['It is on the chair.','It is two.'],'What color は色を聞いているよ。'],
      ['I like cats.','私は猫が好き。','犬も好きか質問しよう。','Do you like dogs, too?',['Can you play tennis?','What day is it?'],'too を最後に添えると「～も？」と聞けるよ。']
    ],ending:'Yes, I do. Dogs are cute.',endingJa:'うん。犬はかわいいね。',challenge:"自分のことを I have ～. / I don't have a pet. で言おう。"},
    {id:'help',icon:'🙋',title:'聞き取れないとき',goal:'聞き返して、会話に戻ろう。',turns:[
      ['What is your favorite animal?','好きな動物は？','聞き取れなかったので、もう一度お願いしよう。','Please say that again.',['Nice to meet you.','See you tomorrow.'],'聞き返しても大丈夫。この1文を使おう。'],
      ['What animal do you like?','どんな動物が好き？','犬が好きだと答えよう。','I like dogs.',['I am at school.','It is five.'],'もう一度聞けたら、短く答えよう。'],
      ['I like dogs, too. Do you have a dog?','私も犬が好き。犬を飼っている？','飼っていないと答えよう。',"No, I don't.",['No, I am not.',"No, I can't."],'Do you have ～? への否定は No, I don’t.']
    ],ending:'I have a dog. His name is Max.',endingJa:'私は犬を飼っているよ。名前はマックス。',challenge:'もう一度 Please say that again. を見ずに言ってみよう。'}
  ];
  for(const s of scenes)s.turns=s.turns.map((t,i)=>({id:s.id+'-'+i,prompt:t[0],ja:t[1],task:t[2],answer:t[3],wrong:t[4],tip:t[5]}));
  const turns=scenes.flatMap(s=>s.turns), modes=['choice','order','speak'],KEY='eigo305-conversation-quest-v1';
  function shuffle(xs){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function read(raw){const out={};if(!raw||typeof raw!=='object')return out;for(const q of turns){const r=raw[q.id];if(!r||typeof r!=='object')continue;out[q.id]={};for(const m of modes)if(['done','again'].includes(r[m]))out[q.id][m]=r[m];}return out;}
  const api={scenes,turns,modes,KEY,shuffle,read};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ConversationQuest=api;
})(typeof window!=='undefined'?window:globalThis);
