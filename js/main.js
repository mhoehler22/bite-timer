/* Bite Timer: screens and wiring.
   Who's coming -> what color -> what name -> dinner -> all done -> My Rooms book. */
(function (BT) {
  const U = BT.util, A = BT.art, $ = U.$, $$ = U.$$;
  const St = BT.store, D = BT.decorator, Sc = BT.scene, T = BT.timer, Au = BT.audio, F = BT.fx;
  const FAST = U.flag('fast'); // ?fast=1 makes every countdown 3 seconds, for testing

  const state = {
    screen: null, pick: { creature: null, color: null, name: null },
    room: null, svg: null, waiting: false, remindTimer: 0,
    autoPaused: false, grownPaused: false, names: [], whoSet: [],
    visiting: null, doneRoom: null
  };
  const dur = () => FAST ? 3 : St.data.settings.dur;
  const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  /* ---------- screens and little helpers ---------- */
  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
    state.screen = id;
  }

  let toastTimer = 0;
  function toast(msg, ms = 2400) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }

  // A friendly question with big buttons. Resolves to the chosen button's value.
  function ask(text, buttons, art = '') {
    return new Promise(res => {
      $('#ask-text').textContent = text;
      $('#ask-art').innerHTML = art;
      const box = $('#ask-btns');
      box.innerHTML = '';
      buttons.forEach((b, i) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'big ' + (b.cls || (i === 0 ? 'go' : 'soft'));
        el.textContent = b.label;
        el.onclick = () => { $('#ask').hidden = true; res(b.value); };
        box.appendChild(el);
      });
      $('#ask').hidden = false;
    });
  }

  const creatureSVG = (id, colorId, sleepy) => {
    const cr = BT.creatures[id];
    if (!cr) return '';
    const p = A.pack(A.color(colorId));
    p.sleepy = !!sleepy;
    return `<svg viewBox="-74 -122 148 134" aria-hidden="true">${cr.poses.sit.draw(p)}</svg>`;
  };

  /* ---------- 1. Who's coming to dinner? ---------- */
  function pickFour(avoid = []) {
    const all = Object.keys(BT.creatures);
    const recent = St.data.recent;
    let pool = all.length - avoid.length >= 4 ? all.filter(id => !avoid.includes(id)) : all.slice();
    const chosen = [];
    while (chosen.length < Math.min(4, all.length) && pool.length) {
      const id = U.weighted(pool, c => { const r = recent.indexOf(c); return r === 0 ? 0.25 : r > 0 ? 0.6 : 1; });
      chosen.push(id);
      pool = pool.filter(x => x !== id);
    }
    return chosen;
  }

  function renderWho(avoid) {
    state.whoSet = pickFour(avoid || []);
    $('#who-cards').innerHTML = state.whoSet.map(id => {
      const cr = BT.creatures[id], home = BT.homes[cr.home];
      return `<button class="card" type="button" data-id="${id}" style="background:${A.light(A.color(cr.color), 0.72)}">` +
        `${creatureSVG(id, cr.color)}<b>${U.esc(cr.label)}</b><small>🏠 ${U.esc(home ? home.label : '')}</small></button>`;
    }).join('');
  }

  function goWho(reroll) {
    if (reroll || !state.whoSet.length) renderWho();
    show('who');
  }

  $('#who-cards').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (!c) return;
    const cr = BT.creatures[c.dataset.id];
    Au.unlock(); Au.tap(cr.sound); F.squish(c);
    state.pick = { creature: cr.id, color: cr.color, name: null };
    setTimeout(goColor, 260);
  });
  $('#who-shuffle').onclick = () => { Au.unlock(); Au.tap('sparkle'); renderWho(state.whoSet); };
  $('#who-book').onclick = () => { Au.unlock(); goBook(); };

  /* ---------- 2. What color? ---------- */
  function goColor() { show('color'); renderColor(false); }

  function renderColor(wiggle) {
    const { creature, color } = state.pick;
    $('#color-preview').innerHTML = creatureSVG(creature, color);
    if (wiggle) F.squish($('#color-preview'));
    $('#swatches').innerHTML = A.COLORS.map((c, i) =>
      `<button class="sw${c.id === color ? ' on' : ''}" type="button" data-c="${c.id}" data-i="${i}" style="background:${c.hex}" aria-label="${c.label}"></button>`).join('');
  }
  $('#swatches').addEventListener('click', e => {
    const b = e.target.closest('.sw');
    if (!b) return;
    Au.unlock(); Au.note(+b.dataset.i);
    state.pick.color = b.dataset.c;
    renderColor(true);
  });
  $('#color-surprise').onclick = () => {
    Au.unlock(); Au.tap('sparkle');
    state.pick.color = U.pick(A.COLORS.filter(c => c.id !== state.pick.color)).id;
    renderColor(true);
    const c = Sc.center($('#color-preview'));
    F.burst(c.x, c.y, 12);
  };
  $('#color-next').onclick = () => { Au.unlock(); goName(); };

  /* ---------- 3. What's their name? ---------- */
  function goName() {
    show('name');
    $('#name-preview').innerHTML = creatureSVG(state.pick.creature, state.pick.color);
    newNames();
    updateChosen();
  }
  function newNames() {
    const pool = BT.NAMES.filter(n => !state.names.includes(n));
    state.names = U.shuffle(pool).slice(0, 6);
    renderChips();
  }
  function renderChips() {
    $('#name-chips').innerHTML = state.names.map(n => `<button class="chip${n === state.pick.name ? ' on' : ''}" type="button">${U.esc(n)}</button>`).join('');
  }
  function updateChosen() {
    $('#name-chosen').textContent = state.pick.name || '?';
    $('#name-go').disabled = !state.pick.name;
  }
  $('#name-chips').addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    Au.unlock();
    state.pick.name = b.textContent;
    Au.say(b.textContent);
    renderChips(); updateChosen(); F.squish($('#name-chosen'));
  });
  $('#name-more').onclick = () => { Au.unlock(); Au.tap('boop'); newNames(); };
  $('#name-own').onclick = () => { Au.unlock(); openLetters(); };
  $('#name-go').onclick = () => { Au.unlock(); startDinner(); };

  /* The child's own name, spelled on a big ABC board */
  let spell = '';
  const spellName = () => spell ? spell[0] + spell.slice(1).toLowerCase() : '';
  $('#keys').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((k, i) =>
    `<button class="key" type="button" data-k="${k}" style="background:${A.light(A.DECOR[i % A.DECOR.length], 0.45)}">${k}</button>`).join('') +
    `<button class="key del" type="button" data-k="del" aria-label="Delete a letter">⌫</button>`;
  function openLetters() { spell = ''; renderSpell(); $('#letters').hidden = false; }
  function renderSpell() {
    $('#spell-text').textContent = spellName() || ' ';
    $('#spell-done').disabled = !spell;
  }
  $('#keys').addEventListener('click', e => {
    const b = e.target.closest('.key');
    if (!b) return;
    Au.unlock();
    if (b.dataset.k === 'del') { spell = spell.slice(0, -1); Au.tap('squish'); }
    else if (spell.length < 12) { spell += b.dataset.k; Au.say(b.dataset.k, { rate: 1.05 }); }
    F.squish(b);
    renderSpell();
  });
  $('#spell-say').onclick = () => { Au.unlock(); if (spell) Au.say(spellName()); };
  $('#spell-cancel').onclick = () => { $('#letters').hidden = true; };
  $('#spell-done').onclick = () => {
    if (!spell) return;
    state.pick.name = spellName();
    $('#letters').hidden = true;
    Au.say(state.pick.name);
    renderChips(); updateChosen(); F.squish($('#name-chosen'));
  };

  /* ---------- 4. Dinner ---------- */
  const prog = $('#ring-prog');
  const CIRC = 2 * Math.PI * 84;
  prog.style.strokeDasharray = CIRC;
  let ringFace = '';
  function setRingFace(kind) {
    if (kind === ringFace) return;
    ringFace = kind;
    $('#ring-face').innerHTML = A.face(0, -2, 1.1, { mouth: kind === 'sleepy' ? 'u' : kind, sleepy: kind === 'sleepy', gap: 10 });
  }

  T.onTick = (left, total) => {
    prog.style.strokeDashoffset = CIRC * (left / total);
    const paused = T.state === 'paused';
    $('#ring-num').textContent = paused ? '⏸' : Math.ceil(left);
    const near = left <= 3 && T.state === 'running';
    $('#ring-wrap').classList.toggle('near', near);
    setRingFace(paused ? 'sleepy' : near ? 'o' : 'u');
  };

  T.onDone = () => {
    prog.style.strokeDashoffset = 0;
    $('#ring-num').textContent = '0';
    $('#ring-wrap').classList.remove('near');
    showBite();
    Au.chime();
    const s = St.data.settings;
    if (s.cue) setTimeout(() => Au.say(`Bite time${s.kid ? ', ' + s.kid : ''}!`), 900);
    clearInterval(state.remindTimer);
    state.remindTimer = setInterval(() => {
      if (!state.waiting) return;
      if (St.data.settings.remind) Au.reminder();
      const b = $('#bite-btn');
      b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle');
    }, FAST ? 6000 : 20000);
  };

  function showBite() {
    const b = $('#bite-btn');
    state.waiting = true;
    b.hidden = false;
    b.classList.remove('show', 'wiggle'); void b.offsetWidth; b.classList.add('show');
    setRingFace('open');
  }
  function hideBite() {
    const b = $('#bite-btn');
    b.hidden = true;
    b.classList.remove('show', 'wiggle');
    state.waiting = false;
    clearInterval(state.remindTimer);
  }

  function setCount(n, bump) {
    $('#bite-count').textContent = n;
    if (bump) F.squish($('#stars'));
  }
  function setPauseLabel() {
    const p = T.state === 'paused';
    $('#pause-btn').textContent = p ? '▶ Resume' : '⏸ Pause';
    $('#ring-wrap').classList.toggle('paused', p);
  }
  function renderDur() {
    $$('#dur-seg button').forEach(b => b.classList.toggle('on', +b.dataset.dur === St.data.settings.dur));
  }

  function startDinner() {
    const homeId = BT.creatures[state.pick.creature].home;
    const last = St.data.book.find(r => r.home === homeId);
    const room = D.newRoom(Object.assign({}, state.pick, { lastMood: last ? last.mood : undefined }));
    St.startRoom(room);
    enterDinner(room, true);
  }

  function enterDinner(room, fresh) {
    state.room = room;
    show('dinner');
    state.svg = Sc.mount($('#stage'), room);
    $('#room-title').textContent = D.title(room);
    setCount(room.bites, false);
    renderDur();
    hideBite();
    BT.wake.on();
    St.persist();
    if (fresh) {
      Au.tap(BT.creatures[room.creature].sound);
      setTimeout(() => {
        const host = state.svg.querySelector('.k-host');
        if (host) { const c = Sc.center(host); F.hearts(c.x, c.y - 10, 5); }
      }, 350);
    }
    T.start(dur());
    setPauseLabel();
  }

  const CHEERS = ["You're amazing", 'Super chomper', 'Yum yum hooray', 'What a great eater', 'Way to go', 'Munch munch magic', 'Bite-tastic', 'Look at you go'];
  function celebrate(n) {
    F.shower();
    Au.jingle();
    const kid = (St.data.settings.kid || '').trim();
    const cheer = CHEERS[Math.max(0, n / 5 - 1) % CHEERS.length];
    F.banner(`${n} bites! ${cheer}${kid ? ', ' + kid : ''}!`);
  }

  let biteLock = false;
  $('#bite-btn').onclick = () => {
    if (biteLock || !state.room) return;
    biteLock = true;
    setTimeout(() => { biteLock = false; }, 700);
    Au.unlock();
    hideBite();
    const room = state.room;
    room.bites++;
    room.lastAt = Date.now();
    const wasFull = D.isFull(room);
    const { item, removed } = D.reward(room);
    if (removed) Sc.remove(state.svg, removed);
    const node = Sc.add(state.svg, room, item);
    Au.pop();
    setTimeout(() => { const c = Sc.center(node); F.burst(c.x, c.y); }, 160);
    setCount(room.bites, true);
    St.save();
    const party = room.bites % 5 === 0;
    if (party) setTimeout(() => celebrate(room.bites), 800);
    if (!wasFull && D.isFull(room)) setTimeout(() => F.banner(`${room.name}'s room is SO cozy! ✨`), party ? 3300 : 900);
    T.start(dur());
    setPauseLabel();
  };

  $('#pause-btn').onclick = () => {
    Au.unlock();
    if (T.state === 'running') T.pause();
    else if (T.state === 'paused') T.resume();
    else if (state.waiting) { hideBite(); T.state = 'paused'; T.left = 0; T.onTick(0, T.dur); }
    setPauseLabel();
  };

  $('#dur-seg').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    St.data.settings.dur = +b.dataset.dur;
    St.save();
    renderDur();
    if (T.state === 'running') T.start(dur());
    else if (T.state === 'paused') { T.dur = dur(); T.left = dur(); T.onTick(T.left, T.dur); }
  });

  // Leaving the app pauses the timer; coming back picks it up again.
  document.addEventListener('visibilitychange', () => {
    if (state.screen !== 'dinner') return;
    if (document.hidden) { if (T.pause()) state.autoPaused = true; }
    else if (state.autoPaused) { state.autoPaused = false; T.resume(); }
    setPauseLabel();
  });

  /* ---------- 5. All done ---------- */
  $('#all-done').onclick = async () => {
    Au.unlock();
    const room = state.room;
    if (!room) return;
    const wasRunning = T.pause();
    setPauseLabel();
    if (room.bites === 0) {
      const leave = await ask('No bites yet! Leave dinner anyway?', [{ label: '🍽️ Keep eating', value: false }, { label: 'Leave', value: true }]);
      if (!leave) { if (wasRunning) T.resume(); setPauseLabel(); return; }
      endDinner(true);
      return;
    }
    const yes = await ask('All done eating?', [{ label: '🎉 Yes, all done!', value: true }, { label: '🍽️ Keep eating', value: false }], creatureSVG(room.creature, room.color));
    if (!yes) { if (wasRunning) T.resume(); setPauseLabel(); return; }
    endDinner(false);
  };

  function endDinner(discard) {
    T.stop(); hideBite(); BT.wake.off();
    const room = state.room;
    state.room = null;
    if (discard) { St.data.current = null; St.save(); goWho(true); return; }
    const host = room.items.find(i => i.t === 'host');
    if (host) { host.sleepy = true; Sc.redraw(state.svg, room, host); }
    Au.tap('yawn');
    setTimeout(() => { F.shower(); Au.jingle(); }, 600);
    St.finishCurrent();
    setTimeout(() => showDone(room), 1800);
  }

  function showDone(room) {
    state.doneRoom = room;
    show('done');
    $('#done-title').textContent = `${room.name} had a cozy dinner!`;
    Sc.mount($('#done-stage'), room);
    $('#done-stars').textContent = `⭐ ${room.bites} bite${room.bites === 1 ? '' : 's'}`;
  }
  $('#done-book').onclick = () => { Au.unlock(); goBook(); };
  $('#done-home').onclick = () => { Au.unlock(); goWho(true); };

  /* ---------- 6. My Rooms book ---------- */
  const thumbs = new Map();
  let io = null;
  function loadThumb(img) {
    const id = img.dataset.id;
    if (!thumbs.has(id)) {
      const r = St.data.book.find(x => x.id === id);
      if (r) thumbs.set(id, Sc.dataURL(r));
    }
    if (thumbs.has(id)) img.src = thumbs.get(id);
  }
  function goBook() {
    show('book');
    const book = St.data.book;
    $('#book-empty').hidden = book.length > 0;
    $('#book-grid').innerHTML = book.map(r =>
      `<button class="bcard" type="button" data-id="${r.id}"><img alt="" data-id="${r.id}">` +
      `<b>${U.esc(D.title(r))}</b><small>${U.dateLabel(r.startedAt)} · ⭐ ${r.bites}</small></button>`).join('');
    if (io) io.disconnect();
    io = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { loadThumb(en.target); io.unobserve(en.target); } }), { rootMargin: '300px' })
      : null;
    $$('#book-grid img').forEach(img => io ? io.observe(img) : loadThumb(img));
  }
  $('#book-grid').addEventListener('click', e => {
    const c = e.target.closest('.bcard');
    if (c) { Au.unlock(); visit(c.dataset.id); }
  });

  /* ---------- 7. Visiting a saved room ---------- */
  function visit(id) {
    const r = St.data.book.find(x => x.id === id);
    if (!r) return;
    state.visiting = r;
    show('visit');
    $('#visit-title').textContent = D.title(r);
    Sc.mount($('#visit-stage'), r);
    $('#visit-meta').textContent = `${U.dateLabel(r.startedAt)} · ⭐ ${r.bites} bite${r.bites === 1 ? '' : 's'}`;
    Au.tap(BT.creatures[r.creature] ? BT.creatures[r.creature].sound : 'chime');
  }

  /* ---------- tapping things in a room ---------- */
  function roomTap(e, getRoom) {
    const t = e.target.closest('.item, .furn');
    if (!t) return;
    Au.unlock();
    const tw = t.querySelector('.tw');
    if (tw) { tw.classList.remove('squish'); void tw.getBoundingClientRect(); tw.classList.add('squish'); }
    F.hearts(e.clientX, e.clientY, 3 + Math.floor(Math.random() * 3));
    let sound = t.dataset.sound || 'chime';
    if (t.classList.contains('item')) {
      const room = getRoom();
      const it = room && room.items.find(i => i.k === t.dataset.k);
      if (it) sound = it.t === 'decor' ? (BT.decor[it.id] || {}).sound : (BT.creatures[it.id] || {}).sound;
    }
    Au.tap(sound || 'chime');
  }
  $('#stage').addEventListener('pointerdown', e => roomTap(e, () => state.room));
  $('#visit-stage').addEventListener('pointerdown', e => roomTap(e, () => state.visiting));
  $('#done-stage').addEventListener('pointerdown', e => roomTap(e, () => state.doneRoom));

  /* ---------- navigation buttons ---------- */
  $$('[data-go]').forEach(b => b.addEventListener('click', () => {
    Au.unlock();
    const to = b.dataset.go;
    if (to === 'who') goWho(state.screen === 'book');
    else if (to === 'color') goColor();
    else if (to === 'book') goBook();
  }));

  /* ---------- grown-up settings (press and hold the gear) ---------- */
  $$('[data-gear]').forEach(g => {
    let timer = 0, opened = false;
    const cancel = () => { clearTimeout(timer); g.classList.remove('holding'); };
    g.addEventListener('pointerdown', e => {
      e.preventDefault();
      opened = false;
      g.classList.add('holding');
      timer = setTimeout(() => { opened = true; cancel(); openGrown(); }, 650);
    });
    g.addEventListener('pointerup', () => { cancel(); if (!opened) toast('Grown-ups: press and hold ⚙️'); });
    g.addEventListener('pointerleave', cancel);
    g.addEventListener('pointercancel', cancel);
    g.addEventListener('contextmenu', e => e.preventDefault());
  });

  function openGrown() {
    const s = St.data.settings;
    $('#g-kid').value = s.kid || '';
    $('#g-sound').checked = !s.mute;
    $('#g-remind').checked = !!s.remind;
    $('#g-cue').checked = !!s.cue;
    $('#g-count').textContent = St.data.book.length;
    $('#g-rooms').hidden = true;
    $('#g-installed').textContent = isStandalone() ? '✓ Installed on this device.' : '';
    $('#grown').hidden = false;
    if (state.screen === 'dinner' && T.pause()) { state.grownPaused = true; setPauseLabel(); }
  }
  function closeGrown() {
    const s = St.data.settings;
    s.kid = $('#g-kid').value.trim().slice(0, 20);
    s.mute = !$('#g-sound').checked;
    s.remind = $('#g-remind').checked;
    s.cue = $('#g-cue').checked;
    Au.muted = s.mute;
    St.save();
    $('#grown').hidden = true;
    if (state.grownPaused) { state.grownPaused = false; T.resume(); setPauseLabel(); }
  }
  $('#g-close').onclick = closeGrown;

  function renderManage() {
    $('#g-rooms').innerHTML = St.data.book.length
      ? St.data.book.map(r => `<div class="g-room"><span>${U.esc(D.title(r))}<br><small>${U.dateLabel(r.startedAt)} · ⭐ ${r.bites}</small></span><button class="gbtn" type="button" data-del="${r.id}">🗑 Delete</button></div>`).join('')
      : '<p class="small">No rooms yet.</p>';
  }
  $('#g-manage').onclick = () => { const box = $('#g-rooms'); box.hidden = !box.hidden; if (!box.hidden) renderManage(); };
  $('#g-rooms').addEventListener('click', async e => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    const r = St.data.book.find(x => x.id === b.dataset.del);
    if (!r) return;
    $('#grown').hidden = true;
    const ok = await ask(`Delete "${D.title(r)}" from My Rooms? This can't be undone.`, [{ label: 'Keep it', value: false }, { label: '🗑 Delete', value: true }]);
    $('#grown').hidden = false;
    if (!ok) return;
    St.deleteRoom(r.id);
    thumbs.delete(r.id);
    $('#g-count').textContent = St.data.book.length;
    renderManage();
    toast('Deleted.');
  });

  $('#g-export').onclick = async () => {
    const text = St.exportText();
    const name = `bite-timer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([text], name, { type: 'application/json' });
    const touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    try {
      if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Bite Timer backup' });
        return;
      }
    } catch (err) { if (err && err.name === 'AbortError') return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    toast('Backup saved.');
  };
  $('#g-import').onclick = () => $('#g-file').click();
  $('#g-file').onchange = async () => {
    const f = $('#g-file').files[0];
    if (!f) return;
    try {
      const n = St.importText(await f.text());
      toast(n ? `Added ${n} room${n === 1 ? '' : 's'} to My Rooms.` : 'Those rooms are already here.');
      $('#g-count').textContent = St.data.book.length;
    } catch (err) { toast(err.message || 'That file did not work.'); }
    $('#g-file').value = '';
  };

  /* ---------- start-up ---------- */
  function boot() {
    St.load();
    Au.muted = !!St.data.settings.mute;
    BT.checkContent();
    goWho(true);
    document.addEventListener('pointerdown', () => Au.unlock(), { capture: true });

    const cur = St.checkCurrent();
    if (cur && BT.homes[cur.home] && BT.creatures[cur.creature]) {
      ask(`Keep going with ${D.title(cur)}?`, [{ label: '▶ Keep going', value: true }, { label: '✨ New dinner', value: false }], creatureSVG(cur.creature, cur.color))
        .then(keep => {
          Au.unlock();
          if (keep) enterDinner(cur, false);
          else { St.finishCurrent(); goWho(true); }
        });
    }

    if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !U.flag('nosw')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  // Exposed for testing in the browser console.
  BT.app = { state, show, startDinner, enterDinner, celebrate, goBook, visit, ask };
  boot();
})(window.BT);
