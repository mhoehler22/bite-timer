/* Cloud Castle: the Dragon's home. A castle on the clouds, a rainbow, a sleepy moon,
   a star garland, and floating cloud platforms. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['castle'];
  const GOLD = '#FFE89C';

  /* ---- decorations that belong here ---- */
  add({
    id: 'crown', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 32, sound: 'sparkle',
    draw: p => `<path d="M-20,0 L-22,-24 L-11,-12 L0,-28 L11,-12 L22,-24 L20,0Z" fill="${A.mix(GOLD, p.c, 0.2)}" ${O}/>` +
      `<circle cx="-22" cy="-25" r="3" fill="${p.c}" ${O2}/><circle cx="0" cy="-29" r="3.4" fill="${p.acc}" ${O2}/><circle cx="22" cy="-25" r="3" fill="${p.c}" ${O2}/>` +
      A.face(0, -9, 0.55, { gap: 7 })
  });
  add({
    id: 'gem', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 34, sound: 'sparkle',
    draw: p => `<path d="M-17,-22 L-9,-31 L9,-31 L17,-22 L0,0Z" ${A.f(p.c)} ${O}/>` +
      A.line('M-17,-22 H17 M-9,-31 L-5,-22 L0,0 M9,-31 L5,-22', 1.4, PLUM, 'opacity=".3"') +
      A.face(0, -15, 0.5, { gap: 5 }) + A.sparkle(16, -32, 0.45, '#fff', A.O2)
  });
  add({
    id: 'shootingStar', homes: HOME, anchors: ['air'], origin: 'center', h: 34, sound: 'sparkle',
    draw: p => A.line('M-4,4 L-30,18', 4, p.acc) + A.line('M-2,9 L-24,24', 4, p.acc2) + A.line('M-7,-1 L-32,10', 4, '#fff') +
      `<path d="${A.starPath(15, 8.5)}" ${A.f(p.c)} ${O}/>` + A.face(0, 1, 0.45, { gap: 5 })
  });
  add({
    id: 'potion', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 48, sound: 'boing',
    draw: p => `<rect x="-6" y="-44" width="12" height="9" rx="3" fill="#E7C49F" ${O2}/>` +
      `<rect x="-5" y="-37" width="10" height="9" fill="#ffffff" fill-opacity=".7" ${O2}/>` +
      `<circle cx="0" cy="-16" r="16" fill="#ffffff" fill-opacity=".7" ${O}/>` +
      `<path d="M-15,-12 Q0,-6 15,-12 A16,16 0 0 1 -15,-12Z" fill="${p.c}"/>` +
      `<circle cx="0" cy="-16" r="16" fill="none" ${O}/>` +
      `<circle cx="-5" cy="-19" r="2" fill="#fff"/><circle cx="4" cy="-25" r="1.5" fill="#fff"/>` + A.face(0, -11, 0.5, { gap: 6 })
  });
  add({
    id: 'banner', homes: HOME, anchors: ['hang'], origin: 'top', h: 44, sound: 'chime',
    draw: p => A.line('M0,0 V6 M-16,7 H16', 2.4) +
      `<path d="M-14,8 L14,8 L14,40 L0,32 L-14,40Z" ${A.f(p.c)} ${O}/>` +
      `<path transform="translate(0 19) scale(.32)" d="${A.starPath(21, 12)}" fill="${p.acc}" stroke="${PLUM}" stroke-width="6" stroke-linejoin="round"/>`
  });

  const tower = (x, y, w, h, roof, wall) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${A.f(wall)} ${O}/>` +
    `<path d="M${x - 6},${y + 2} L${x + w / 2},${y - 44} L${x + w + 6},${y + 2}Z" ${A.f(roof)} ${O}/>` +
    A.line(`M${x + w / 2},${y - 44} V${y - 60}`, 2) + `<path d="M${x + w / 2},${y - 60} l14,4 l-14,5Z" fill="${roof}" ${O2}/>` +
    `<path d="M${x + w / 2 - 6},${y + 34} v-8 a6,6 0 0 1 12,0 v8Z" fill="${A.deep(wall, 0.3)}" ${O2}/>`;

  /* ---- the home ---- */
  BT.addHome({
    id: 'castle', label: 'Cloud Castle',
    contrast: ['wall'],
    noShared: ['lamp', 'books', 'plant', 'cactus', 'frame', 'mug', 'roundPillow'],
    moods: [
      { wall: '#E5DCFF', wall2: '#FFE0EC', floor: '#FFFFFF', floor2: '#ECE6FF', tower: '#FFF3E6', roof: '#FFB7D5' },
      { wall: '#DAECFF', wall2: '#EFE6FF', floor: '#FFFFFF', floor2: '#E2EEFF', tower: '#F3EDFF', roof: '#A9EEC9' },
      { wall: '#FFE4EE', wall2: '#FFF3D9', floor: '#FFFFFF', floor2: '#FBE8F0', tower: '#EEF7FF', roof: '#CDB4F6' },
      { wall: '#D6CCF4', wall2: '#F6D4E8', floor: '#FFFFFF', floor2: '#E6DDF8', tower: '#FFF6E8', roof: '#B0D4FF' }
    ],
    host: { x: 200, y: 374, s: 1.1, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 150, y: 28, s: 0.58 }, { a: 'hang', x: 250, y: 28, s: 0.58 }, { a: 'hang', x: 350, y: 28, s: 0.58 },
      { a: 'wall', x: 78, y: 136, s: 0.5 }, { a: 'wall', x: 334, y: 120, s: 0.5 },
      { a: 'shelf', x: 52, y: 196, s: 0.46 }, { a: 'shelf', x: 348, y: 206, s: 0.46 },
      { a: 'big', x: 52, y: 330, s: 0.78 }, { a: 'big', x: 348, y: 330, s: 0.78 },
      { a: 'floor', x: 58, y: 394, s: 0.76 }, { a: 'floor', x: 136, y: 396, s: 0.74 }, { a: 'floor', x: 266, y: 396, s: 0.74 }, { a: 'floor', x: 344, y: 394, s: 0.76 }
    ],
    air: { x: 40, y: 60, w: 320, h: 100 },
    draw(m, r) {
      let s = `<rect width="400" height="300" fill="${m.wall}"/>`;
      s += `<ellipse cx="200" cy="300" rx="320" ry="140" fill="${m.wall2}" opacity=".85"/>`;
      s += A.sprinkles(r, { x: 20, y: 40, w: 360, h: 140 }, 12, ['#fff', GOLD]);

      // sleepy moon
      s += A.furn(`<circle cx="60" cy="64" r="28" fill="#FFF6D6" ${O}/><circle cx="72" cy="52" r="5" fill="#FFEDB0"/><circle cx="46" cy="76" r="3.5" fill="#FFEDB0"/>` +
        A.face(58, 66, 0.85, { sleepy: true }), 'sparkle', '50% 50%');

      // rainbow behind the castle
      [[150, '#FFC8DD'], [138, '#FFE89C'], [126, '#C7EBA8'], [114, '#B0D4FF']].forEach(([rad, c]) => {
        s += `<path d="M${200 - rad},266 A${rad},${rad} 0 0 1 ${200 + rad},266" fill="none" stroke="${c}" stroke-width="12" opacity=".75"/>`;
      });

      // the castle
      s += A.furn(tower(108, 126, 40, 140, m.roof, m.tower) + tower(252, 126, 40, 140, m.roof, m.tower) +
        `<rect x="146" y="156" width="108" height="110" ${A.f(m.tower)} ${O}/>` +
        [146, 168, 190, 212, 234].map(x => `<rect x="${x}" y="144" width="20" height="14" rx="3" ${A.f(m.tower)} ${O}/>`).join('') +
        `<path d="M180,266 L180,240 Q180,222 200,222 Q220,222 220,240 L220,266Z" fill="${m.roof}" ${O}/>` +
        A.heart(200, 244, 0.45, '#fff', false) + A.face(200, 192, 0.9), 'sparkle');

      // floating cloud platforms
      s += A.furn(A.cloud(52, 222, 1.6, '#fff', true), 'squish', '50% 50%');
      s += A.furn(A.cloud(348, 232, 1.5, '#fff', false), 'squish', '50% 50%');

      // the cloud floor
      s += A.union([[20, 286, 40], [90, 274, 44], [170, 280, 40], [250, 272, 46], [330, 280, 42], [395, 284, 36]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}"/>`).concat(['<rect x="-10" y="280" width="420" height="130"/>']), m.floor);
      for (let i = 0; i < 6; i++) s += `<ellipse cx="${A.n(r() * 400)}" cy="${A.n(310 + r() * 80)}" rx="${A.n(18 + r() * 18)}" ry="5" fill="${m.floor2}"/>`;

      // star garland
      const sg = A.sag(100, 12, 400, 12, 3, 14);
      s += A.line(sg.d, 2);
      sg.dips.forEach(([x, y]) => { s += `<path transform="translate(${A.n(x - 25)} ${A.n(y - 4)}) scale(.3)" d="${A.starPath(21, 12)}" fill="${GOLD}" stroke="${PLUM}" stroke-width="7" stroke-linejoin="round"/>`; });
      return s;
    }
  });
})(window.BT);
