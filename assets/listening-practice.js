(function () {
  'use strict';
  const support = window.LearningSupport, progress = support.create(localStorage), esc = support.escapeHTML;
  const LEVEL_KEY = 'eigo305-listening-level-v1';
  const levels = [
    { id: 'word', title: '① 英単語を選ぶ', note: '音とつづりをつなげよう', key: 'en' },
    { id: 'meaning', title: '② 意味を選ぶ', note: '聞いた英語の意味を答えよう', key: 'ja' },
    { id: 'sentence', title: '③ 短い文を聞く', note: '文全体の意味をつかもう', key: 'ja' }
  ];
  let level = levels.find(x => x.id === localStorage.getItem(LEVEL_KEY)) || levels[0];
  const words = support.listeningWords(W);
  let session = null, speechToken = 0;
  const baseStart = start, baseHome = home;
  function mode() { return 'listening-' + level.id; }
  function pool() { return level.id === 'sentence' ? window.ListeningSentences : words; }
  function cancelSpeech() {
    speechToken++;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  function status(message) {
    const node = document.getElementById('listenStatus');
    if (node) node.textContent = message;
  }
  function speak(text, rate = .9) {
    cancelSpeech();
    const token = speechToken;
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      status('このブラウザーでは音声を再生できません。音声対応のSafariなどで開いてください。');
      return;
    }
    stopBgm();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; utterance.rate = rate; utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    status('読み上げています…');
    utterance.onend = () => {
      if (token !== speechToken || !session || session.screen !== 'question') return;
      session.heard = true;
      document.querySelectorAll('[data-listen-answer]').forEach(b => { b.disabled = session.answered; });
      status('聞こえた内容を選ぼう。何度聞いても大丈夫！');
    };
    utterance.onerror = () => {
      if (token === speechToken) status('音声を再生できませんでした。「もう一度聞く」を押してね。');
    };
    try { window.speechSynthesis.speak(utterance); }
    catch { status('音声を再生できませんでした。「もう一度聞く」を押してね。'); }
  }
  function selectLevel(id) {
    level = levels.find(x => x.id === id) || levels[0];
    localStorage.setItem(LEVEL_KEY, level.id); home();
  }
  function decorate() {
    if (quizMode !== 'listening') return;
    const note = document.querySelector('.listen-note');
    if (!note) return;
    note.textContent = '時間制限なし。音声を聞いてから答えよう。まちがえた問題は解き直せるよ。';
    const panel = document.createElement('section'); panel.className = 'listening-settings';
    const items = pool(), due = items.filter(w => progress.needsReview(mode(), w.id)).length;
    panel.innerHTML = `<h2>🎧 リスニングの3ステップ</h2><div class="listening-levels">${levels.map(l => {
      const list = l.id === 'sentence' ? window.ListeningSentences : words;
      const count = list.filter(w => progress.get('listening-' + l.id, w.id)?.lastSuccess != null).length;
      return `<button type="button" data-level="${l.id}" class="${l.id === level.id ? 'on' : ''}" aria-pressed="${l.id === level.id}">${l.title}<small>${count} / ${list.length}問 正解経験あり</small></button>`;
    }).join('')}</div><p>${level.note}。${level.id === 'sentence' ? 'オリジナルの短文34問から練習します。' : '同じ音の単語は意味をまとめて出題します。'}<br>苦手・復習待ち：<b>${due}問</b>。苦手を優先し、翌日以降も復習します。</p><button type="button" class="primary" id="listenAll">▶ ${due ? '苦手を優先して' : ''}10問はじめる</button><p class="practice-note">カテゴリー別にも練習できます。短文はカテゴリーごとに2〜3問です。音声は「ふつう」「ゆっくり」で何度でも聞けます。右上の音設定はBGM・効果音用です。</p>`;
    note.after(panel);
    panel.querySelectorAll('[data-level]').forEach(b => { b.onclick = () => selectLevel(b.dataset.level); });
    panel.querySelector('#listenAll').onclick = () => start('all');
    const rules = document.querySelector('.rules');
    if (rules) rules.textContent = '🎧 時間制限なし。苦手 → 復習待ち → 新しい問題の順に優先。解き直しは何度でもできます。';
    document.querySelectorAll('.section [data-c]').forEach(b => {
      const group = b.dataset.c === 'all' ? items : items.filter(w => w.category === b.dataset.c);
      const count = b.querySelector('.count') || b.querySelector('small');
      if (count) count.textContent = group.length + '問';
      const done = group.filter(w => progress.get(mode(), w.id)?.lastSuccess != null).length;
      const label = b.querySelector('.done'); if (label) label.textContent = done + '/' + group.length;
      const bar = b.querySelector('.mini i'); if (bar) bar.style.width = (group.length ? done / group.length * 100 : 0) + '%';
      b.disabled = !group.length;
    });
  }
  home = function () {
    cancelSpeech(); session = null;
    baseHome(); decorate();
  };
  start = function (cat) {
    if (quizMode !== 'listening') { session = null; return baseStart(cat); }
    clearInterval(timer); stopBgm(); cancelSpeech(); visitDay(); category = cat;
    const source = pool().filter(w => cat === 'all' || w.category === cat);
    const items = progress.prioritize(source, mode(), 10, shuffle);
    if (!items.length) return;
    session = { items, originalTotal: items.length, firstCorrect: 0, pending: new Map(), rewarded: new Set(), index: 0, retry: false, earned: 0, started: Date.now(), screen: 'question' };
    renderQuestion();
    // Called directly by a tap, keeping speech playback within the iPad user gesture.
    speak(items[0].en);
  };
  function renderQuestion() {
    const q = session.items[session.index];
    session.screen = 'question'; session.answered = false; session.heard = false;
    session.choices = level.id === 'sentence' ? shuffle([q.ja, ...q.distractors]) : support.listeningChoices(q, words, level.key, shuffle);
    $('#app').innerHTML = `<div class="shell"><div class="quiz listening-quiz"><header class="qhead"><button class="x" id="listenExit" aria-label="カテゴリーに戻る">×</button><div class="qprogress"><i style="width:${(session.index + 1) / session.items.length * 100}%"></i></div><div class="timer">🎧 練習</div></header><section class="qcard"><div class="top"><span class="chip">${esc(level.title)}</span><span>${session.retry ? '解き直し ' : ''}${session.index + 1} / ${session.items.length}</span></div><p class="prompt">${level.key === 'en' ? '聞こえた英単語はどれ？' : level.id === 'sentence' ? '聞こえた文の意味は？' : '聞こえた英語の意味は？'}</p><div class="listen-stage"><span class="ear">🎧</span><strong>音声を聞いてから答えよう</strong><div class="listen-controls"><button class="speak-button" id="listenReplay">🔊 もう一度聞く</button><button class="speak-button" id="listenSlow">🐢 ゆっくり聞く</button></div><p class="listen-status" id="listenStatus" role="status" aria-live="polite"></p></div><div class="choices">${session.choices.map((c, i) => `<button class="choice" data-listen-answer="${i}" disabled><b>${String.fromCharCode(65 + i)}</b>${esc(c)}</button>`).join('')}</div><div id="listenFeedback" aria-live="polite"></div></section></div></div>`;
    $('#listenExit').onclick = home;
    $('#listenReplay').onclick = () => speak(q.en);
    $('#listenSlow').onclick = () => speak(q.en, .65);
    document.querySelectorAll('[data-listen-answer]').forEach(b => { b.onclick = () => answerListening(Number(b.dataset.listenAnswer)); });
  }
  function answerListening(i) {
    if (!session || session.screen !== 'question' || session.answered || !session.heard) return;
    const q = session.items[session.index], correctAnswer = q[level.key], ok = session.choices[i] === correctAnswer;
    if (session.choices[i] == null) return;
    session.answered = true; cancelSpeech();
    progress.record(mode(), q.id, ok, { retry: session.retry });
    if (ok) {
      session.pending.delete(q.id);
      if (!session.retry) session.firstCorrect++;
      if (!session.rewarded.has(q.id)) {
        session.rewarded.add(q.id); session.earned += 2; stars += 2;
        localStorage.setItem(STAR_KEY, String(stars));
      }
      if (level.id !== 'sentence') {
        const learned = shopSet(LISTEN_SHOP_KEY);
        q.wordIds.forEach(id => { mastered.add(id); learned.add(id); });
        save();
        localStorage.setItem(LISTEN_SHOP_KEY, JSON.stringify([...learned]));
      }
      se('ok');
    } else { session.pending.set(q.id, q); se('bad'); }
    document.querySelectorAll('[data-listen-answer]').forEach((b, j) => {
      b.disabled = true;
      if (session.choices[j] === correctAnswer) b.classList.add('ok');
      else if (i === j) b.classList.add('bad');
    });
    const feedback = $('#listenFeedback'); feedback.className = 'feedback';
    feedback.innerHTML = `<div class="listen-answer"><strong>${ok ? '正解！' : 'おしい！ あとで解き直そう'}</strong><span>${esc(q.en)}</span><span>${esc(q.ja)}</span></div><button class="next" id="listenNext">${session.index + 1 === session.items.length ? '結果を見る' : '次の問題'} →</button>`;
    $('#listenNext').onclick = () => {
      cancelSpeech(); session.index++;
      if (session.index >= session.items.length) renderResult();
      else { renderQuestion(); speak(session.items[session.index].en); }
    };
  }
  function retry() {
    if (!session?.pending.size) return;
    session.items = shuffle([...session.pending.values()]); session.index = 0; session.retry = true;
    renderQuestion(); speak(session.items[0].en);
  }
  function renderResult() {
    cancelSpeech(); session.screen = 'result';
    const remaining = session.pending.size, clean = session.firstCorrect === session.originalTotal;
    const reward = remaining ? 'clear-chick.webp' : clean ? 'genius-unicorn.webp' : 'great-rabbit.webp';
    $('#app').innerHTML = `<div class="shell"><section class="result listening-result"><div class="reward-hero"><img src="./assets/rewards/${reward}" alt="学習を応援するキャラクター"></div><h1>${remaining ? '苦手をもう一度！' : session.retry ? '解き直しクリア！' : 'よくできました！'}</h1><p>${esc(level.title)}</p><div class="score"><strong>${session.firstCorrect}</strong><small>/ ${session.originalTotal}問 初回正解</small></div><p class="practice-count">${remaining ? '解き直し：あと ' + remaining + '問' : '今回の問題をすべて正解できました！'}</p><div class="reward-pop">今回のごほうび<b>⭐ ${session.earned} スター</b></div>${remaining ? `<section class="mistake-box"><h2>📝 まちがえた問題</h2><div class="mistake-list">${[...session.pending.values()].map(q => `<div class="mistake-item"><div><strong>${esc(q.en)}</strong><small>${esc(q.ja)}</small></div></div>`).join('')}</div></section>` : ''}<p class="practice-note">${remaining ? '苦手は保存済み。途中で戻っても次回の同じステップで優先して出題します。' : '次は翌日以降に復習しよう。正解を重ねると復習の間隔が延びます。'}</p><div class="actions">${remaining ? `<button class="primary" id="listenRetry">まちがえた${remaining}問を解き直す</button>` : '<button class="primary" id="listenAgain">次の問題へ</button>'}<button class="secondary" id="listenHome">${remaining ? '保存して、あとで続ける' : 'カテゴリーを選ぶ'}</button></div></section></div>`;
    if (remaining) $('#listenRetry').onclick = retry;
    else $('#listenAgain').onclick = () => start(category);
    $('#listenHome').onclick = home;
  }
  resetProgress = function () {
    if (!window.confirm(W.length + '語の正解記録と、リスニング・MISSION 20の復習記録をリセットしますか？')) return;
    mastered.clear(); stars = 0; streakData = { days: 0, last: '' }; save();
    [STAR_KEY, STREAK_KEY, NORMAL_SHOP_KEY, LISTEN_SHOP_KEY, GUIDE_SHOP_KEY, SHOP_INIT_KEY].forEach(k => localStorage.removeItem(k));
    progress.clear(); home();
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelSpeech(); });
  window.addEventListener('pagehide', cancelSpeech);
  decorate();
})();
