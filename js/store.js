/* Bite Timer: saving on the phone itself (localStorage). Nothing leaves the device.
   The key is namespaced because every GitHub Pages app on the same account shares one web origin. */
(function (BT) {
  const KEY = 'biteTimer:v1';
  const RESUME_MS = 3 * 60 * 60 * 1000; // reopen within 3 hours -> offer to keep going
  const St = BT.store = {};

  const fresh = () => ({
    v: 1,
    settings: { dur: 15, mute: false, cue: false, remind: true, kid: '' },
    current: null,   // tonight's room, while dinner is going
    book: [],        // finished rooms, newest first
    recent: []       // creatures picked lately, so the four choices vary
  });

  St.data = fresh();

  St.load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        St.data = Object.assign(fresh(), d, { settings: Object.assign(fresh().settings, d.settings || {}) });
      }
    } catch (e) { console.warn('Could not read saved data', e); }
    return St.data;
  };

  St.save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(St.data)); return true; }
    catch (e) { console.warn('Could not save', e); return false; }
  };

  // Ask the browser not to clear our data when space runs low.
  St.persist = () => { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* fine */ } };

  St.startRoom = room => {
    St.data.current = room;
    St.data.recent = [room.creature, ...St.data.recent.filter(c => c !== room.creature)].slice(0, 4);
    St.save();
  };

  // Put tonight's room in the book (only if she took at least one bite).
  St.finishCurrent = () => {
    const room = St.data.current;
    St.data.current = null;
    if (room && room.bites > 0) {
      room.endedAt = Date.now();
      room.items.forEach(i => { if (i.t === 'host') i.sleepy = true; });
      St.data.book.unshift(room);
    }
    St.save();
    return room;
  };

  // On start-up: is there an unfinished dinner? Recent ones can be resumed; old ones are filed away.
  St.checkCurrent = () => {
    const room = St.data.current;
    if (!room) return null;
    if (Date.now() - (room.lastAt || room.startedAt) < RESUME_MS) return room;
    St.finishCurrent();
    return null;
  };

  St.deleteRoom = id => {
    St.data.book = St.data.book.filter(r => r.id !== id);
    St.save();
  };

  /* ---- backup file ---- */
  St.exportText = () => JSON.stringify({ app: 'bite-timer', exportedAt: new Date().toISOString(), data: St.data }, null, 1);

  St.importText = text => {
    const parsed = JSON.parse(text);
    const d = parsed && parsed.app === 'bite-timer' ? parsed.data : parsed;
    if (!d || !Array.isArray(d.book)) throw new Error('This file is not a Bite Timer backup.');
    const have = new Set(St.data.book.map(r => r.id));
    const added = d.book.filter(r => r && r.id && r.items && !have.has(r.id));
    St.data.book = St.data.book.concat(added).sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
    if (d.settings && !St.data.settings.kid && d.settings.kid) St.data.settings.kid = d.settings.kid;
    St.save();
    return added.length;
  };
})(window.BT);
