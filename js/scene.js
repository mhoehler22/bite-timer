/* Bite Timer: draws a room (backdrop + everything in it) from its saved data.
   Used live at dinner, when visiting the book, and to make book thumbnails. */
(function (BT) {
  const A = BT.art, n = A.n;
  const S = BT.scene = {};
  const NS = 'http://www.w3.org/2000/svg';
  const LAYER = { wall: 1, hang: 2, air: 3, shelf: 4, floor: 5 };

  S.z = it => (LAYER[it.a] || 5) * 1000 + it.y;

  // A decoration's drawing, shifted so its origin matches the spot it sits in.
  function decorArt(it) {
    const d = BT.decor[it.id];
    if (!d) return '';
    let art = d.draw(A.pack(it.c, it.c2));
    const nat = d.origin, h = d.h;
    const want = it.a === 'hang' ? 'top' : (it.a === 'wall' || it.a === 'air') ? 'center' : 'bottom';
    if (nat === want) return art;
    if (want === 'top') {
      const len = d.hangLen || 12;
      const dy = len + (nat === 'center' ? h / 2 : h);
      return A.line(`M0,0 V${len + 2}`, 2) + `<g transform="translate(0 ${n(dy)})">${art}</g>`;
    }
    if (want === 'bottom') return `<g transform="translate(0 ${n(nat === 'center' ? -h / 2 : -h)})">${art}</g>`;
    return `<g transform="translate(0 ${n(nat === 'bottom' ? h / 2 : -h / 2)})">${art}</g>`;
  }

  function creatureArt(it, home) {
    const cr = BT.creatures[it.id];
    if (!cr) return '';
    const pose = cr.poses[it.pose] || cr.poses.sit;
    const p = A.pack(A.color(it.c), it.c2);
    p.sleepy = !!it.sleepy;
    let art = pose.draw(p);
    if (home && home.petWrap === 'bubble' && it.t === 'pet' && it.a !== 'hang') {
      art = `<circle cx="0" cy="-46" r="56" fill="#fff" fill-opacity=".2"/>` + art +
        `<circle cx="0" cy="-46" r="56" fill="none" stroke="#fff" stroke-width="3.5" stroke-opacity=".9"/>` +
        A.line('M-36,-80 q14,-14 32,-16', 5, '#fff', 'opacity=".8"');
    }
    return art;
  }

  S.art = (it, home) => it.t === 'decor' ? decorArt(it) : creatureArt(it, home);

  S.itemMarkup = (it, home) => {
    const f = it.f === -1 ? -1 : 1;
    const motion = it.a === 'hang' ? 'sway' : it.a === 'air' ? 'float' : it.t === 'decor' ? 'rest' : 'breathe';
    const delay = -((parseInt(String(it.k).slice(-3), 36) || 0) % 30) / 10;
    return `<g class="item a-${it.a} k-${it.t}" data-k="${it.k}" transform="translate(${n(it.x)} ${n(it.y)}) scale(${n(it.s * f)} ${n(it.s)})">` +
      `<g class="pop"><g class="idle ${motion}" style="animation-delay:${delay}s"><g class="tw">${S.art(it, home)}</g></g></g></g>`;
  };

  // The whole room as an SVG string.
  S.svg = (room, opts = {}) => {
    const home = BT.homes[room.home];
    if (!home) return '<svg viewBox="0 0 400 400"></svg>';
    const mood = home.moods[(room.mood || 0) % home.moods.length];
    const items = room.items.slice().sort((a, b) => S.z(a) - S.z(b));
    const back = home.draw(mood, BT.util.rng(room.seed || 1));
    const cls = 'room' + (opts.still ? ' still' : '');
    return `<svg class="${cls}" xmlns="${NS}" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">` +
      `<g class="back">${back}</g><g class="items">${items.map(it => S.itemMarkup(it, home)).join('')}</g></svg>`;
  };

  S.mount = (el, room, opts) => {
    el.innerHTML = S.svg(room, opts);
    return el.firstElementChild;
  };

  // Add one new item to a room already on screen, in the right front-to-back order.
  S.add = (svg, room, it, animate = true) => {
    const home = BT.homes[room.home];
    const holder = document.createElementNS(NS, 'svg');
    holder.innerHTML = S.itemMarkup(it, home);
    const node = holder.firstElementChild;
    const layer = svg.querySelector('.items');
    const z = S.z(it);
    const before = [...layer.children].find(c => {
      const other = room.items.find(o => o.k === c.dataset.k);
      return other && S.z(other) > z;
    });
    layer.insertBefore(node, before || null);
    if (animate) {
      node.classList.add('popping');
      setTimeout(() => node.classList.remove('popping'), 900);
    }
    return node;
  };

  // Something floats away (used when the air gets too full).
  S.remove = (svg, it) => {
    const node = svg.querySelector(`[data-k="${it.k}"]`);
    if (!node) return;
    node.classList.add('leaving');
    setTimeout(() => node.remove(), 1200);
  };

  // Re-draw one item in place (e.g. the host falling asleep at the end of dinner).
  S.redraw = (svg, room, it) => {
    const node = svg.querySelector(`[data-k="${it.k}"]`);
    if (!node) return;
    const holder = document.createElementNS(NS, 'svg');
    holder.innerHTML = S.itemMarkup(it, BT.homes[room.home]);
    node.replaceWith(holder.firstElementChild);
  };

  // A standalone picture of the room, for the book's thumbnails (cheap for the phone to show many).
  S.dataURL = room => {
    const { out, defs } = A.collect(() => S.svg(room, { still: true }));
    const svg = out.replace('preserveAspectRatio="xMidYMid meet">', `preserveAspectRatio="xMidYMid meet"><defs>${defs}</defs>`);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  // Screen position of an item, for sparkles and hearts.
  S.center = node => {
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
})(window.BT);
