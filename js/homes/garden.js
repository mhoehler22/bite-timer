/* Strawberry Garden: the Bunny's home. A sunny sky with bunting, a picket fence,
   a giant strawberry, a tree stump, and a grassy path. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['garden'];
  const GREEN = '#A9E5BB', GREEN2 = '#8FDCA8';

  /* ---- decorations that belong here ---- */
  add({
    id: 'flower', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 58, sound: 'chime',
    draw: p => A.limb('M0,0 V-32', GREEN, 4) + A.leaf(0, -10, 0.9, -60, GREEN) + A.leaf(0, -16, 0.9, 60, GREEN2) +
      [0, 72, 144, 216, 288].map(a => { const x = Math.cos((a - 90) * Math.PI / 180) * 10, y = -42 + Math.sin((a - 90) * Math.PI / 180) * 10; return `<circle cx="${A.n(x)}" cy="${A.n(y)}" r="8" ${A.f(p.c)} ${O2}/>`; }).join('') +
      `<circle cx="0" cy="-42" r="8" fill="#FFE89C" ${O2}/>` + A.face(0, -42, 0.45, { gap: 4.5, cheeks: false })
  });
  add({
    id: 'strawberry', homes: HOME, anchors: ['floor', 'shelf'], origin: 'bottom', h: 46, sound: 'squish',
    draw: p => `<path d="M0,0 C-18,-6 -22,-26 -14,-34 C-6,-40 6,-40 14,-34 C22,-26 18,-6 0,0Z" ${A.f(A.mix(p.c, '#FF8FAF', 0.55))} ${O}/>` +
      [[-9, -26], [9, -26], [-12, -14], [12, -14], [0, -8], [-4, -30], [5, -31]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2" fill="#FFF3B0"/>`).join('') +
      `<path d="M0,-37 L-10,-42 L-5,-36 L-12,-34 L0,-33 L12,-34 L5,-36 L10,-42Z" fill="${GREEN}" ${O2}/>` +
      A.face(0, -19, 0.65, { gap: 8 })
  });
  add({
    id: 'carrot', homes: HOME, anchors: ['floor', 'shelf'], origin: 'bottom', h: 52, sound: 'boop',
    draw: p => A.leaf(-4, -36, 0.9, -25, GREEN) + A.leaf(4, -36, 0.9, 25, GREEN2) + A.leaf(0, -37, 1, 0, GREEN) +
      `<path d="M-11,-36 Q-12,-10 0,0 Q12,-10 11,-36Z" ${A.f(A.mix(p.c, '#FFB37A', 0.6))} ${O}/>` +
      A.line('M-9,-14 h4 M6,-20 h4', 1.6, PLUM, 'opacity=".35"') + A.face(0, -25, 0.6, { gap: 6 })
  });
  add({
    id: 'wateringCan', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 40, sound: 'chime',
    draw: p => A.limb('M14,-14 L30,-28', p.c, 5) + `<ellipse cx="32" cy="-30" rx="4" ry="6" transform="rotate(40 32 -30)" fill="${p.c}" ${O2}/>` +
      A.limb('M-12,-30 q12,-14 24,0', p.c, 4) +
      `<rect x="-17" y="-30" width="32" height="30" rx="8" ${A.f(p.c)} ${O}/>` + A.face(-1, -14, 0.6, { gap: 7 }) +
      `<path d="M38,-20 q2,4 0,6 q-2,-2 0,-6Z M34,-12 q2,4 0,6 q-2,-2 0,-6Z" fill="#B0D4FF"/>`
  });
  add({
    id: 'bee', homes: HOME, anchors: ['air'], origin: 'center', h: 26, sound: 'sparkle',
    draw: p => `<ellipse cx="-4" cy="-11" rx="7" ry="9" transform="rotate(-20 -4 -11)" fill="${A.light(p.c, 0.6)}" fill-opacity=".9" ${O2}/>` +
      `<ellipse cx="6" cy="-11" rx="6" ry="8" transform="rotate(20 6 -11)" fill="${A.light(p.c, 0.6)}" fill-opacity=".9" ${O2}/>` +
      `<ellipse cx="0" cy="0" rx="15" ry="11" fill="#FFE89C" ${O}/>` +
      A.line('M-6,-10 q-3,10 0,20 M2,-11 q-3,11 0,22', 3, PLUM, 'opacity=".75"') +
      `<circle cx="9" cy="-2" r="1.8" fill="${PLUM}"/><ellipse cx="10" cy="3" rx="2.4" ry="1.5" fill="${A.CHEEK}"/>`
  });
  add({
    id: 'snail', homes: HOME, anchors: ['floor', 'shelf'], origin: 'bottom', h: 36, sound: 'boop',
    draw: p => `<path d="M-24,0 Q-26,-7 -16,-7 L16,-7 Q24,-8 24,-20 Q24,-28 16,-28 Q8,-28 8,-18 L8,-8" fill="${A.light(p.acc, 0.5)}" ${O}/>` +
      `<path d="M-24,0 L24,0 L24,-7 L-16,-7 Q-26,-7 -24,0Z" fill="${A.light(p.acc, 0.5)}" ${O}/>` +
      A.line('M12,-27 l-3,-9 M20,-27 l3,-9', 1.8) + `<circle cx="9" cy="-37" r="2.2" fill="${PLUM}"/><circle cx="23" cy="-37" r="2.2" fill="${PLUM}"/>` +
      `<circle cx="16" cy="-17" r="7" fill="${A.light(p.acc, 0.5)}"/>` + A.face(16, -18, 0.42, { gap: 4 }) +
      `<circle cx="-6" cy="-19" r="14" ${A.f(p.c)} ${O}/>` + A.line('M-6,-19 m-2,0 a3,3 0 1 1 3,3 a6,6 0 1 1 -7,-7', 1.8, PLUM, 'opacity=".4"')
  });

  /* ---- the home ---- */
  BT.addHome({
    id: 'garden', label: 'Strawberry Garden',
    noShared: ['lamp', 'books', 'frame', 'mug', 'roundPillow'],
    moods: [
      { wall: '#DDF0FF', wall2: '#FFF2F7', floor: '#C9EDB0', floor2: '#B2E295', fence: '#FFFFFF', a2: '#FFB7D5', hill: '#B8E6C4' },
      { wall: '#FFE6EF', wall2: '#FFF7E6', floor: '#BDF0DC', floor2: '#A2E3CA', fence: '#FFF8EE', a2: '#CDB4F6', hill: '#A9E5BB' },
      { wall: '#EDE4FF', wall2: '#E3F4FF', floor: '#D8F2BC', floor2: '#C2E8A0', fence: '#FFF6DA', a2: '#A6E7EF', hill: '#C7EBA8' },
      { wall: '#FFF4D6', wall2: '#FFE6EF', floor: '#CFEFC0', floor2: '#B6E3A4', fence: '#F3E8FF', a2: '#FFCCB0', hill: '#B9F3E4' }
    ],
    host: { x: 200, y: 366, s: 1.12, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 50, y: 30, s: 0.6 }, { a: 'hang', x: 150, y: 30, s: 0.6 }, { a: 'hang', x: 250, y: 30, s: 0.6 },
      { a: 'wall', x: 140, y: 128, s: 0.52 }, { a: 'wall', x: 250, y: 112, s: 0.52 },
      { a: 'shelf', x: 330, y: 286, s: 0.5 },
      { a: 'floor', x: 120, y: 304, s: 0.58 }, { a: 'floor', x: 270, y: 300, s: 0.58 },
      { a: 'floor', x: 50, y: 334, s: 0.64 }, { a: 'floor', x: 375, y: 344, s: 0.62 },
      { a: 'floor', x: 44, y: 392, s: 0.78 }, { a: 'floor', x: 118, y: 394, s: 0.78 }, { a: 'floor', x: 284, y: 394, s: 0.78 }, { a: 'floor', x: 356, y: 394, s: 0.74 }
    ],
    air: { x: 30, y: 60, w: 340, h: 110 },
    draw(m, r) {
      let s = `<rect width="400" height="270" fill="${m.wall}"/>`;
      s += `<ellipse cx="200" cy="250" rx="300" ry="60" fill="${m.wall2}" opacity=".8"/>`;

      // sun
      s += A.furn(`<g transform="translate(340 70)">` +
        [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0,-34 v-8" transform="rotate(${a})" stroke="#FFD86E" stroke-width="5" stroke-linecap="round"/>`).join('') +
        `<circle r="26" fill="#FFE89C" ${O}/>` + A.face(0, 2, 0.85) + `</g>`, 'sparkle', '50% 50%');
      s += A.cloud(92, 86, 0.95, '#fff', true) + A.cloud(214, 58, 0.7, '#fff', false);

      // hills and fence
      s += `<ellipse cx="80" cy="262" rx="160" ry="50" fill="${m.hill}"/><ellipse cx="330" cy="268" rx="170" ry="56" fill="${A.light(m.hill, 0.3)}"/>`;
      for (let x = 4; x < 400; x += 26) s += `<path d="M${x},264 V214 L${x + 9},204 L${x + 18},214 V264Z" fill="${m.fence}" ${O2}/>`;
      s += `<rect x="0" y="222" width="400" height="8" fill="${m.fence}" ${O2}/><rect x="0" y="246" width="400" height="8" fill="${m.fence}" ${O2}/>`;

      // grass
      s += `<path d="M0,262 Q100,252 200,262 T400,262 V400 H0Z" fill="${m.floor}" ${O}/>`;
      for (let i = 0; i < 14; i++) { const x = A.n(r() * 390), y = A.n(280 + r() * 112); s += A.line(`M${x},${y} l3,-7 M${x + 6},${y} l-1,-8 M${x + 10},${y} l3,-6`, 2, m.floor2); }
      for (let i = 0; i < 8; i++) s += `<circle cx="${A.n(r() * 400)}" cy="${A.n(285 + r() * 110)}" r="3" fill="${i % 2 ? '#fff' : m.a2}"/>`;
      // stepping stones
      [[200, 392, 26], [176, 336, 20], [210, 302, 15]].forEach(([x, y, rx]) => { s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.38}" fill="#F6F0EA" ${O2}/>`; });

      // the giant strawberry (left) and a tree stump (right)
      s += A.furn(`<g transform="translate(64 286) scale(2.2)">` + BT.decor.strawberry.draw(A.pack(m.a2)) + `</g>`, 'squish');
      s += A.furn(`<path d="M304,326 L306,292 L354,292 L356,326Z" fill="#E7C49F" ${O}/>` +
        `<ellipse cx="330" cy="292" rx="25" ry="8" fill="#F6DDBE" ${O}/>` + A.line('M330,292 m-10,0 a10,4 0 1 0 20,0 a10,4 0 1 0 -20,0', 1.4, PLUM, 'opacity=".35"') +
        A.face(330, 310, 0.6, { gap: 7 }), 'boop');

      s += A.bunting(0, 12, 400, 12, 4, 14, [m.a2, '#FFE89C', '#A9EEC9', '#B0D4FF']);
      s += A.sprinkles(r, { x: 30, y: 110, w: 260, h: 80 }, 6, ['#fff', m.a2]);
      return s;
    }
  });
})(window.BT);
