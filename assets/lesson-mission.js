/* Part 2 reuses the original Mission 20 game and review engine. */
(() => {
  if (!LESSON_PART2) return;
  const data = LessonMissionBank, esc = LearningSupport.escapeHTML;
  let lesson = '', onlyNew = false, previousCategory = null, speechToken = 0;
  document.body.classList.add('lesson-mission');
  document.title = 'MISSION 20 PART 2 · レッスンの単語と語句';
  $('.hero h1').innerHTML = '🎮 <span>MISSION 20</span><small>PART 2</small>';
  $('.hero p').textContent = 'レッスンの単語・語句・会話をカードで覚えよう。最大20問、時間制限なし。';
  $('#part-link').href = './hayamihyo.html?v=35';
  $('#part-link').textContent = '← PART 1：いつもの単語・会話ミッション';
  $('.sectionbar.normal').textContent = '📚 レッスンの単語と表現';
  $('#back').textContent = '← PART 1';
  $('#back').onclick = () => { stopBgm(); cancelSpeech(); location.href = './hayamihyo.html?v=35'; };
  $('.gamehero h2').innerHTML = '⚡ 単語・語句を<span>セット！</span>';
  const controls = document.createElement('div'); controls.id = 'lesson-controls';
  controls.innerHTML = '<p>同じ英語をまとめた <b>' + data.words.length + '表現</b>。PART 1と共通の' + data.words.filter(w => w.existing).length + '表現も、文と一緒に復習できます。</p><p>まずは「合格レッスン」の6ブロックから。「これまでのフレーズ」は少し難しい表現も含みます。</p><label>出題範囲 <select id="lesson-filter"><option value="">ブロック全体</option></select></label> <label><input type="checkbox" id="lesson-new"> PART 1にない表現だけ</label><p id="lesson-progress" role="status"></p><details id="lesson-guide"><summary>📖 選んだ範囲の早見表・発音・出典</summary><div id="lesson-table"></div></details><p id="lesson-audio" role="status"></p>';
  $('#normalCats').after(controls);
  wordsFor = id => W.filter(w => w.groups.includes(id) && (!onlyNew || !w.existing) && (!lesson || w.sources.some(s => s.track === (id.startsWith('core-') ? '合格' : 'フレーズ') && s.n === Number(lesson))));
  const recordKey = (mode, cat) => mode + '-' + cat + '-lesson-' + (lesson || 'all') + (onlyNew ? '-new' : '-all');
  recKey = () => selectedCat ? recordKey(selectedMode, selectedCat) : '';
  bestFor = (mode, cat) => { const r = records()[recordKey(mode, cat)] || []; return r.length ? Math.min(...r.map(x => Number(x.time))) : null; };
  const originalRenderCats = renderCats;
  renderCats = function () {
    originalRenderCats();
    document.querySelectorAll('[data-cat]').forEach(b => {
      const group = data.groups.find(g => g.id === b.dataset.cat);
      const label = document.createElement('span'); label.className = 'lesson-track'; label.textContent = group.track + ' ' + group.range;
      b.prepend(label);
    });
  };
  const originalSelection = updateSelection;
  updateSelection = function () {
    if (selectedCat !== previousCategory) {
      previousCategory = selectedCat; lesson = '';
      const sources = new Map();
      if (selectedCat) W.filter(w => w.groups.includes(selectedCat)).forEach(w => w.sources.filter(s => s.track === (selectedCat.startsWith('core-') ? '合格' : 'フレーズ') && Math.floor((s.n - 1) / 5) === Number(selectedCat.split('-')[1])).forEach(s => sources.set(s.n, s.title)));
      $('#lesson-filter').innerHTML = '<option value="">ブロック全体</option>' + [...sources].sort((a,b)=>a[0]-b[0]).map(([n,title]) => '<option value="' + n + '">Lesson ' + n + '：' + esc(title) + '</option>').join('');
      renderCats();
    }
    originalSelection();
    const items = selectedCat ? wordsFor(selectedCat) : [], learned = mastered();
    $('#lesson-progress').textContent = selectedCat ? 'この範囲で正解できた表現 ' + items.filter(w => learned.has(w.id)).length + ' / ' + items.length + '。記録はPART 2専用です。' : '上のブロックを選ぶと、Lessonごとにも絞り込めます。';
    $('#lesson-table').innerHTML = items.length ? '<table><thead><tr><th>英語・発音</th><th>意味</th><th>出典</th></tr></thead><tbody>' + items.map(w => '<tr><td><button data-say="' + w.id + '" aria-label="' + esc(w.en) + 'の発音">🔊</button> ' + esc(w.en) + '</td><td>' + esc(w.ja) + '</td><td>' + w.sources.map(s=>esc(s.track+' L'+s.n)).join('・') + (w.existing ? '<br>PART 1でも登場' : '') + '</td></tr>').join('') + '</tbody></table>' : '<p>この範囲には問題がありません。絞り込みを変えてください。</p>';
    document.querySelectorAll('[data-say]').forEach(b => { b.onclick = () => say(W.find(w=>w.id===b.dataset.say).en); });
  };
  function change() { cancelSpeech(); lesson = $('#lesson-filter').value; onlyNew = $('#lesson-new').checked; renderCats(); updateSelection(); showRecords(); }
  $('#lesson-filter').onchange = change; $('#lesson-new').onchange = change;
  function cancelSpeech() { speechToken++; window.speechSynthesis?.cancel(); }
  function say(text) {
    cancelSpeech(); const token = speechToken, status = $('#lesson-audio');
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { status.textContent = 'この端末では音声を再生できません。'; return; }
    try {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = .8;
      u.voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('en')) || null;
      u.onstart = () => { if (token === speechToken) status.textContent = '再生中…'; };
      u.onend = () => { if (token === speechToken) status.textContent = ''; };
      u.onerror = () => { if (token === speechToken) status.textContent = 'もう一度、発音ボタンを押してください。'; };
      speechSynthesis.speak(u);
    } catch { status.textContent = '音声を再生できませんでした。'; }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelSpeech(); });
  window.addEventListener('pagehide', cancelSpeech);
  load = function () {
    W = data.words; renderCats(); updateSelection(); showRecords(); updateSound(); renderBgmChoices();
    const launch = $('#start').onclick;
    $('#start').onclick = () => { cancelSpeech(); $('#lesson-guide').open = false; launch(); };
  };
})();
