/* Bite Timer: making rooms and choosing each bite's reward. */
(function (BT) {
  const A = BT.art, U = BT.util;
  const D = BT.decorator = {};

  D.PET_CHANCE = 0.35;        // share of rewards that are visiting friends
  D.BIG_WEIGHT = 1.3;         // furniture's extra chance when an ordinary decoration is picked
  D.FURNITURE_EVERY = 2;      // pacing: furniture at least every this-many bites while there's floor room
  D.DECOR_SIZE = 1.3;         // decorations drawn bigger than their spot's base size, for little fingers on a phone
  D.AIR_MAX = 40;             // once spots are full, floaty things fill the air up to this many
  D.SLOTH_ODDS = [0, 0.35, 0.6, 1]; // chance of a visiting sloth on bite 1, 2, 3 (the sloth guarantee from the original design)

  // Pick a color mood for the home that doesn't swallow the creature's own color.
  D.pickMood = (home, colorHex, avoid, r = Math.random) => {
    const keys = home.contrast || ['wall', 'floor'];
    const scored = home.moods.map((m, i) => ({ i, d: Math.min(...keys.map(k => A.dist(colorHex, m[k]))) }));
    let pool = scored.filter(s => s.d > 40 && s.i !== avoid);
    if (!pool.length) pool = scored.filter(s => s.d > 40);
    if (!pool.length) pool = [scored.sort((a, b) => b.d - a.d)[0]];
    return U.pick(pool, r).i;
  };

  // A fresh room for tonight: the host creature at home, nothing else yet.
  D.newRoom = ({ creature, color, name, mood, lastMood }) => {
    const cr = BT.creatures[creature];
    const home = BT.homes[cr.home];
    const hex = A.color(color);
    const m = mood != null ? mood : D.pickMood(home, hex, lastMood);
    const hs = home.host;
    const pose = cr.poses[hs.pose] ? hs.pose : 'sit';
    const host = {
      k: U.uid(), t: 'host', id: creature, pose, c: color, c2: A.accentFor(hex),
      a: cr.poses[pose].anchors.includes(hs.a) ? hs.a : cr.poses[pose].anchors[0],
      x: hs.x, y: hs.y, s: hs.s, f: 1, slot: -1
    };
    return {
      id: U.uid(), v: 1, creature, color, name, home: home.id, mood: m,
      seed: Math.floor(Math.random() * 1e9), startedAt: Date.now(), lastAt: Date.now(),
      bites: 0, slothSeen: creature === 'sloth', items: [host]
    };
  };

  D.title = room => {
    const home = BT.homes[room.home];
    return home ? (home.title ? home.title(room.name) : `${room.name}'s ${home.label}`) : room.name;
  };

  const freeSlots = (room, home) => {
    const used = new Set(room.items.filter(i => i.slot >= 0).map(i => i.slot));
    return home.slots.map((s, i) => i).filter(i => !used.has(i));
  };

  function petFor(id, anchorsFree, r) {
    const cr = BT.creatures[id];
    if (!cr) return null;
    const poses = Object.entries(cr.poses).filter(([, p]) => p.anchors.some(a => anchorsFree.has(a)));
    if (!poses.length) return null;
    const [pose, def] = U.pick(poses, r);
    const col = U.pick(A.COLORS, r);
    return { t: 'pet', id, pose, anchors: def.anchors, c: col.id, c2: A.accentFor(col.hex), scale: def.scale || 0.8 };
  }

  const isFurniture = d => !!d && d.anchors.includes('big');

  function decorFor(home, anchorsFree, room, r, onlyFurniture) {
    const counts = {};
    room.items.forEach(i => { if (i.t === 'decor') counts[i.id] = (counts[i.id] || 0) + 1; });
    const list = BT.decorFor(home.id).filter(d => d.anchors.some(a => anchorsFree.has(a)) && (!onlyFurniture || isFurniture(d)));
    if (!list.length) return null;
    const d = U.weighted(list, d => (isFurniture(d) ? D.BIG_WEIGHT : d.homes ? 2.2 : 1) * Math.pow(isFurniture(d) ? 0.12 : 0.35, counts[d.id] || 0), r);
    const c = U.pick(A.DECOR, r);
    return { t: 'decor', id: d.id, anchors: d.anchors, c, c2: A.accentFor(c, U.pick(A.DECOR, r)), scale: d.scale * D.DECOR_SIZE };
  }

  // Choose and place tonight's next reward. Mutates the room; returns { item, removed }.
  D.reward = (room, r = Math.random) => {
    const home = BT.homes[room.home];
    const free = freeSlots(room, home);
    let it = null, removed = null;

    if (free.length) {
      const anchorsFree = new Set(free.map(i => home.slots[i].a));
      const b = room.bites;
      const slothOdds = D.SLOTH_ODDS[Math.min(b, D.SLOTH_ODDS.length - 1)];
      if (!room.slothSeen && b >= 1 && r() < slothOdds) it = petFor('sloth', anchorsFree, r);
      // Furniture pacing: furniture goes in the big spots first, then on the floor. If FURNITURE_EVERY bites
      // go by without any, this bite brings a piece (so a room gathers several pieces over a dinner).
      if (!it && b - (room.lastFurniture || 0) >= D.FURNITURE_EVERY && (anchorsFree.has('big') || anchorsFree.has('floor'))) it = decorFor(home, anchorsFree, room, r, true);
      if (!it && r() < D.PET_CHANCE) it = petFor(U.pick(Object.keys(BT.creatures), r), anchorsFree, r);
      if (!it) it = decorFor(home, anchorsFree, room, r);
      if (it) {
        let fits = free.filter(i => it.anchors.includes(home.slots[i].a));
        const bigFits = fits.filter(i => home.slots[i].a === 'big');
        if (bigFits.length) fits = bigFits; // furniture takes the big spots first
        if (!isFurniture(BT.decor[it.id])) {
          // Pets and small things usually choose shelves, keeping the floor open for furniture.
          const offFloor = fits.filter(i => home.slots[i].a !== 'floor');
          if (offFloor.length && r() < 0.85) fits = offFloor;
        }
        const si = U.pick(fits, r), slot = home.slots[si];
        if (isFurniture(BT.decor[it.id])) room.lastFurniture = b;
        Object.assign(it, { a: slot.a, x: slot.x + (r() - 0.5) * 8, y: slot.y, s: slot.s * it.scale, slot: si });
      }
    }

    if (!it) {
      // Every spot is taken: something floaty drifts into the air instead.
      const floaty = BT.decorFor(home.id).filter(d => d.anchors.includes('air'));
      const d = U.pick(floaty, r);
      const c = U.pick(A.DECOR, r);
      const air = room.items.filter(i => i.a === 'air');
      const box = home.air;
      let best = null, bestGap = -1;
      for (let k = 0; k < 10; k++) {
        const x = box.x + r() * box.w, y = box.y + r() * box.h;
        const gap = air.reduce((g, o) => Math.min(g, Math.hypot(o.x - x, o.y - y)), 999);
        if (gap > bestGap) { bestGap = gap; best = { x, y }; }
      }
      it = { t: 'decor', id: d.id, c, c2: A.accentFor(c), a: 'air', x: best.x, y: best.y, s: (0.55 + r() * 0.2) * d.scale, slot: -1 };
      if (air.length >= D.AIR_MAX) {
        removed = air[0];
        room.items = room.items.filter(i => i !== removed);
      }
    }

    it.k = U.uid() + room.items.length;
    it.f = r() < 0.5 ? -1 : 1;
    delete it.anchors; delete it.scale;
    if (it.id === 'sloth') room.slothSeen = true;
    room.items.push(it);
    return { item: it, removed };
  };

  D.isFull = room => freeSlots(room, BT.homes[room.home]).length === 0;
})(window.BT);
