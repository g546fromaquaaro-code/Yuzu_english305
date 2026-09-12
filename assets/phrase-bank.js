/* Original beginner expressions; stable IDs shared across modes. */
(function(root){const groups=[
  {
    "id": "phrase-greeting",
    "title": "あいさつ",
    "icon": "👋",
    "items": [
      {
        "id": "phrase-greeting-1",
        "en": "Hello!",
        "ja": "こんにちは！",
        "answer": "Hello",
        "prompt": "____!",
        "hint": "友達に会ったときのあいさつ。"
      },
      {
        "id": "phrase-greeting-2",
        "en": "Good morning.",
        "ja": "おはようございます。",
        "answer": "morning",
        "prompt": "Good ____.",
        "hint": "朝は morning。"
      },
      {
        "id": "phrase-greeting-3",
        "en": "Good afternoon.",
        "ja": "こんにちは。（午後）",
        "answer": "afternoon",
        "prompt": "Good ____.",
        "hint": "午後は afternoon。"
      },
      {
        "id": "phrase-greeting-4",
        "en": "Good night.",
        "ja": "おやすみなさい。",
        "answer": "night",
        "prompt": "Good ____.",
        "hint": "寝る前のあいさつ。"
      },
      {
        "id": "phrase-greeting-5",
        "en": "Thank you.",
        "ja": "ありがとう。",
        "answer": "Thank",
        "prompt": "____ you.",
        "hint": "お礼を伝える表現。"
      },
      {
        "id": "phrase-greeting-6",
        "en": "You are welcome.",
        "ja": "どういたしまして。",
        "answer": "welcome",
        "prompt": "You are ____.",
        "hint": "Thank you. への返事。"
      }
    ]
  },
  {
    "id": "phrase-intro",
    "title": "自己紹介と返事",
    "icon": "💬",
    "items": [
      {
        "id": "phrase-intro-1",
        "en": "How are you?",
        "ja": "元気ですか。",
        "answer": "How",
        "prompt": "____ are you?",
        "hint": "相手の調子を聞くあいさつ。"
      },
      {
        "id": "phrase-intro-2",
        "en": "I am fine.",
        "ja": "私は元気です。",
        "answer": "fine",
        "prompt": "I am ____.",
        "hint": "How are you? への返事。"
      },
      {
        "id": "phrase-intro-3",
        "en": "My name is Yuzu.",
        "ja": "私の名前はゆづです。",
        "answer": "name",
        "prompt": "My ____ is Yuzu.",
        "hint": "name は名前。"
      },
      {
        "id": "phrase-intro-4",
        "en": "Nice to meet you.",
        "ja": "はじめまして。",
        "answer": "meet",
        "prompt": "Nice to ____ you.",
        "hint": "初めて会う相手へのあいさつ。"
      },
      {
        "id": "phrase-intro-5",
        "en": "I am ten years old.",
        "ja": "私は10歳です。",
        "answer": "old",
        "prompt": "I am ten years ____.",
        "hint": "年齢は years old。"
      },
      {
        "id": "phrase-intro-6",
        "en": "I am from Japan.",
        "ja": "私は日本出身です。",
        "answer": "from",
        "prompt": "I am ____ Japan.",
        "hint": "from は出身を表す。"
      }
    ]
  },
  {
    "id": "phrase-schooltalk",
    "title": "学校のことば",
    "icon": "🎒",
    "items": [
      {
        "id": "phrase-schooltalk-1",
        "en": "Open your book.",
        "ja": "本を開いてください。",
        "answer": "Open",
        "prompt": "____ your book.",
        "hint": "Open は開く。"
      },
      {
        "id": "phrase-schooltalk-2",
        "en": "Close the door.",
        "ja": "ドアを閉めてください。",
        "answer": "Close",
        "prompt": "____ the door.",
        "hint": "Close は閉める。"
      },
      {
        "id": "phrase-schooltalk-3",
        "en": "Listen to me.",
        "ja": "私の話を聞いてください。",
        "answer": "to",
        "prompt": "Listen ____ me.",
        "hint": "listen to ～ で「～を聞く」。"
      },
      {
        "id": "phrase-schooltalk-4",
        "en": "Raise your hand.",
        "ja": "手を挙げてください。",
        "answer": "hand",
        "prompt": "Raise your ____.",
        "hint": "hand は手。"
      },
      {
        "id": "phrase-schooltalk-5",
        "en": "May I come in?",
        "ja": "入ってもいいですか。",
        "answer": "May",
        "prompt": "____ I come in?",
        "hint": "May I ...? は丁寧に許可を求める。"
      },
      {
        "id": "phrase-schooltalk-6",
        "en": "Here you are.",
        "ja": "はい、どうぞ。",
        "answer": "Here",
        "prompt": "____ you are.",
        "hint": "物を渡すときの表現。"
      }
    ]
  },
  {
    "id": "phrase-shoppingtalk",
    "title": "お店で会話",
    "icon": "🛍️",
    "items": [
      {
        "id": "phrase-shoppingtalk-1",
        "en": "How much is this?",
        "ja": "これはいくらですか。",
        "answer": "much",
        "prompt": "How ____ is this?",
        "hint": "値段は How much。"
      },
      {
        "id": "phrase-shoppingtalk-2",
        "en": "I want this bag.",
        "ja": "私はこのかばんがほしいです。",
        "answer": "want",
        "prompt": "I ____ this bag.",
        "hint": "want はほしい。"
      },
      {
        "id": "phrase-shoppingtalk-3",
        "en": "Two apples, please.",
        "ja": "りんごを2個ください。",
        "answer": "please",
        "prompt": "Two apples, ____.",
        "hint": "please をつけて丁寧に頼む。"
      },
      {
        "id": "phrase-shoppingtalk-4",
        "en": "Can I help you?",
        "ja": "いらっしゃいませ。何かお探しですか。",
        "answer": "help",
        "prompt": "Can I ____ you?",
        "hint": "店員がお客さんに声をかける表現。"
      },
      {
        "id": "phrase-shoppingtalk-5",
        "en": "That is all.",
        "ja": "それで全部です。",
        "answer": "all",
        "prompt": "That is ____.",
        "hint": "all は全部。"
      },
      {
        "id": "phrase-shoppingtalk-6",
        "en": "No, thank you.",
        "ja": "いいえ、結構です。",
        "answer": "No",
        "prompt": "____, thank you.",
        "hint": "丁寧に断るときの表現。"
      }
    ]
  },
  {
    "id": "phrase-basketalk",
    "title": "バスケと友達",
    "icon": "🏀",
    "items": [
      {
        "id": "phrase-basketalk-1",
        "en": "Let's play basketball.",
        "ja": "バスケットボールをしよう。",
        "answer": "Let's",
        "prompt": "____ play basketball.",
        "hint": "Let's + 動詞の原形で誘う。"
      },
      {
        "id": "phrase-basketalk-2",
        "en": "Pass me the ball.",
        "ja": "私にボールをパスして。",
        "answer": "ball",
        "prompt": "Pass me the ____.",
        "hint": "ball はボール。"
      },
      {
        "id": "phrase-basketalk-3",
        "en": "Are you ready?",
        "ja": "準備はいいですか。",
        "answer": "ready",
        "prompt": "Are you ____?",
        "hint": "ready は準備ができている。"
      },
      {
        "id": "phrase-basketalk-4",
        "en": "Good job!",
        "ja": "よくできたね！",
        "answer": "job",
        "prompt": "Good ____!",
        "hint": "相手の頑張りをほめる。"
      },
      {
        "id": "phrase-basketalk-5",
        "en": "I can run fast.",
        "ja": "私は速く走れます。",
        "answer": "can",
        "prompt": "I ____ run fast.",
        "hint": "can + 動詞の原形で「できる」。"
      },
      {
        "id": "phrase-basketalk-6",
        "en": "See you tomorrow.",
        "ja": "また明日ね。",
        "answer": "tomorrow",
        "prompt": "See you ____.",
        "hint": "tomorrow は明日。"
      }
    ]
  },
  {
    "id": "phrase-dailyphrase",
    "title": "毎日の語句",
    "icon": "☀️",
    "items": [
      {
        "id": "phrase-dailyphrase-1",
        "en": "get up",
        "ja": "起きる",
        "answer": "up",
        "prompt": "get ____",
        "hint": "get up をまとまりで覚えよう。"
      },
      {
        "id": "phrase-dailyphrase-2",
        "en": "go to school",
        "ja": "学校に行く",
        "answer": "to",
        "prompt": "go ____ school",
        "hint": "go to + 場所。"
      },
      {
        "id": "phrase-dailyphrase-3",
        "en": "have breakfast",
        "ja": "朝食を食べる",
        "answer": "breakfast",
        "prompt": "have ____",
        "hint": "朝食は breakfast。"
      },
      {
        "id": "phrase-dailyphrase-4",
        "en": "do my homework",
        "ja": "自分の宿題をする",
        "answer": "homework",
        "prompt": "do my ____",
        "hint": "homework は宿題。"
      },
      {
        "id": "phrase-dailyphrase-5",
        "en": "take a bath",
        "ja": "お風呂に入る",
        "answer": "bath",
        "prompt": "take a ____",
        "hint": "take a bath をまとまりで覚えよう。"
      },
      {
        "id": "phrase-dailyphrase-6",
        "en": "go to bed",
        "ja": "寝る",
        "answer": "bed",
        "prompt": "go to ____",
        "hint": "go to bed は「寝る」。"
      }
    ]
  },
  {
    "id": "phrase-lessonhelp",
    "title": "レッスンで困ったら",
    "icon": "🙋",
    "items": [
      {
        "id": "phrase-lessonhelp-1",
        "en": "Please say that again.",
        "ja": "もう一度言ってください。",
        "answer": "again",
        "prompt": "Please say that ____.",
        "hint": "聞き取れなければ、もう一度お願いしよう。",
        "scene": "先生の話が聞き取れません。",
        "question": "What do you do after school?",
        "questionJa": "放課後は何をしますか。"
      },
      {
        "id": "phrase-lessonhelp-2",
        "en": "Please speak slowly.",
        "ja": "ゆっくり話してください。",
        "answer": "slowly",
        "prompt": "Please speak ____.",
        "hint": "速いときは slowly を使ってお願い。",
        "scene": "先生の話が速いです。",
        "question": "Please tell me about your favorite animal.",
        "questionJa": "好きな動物について教えてください。"
      },
      {
        "id": "phrase-lessonhelp-3",
        "en": "I don't understand.",
        "ja": "わかりません。",
        "answer": "understand",
        "prompt": "I don't ____.",
        "hint": "わからないと伝えることも会話の一歩。",
        "scene": "先生の説明がわかりません。",
        "question": "Do you understand?",
        "questionJa": "わかりましたか。"
      },
      {
        "id": "phrase-lessonhelp-4",
        "en": "What does this mean?",
        "ja": "これはどういう意味ですか。",
        "answer": "mean",
        "prompt": "What does this ____?",
        "hint": "意味を質問する決まり文句。",
        "scene": "先生が言った言葉の意味を知りたいです。",
        "question": "This animal has a long tail.",
        "questionJa": "この動物には長いしっぽがあります。"
      },
      {
        "id": "phrase-lessonhelp-5",
        "en": "How do you spell it?",
        "ja": "それはどうつづりますか。",
        "answer": "spell",
        "prompt": "How do you ____ it?",
        "hint": "spell はアルファベットのつづりを言うこと。",
        "scene": "言葉のつづりを知りたいです。",
        "question": "My name is Emma.",
        "questionJa": "私の名前はエマです。"
      },
      {
        "id": "phrase-lessonhelp-6",
        "en": "Can you hear me?",
        "ja": "私の声が聞こえますか。",
        "answer": "hear",
        "prompt": "Can you ____ me?",
        "hint": "音が聞こえるか確認しよう。",
        "scene": "先生に声が届いているか確かめたいです。",
        "question": "Hello, Yuzu.",
        "questionJa": "こんにちは、ゆづ。"
      }
    ]
  },
  {
    "id": "phrase-likes",
    "title": "好きなことを話す",
    "icon": "❤️",
    "items": [
      {
        "id": "phrase-likes-1",
        "en": "I like cats.",
        "ja": "私は猫が好きです。",
        "answer": "cats",
        "prompt": "I like ____.",
        "hint": "cats を dogs や rabbits に替えてもいいよ。",
        "scene": "好きな動物を答えます。",
        "question": "What animals do you like?",
        "questionJa": "どんな動物が好きですか。"
      },
      {
        "id": "phrase-likes-2",
        "en": "My favorite color is blue.",
        "ja": "私の好きな色は青です。",
        "answer": "blue",
        "prompt": "My favorite color is ____.",
        "hint": "blue を自分の好きな色に替えよう。",
        "scene": "好きな色を答えます。",
        "question": "What is your favorite color?",
        "questionJa": "好きな色は何ですか。"
      },
      {
        "id": "phrase-likes-3",
        "en": "I like apples.",
        "ja": "私はりんごが好きです。",
        "answer": "apples",
        "prompt": "I like ____.",
        "hint": "apples を pizza などに替えよう。",
        "scene": "好きな食べ物を答えます。",
        "question": "What food do you like?",
        "questionJa": "どんな食べ物が好きですか。"
      },
      {
        "id": "phrase-likes-4",
        "en": "Yes, I do.",
        "ja": "はい、好きです。（Do you like ...? への返事）",
        "answer": "do",
        "prompt": "Yes, I ____.",
        "hint": "好きなら Yes, I do. 好きでなければ No, I don't.",
        "scene": "好きかどうか答えます。",
        "question": "Do you like music?",
        "questionJa": "音楽が好きですか。"
      },
      {
        "id": "phrase-likes-5",
        "en": "No, I don't.",
        "ja": "いいえ、好きではありません。（Do you like ...? への返事）",
        "answer": "don't",
        "prompt": "No, I ____.",
        "hint": "自分の気持ちに合わせて Yes / No を選んでいいよ。",
        "scene": "好きではないと答えます。",
        "question": "Do you like tomatoes?",
        "questionJa": "トマトが好きですか。"
      },
      {
        "id": "phrase-likes-6",
        "en": "I like English very much.",
        "ja": "私は英語がとても好きです。",
        "answer": "very",
        "prompt": "I like English ____ much.",
        "hint": "very much はとても。教科名を替えてみよう。",
        "scene": "好きな教科を少し長く答えます。",
        "question": "What subject do you like?",
        "questionJa": "どの教科が好きですか。"
      }
    ]
  },
  {
    "id": "phrase-familytalk",
    "title": "家族と身の回り",
    "icon": "🏠",
    "items": [
      {
        "id": "phrase-familytalk-1",
        "en": "I have a sister.",
        "ja": "私には姉か妹がいます。",
        "answer": "sister",
        "prompt": "I have a ____.",
        "hint": "sister を brother に替えられるよ。いなければ No, I don't.",
        "scene": "きょうだいについて答えます。",
        "question": "Do you have any brothers or sisters?",
        "questionJa": "兄弟や姉妹はいますか。"
      },
      {
        "id": "phrase-familytalk-2",
        "en": "There are four people in my family.",
        "ja": "私の家族は4人です。",
        "answer": "four",
        "prompt": "There are ____ people in my family.",
        "hint": "four を自分の家族の人数に替えよう。",
        "scene": "家族の人数を答えます。",
        "question": "How many people are in your family?",
        "questionJa": "家族は何人ですか。"
      },
      {
        "id": "phrase-familytalk-3",
        "en": "This is my mother.",
        "ja": "こちらは私の母です。",
        "answer": "mother",
        "prompt": "This is my ____.",
        "hint": "mother を father や sister に替えよう。",
        "scene": "家族の写真について答えます。",
        "question": "Who is this?",
        "questionJa": "こちらは誰ですか。"
      },
      {
        "id": "phrase-familytalk-4",
        "en": "My bag is under the desk.",
        "ja": "私のかばんは机の下にあります。",
        "answer": "under",
        "prompt": "My bag is ____ the desk.",
        "hint": "under / on / by で場所を説明。",
        "scene": "かばんの場所を答えます。",
        "question": "Where is your bag?",
        "questionJa": "かばんはどこにありますか。"
      },
      {
        "id": "phrase-familytalk-5",
        "en": "I have two pencils.",
        "ja": "私は鉛筆を2本持っています。",
        "answer": "two",
        "prompt": "I have ____ pencils.",
        "hint": "数を替えよう。1本なら a pencil。",
        "scene": "鉛筆の数を答えます。",
        "question": "How many pencils do you have?",
        "questionJa": "鉛筆を何本持っていますか。"
      },
      {
        "id": "phrase-familytalk-6",
        "en": "It is sunny today.",
        "ja": "今日は晴れです。",
        "answer": "sunny",
        "prompt": "It is ____ today.",
        "hint": "sunny を rainy や cloudy に替えてみよう。",
        "scene": "天気を答えます。",
        "question": "How is the weather today?",
        "questionJa": "今日の天気はどうですか。"
      }
    ]
  },
  {
    "id": "phrase-routine",
    "title": "一日のことを話す",
    "icon": "⏰",
    "items": [
      {
        "id": "phrase-routine-1",
        "en": "I get up at seven.",
        "ja": "私は7時に起きます。",
        "answer": "seven",
        "prompt": "I get up at ____.",
        "hint": "時刻は at + 数字。",
        "scene": "起きる時刻を答えます。",
        "question": "What time do you get up?",
        "questionJa": "何時に起きますか。"
      },
      {
        "id": "phrase-routine-2",
        "en": "I go to school by bus.",
        "ja": "私はバスで学校に行きます。",
        "answer": "bus",
        "prompt": "I go to school by ____.",
        "hint": "徒歩なら I walk to school. と言おう。",
        "scene": "通学の方法を答えます。",
        "question": "How do you go to school?",
        "questionJa": "どうやって学校に行きますか。"
      },
      {
        "id": "phrase-routine-3",
        "en": "I eat bread for breakfast.",
        "ja": "私は朝食にパンを食べます。",
        "answer": "bread",
        "prompt": "I eat ____ for breakfast.",
        "hint": "bread を rice などに替えよう。",
        "scene": "朝食を答えます。",
        "question": "What do you eat for breakfast?",
        "questionJa": "朝食に何を食べますか。"
      },
      {
        "id": "phrase-routine-4",
        "en": "I do my homework after school.",
        "ja": "私は放課後に宿題をします。",
        "answer": "after",
        "prompt": "I do my homework ____ school.",
        "hint": "after school は放課後。",
        "scene": "放課後にすることを答えます。",
        "question": "What do you do after school?",
        "questionJa": "放課後は何をしますか。"
      },
      {
        "id": "phrase-routine-5",
        "en": "I play basketball on Sundays.",
        "ja": "私は日曜日にバスケをします。",
        "answer": "Sundays",
        "prompt": "I play basketball on ____.",
        "hint": "毎週の日曜日は on Sundays。",
        "scene": "いつスポーツをするか答えます。",
        "question": "When do you play basketball?",
        "questionJa": "いつバスケットボールをしますか。"
      },
      {
        "id": "phrase-routine-6",
        "en": "I go to bed at nine.",
        "ja": "私は9時に寝ます。",
        "answer": "nine",
        "prompt": "I go to bed at ____.",
        "hint": "nine を自分の寝る時刻に替えてみよう。",
        "scene": "寝る時刻を答えます。",
        "question": "What time do you go to bed?",
        "questionJa": "何時に寝ますか。"
      }
    ]
  },
  {
    "id": "phrase-cannow",
    "title": "できること・今していること",
    "icon": "🏃",
    "items": [
      {
        "id": "phrase-cannow-1",
        "en": "Yes, I can.",
        "ja": "はい、できます。",
        "answer": "can",
        "prompt": "Yes, I ____.",
        "hint": "できなければ No, I can't. でもいいよ。",
        "scene": "泳げるか答えます。",
        "question": "Can you swim?",
        "questionJa": "泳げますか。"
      },
      {
        "id": "phrase-cannow-2",
        "en": "No, I can't.",
        "ja": "いいえ、できません。",
        "answer": "can't",
        "prompt": "No, I ____.",
        "hint": "できるなら Yes, I can. と答えていいよ。",
        "scene": "ピアノを弾けないと答えます。",
        "question": "Can you play the piano?",
        "questionJa": "ピアノを弾けますか。"
      },
      {
        "id": "phrase-cannow-3",
        "en": "I can play basketball.",
        "ja": "私はバスケットボールができます。",
        "answer": "play",
        "prompt": "I can ____ basketball.",
        "hint": "can の後ろは動詞の原形。",
        "scene": "できるスポーツを答えます。",
        "question": "What sports can you play?",
        "questionJa": "どんなスポーツができますか。"
      },
      {
        "id": "phrase-cannow-4",
        "en": "I am studying English.",
        "ja": "私は英語を勉強しています。",
        "answer": "studying",
        "prompt": "I am ____ English.",
        "hint": "I am + 動詞ing。",
        "scene": "今していることを答えます。",
        "question": "What are you doing now?",
        "questionJa": "今何をしていますか。"
      },
      {
        "id": "phrase-cannow-5",
        "en": "She is reading a book.",
        "ja": "彼女は本を読んでいます。",
        "answer": "reading",
        "prompt": "She is ____ a book.",
        "hint": "主語 she には is。例の場面として答えよう。",
        "scene": "絵の中の女の子の動作を説明する練習です。",
        "question": "What is she doing?",
        "questionJa": "彼女は何をしていますか。"
      },
      {
        "id": "phrase-cannow-6",
        "en": "They are playing soccer.",
        "ja": "彼らはサッカーをしています。",
        "answer": "are",
        "prompt": "They ____ playing soccer.",
        "hint": "主語 they には are。例の場面として答えよう。",
        "scene": "絵の中の子どもたちの動作を説明する練習です。",
        "question": "What are they doing?",
        "questionJa": "彼らは何をしていますか。"
      }
    ]
  },
  {
    "id": "phrase-askback",
    "title": "自分から質問する",
    "icon": "🗣️",
    "items": [
      {
        "id": "phrase-askback-1",
        "en": "How about you?",
        "ja": "あなたはどうですか。",
        "answer": "about",
        "prompt": "How ____ you?",
        "hint": "自分の答えのあとに質問を返して会話を続けよう。",
        "scene": "自分の好きな食べ物を答えたあと、先生にも聞きます。",
        "question": "What food do you like?",
        "questionJa": "どんな食べ物が好きですか。"
      },
      {
        "id": "phrase-askback-2",
        "en": "What is your favorite food?",
        "ja": "好きな食べ物は何ですか。",
        "answer": "food",
        "prompt": "What is your favorite ____?",
        "hint": "food を color や sport に替えられるよ。",
        "scene": "先生の好きな食べ物を聞きます。",
        "question": "Do you have a question for me?",
        "questionJa": "私に何か質問はありますか。"
      },
      {
        "id": "phrase-askback-3",
        "en": "Do you have a pet?",
        "ja": "ペットを飼っていますか。",
        "answer": "pet",
        "prompt": "Do you have a ____?",
        "hint": "pet はペット。",
        "scene": "先生が動物を飼っているか聞きます。",
        "question": "Ask me about animals.",
        "questionJa": "動物について質問してください。"
      },
      {
        "id": "phrase-askback-4",
        "en": "What do you do on Sundays?",
        "ja": "日曜日は何をしますか。",
        "answer": "Sundays",
        "prompt": "What do you do on ____?",
        "hint": "日曜日にいつもすることを聞く質問。",
        "scene": "先生の休日について聞きます。",
        "question": "Ask me about my weekend.",
        "questionJa": "私の週末について質問してください。"
      },
      {
        "id": "phrase-askback-5",
        "en": "Can you play tennis?",
        "ja": "テニスができますか。",
        "answer": "tennis",
        "prompt": "Can you play ____?",
        "hint": "tennis を basketball に替えてもいいよ。",
        "scene": "先生ができるスポーツを聞きます。",
        "question": "Ask me about sports.",
        "questionJa": "スポーツについて質問してください。"
      },
      {
        "id": "phrase-askback-6",
        "en": "Is this your book?",
        "ja": "これはあなたの本ですか。",
        "answer": "your",
        "prompt": "Is this ____ book?",
        "hint": "your は「あなたの」。",
        "scene": "先生に本の持ち主を確認する場面です。",
        "question": "Here is a book.",
        "questionJa": "ここに本があります。"
      }
    ]
  }
];if(typeof module!=="undefined"&&module.exports)module.exports=groups;else root.PhraseBank=groups;})(typeof window!=="undefined"?window:globalThis);
