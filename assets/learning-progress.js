(function (root) {
  'use strict';
  const KEY = 'eigo305-practice-v1';
  const DAY = 86400000;
  const normalize = value => value.trim().toLowerCase().replace(/[’‘]/g, "'");
  const homophones = [['our', 'hour'], ['sea', 'see'], ['i', 'eye'], ['two', 'to', 'too'], ['four', 'for'], ['write', 'right'], ['one', 'won']];
  const soundKey = value => { const n = normalize(value); return homophones.find(group => group.includes(n))?.[0] || n; };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function create(storage) {
    function read() {
      try {
        const value = JSON.parse(storage.getItem(KEY) || '{}');
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      } catch { return {}; }
    }
    function get(mode, id) { return read()[mode]?.[id] || null; }
    function needsReview(mode, id, now = Date.now()) {
      const r = get(mode, id);
      return !!r && (r.pending === true || Number(r.due) <= now);
    }
    function record(mode, id, ok, options = {}) {
      const now = options.now ?? Date.now(), all = read();
      const group = all[mode] && typeof all[mode] === 'object' ? all[mode] : {};
      const old = group[id] || {};
      const r = { ...old, attempts: (Number(old.attempts) || 0) + 1, lastAttempt: now };
      if (!ok) {
        Object.assign(r, { pending: true, streak: 0, due: now, mistakes: (Number(old.mistakes) || 0) + 1 });
      } else {
        // A retry or another answer on the same day cannot count as spaced recall.
        const spaced = !options.retry && !old.pending && old.lastSuccess != null && now - old.lastSuccess >= DAY;
        const streak = Math.max(1, Math.min(4, (Number(old.streak) || 0) + (spaced ? 1 : 0)));
        Object.assign(r, { pending: false, streak, lastSuccess: now, due: now + [1, 3, 7, 14][streak - 1] * DAY });
      }
      group[id] = r; all[mode] = group;
      storage.setItem(KEY, JSON.stringify(all));
      return r;
    }
    function prioritize(pool, mode, count, shuffle, now = Date.now()) {
      const group = read()[mode] || {};
      const priority = w => !group[w.id] ? 2 : group[w.id].pending ? 0 : Number(group[w.id].due) <= now ? 1 : 3;
      return shuffle(pool).sort((a, b) => priority(a) - priority(b)).slice(0, count);
    }
    return { get, record, needsReview, prioritize, clear: () => storage.removeItem(KEY) };
  }
  // Merge meanings of identical spoken words: "you" must not have competing correct answers.
  function listeningWords(words) {
    const groups = new Map();
    words.forEach(w => {
      const key = normalize(w.en);
      if (!groups.has(key)) groups.set(key, { ...w, meanings: [], wordIds: [] });
      const q = groups.get(key);
      if (!q.meanings.includes(w.ja)) q.meanings.push(w.ja);
      q.wordIds.push(w.id);
    });
    return [...groups.values()].map(w => ({ ...w, ja: w.meanings.join(' ／ ') }));
  }
  function listeningChoices(q, pool, key, shuffle) {
    const candidates = pool.filter(w => soundKey(w.en) !== soundKey(q.en) && w[key] !== q[key]
      && (key !== 'ja' || !(w.meanings || [w.ja]).some(m => (q.meanings || [q.ja]).includes(m))));
    const unique = new Map();
    const near = shuffle(candidates.filter(w => w.category === q.category));
    const rest = shuffle(candidates.filter(w => w.category !== q.category));
    [...near, ...rest].forEach(w => { if (!unique.has(w[key])) unique.set(w[key], w[key]); });
    return shuffle([q[key], ...[...unique.values()].slice(0, 3)]);
  }
  root.LearningSupport = { KEY, DAY, create, normalize, escapeHTML, listeningWords, listeningChoices };
})(typeof window === 'undefined' ? globalThis : window);
