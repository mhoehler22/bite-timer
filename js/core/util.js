/* Bite Timer: shared helpers. Everything in the app hangs off one global, BT. */
window.BT = window.BT || {};
(function (BT) {
  const U = BT.util = {};

  U.pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length)];

  U.shuffle = (arr, r = Math.random) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Pick one item with probability proportional to weight(item).
  U.weighted = (items, weight, r = Math.random) => {
    const ws = items.map(weight);
    const total = ws.reduce((s, w) => s + w, 0);
    if (!total) return items.length ? U.pick(items, r) : null;
    let x = r() * total;
    for (let i = 0; i < items.length; i++) { x -= ws[i]; if (x <= 0) return items[i]; }
    return items[items.length - 1];
  };

  // Small seeded random generator, so a room's backdrop details look the same every time it's drawn.
  U.rng = seed => {
    let a = (seed >>> 0) || 1;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  U.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  U.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  U.$ = (sel, root = document) => root.querySelector(sel);
  U.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  U.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.sleep = ms => new Promise(res => setTimeout(res, ms));

  U.dateLabel = ts => new Date(ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  // Query-string flags for testing, e.g. ?fast=1
  U.flag = name => new URLSearchParams(location.search).has(name);
})(window.BT);
