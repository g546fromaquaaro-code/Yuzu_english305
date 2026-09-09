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
