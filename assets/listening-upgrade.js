/* Listening practice is isolated from the original timed reading game. */
(() => {
  'use strict';
  const support = LearningSupport, practice = support.create(localStorage), esc = support.escapeHTML;
  const originals = { home, start, answer, nextQuestion, speakWord };
  const pool = support.listeningWords(W);
  let queue = [], position = 0, total = 0, firstCorrect = 0, completed = 0, active = false;
  let graded = false, heard = false, token = 0, rate = .8, key = 'ja';
  const mode = () => key === 'ja' ? 'listening-meaning' : 'listening-word';
  function write(fn) { try { fn(); } catch { const el = document.querySelector('#listen-save'); if (el) el.textContent = '記録を保存できません。画面を閉じると今回の記録が残らないことがあります。'; } }
  function cancel() { token++; window.speechSynthesis?.cancel(); }
  function options() {
    return '<label>答え方 <select id="listen-kind"><option value="ja">意味を選ぶ</option><option value="en">英語を選ぶ</option></select></label> <label>速さ <select id="listen-rate"><option value="0.65">ゆっくり</option><option value="0.8">ややゆっくり</option><option value="1">ふつう</option></select></label>';
  }
  home = function () {
    active = false; cancel(); originals.home();
    if (quizMode !== 'listening') return;
    const note = document.querySelector('.listen-note');
    if (note) note.textContent = '単語も会話も、まずは音だけで聞いてみよう。';
    const rules = document.querySelector('.rules');
    if (rules) {
      rules.innerHTML = '<b>🎧 じっくりリスニング</b><p>1回最大10問・時間制限なし。苦手と復習時期の問題を優先します。</p>' + options() + '<p>聞く → 選ぶ → 答えを確認 → 声に出してまねしよう。</p>';
      // Place settings before categories, where children can find them before starting.
      document.querySelector('.section')?.before(rules);
      document.querySelector('#listen-kind').value = key;
      document.querySelector('#listen-kind').onchange = e => { key = e.target.value; };
      document.querySelector('#listen-rate').value = String(rate);
      document.querySelector('#listen-rate').onchange = e => { rate = Number(e.target.value); };
    }
  };
  start = function (c) {
    if (quizMode !== 'listening') return originals.start(c);
    cancel(); clearInterval(timer); stopBgm(); category = c;
    const available = c === 'all' ? pool : pool.filter(q => q.wordIds.some(id => W.some(w => w.id === id && w.category === c)));
    queue = practice.prioritize(available, mode(), 10, shuffle).map(q => ({ q, retry: false }));
    total = queue.length; position = firstCorrect = completed = 0; active = true;
    if (!total) return home();
    write(() => visitDay()); render();
  };
  function render() {
    cancel(); graded = heard = false;
    const item = queue[position], q = item.q;
    choices = support.listeningChoices(q, pool, key, shuffle);
    document.querySelector('#app').innerHTML = '<div class="shell"><div class="quiz"><header class="qhead"><button class="x" onclick="home()" aria-label="ホームへ戻る">×</button><div class="qprogress"><i style="width:' + completed / total * 100 + '%"></i></div><span>できた ' + completed + ' / ' + total + '</span></header><section class="qcard"><p class="eyebrow">' + (item.retry ? 'もう一度チャレンジ' : 'LISTENING') + '</p><p class="prompt">' + (key === 'ja' ? '聞こえた英語の意味は？' : '聞こえた英語はどれ？') + '</p><div class="listen-stage"><span class="ear">🎧</span><button class="speak-button" id="listen-play">🔊 聞く・もう一度聞く</button><label>速さ <select id="listen-rate"><option value="0.65">ゆっくり</option><option value="0.8">ややゆっくり</option><option value="1">ふつう</option></select></label><small id="listen-audio" role="status">音が出ないときは「聞く」を押してね</small></div><div class="choices">' + choices.map((x, i) => '<button class="choice" data-a="' + i + '" onclick="answer(' + i + ')" disabled><b>' + String.fromCharCode(65 + i) + '</b>' + esc(x) + '</button>').join('') + '</div><div id="feedback" aria-live="polite"></div><p id="listen-save" role="status"></p></section></div></div>';
    document.querySelector('#listen-rate').value = String(rate);
    document.querySelector('#listen-rate').onchange = e => { rate = Number(e.target.value); cancel(); };
    document.querySelector('#listen-play').onclick = () => play(q.en);
    // Keep playback in the start/next tap so Safari can use the user gesture.
    if (!document.hidden) play(q.en);
  }
  function play(text) {
    cancel(); const current = token, status = document.querySelector('#listen-audio');
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { status.textContent = 'この端末では音声を再生できません。音声対応のブラウザで開いてください。'; return; }
    try {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate;
      const voices = speechSynthesis.getVoices(); u.voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
      u.onstart = () => { if (current === token) status.textContent = '再生中…'; };
      u.onend = () => { if (current !== token || !active) return; heard = true; status.textContent = 'もう一度聞いてもOK！'; if (!graded) document.querySelectorAll('[data-a]').forEach(b => { b.disabled = false; }); };
      u.onerror = () => { if (current === token) status.textContent = '再生できませんでした。音量を確認して、もう一度「聞く」を押してください。'; };
      speechSynthesis.speak(u);
    } catch { status.textContent = '再生できませんでした。もう一度「聞く」を押してください。'; }
  }
  answer = function (i) {
    if (!active) return originals.answer(i);
    if (graded || !heard || !Number.isInteger(i) || i < 0 || i >= choices.length) return;
    graded = true; cancel();
    const item = queue[position], q = item.q, ok = choices[i] === q[key];
    write(() => practice.record(mode(), q.id, ok, { retry: item.retry }));
    if (ok) {
      completed++; if (!item.retry) firstCorrect++;
      // Reward only newly learned IDs; repeated practice cannot farm stars.
      write(() => {
        const learned = shopSet(LISTEN_SHOP_KEY), fresh = q.wordIds.filter(id => !learned.has(id));
        q.wordIds.forEach(id => { learned.add(id); mastered.add(id); });
        localStorage.setItem(LISTEN_SHOP_KEY, JSON.stringify([...learned])); save();
        if (fresh.length) { stars += 2; localStorage.setItem(STAR_KEY, String(stars)); }
      });
      sparkle();
    } else queue.splice(Math.min(position + 3, queue.length), 0, { q, retry: true });
    document.querySelectorAll('[data-a]').forEach((b, n) => { b.disabled = true; if (choices[n] === q[key]) b.classList.add('ok'); else if (n === i) b.classList.add('bad'); });
    document.querySelector('#feedback').className = 'feedback';
    document.querySelector('#feedback').innerHTML = '<strong>' + (ok ? '正解！' : 'おしい！ あとでもう一度聞こう。') + '</strong><p>' + esc(q.en) + '<br>' + esc(q.ja) + '</p><p>🔊 もう一度聞いて、声に出してまねしよう。</p><button class="next" onclick="nextQuestion()">' + (position + 1 === queue.length ? '結果を見る' : '次へ') + ' →</button>';
  };
  nextQuestion = function () {
    if (!active) return originals.nextQuestion();
    if (!graded) return;
    cancel(); position++;
    if (position < queue.length) return render();
    active = false;
    document.querySelector('#app').innerHTML = '<div class="shell"><section class="result"><div class="reward-hero"><img src="./assets/rewards/' + (firstCorrect === total ? 'genius-unicorn.webp' : 'great-rabbit.webp') + '" alt="がんばったね"></div><h1>🎧 全問できた！</h1><p>最初の答え：' + firstCorrect + ' / ' + total + '問正解</p><p>やり直しも含めて ' + total + '問クリア！</p><p>復習は1・3・7・14日後が目安。次の練習で優先して出題するよ。</p><p>今日は聞けた表現を、先生との会話でも使ってみよう。</p><div class="actions"><button class="primary" onclick="start(category)">もう10問チャレンジ</button><button class="secondary" onclick="home()">カテゴリを選ぶ</button></div></section></div>';
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
  window.addEventListener('pagehide', cancel);
  home();
})();
