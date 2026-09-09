const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const data = JSON.parse(read('legacy.html').match(/const DATA=(\{.*?\}),W=DATA\.words/s)[1]);
function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}
function harness() {
  const elements = new Map();
  function element(key) {
    if (!elements.has(key)) elements.set(key, { innerHTML: '', textContent: '', style: {}, disabled: false,
      classList: { add() {}, remove() {}, toggle() {} }, before() {}, after() {}, scrollIntoView() {},
      querySelector: element, querySelectorAll: () => [], addEventListener() {}, setAttribute() {} });
    return elements.get(key);
  }
  const context = { console, localStorage: storage(), setInterval: () => 1, clearInterval() {},
    performance: { now: () => 1000 }, scrollTo() {}, addEventListener() {},
    document: { querySelector: element, querySelectorAll: () => [], getElementById: id => element('#' + id),
      createElement: () => element('created-' + elements.size), body: element('body'), addEventListener() {} },
    confirm: () => true, W: data.words, $: element, shuffle: items => [...items],
    stopBgm() {}, startBgm() {}, ensureAudio() {}, se() {}, sparkle() {},
    speechSynthesis: { cancel() {}, getVoices: () => [], speak(u) { context.lastSpeech = u; } },
    SpeechSynthesisUtterance: function (text) { this.text = text; },
  };
  context.window = context; vm.createContext(context);
  vm.runInContext(read('assets/learning-progress.js'), context);
  return { context, element, run: code => vm.runInContext(code, context) };
}
test('spaced review persists across reloads, separates modes, and does not promote retries', () => {
  const { context: c } = harness(), p = c.LearningSupport.create(c.localStorage), day = c.LearningSupport.DAY;
  p.record('mission', 'a', false, { now: 0 });
  assert.equal(c.LearningSupport.create(c.localStorage).needsReview('mission', 'a', 1), true);
  assert.equal(p.get('listening-word', 'a'), null);
  assert.equal(p.record('mission', 'a', true, { now: 100, retry: true }).streak, 1);
  assert.equal(p.needsReview('mission', 'a', 101), false);
  assert.equal(p.record('mission', 'a', true, { now: 200 }).streak, 1);
  assert.equal(p.record('mission', 'a', true, { now: 200 + day }).streak, 2);
  assert.equal(p.get('mission', 'a').due, 200 + 4 * day);
});
test('pending mistakes precede due, unseen and scheduled items', () => {
  const { context: c } = harness(), p = c.LearningSupport.create(c.localStorage), day = c.LearningSupport.DAY;
  p.record('mission', 'pending', false, { now: 0 });
  p.record('mission', 'due', true, { now: 0 });
  p.record('mission', 'later', true, { now: day });
  const list = ['later', 'new', 'due', 'pending'].map(id => ({ id }));
  assert.deepEqual(Array.from(p.prioritize(list, 'mission', 4, a => a, day), w => w.id), ['pending', 'due', 'new', 'later']);
});
test('all spoken-word groups have four unique, unambiguous choices at both word levels', () => {
  const { context: c } = harness(), s = c.LearningSupport, words = s.listeningWords(data.words);
  const you = words.find(w => w.en === 'you');
  assert.ok(you.wordIds.length > 1);
  assert.ok(you.ja.includes('あなたを'));
  for (const q of words) for (const key of ['en', 'ja']) {
    const choices = s.listeningChoices(q, words, key, a => a);
    assert.equal(choices.length, 4, q.en);
    assert.equal(new Set(choices).size, 4, q.en);
    assert.equal(choices.filter(x => x === q[key]).length, 1);
  }
});
test('sentence exercises cover every category and have exactly one correct option', () => {
  const { context: c, run } = harness(); run(read('assets/listening-sentences.js'));
  assert.equal(c.ListeningSentences.length, 34);
  assert.equal(new Set(c.ListeningSentences.map(q => q.category)).size, 15);
  assert.equal(new Set(c.ListeningSentences.map(q => q.id)).size, 34);
  for (const q of c.ListeningSentences) assert.equal(new Set([q.ja, ...q.distractors]).size, 4);
});
test('listening never pits homophones against each other', () => {
  const { context: c } = harness(), s = c.LearningSupport, words = s.listeningWords(data.words);
  for (const [a, b] of [['our', 'hour'], ['sea', 'see']]) {
    const q = words.find(w => w.en === a), other = words.find(w => w.en === b);
    for (const key of ['en', 'ja']) assert.ok(!s.listeningChoices(q, [q, other, ...words], key, a => a).includes(other[key]));
  }
});
function missionHarness() {
  const h = harness(), c = h.context;
  Object.assign(c, { selectedCat: 'weather', selectedMode: 'normal', round: [], bank: [], fill: {}, active: 0, graded: false,
    timerId: null, startAt: 0, MKEY: 'eigo305-mastered-v1', RKEY: 'records',
    mastered: () => new Set(JSON.parse(c.localStorage.getItem(c.MKEY) || '[]')),
    wordsFor: id => data.words.filter(w => w.category === id), meta: () => ({ icon: '', label: '天気' }),
    records: () => JSON.parse(c.localStorage.getItem('records') || '{}'), recKey: () => 'normal-weather',
    render() {}, home() {}, renderCats() {}, showRecords() {}, load() {}, rewardAsset: () => ({ img: 'clear-chick.webp', alt: 'ひよこ' }) });
  h.run(read('assets/mission-review.js')); return h;
}
function fillMission(c, wrongIndex = -1) {
  c.fill = {}; const used = new Set();
  c.round.forEach((w, i) => {
    const match = c.bank.find(x => !used.has(x.id) && (i === wrongIndex ? x.en !== w.en : x.en === w.en));
    if (match) { c.fill[i] = match.id; used.add(match.id); }
  });
  // Simulate a valid complete card arrangement by swapping the first two when needed.
  if (wrongIndex >= 0 && Object.keys(c.fill).length !== c.round.length) {
    fillMission(c); [c.fill[0], c.fill[1]] = [c.fill[1], c.fill[0]];
  }
}
test('mission blocks incomplete grading, records each correct word and retries only mistakes', () => {
  const { context: c, element } = missionHarness();
  c.start(); c.finish(); assert.equal(c.graded, false);
  fillMission(c); [c.fill[0], c.fill[1]] = [c.fill[1], c.fill[0]];
  const wrong = c.round.slice(0, 2).map(w => w.id), total = c.round.length;
  c.finish();
  assert.equal(c.mastered().size, total - 2);
  assert.equal(c.localStorage.getItem('records'), null);
  element('#again').onclick();
  assert.deepEqual(Array.from(c.round, w => w.id), wrong);
  assert.ok(new Set(c.bank.map(w => w.en)).size >= 4);
  fillMission(c); c.finish();
  assert.equal(c.mastered().size, total);
  assert.equal(c.localStorage.getItem('records'), null, 'retry must not create a speed record');
  assert.equal(c.LearningSupport.create(c.localStorage).get('mission', wrong[0]).pending, false);
});
test('single mission mistake still has distractors and unfinished retries survive leaving', () => {
  const { context: c, element } = missionHarness();
  c.wordsFor = () => data.words.filter(w => w.category === 'weather').slice(0, 1);
  c.start(); assert.ok(c.bank.length >= 4);
  const id = c.round[0].id; c.fill[0] = c.bank.find(x => x.en !== c.round[0].en).id; c.finish();
  element('#choose').onclick(); c.selectedMode = 'weak';
  assert.ok(c.unmasteredFor('weather').some(w => w.id === id));
  c.start(); assert.equal(c.round[0].id, id);
});
test('mission accepts interchangeable autumn/fall cards but distinguishes calendar and sky', () => {
  const { context: c, element } = missionHarness();
  c.wordsFor = () => data.words.filter(w => ['autumn', 'fall'].includes(w.en));
  c.start(); fillMission(c); [c.fill[0], c.fill[1]] = [c.fill[1], c.fill[0]]; c.finish();
  assert.match(element('#result').innerHTML, /MISSION CLEAR/);
  c.wordsFor = () => data.words.filter(w => w.en === 'month').slice(0, 1);
  c.start(); c.bank.push({ id: 999, en: 'moon', used: 0 }); c.fill[0] = 999; c.finish();
  assert.match(element('#result').innerHTML, /あと1問/);
});
function listeningHarness(level = 'meaning') {
  const h = harness(), c = h.context;
  c.localStorage.setItem('eigo305-listening-level-v1', level);
  Object.assign(c, { start() {}, home() {}, resetProgress() {}, quizMode: 'listening', timer: null, category: 'all',
    visitDay() {}, mastered: new Set(['existing-word']), stars: 10, streakData: { days: 0, last: '' },
    STAR_KEY: 'stars', STREAK_KEY: 'streak', NORMAL_SHOP_KEY: 'normal', LISTEN_SHOP_KEY: 'listen', GUIDE_SHOP_KEY: 'guide', SHOP_INIT_KEY: 'init',
    save() { c.localStorage.setItem('mastered', JSON.stringify([...c.mastered])); },
    shopSet: key => new Set(JSON.parse(c.localStorage.getItem(key) || '[]')) });
  h.run(read('assets/listening-sentences.js')); h.run(read('assets/listening-practice.js'));
  return h;
}
// Collect answer callbacks exposed by the rendered exercise without a browser.
function answerButtons(h) {
  const buttons = Array.from({ length: 4 }, (_, i) => ({ dataset: { listenAnswer: String(i) }, classList: { add() {} }, disabled: true }));
  const original = h.context.document.querySelectorAll;
  h.context.document.querySelectorAll = selector => selector === '[data-listen-answer]' ? buttons : original(selector);
  return buttons;
}
test('listening requires successful playback, supports slow replay, and preserves previous progress', () => {
  const h = listeningHarness(), c = h.context, buttons = answerButtons(h);
  c.start('pronoun');
  buttons[0].onclick(); assert.equal(c.stars, 10, 'cannot answer before hearing');
  h.element('#listenSlow').onclick(); assert.equal(c.lastSpeech.rate, .65);
  c.lastSpeech.onend(); buttons[0].onclick();
  assert.equal(c.stars, 12); assert.ok(c.mastered.has('existing-word'));
  buttons[0].onclick(); assert.equal(c.stars, 12, 'double taps do not award twice');
  assert.match(h.element('#listenFeedback').innerHTML, /正解！/);
  assert.equal(c.LearningSupport.create(c.localStorage).get('listening-meaning', data.words[0].id).pending, false);
});
test('listening mistakes are retried until correct and sentence scores do not inflate vocabulary', () => {
  const h = listeningHarness('sentence'), c = h.context, buttons = answerButtons(h);
  c.start('pronoun'); c.lastSpeech.onend(); buttons[1].onclick();
  h.element('#listenNext').onclick(); c.lastSpeech.onend(); buttons[0].onclick();
  h.element('#listenNext').onclick(); assert.match(h.element('#app').innerHTML, /まちがえた1問/);
  h.element('#listenRetry').onclick(); c.lastSpeech.onend(); buttons[1].onclick();
  h.element('#listenNext').onclick(); assert.match(h.element('#app').innerHTML, /まちがえた1問/);
  h.element('#listenRetry').onclick(); c.lastSpeech.onend(); buttons[0].onclick();
  h.element('#listenNext').onclick(); assert.match(h.element('#app').innerHTML, /解き直しクリア/);
  assert.equal(c.mastered.size, 1); assert.equal(c.stars, 14);
  assert.equal(c.LearningSupport.create(c.localStorage).get('listening-sentence', 'sentence-1').streak, 1);
});
test('cancelled reset preserves practice records and confirmed reset removes them', () => {
  const { context: c } = listeningHarness();
  const p = c.LearningSupport.create(c.localStorage); p.record('mission', 'x', false);
  c.confirm = () => false; c.resetProgress(); assert.ok(p.get('mission', 'x'));
  c.confirm = () => true; c.resetProgress(); assert.equal(p.get('mission', 'x'), null);
});
