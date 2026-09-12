(function () {
  'use strict';
  const support = window.LearningSupport, practice = support.create(localStorage), esc = support.escapeHTML;
  let retrying = false, pending = [], originalTotal = 0, originalScore = 0, originalRound = [];
  const previousHome = home;
  const meaningHints = { hour: '時間（1時間・2時間の単位）', time: '時間・時刻', month: '月（1月・2月の単位）', moon: '月（夜空の月）', watch: '見る（テレビなどをじっと）', look: '見る（目を向ける）' };
  function meaning(w) { return meaningHints[support.normalize(w.en)] || w.ja; }
  function accepts(w, en) {
    return W.some(candidate => candidate.en === en && meaning(candidate) === meaning(w));
  }
  unmasteredFor = function (id) {
    const m = mastered();
    return wordsFor(id).filter(w => !m.has(w.id) || practice.needsReview('mission', w.id));
  };
  pick = function () {
    const pool = selectedMode === 'weak' ? unmasteredFor(selectedCat) : wordsFor(selectedCat);
    return practice.prioritize(pool, 'mission', 20, shuffle);
  };
  function makeBank(items) {
    const answers = items.map(w => ({ en: w.en }));
    const used = new Set(items.map(w => support.normalize(w.en)));
    // With one mistake, a one-card bank would give the answer away.
    const near = shuffle(W.filter(w => w.category === selectedCat));
    for (const w of [...near, ...shuffle(W)]) {
      if (new Set(answers.map(x => support.normalize(x.en))).size >= 4) break;
      if (!used.has(support.normalize(w.en))) { answers.push({ en: w.en }); used.add(support.normalize(w.en)); }
    }
    return shuffle(answers.map((w, i) => ({ id: i, en: w.en, used: null })));
  }
  function begin(items, isRetry) {
    if (!items.length) return;
    retrying = isRetry; round = items; bank = makeBank(items);
    fill = {}; active = 0; graded = false;
    ensureAudio(); se('start'); startBgm();
    $('#setup').style.display = 'none'; $('#game').classList.add('on');
    document.body.classList.toggle('mission-review', isRetry);
    $('#result').classList.remove('on'); $('#result').innerHTML = '';
    $('#bankWrap').style.display = 'block'; $('#finish').style.display = 'block';
    $('#reset').textContent = '🔄 この問題を最初から';
    $('#label').textContent = `${meta(selectedCat).icon} ${meta(selectedCat).label} ／ ${isRetry ? 'まちがい解き直し（時間制限なし）' : selectedMode === 'weak' ? '苦手・未習得ミッション' : '通常ミッション'}`;
    $('.banktitle').textContent = bank.length > round.length ? '👇 正しいカードを選ぼう（使わないカードもあるよ）' : '👇 英単語カード';
    clearInterval(timerId); startAt = performance.now();
    $('#timer').textContent = isRetry ? '🌱 解き直し' : '⏱ 0.0秒';
    if (!isRetry) timerId = setInterval(() => { $('#timer').textContent = '⏱ ' + ((performance.now() - startAt) / 1000).toFixed(1) + '秒'; }, 100);
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  start = function () {
    pending = []; originalRound = pick(); originalTotal = originalRound.length; originalScore = 0;
    begin(originalRound, false);
  };
  render = function () {
    const used = Object.keys(fill).length;
    $('#progress').style.width = (used / round.length * 100) + '%';
    $('#count').textContent = used + ' / ' + round.length;
    $('#words').innerHTML = round.map((w, i) => {
      const x = bank.find(a => a.id === fill[i]), ok = graded && x && accepts(w, x.en), bad = graded && !ok;
      return `<button class="slot ${!graded && x ? 'filled' : ''} ${!graded && active === i ? 'active' : ''} ${ok ? 'ok' : ''} ${bad ? 'bad' : ''}" data-s="${i}" ${graded ? 'disabled' : ''}><span class="num">${i + 1}</span><span class="ja">${esc(meaning(w))}</span><span class="ans">${x ? esc(x.en) : '？'}</span>${bad ? `<span class="correct">正解：${esc(w.en)}</span>` : ''}</button>`;
    }).join('');
    $('#bank').innerHTML = graded ? '' : bank.map(x => `<button class="chip ${x.used !== null ? 'used' : ''}" data-c="${x.id}">${esc(x.en)}</button>`).join('');
    if (!graded) {
      document.querySelectorAll('[data-s]').forEach(b => { b.onclick = () => slot(+b.dataset.s); });
      document.querySelectorAll('[data-c]').forEach(b => { b.onclick = () => chip(+b.dataset.c); });
    }
    if (graded) {
      document.querySelectorAll('[data-s]').forEach(b => { b.disabled = true; });
      return;
    }
    const complete = round.length > 0 && Object.keys(fill).length === round.length;
    $('#finish').disabled = !complete;
    $('#finish').textContent = complete ? '🏁 答え合わせ' : 'あと ' + (round.length - Object.keys(fill).length) + '問セットしよう';
  };
  finish = function () {
    if (graded || !round.length || Object.keys(fill).length !== round.length) return;
    graded = true; clearInterval(timerId); stopBgm();
    const sec = (performance.now() - startAt) / 1000, m = mastered();
    let score = 0; pending = [];
    round.forEach((w, i) => {
      const chosen = bank.find(x => x.id === fill[i]), ok = !!chosen && accepts(w, chosen.en);
      practice.record('mission', w.id, ok, { retry: retrying });
      if (ok) { score++; m.add(w.id); } else pending.push(w);
    });
    // Correct words count even when the other words need another attempt.
    localStorage.setItem(MKEY, JSON.stringify([...m]));
    if (!retrying) originalScore = score;
    const perfect = pending.length === 0;
    // A reduced retry round must never replace a full mission's best time.
    if (perfect && !retrying) {
      const all = records(), k = recKey();
      all[k] = [...(all[k] || []), { time: +sec.toFixed(1), count: round.length }].sort((a, b) => a.time - b.time).slice(0, 5);
      localStorage.setItem(RKEY, JSON.stringify(all));
    }
    render(); $('#bankWrap').style.display = 'none'; $('#finish').style.display = 'none';
    if (perfect) { se('clear'); sparkle(); } else se('miss');
    const reward = rewardAsset(retrying ? 91 : sec, perfect);
    const heading = perfect ? retrying ? '解き直しクリア！' : 'MISSION CLEAR!' : '苦手をもう一度！';
    $('#result').classList.add('on');
    $('#result').innerHTML = `<div class="rewardPic"><img src="./assets/rewards/${reward.img}" alt="${reward.alt}"></div><h2>${heading}</h2><div class="score">${score} / ${round.length}</div><p>${retrying ? `初回：${originalScore} / ${originalTotal}問正解。` : ''}${perfect ? retrying ? '今回の苦手をすべて正解できたよ！' : `${sec.toFixed(1)}秒でクリア！` : `あと${pending.length}問。赤いところを確認して、正解するまで解き直そう。`}</p><p class="mission-note">${perfect ? '翌日以降も復習すると、もっと覚えられるよ。' : '苦手は保存済み。途中で戻っても次回に優先して出題します。'}</p><div class="result-actions"><button class="again" id="again">${perfect ? '次のミッションへ' : `まちがえた${pending.length}問を解き直す`}</button><button class="choose" id="choose">${perfect ? 'カテゴリーを選ぶ' : '保存して、あとで続ける'}</button></div>`;
    $('#again').onclick = perfect ? start : () => begin(shuffle(pending), true);
    $('#choose').onclick = home;
    renderCats(); showRecords();
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  home = function () { document.body.classList.remove('mission-review'); previousHome(); };
  $('#start').onclick = start;
  $('#finish').onclick = finish;
  $('#reset').onclick = () => { if (!graded) begin([...round], retrying); };
  // Label resets explicitly; after grading, the dedicated retry button owns progression.
  const renderWithReset = render;
  render = function () { renderWithReset(); $('#reset').style.display = graded ? 'none' : 'block'; };
  const note = document.createElement('p'); note.className = 'mission-note';
  note.textContent = 'まちがえた単語を優先。採点後は苦手だけ解き直せるよ。正解した単語は翌日以降も復習します。';
  $('.sectionbar.normal').before(note);
  load();
})();
