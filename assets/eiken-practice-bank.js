/* Original Grade 5 practice, not reproduced examination questions. */
(function(root){
 const gaps=[
 ['be','I (____) ten years old.','am','is|are|do','私は10歳です。I と組むbe動詞は am。'],
 ['be','My brother (____) a student.','is','am|are|do','兄／弟は学生です。1人の人には is。'],
 ['be','They (____) in the park.','are','is|am|does','彼らは公園にいます。They には are。'],
 ['verb','My sister (____) tennis every Sunday.','plays','play|playing|are','姉／妹は毎週日曜にテニスをします。She と同じ1人の主語なので plays。'],
 ['verb','Does Ken (____) dogs?','like','likes|liking|is','ケンは犬が好きですか。Does の後ろの動詞は原形。'],
 ['verb',"I (____) like milk.",'do not','am not|does not|not','私は牛乳が好きではありません。一般動詞の否定は do not。'],
 ['can','She can (____) very fast.','run','runs|running|is','彼女はとても速く走れます。can の後ろは原形。'],
 ['ing','Look! The boy is (____).','swimming','swim|swims|can','見て！男の子が泳いでいます。今していることは be動詞＋ing。'],
 ['question','(____) is your bag? — Under the chair.','Where','Who|When|What time','かばんはどこ？椅子の下。場所を聞くのは Where。'],
 ['question','(____) is that woman? — My mother.','Who','Where|When|How many','あの女性は誰？母です。人を聞くのは Who。'],
 ['question','How (____) are you? — I am ten.','old','many|much|time','何歳ですか。年齢は How old。'],
 ['question','How (____) pencils do you have? — Three.','many','old|time|color','鉛筆を何本持っていますか。数は How many＋複数形。'],
 ['time','I get up (____) seven.','at','on|in|to','7時に起きます。時刻の前は at。'],
 ['time','We play basketball (____) Sundays.','on','at|in|to','日曜日にバスケをします。曜日の前は on。'],
 ['time','My birthday is (____) June.','in','on|at|under','誕生日は6月です。月の前は in。'],
 ['noun','This is (____) orange.','an','a|two|many','これはオレンジです。母音の音で始まる orange の前は an。'],
 ['noun','I have two (____).','boxes','box|a box|an box','箱を2つ持っています。box の複数形は boxes。'],
 ['pronoun','This is my sister. (____) name is Emi.','Her','She|Hers|Him','これは妹／姉です。名前はエミです。名詞 name の前は Her。'],
 ['pronoun','This is my bag. That bag is (____), too.','mine','my|I|me','こちらは私のかばん。あれも私のものです。後ろに名詞がない「私のもの」は mine。'],
 ['there','There (____) two cats in the room.','are','is|am|do','部屋に猫が2匹います。複数なので There are。'],
 ['phrase',"Let's (____) soccer after school.",'play','plays|playing|to play','放課後サッカーをしよう。Let’s の後ろは動詞の原形。'],
 ['phrase','Please (____) your book to page ten.','open','drink|eat|swim','本の10ページを開いてください。本を開く動詞は open。'],
 ['vocab','I am hungry. I want some (____).','bread','water|milk|juice','お腹がすいたのでパンがほしい。hungry は空腹、thirsty はのどが渇いた。'],
 ['vocab','It is raining. Please take your (____).','umbrella','pencil|piano|bed','雨なので傘を持っていこう。rain と umbrella を場面で結び付けよう。']
 ];
 const talks=[
 ['Thank you for your help.','You are welcome.','I am ten.|At seven.|It is a dog.','お礼への返事は「どういたしまして」。'],
 ['What time is it?','It is three thirty.','It is Monday.|It is my book.|I am fine.','What time は時刻。曜日ではなく3時半を選ぶ。'],
 ["Let's play basketball.",'That sounds good.','He is my brother.|It is under the desk.|I have two.','誘いに「いいね」と返す。'],
 ['Can you play the piano?','Yes, I can.','Yes, I am.|Yes, I do.|Yes, it is.','Can you には I can で答える。'],
 ['Where is my pen?','It is on the desk.','It is ten o\'clock.|She is my teacher.|I am eleven.','Where は場所。机の上という返事を選ぶ。'],
 ['How do you go to school?','By bus.','In May.|Three books.|My father.','How do you go は移動の方法を聞く。'],
 ['Whose bike is this?','It is mine.','It is Sunday.|I can swim.|At six.','Whose は持ち主。「私のもの」で答える。'],
 ['What are you doing?','I am reading a book.','I am nine.|I have a sister.|My name is Yui.','今している動作は be動詞＋ing で答える。']
 ];
 const orders=[
 ['私は毎日英語を勉強します。','I|study|English|every|day','主語 I → 動詞 study → 何を English → いつ every day。'],
 ['あなたはどこに住んでいますか。','Where|do|you|live','疑問詞 Where → do → 主語 you → 動詞 live。'],
 ['彼女はピアノを弾くことができます。','She|can|play|the|piano','主語 → can → 原形。楽器には the を付ける。'],
 ['私の父は犬が好きです。','My|father|likes|dogs','My father は1人。動詞は likes。'],
 ['これはあなたの本ですか。','Is|this|your|book','be動詞の質問は Is を主語 this の前に。'],
 ['私は牛乳が好きではありません。','I|do|not|like|milk','主語 → do not → 動詞の原形。'],
 ['彼は今走っています。','He|is|running|now','今していることは is running。'],
 ['あなたは何歳ですか。','How|old|are|you','How old をセットで置き、are → you。'],
 ['ドアを開けてください。','Open|the|door|please','お願いは動詞から始める。今回は please を最後に置こう。'],
 ['私は青いかばんを持っています。','I|have|a|blue|bag','a → 色 blue → 名詞 bag の順。']
 ];
 const questions=[...gaps.map((x,i)=>({id:'gap-'+(i+1),type:'gap',topic:x[0],prompt:x[1],answer:x[2],choices:[x[2],...x[3].split('|')],explanation:x[4]})),...talks.map((x,i)=>({id:'talk-'+(i+1),type:'talk',topic:'conversation',prompt:'A: '+x[0]+'\nB: (____)',answer:x[1],choices:[x[1],...x[2].split('|')],explanation:x[3]})),...orders.map((x,i)=>({id:'order-'+(i+1),type:'order',topic:'order',prompt:x[0],words:x[1].split('|'),explanation:x[2]}))];
 const api={questions,labels:{gap:'文の穴埋め',talk:'会話の返事',order:'語順を組み立てる'}};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EikenPracticeBank=api;
})(globalThis);
