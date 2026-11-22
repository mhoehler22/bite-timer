/* Bite Timer: saving on the phone itself (localStorage). Nothing leaves the device.
   The key is namespaced because every GitHub Pages app on the same account shares one web origin.

   Data version 2 keeps a profile for each child:
     { v: 2, settings: {sound and voice, shared by everyone}, active: <child id>,
       kids: [ { id, name, color, dur, book: [rooms], current: room|null, recent: [creature ids] } ] }
   Version 1 (one child, rooms at the top level) is moved into the first child automatically. */
(function (BT) {
  const KEY = 'biteTimer:v1'; // the key stays the same; the data carries its own version number
  const RESUME_MS = 3 * 60 * 60 * 1000; // reopen within 3 hours -> offer to keep going
  const St = BT.store = {};

  const SETTINGS = () => ({ mute: false, cue: false, remind: true, babble: true, voice: '', pitch: 1.1 });
  const newKid = (name, color) => ({
    id: BT.util.uid(), name: String(name || '').trim().slice(0, 20) || 'Kiddo', color: color || 'pink',
    createdAt: Date.now(), dur: 15,
    book: [],      // finished rooms, newest first
    current: null, // tonight's room, while dinner is going
    recent: []     // creatures picked lately, so the four choices vary
  });
  const fresh = () => ({ v: 2, settings: SETTINGS(), kids: [], active: null });

  const pickDefined = (o, keys) => keys.reduce((a, k) => { if (o && o[k] !== undefined) a[k] = o[k]; return a; }, {});

  St.migrate = d => {
    if (!d || typeof d !== 'object') return fresh();
    if (d.v === 2 && Array.isArray(d.kids)) {
      d.settings = Object.assign(SETTINGS(), d.settings || {});
      d.kids = d.kids.filter(k => k && k.id).map(k => Object.assign(newKid(k.name, k.color), k, {
        book: Array.isArray(k.book) ? k.book : [], recent: Array.isArray(k.recent) ? k.recent : [], dur: k.dur || 15
      }));
      if (!d.kids.some(k => k.id === d.active)) d.active = d.kids[0] ? d.kids[0].id : null;
      return d;
    }
    // Version 1: one child's rooms at the top level.
    const out = fresh();
    const s = d.settings || {};
    Object.assign(out.settings, pickDefined(s, ['mute', 'cue', 'remind', 'babble', 'voice', 'pitch']));
    const hasAny = (Array.isArray(d.book) && d.book.length) || d.current || (s.kid && String(s.kid).trim());
    if (hasAny) {
      const k = newKid(s.kid, 'pink');
      k.book = Array.isArray(d.book) ? d.book : [];
      k.current = d.current || null;
      k.recent = Array.isArray(d.recent) ? d.recent : [];
      k.dur = s.dur || 15;
      out.kids.push(k);
      out.active = k.id;
    }
    return out;
  };

  St.data = fresh();

  St.load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      St.data = raw ? St.migrate(JSON.parse(raw)) : fresh();
    } catch (e) { console.warn('Could not read saved data', e); St.data = fresh(); }
    return St.data;
  };

  St.save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(St.data)); return true; }
    catch (e) { console.warn('Could not save', e); return false; }
  };

  // Ask the browser not to clear our data when space runs low.
  St.persist = () => { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* fine */ } };

  /* ---- children ---- */
  St.kids = () => St.data.kids;
  St.kid = () => St.data.kids.find(k => k.id === St.data.active) || null;
  St.setActive = id => { if (St.data.kids.some(k => k.id === id)) { St.data.active = id; St.save(); } return St.kid(); };
  St.addKid = (name, color) => {
    const k = newKid(name, color);
    St.data.kids.push(k);
    if (!St.kid()) St.data.active = k.id; // never switch children mid-dinner; they pick themselves on "Who's eating?"
    St.save();
    return k;
  };
  St.renameKid = (id, name) => {
    const k = St.data.kids.find(x => x.id === id);
    const clean = String(name || '').trim().slice(0, 20);
    if (k && clean) { k.name = clean; St.save(); }
    return k;
  };
  St.removeKid = id => {
    St.data.kids = St.data.kids.filter(k => k.id !== id);
    if (St.data.active === id) St.data.active = St.data.kids[0] ? St.data.kids[0].id : null;
    St.save();
  };
  // The creature shown on a child's card: their latest friend, or a sloth to start.
  St.avatar = k => {
    const r = k.current || k.book[0];
    return { creature: r && BT.creatures[r.creature] ? r.creature : 'sloth', color: k.color || 'pink' };
  };

  /* ---- the active child's dinners ---- */
  St.startRoom = room => {
    const k = St.kid();
    if (!k) return;
    k.current = room;
    k.recent = [room.creature, ...k.recent.filter(c => c !== room.creature)].slice(0, 4);
    St.save();
  };

  // Put tonight's room in the book (only if at least one bite was taken).
  const finish = k => {
    const room = k.current;
    k.current = null;
    if (room && room.bites > 0) {
      room.endedAt = Date.now();
      room.items.forEach(i => { if (i.t === 'host') i.sleepy = true; });
      k.book.unshift(room);
    }
    return room;
  };
  St.finishCurrent = () => { const k = St.kid(); const room = k ? finish(k) : null; St.save(); return room; };
  St.dropCurrent = () => { const k = St.kid(); if (k) k.current = null; St.save(); };

  // Is there an unfinished dinner for this child? Recent ones can be resumed; old ones are filed away.
  St.checkCurrent = () => {
    const k = St.kid();
    const room = k && k.current;
    if (!room) return null;
    if (Date.now() - (room.lastAt || room.startedAt) < RESUME_MS) return room;
    St.finishCurrent();
    return null;
  };
  // On start-up: file away any child's dinner left open for more than 3 hours.
  St.fileStale = () => {
    St.data.kids.forEach(k => { if (k.current && Date.now() - (k.current.lastAt || k.current.startedAt) >= RESUME_MS) finish(k); });
    St.save();
  };
  St.hasOpenDinner = k => !!(k.current && Date.now() - (k.current.lastAt || k.current.startedAt) < RESUME_MS);

  St.book = () => { const k = St.kid(); return k ? k.book : []; };
  St.deleteRoom = id => {
    const k = St.kid();
    if (k) k.book = k.book.filter(r => r.id !== id);
    St.save();
  };

  /* ---- backup file (everyone's rooms) ---- */
  St.exportText = () => JSON.stringify({ app: 'bite-timer', exportedAt: new Date().toISOString(), data: St.data }, null, 1);

  // Merges a backup into what's here: matching children (same id, or same name) get the rooms they're
  // missing; new children are added. Returns { rooms, kids } counts of what was added.
  St.importText = text => {
    const parsed = JSON.parse(text);
    const raw = parsed && parsed.app === 'bite-timer' ? parsed.data : parsed;
    if (!raw || !(Array.isArray(raw.kids) || Array.isArray(raw.book))) throw new Error('This file is not a Bite Timer backup.');
    const d = St.migrate(JSON.parse(JSON.stringify(raw)));
    let rooms = 0, kids = 0;
    for (const inc of d.kids) {
      let k = St.data.kids.find(x => x.id === inc.id) || St.data.kids.find(x => x.name.toLowerCase() === inc.name.toLowerCase());
      if (!k) {
        k = Object.assign(newKid(inc.name, inc.color), { id: inc.id, dur: inc.dur || 15, recent: inc.recent || [] });
        St.data.kids.push(k);
        kids++;
      }
      const have = new Set(k.book.map(r => r.id));
      const add = inc.book.filter(r => r && r.id && r.items && !have.has(r.id));
      k.book = k.book.concat(add).sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
      rooms += add.length;
    }
    if (!St.kid() && St.data.kids[0]) St.data.active = St.data.kids[0].id;
    St.save();
    return { rooms, kids };
  };
})(window.BT);
