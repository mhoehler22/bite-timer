/* Bite Timer: screens and wiring.
   Who's eating (pick a child) -> who's coming -> what color -> what name -> dinner -> all done -> the child's book. */
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
  const dur = () => FAST ? 3 : ((St.kid() || {}).dur || 15);
  const kidName = () => ((St.kid() || {}).name || '').trim();
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

  // A creature talks in its own babble voice. If grown-ups turned babble off, it makes its usual sound instead.
  const talk = (id, mood, n, vol, fallback = true) => {
    const cr = BT.creatures[id];
    if (!cr) return;
    if (Au.babbleOn) Au.babble(cr.voice, { mood, n, vol });
    else if (fallback) Au.tap(cr.sound);
  };
  const hostId = () => state.room && state.room.creature;

  /* ---------- 0. Who's eating? (each child has their own rooms) ---------- */
  function goKids() {
    show('kids');
    const kids = St.kids();
    $('#kid-cards').innerHTML = kids.map(k => {
      const av = St.avatar(k);
      const n = k.book.length;
      return `<button class="kid" type="button" data-id="${k.id}" style="background:${A.light(A.color(k.color), 0.62)}">` +
        creatureSVG(av.creature, av.color) + `<b>${U.esc(k.name)}</b>` +
        `<small>${St.hasOpenDinner(k) ? '🍽️ dinner waiting!' : '⭐ ' + n + ' room' + (n === 1 ? '' : 's')}</small></button>`;
    }).join('') + `<button class="kid add" type="button" id="kid-add"><span class="plus">＋</span><b>Add a child</b></button>`;
    $('#kids-hint').textContent = kids.length ? 'Tap your name!' : 'Grown-ups: tap ＋ to add each child who uses Bite Timer';
  }
  $('#kid-cards').addEventListener('click', e => {
    const c = e.target.closest('.kid');
    if (!c) return;
    Au.unlock();
    if (c.id === 'kid-add') { openAddKid('kids'); return; }
    const k = St.setActive(c.dataset.id);
    if (!k) return;
    F.squish(c);
    talk(St.avatar(k).creature, 'hello', 3);
    state.whoSet = [];
    setTimeout(enterKid, 280);
  });
  // After picking a child: offer to finish their open dinner, otherwise on to "Who's coming to dinner?"
  function enterKid() {
    goWho(true);
    const cur = St.checkCurrent();
    if (cur && BT.homes[cur.home] && BT.creatures[cur.creature]) {
      ask(`Keep going with ${D.title(cur)}?`, [{ label: '▶ Keep going', value: true }, { label: '✨ New dinner', value: false }], creatureSVG(cur.creature, cur.color))
        .then(keep => {
          Au.unlock();
          if (keep) enterDinner(cur, false);
          else { St.finishCurrent(); goWho(true); }
        });
    }
  }

  /* Add a child (from the "Who's eating?" screen or the grown-up panel) */
  let akColor = 'pink', akFrom = 'kids';
  function renderAkColors() {
    $('#ak-colors').innerHTML = A.COLORS.map(c => `<button class="sw${c.id === akColor ? ' on' : ''}" type="button" data-c="${c.id}" style="background:${c.hex}" aria-label="${c.label}"></button>`).join('');
    $('#ak-preview').innerHTML = creatureSVG('sloth', akColor);
  }
  function openAddKid(from) {
    akFrom = from;
    const used = St.kids().map(k => k.color);
    const free = A.COLORS.filter(c => !used.includes(c.id));
    akColor = (free.length ? U.pick(free) : U.pick(A.COLORS)).id;
    $('#ak-name').value = '';
    $('#ak-add').disabled = true;
    renderAkColors();
    if (from === 'grown') $('#grown').hidden = true;
    $('#addkid').hidden = false;
    setTimeout(() => $('#ak-name').focus(), 60);
  }
  function closeAddKid() {
    $('#addkid').hidden = true;
    if (akFrom === 'grown') { renderKidsList(); $('#grown').hidden = false; }
  }
  $('#ak-colors').addEventListener('click', e => {
    const b = e.target.closest('.sw');
    if (!b) return;
    akColor = b.dataset.c;
    renderAkColors();
    F.squish($('#ak-preview'));
  });
  $('#ak-name').addEventListener('input', () => { $('#ak-add').disabled = !$('#ak-name').value.trim(); });
  $('#ak-name').addEventListener('keydown', e => { if (e.key === 'Enter' && !$('#ak-add').disabled) $('#ak-add').click(); });
  $('#ak-cancel').onclick = closeAddKid;
  $('#ak-add').onclick = () => {
    const name = $('#ak-name').value.trim();
    if (!name) return;
    const k = St.addKid(name, akColor);
    closeAddKid();
    toast(`Added ${k.name}!`);
    if (state.screen === 'kids') goKids();
  };

  /* ---------- 1. Who's coming to dinner? ---------- */
  function pickFour(avoid = []) {
    const all = Object.keys(BT.creatures);
    const recent = St.kid() ? St.kid().recent : [];
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
    const k = St.kid();
    if (!k) { goKids(); return; }
    $('#who-kid').textContent = `👤 ${k.name}`;
    if (reroll || !state.whoSet.length) renderWho();
    show('who');
  }

  $('#who-cards').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (!c) return;
    const cr = BT.creatures[c.dataset.id];
    Au.unlock(); talk(cr.id, 'hello'); F.squish(c);
    state.pick = { creature: cr.id, color: cr.color, name: null };
    setTimeout(goColor, 260);
  });
  $('#who-shuffle').onclick = () => { Au.unlock(); Au.tap('sparkle'); renderWho(state.whoSet); };
  $('#who-book').onclick = () => { Au.unlock(); goBook(); };
  $('#who-kid').onclick = () => { Au.unlock(); Au.tap('boop'); goKids(); };

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
    Au.unlock();
    if (Au.babbleOn) talk(state.pick.creature, 'happy', 2); else Au.note(+b.dataset.i);
    state.pick.color = b.dataset.c;
    renderColor(true);
  });
  $('#color-surprise').onclick = () => {
    Au.unlock(); Au.tap('sparkle');
    setTimeout(() => talk(state.pick.creature, 'excited', 3, 0.3, false), 300);
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
    Au.say(b.textContent, { onend: () => talk(state.pick.creature, 'happy', 2, 0.25, false) });
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
    Au.say(state.pick.name, { onend: () => talk(state.pick.creature, 'excited', 3, 0.3, false) });
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
    setTimeout(() => talk(hostId(), 'excited', 3, 0.3, false), 800);
    const who = kidName();
    if (s.cue) setTimeout(() => Au.say(`Bite time${who ? ', ' + who : ''}!`), Au.babbleOn ? 1700 : 900);
    clearInterval(state.remindTimer);
    state.remindTimer = setInterval(() => {
      if (!state.waiting) return;
      if (St.data.settings.remind) { Au.reminder(); setTimeout(() => talk(hostId(), 'question', 2, 0.22, false), 500); }
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
    const d = (St.kid() || {}).dur || 15;
    $$('#dur-seg button').forEach(b => b.classList.toggle('on', +b.dataset.dur === d));
  }

  function startDinner() {
    const homeId = BT.creatures[state.pick.creature].home;
    const last = St.book().find(r => r.home === homeId);
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
      talk(room.creature, 'hello', 4);
      setTimeout(() => {
        const host = state.svg.querySelector('.k-host');
        if (host) { const c = Sc.center(host); F.hearts(c.x, c.y - 10, 5); }
      }, 350);
    }
    else talk(room.creature, 'happy', 3);
    T.start(dur());
    setPauseLabel();
  }

  const CHEERS = ["You're amazing", 'Super chomper', 'Yum yum hooray', 'What a great eater', 'Way to go', 'Munch munch magic', 'Bite-tastic', 'Look at you go'];
  function celebrate(n) {
    F.shower();
    Au.jingle();
    setTimeout(() => talk(hostId(), 'excited', 5, 0.3, false), 600);
    const kid = kidName();
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
    if (item.t === 'pet') setTimeout(() => talk(item.id, 'hello', 3, 0.28, false), 450);
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
    const k = St.kid();
    if (k) k.dur = +b.dataset.dur;
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
    if (discard) { St.dropCurrent(); goWho(true); return; }
    const host = room.items.find(i => i.t === 'host');
    if (host) { host.sleepy = true; Sc.redraw(state.svg, room, host); }
    Au.tap('yawn');
    setTimeout(() => talk(room.creature, 'sleepy', 4, 0.28, false), 950);
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
      const r = St.book().find(x => x.id === id);
      if (r) thumbs.set(id, Sc.dataURL(r));
    }
    if (thumbs.has(id)) img.src = thumbs.get(id);
  }
  function goBook() {
    show('book');
    const book = St.book();
    const k = St.kid();
    $('#book-title').textContent = k ? `${k.name}'s Rooms 📖` : 'My Rooms 📖';
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
    const r = St.book().find(x => x.id === id);
    if (!r) return;
    state.visiting = r;
    show('visit');
    $('#visit-title').textContent = D.title(r);
    Sc.mount($('#visit-stage'), r);
    $('#visit-meta').textContent = `${U.dateLabel(r.startedAt)} · ⭐ ${r.bites} bite${r.bites === 1 ? '' : 's'}`;
    talk(r.creature, 'hello', 3);
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
      if (it && it.t !== 'decor' && Au.babbleOn && Math.random() < 0.65) { talk(it.id, it.sleepy ? 'sleepy' : 'happy', 2 + Math.floor(Math.random() * 3)); return; }
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
    $('#g-sound').checked = !s.mute;
    $('#g-remind').checked = !!s.remind;
    $('#g-cue').checked = !!s.cue;
    $('#g-babble').checked = s.babble !== false;
    $('#g-pitch').value = s.pitch || 1.1;
    renderVoices();
    renderKidsList();
    $('#g-rooms').hidden = true;
    $('#g-installed').textContent = isStandalone() ? '✓ Installed on this device.' : '';
    $('#grown').hidden = false;
    if (state.screen === 'dinner' && T.pause()) { state.grownPaused = true; setPauseLabel(); }
  }
  function closeGrown() {
    const s = St.data.settings;
    s.mute = !$('#g-sound').checked;
    s.remind = $('#g-remind').checked;
    s.cue = $('#g-cue').checked;
    s.babble = $('#g-babble').checked;
    s.voice = $('#g-voice').value;
    s.pitch = +$('#g-pitch').value || 1.1;
    applyVoice();
    Au.muted = s.mute;
    St.save();
    $$('#g-kids .g-kid').forEach(row => St.renameKid(row.dataset.id, row.querySelector('input').value));
    $('#grown').hidden = true;
    if (state.grownPaused) { state.grownPaused = false; T.resume(); setPauseLabel(); }
    // Children may have been added, renamed or removed: refresh what's on screen.
    if (state.screen === 'kids') goKids();
    else if (state.screen !== 'dinner' && !St.kid()) goKids();
    else if (state.screen === 'who') goWho(false);
    else if (state.screen === 'book') goBook();
  }

  function renderKidsList() {
    const kids = St.kids();
    $('#g-kids').innerHTML = kids.length
      ? kids.map(k => `<div class="g-kid" data-id="${k.id}"><span class="dot" style="background:${A.color(k.color)}"></span>` +
        `<input value="${U.esc(k.name)}" maxlength="20" autocomplete="off" aria-label="Name"><small>⭐ ${k.book.length}</small>` +
        `<button class="gbtn" type="button" data-delkid="${k.id}" aria-label="Delete ${U.esc(k.name)}">🗑</button></div>`).join('')
      : '<p class="small">No children yet.</p>';
    const k = St.kid();
    $('#g-rooms-label').textContent = k ? `${k.name}'s rooms: ${k.book.length}` : 'Rooms';
    $('#g-manage').disabled = !k;
  }
  $('#g-kids').addEventListener('change', e => {
    const row = e.target.closest('.g-kid');
    if (row && e.target.matches('input')) { St.renameKid(row.dataset.id, e.target.value); renderKidsList(); }
  });
  $('#g-kids').addEventListener('click', async e => {
    const b = e.target.closest('[data-delkid]');
    if (!b) return;
    const k = St.kids().find(x => x.id === b.dataset.delkid);
    if (!k) return;
    if (state.room && k.id === St.data.active) { toast('Finish dinner first.'); return; }
    $('#grown').hidden = true;
    const n = k.book.length;
    const ok = await ask(`Delete ${k.name}${n ? ` and all ${n} of their rooms` : ''}? This can't be undone.`, [{ label: 'Keep', value: false }, { label: '🗑 Delete', value: true }]);
    $('#grown').hidden = false;
    if (!ok) return;
    St.removeKid(k.id);
    renderKidsList();
    toast('Deleted.');
  });
  $('#g-addkid').onclick = () => openAddKid('grown');
  $('#g-close').onclick = closeGrown;

  function applyVoice() {
    const s = St.data.settings;
    Au.babbleOn = s.babble !== false;
    Au.voiceURI = s.voice || '';
    Au.pitch = s.pitch || 1.1;
  }
  function renderVoices() {
    const sel = $('#g-voice');
    const list = Au.voices();
    const cur = St.data.settings.voice || '';
    if (!list.length) { sel.innerHTML = '<option value="">No voices found on this device</option>'; return; }
    sel.innerHTML = `<option value="">Automatic (${U.esc(list[0].name)})</option>` +
      list.map(v => `<option value="${U.esc(v.voiceURI)}"${v.voiceURI === cur ? ' selected' : ''}>${Au.voiceScore(v) >= 6 ? '⭐ ' : ''}${U.esc(v.name)} (${U.esc(v.lang)})</option>`).join('');
  }
  if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', () => { if (!$('#grown').hidden) renderVoices(); });
  // Sound check: play the chime, listen to the app's own output, and say what's going on.
  $('#g-soundcheck').onclick = () => {
    Au.unlock();
    const msg = $('#g-soundmsg');
    msg.hidden = false;
    if (!$('#g-sound').checked) { msg.textContent = 'Sounds are switched off. Tick "Sounds" above, then try again.'; return; }
    const wasMuted = Au.muted;
    Au.muted = false;
    Au.chime();
    msg.textContent = 'Listening…';
    let peak = 0;
    const t0 = performance.now();
    const listen = () => {
      peak = Math.max(peak, Au.level());
      if (performance.now() - t0 < 1500) { requestAnimationFrame(listen); return; }
      Au.muted = wasMuted;
      const st = Au.state();
      msg.textContent = st === 'unsupported' ? "This browser can't play the app's sounds."
        : peak > 0.003 ? "✓ The app is playing sound. If you can't hear the chime, turn up this device's volume and make sure it isn't muted."
          : st !== 'running' ? 'The browser is holding sound back. Tap anywhere on the screen, then try the sound check again.'
            : 'No sound came out. Close the app completely, reopen it, and try again.';
    };
    requestAnimationFrame(listen);
  };

  $('#g-test').onclick = () => {
    Au.unlock();
    const prev = [Au.voiceURI, Au.pitch];
    Au.voiceURI = $('#g-voice').value;
    Au.pitch = +$('#g-pitch').value || 1.1;
    const kid = kidName();
    Au.say(`Bite time${kid ? ', ' + kid : ''}! Mochi, Sprinkles, Pudding.`);
    [Au.voiceURI, Au.pitch] = prev;
  };

  function renderManage() {
    $('#g-rooms').innerHTML = St.book().length
      ? St.book().map(r => `<div class="g-room"><span>${U.esc(D.title(r))}<br><small>${U.dateLabel(r.startedAt)} · ⭐ ${r.bites}</small></span><button class="gbtn" type="button" data-del="${r.id}">🗑 Delete</button></div>`).join('')
      : '<p class="small">No rooms yet.</p>';
  }
  $('#g-manage').onclick = () => { const box = $('#g-rooms'); box.hidden = !box.hidden; if (!box.hidden) renderManage(); };
  $('#g-rooms').addEventListener('click', async e => {
    const b = e.target.closest('[data-del]');
    if (!b) return;
    const r = St.book().find(x => x.id === b.dataset.del);
    if (!r) return;
    $('#grown').hidden = true;
    const ok = await ask(`Delete "${D.title(r)}" from My Rooms? This can't be undone.`, [{ label: 'Keep it', value: false }, { label: '🗑 Delete', value: true }]);
    $('#grown').hidden = false;
    if (!ok) return;
    St.deleteRoom(r.id);
    thumbs.delete(r.id);
    renderKidsList();
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
      const { rooms, kids } = St.importText(await f.text());
      toast(rooms || kids
        ? `Added ${rooms} room${rooms === 1 ? '' : 's'}${kids ? ` and ${kids} child${kids === 1 ? '' : 'ren'}` : ''}.`
        : 'Those rooms are already here.');
      renderKidsList();
    } catch (err) { toast(err.message || 'That file did not work.'); }
    $('#g-file').value = '';
  };

  /* ---------- start-up ---------- */
  function boot() {
    St.load();
    Au.muted = !!St.data.settings.mute;
    applyVoice();
    BT.checkContent();
    St.fileStale();
    goKids();
    document.addEventListener('pointerdown', () => Au.unlock(), { capture: true });

    if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !U.flag('nosw')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  // Exposed for testing in the browser console.
  BT.app = { state, show, goKids, goWho, startDinner, enterDinner, celebrate, goBook, visit, ask, openAddKid };
  boot();
})(window.BT);
