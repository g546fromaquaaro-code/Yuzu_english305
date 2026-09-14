(() => {
  'use strict';
  const { questions, labels } = EikenPracticeBank, map = new Map(questions.map(q => [q.id, q]));
  const KEY = 'eigo305-eiken-practice-v1', MODE = 'eiken-foundations';
  const practice = LearningSupport.create(localStorage), esc = LearningSupport.escapeHTML;
  const $ = s => document.querySelector(s), board = $('#board');
  const shuffle = items => { const a = [...items]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let state = { version: 1, done: [], session: null }, locked = false;
  function validSession(s) {
    if (!s || !Array.isArray(s.queue) || !s.queue.length || s.queue.length > 12 || !s.queue.every(x => x && map.has(x.id) && typeof x.retry === 'boolean')) return null;
    if (new Set(s.queue.map(x => x.id)).size !== s.queue.length) return null;
    if (!Number.isInteger(s.total) || s.total < 1 || s.total > 12 || !Number.isInteger(s.correct) || s.correct < 0 || s.correct > s.total || !Number.isInteger(s.first) || s.first < 0 || s.first > s.correct || s.correct + s.queue.length !== s.total) return null;
    const q = map.get(s.queue[0].id), size = q.words?.length || 0;
    const picks = Array.isArray(s.picks) && new Set(s.picks).size === s.picks.length && s.picks.every(i => Number.isInteger(i) && i >= 0 && i < size) ? s.picks : [];
    return { queue: s.queue.map(x => ({ id: x.id, retry: x.retry })), total: s.total, correct: s.correct, first: s.first, picks };
  }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw?.version === 1) state = { version: 1, done: Array.isArray(raw.done) ? [...new Set(raw.done.filter(id => map.has(id)))] : [], session: validSession(raw.session) };
  } catch {}
  function safe(fn) { try { fn(); } catch { $('#save-status').textContent = '記録を保存できません。続けて練習できますが、閉じると今回の記録が残らないことがあります。'; } }
  function save() { safe(() => localStorage.setItem(KEY, JSON.stringify(state))); }
  function show(html) { board.innerHTML = html; board.focus(); }
  function home() {
    locked = false;
    show('<section><h2>🌱 今日の練習</h2><p>オリジナル42問から、苦手・復習時期・初めての問題を優先。間違いは少し後でもう一度出るよ。</p>' + (state.session ? '<button id="resume">続きから（できた ' + state.session.correct + ' / ' + state.session.total + '）</button><p>続きがある間は、今の12問を進めよう。</p>' : '<button id="daily">毎日の12問をはじめる</button><p>文の穴埋め6問＋会話3問＋語順3問</p><div class="options">' + Object.entries(labels).map(([type, label]) => '<button data-type="' + type + '">' + label + 'だけ練習</button>').join('') + '</div>') + '<h3>できたマスを埋めよう</h3><progress class="meter" value="' + state.done.length + '" max="42"></progress><p>正解できた問題 ' + state.done.length + ' / 42（覚えたかは後日の復習で確認）</p><div aria-label="問題ごとの練習記録">' + questions.map(q => '<span title="' + esc(labels[q.type] + ' ' + q.id) + '" aria-label="' + esc(q.id + (state.done.includes(q.id) ? ' 練習済み' : ' これから')) + '">' + (state.done.includes(q.id) ? '🌸' : '▫️') + '</span>').join(' ') + '</div></section>');
    if (state.session) $('#resume').onclick = render;
    else { $('#daily').onclick = () => start(); document.querySelectorAll('[data-type]').forEach(b => { b.onclick = () => start(b.dataset.type); }); }
  }
  function start(type) {
    const pick = (kind, n) => practice.prioritize(questions.filter(q => q.type === kind), MODE, n, shuffle);
    const selected = type ? pick(type, 6) : [...pick('gap', 6), ...pick('talk', 3), ...pick('order', 3)];
    state.session = { queue: selected.map(q => ({ id: q.id, retry: false })), total: selected.length, correct: 0, first: 0, picks: [] };
    save(); render();
  }
  function render() {
    locked = false;
    const s = state.session;
    if (!s?.queue.length) return home();
    const item = s.queue[0], q = map.get(item.id);
    show('<section><div class="toolbar"><button id="pause">いったん休む</button><span>できた ' + s.correct + ' / ' + s.total + '</span></div><progress class="meter" max="' + s.total + '" value="' + s.correct + '"></progress><p>' + labels[q.type] + (item.retry ? ' · もう一度チャレンジ' : '') + '</p><h2 id="question">' + esc(q.prompt) + '</h2><div id="answer-area"></div><div id="feedback" class="feedback" role="status"></div></section>');
    $('#pause').onclick = home;
    if (q.type === 'order') {
      $('#answer-area').innerHTML = '<p>カードを順番にタップ。上のカードを押すと戻せるよ。' + (q.id === 'order-9' ? 'please は最後に置こう。' : '') + '</p><div class="slots" id="slots" aria-label="作った文"></div><div class="cards" id="cards"></div><button id="check">答え合わせ</button>';
      const order = shuffle(q.words.map((_, i) => i));
      function draw() {
        $('#slots').innerHTML = s.picks.map((i, n) => '<button data-remove="' + n + '" aria-label="' + esc(q.words[i]) + 'を戻す">' + esc(q.words[i]) + '</button>').join('');
        $('#cards').innerHTML = order.filter(i => !s.picks.includes(i)).map(i => '<button data-word="' + i + '">' + esc(q.words[i]) + '</button>').join('');
        document.querySelectorAll('[data-word]').forEach(b => { b.onclick = () => { if (locked) return; s.picks.push(Number(b.dataset.word)); save(); draw(); }; });
        document.querySelectorAll('[data-remove]').forEach(b => { b.onclick = () => { if (locked) return; s.picks.splice(Number(b.dataset.remove), 1); save(); draw(); }; });
        $('#check').disabled = s.picks.length !== q.words.length;
      }
      draw(); $('#check').onclick = () => { if (s.picks.length === q.words.length) grade(s.picks.every((v, i) => v === i)); };
    } else {
      const choices = shuffle(q.choices);
      $('#answer-area').innerHTML = '<div class="options">' + choices.map((c, i) => '<button data-choice="' + i + '">' + (i + 1) + '. ' + esc(c) + '</button>').join('') + '</div>';
      document.querySelectorAll('[data-choice]').forEach(b => { b.onclick = () => grade(choices[Number(b.dataset.choice)] === q.answer); });
    }
  }
  function grade(ok) {
    if (locked || !state.session) return; locked = true;
    const s = state.session, item = s.queue.shift(), q = map.get(item.id);
    safe(() => practice.record(MODE, q.id, ok, { retry: item.retry }));
    if (ok) { s.correct++; if (!item.retry) s.first++; if (!state.done.includes(q.id)) state.done.push(q.id); }
    else s.queue.splice(Math.min(2, s.queue.length), 0, { id: q.id, retry: true });
    s.picks = [];
    const finished = !s.queue.length, first = s.first, total = s.total;
    if (finished) state.session = null;
    save();
    $('#answer-area').querySelectorAll('button').forEach(b => { b.disabled = true; });
    $('#feedback').innerHTML = '<h3>' + (ok ? '🌸 正解！' : '🌱 あとでもう一度やってみよう') + '</h3><p>' + esc(q.answer || q.words.join(' ')) + '</p><p>' + esc(q.explanation) + '</p><a class="back" href="hayamihyo4.html?v=33" target="_blank" rel="noopener">早見表で確かめる ↗</a> <button id="next">' + (finished ? '結果を見る' : '次へ') + '</button>';
    $('#next').onclick = () => {
      if (!finished) return render();
      show('<section><p class="stamp">🌸 🌸 🌸</p><h2>最後までできたね！</h2><p>最初の答え：' + first + ' / ' + total + '問正解</p><p>やり直しも含めて全' + total + '問クリア。次の日も答えを見ずに挑戦しよう。</p><button id="home">練習一覧へ</button></section>'); $('#home').onclick = home;
    };
  }
  home();
})();
