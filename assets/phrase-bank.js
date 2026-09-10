/* Original beginner phrases. Stable IDs are shared with the vocabulary app. */
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
  }
];if(typeof module!=="undefined"&&module.exports)module.exports=groups;else root.PhraseBank=groups;})(typeof window!=="undefined"?window:globalThis);
