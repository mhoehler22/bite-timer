/* Bamboo Grove: the Panda's home. Bamboo stalks, paper lanterns, a round moon window,
   a lily pond, and a low tea table. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['bamboo'];
  const GREEN = '#A9E5BB', GREEN2 = '#8FDCA8', WOOD = '#E3C29B';

  /* ---- decorations that belong here ---- */
  add({
    id: 'paperLantern', homes: ['bamboo', 'garden'], anchors: ['hang'], origin: 'top', h: 54, sound: 'chime',
    draw: p => A.line('M0,0 V9') + `<circle cx="0" cy="29" r="22" fill="#FFF3B0" opacity=".45" class="twinkle"/>` +
      `<rect x="-8" y="8" width="16" height="5" rx="2" fill="${PLUM}"/>` +
      `<ellipse cx="0" cy="29" rx="17" ry="17" ${A.f(p.c)} ${O}/>` +
      A.line('M-8,13 q-6,16 0,32 M8,13 q6,16 0,32', 1.5, PLUM, 'opacity=".3"') +
      `<rect x="-8" y="44" width="16" height="5" rx="2" fill="${PLUM}"/>` + A.line('M0,49 V56 M-3,56 V54 M3,56 V54', 2, p.acc) +
      A.face(0, 29, 0.6, { gap: 6 })
  });
  add({
    id: 'bao', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 30, sound: 'squish',
    draw: p => `<path d="M-20,-2 Q-24,-20 -8,-26 Q0,-29 8,-26 Q24,-20 20,-2 Q0,3 -20,-2Z" fill="#FFF8F0" ${O}/>` +
      A.line('M-5,-24 q5,-4 10,0 M-2,-26 q2,-3 4,0', 1.6, PLUM, 'opacity=".4"') + `<circle cx="0" cy="-27" r="2.6" fill="${p.c}"/>` +
      A.face(0, -12, 0.7)
  });
  add({
    id: 'teacup', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 34, sound: 'chime',
    draw: p => A.line('M-4,-28 q-3,-4 0,-8 q3,-4 0,-8 M5,-28 q-3,-4 0,-8', 1.8, PLUM, 'opacity=".35"') +
      `<ellipse cx="0" cy="-3" rx="21" ry="4.5" ${A.f(p.acc)} ${O2}/>` + A.limb('M12,-20 q8,0 7,6 q-1,5 -8,4', p.c, 3) +
      `<path d="M-14,-24 L14,-24 Q13,-6 0,-5 Q-13,-6 -14,-24Z" ${A.f(p.c)} ${O}/>` +
      `<ellipse cx="0" cy="-24" rx="14" ry="3.5" fill="#C7EBA8" ${O2}/>` + A.face(0, -15, 0.55, { gap: 6 })
  });
  add({
    id: 'lotus', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 34, sound: 'sparkle',
    draw: p => `<ellipse cx="0" cy="-5" rx="26" ry="6" fill="${GREEN}" ${O2}/>` +
      [-56, -28, 28, 56, 0].map(a => `<ellipse cx="0" cy="-22" rx="7" ry="13" transform="rotate(${a} 0 -8)" ${A.f(p.c)} ${O2}/>`).join('') +
      `<circle cx="0" cy="-14" r="5" fill="#FFE89C" ${O2}/>`
  });
  add({
    id: 'bambooShoot', homes: HOME, anchors: ['floor', 'shelf'], origin: 'bottom', h: 56, sound: 'chime',
    draw: p => `<rect x="-5" y="-54" width="10" height="38" rx="5" fill="${GREEN}" ${O2}/>` + A.line('M-5,-42 h10 M-5,-30 h10', 1.6, PLUM, 'opacity=".4"') +
      A.leaf(5, -48, 0.9, 50, GREEN2) + A.leaf(-5, -38, 0.8, -50, GREEN) +
      `<path d="M-15,-18 L15,-18 L11,0 L-11,0Z" ${A.f(p.c)} ${O}/>` + A.face(0, -9, 0.5, { gap: 6 })
  });

  const stalk = (x, top, face) => {
    let s = `<rect x="${x - 8}" y="${top}" width="16" height="${276 - top}" rx="8" fill="${GREEN}" ${O2}/>`;
    for (let y = top + 44; y < 270; y += 52) s += A.line(`M${x - 8},${y} h16`, 2, PLUM, 'opacity=".35"');
    s += A.leaf(x + 6, top + 60, 1.1, 60, GREEN2) + A.leaf(x - 6, top + 112, 1, -60, GREEN);
    if (face) s += A.face(x, 190, 0.45, { gap: 4, cheeks: false });
    return s;
  };

  /* ---- the home ---- */
  BT.addHome({
    id: 'bamboo', label: 'Bamboo Grove',
    noShared: ['lamp', 'frame', 'cactus', 'mug'],
    moods: [
      { wall: '#E8F7EE', wall2: '#D3EFDD', floor: '#F5ECD8', floor2: '#E5D6B5', a1: '#FFB7D5', a2: '#FFE89C', sky: '#FFF0F6' },
      { wall: '#FFF0F5', wall2: '#F7DCE7', floor: '#EEE6FF', floor2: '#DCCEF5', a1: '#FFCCB0', a2: '#B0D4FF', sky: '#FFF8E1' },
      { wall: '#EAF3FF', wall2: '#D5E6FA', floor: '#FFF4DC', floor2: '#F0E0B5', a1: '#CDB4F6', a2: '#FFB7D5', sky: '#FFF0F6' },
      { wall: '#FFF8E6', wall2: '#F5E9C8', floor: '#E6F6F0', floor2: '#CDEBDD', a1: '#A6E7EF', a2: '#FFB7D5', sky: '#EFE6FF' }
    ],
    host: { x: 200, y: 372, s: 1.06, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 60, y: 24, s: 0.58 }, { a: 'hang', x: 200, y: 24, s: 0.56 }, { a: 'hang', x: 340, y: 24, s: 0.58 },
      { a: 'wall', x: 112, y: 150, s: 0.5 }, { a: 'wall', x: 288, y: 150, s: 0.5 },
      { a: 'shelf', x: 300, y: 284, s: 0.46 }, { a: 'shelf', x: 354, y: 284, s: 0.46 },
      { a: 'big', x: 118, y: 302, s: 0.73 }, { a: 'floor', x: 42, y: 304, s: 0.58 },
      { a: 'floor', x: 70, y: 394, s: 0.74 }, { a: 'floor', x: 140, y: 397, s: 0.72 }, { a: 'floor', x: 275, y: 396, s: 0.74 }, { a: 'big', x: 348, y: 394, s: 0.78 },
      { a: 'floor', x: 330, y: 346, s: 0.6 }
    ],
    air: { x: 40, y: 60, w: 320, h: 110 },
    draw(m, r) {
      let s = `<rect width="400" height="276" fill="${m.wall}"/>`;
      s += `<rect y="230" width="400" height="46" fill="${m.wall2}"/>`;

      // round moon window
      s += `<circle cx="200" cy="130" r="74" fill="${WOOD}" ${O}/>`;
      s += `<circle cx="200" cy="130" r="64" fill="${m.sky}" ${O}/>`;
      s += A.furn(`<circle cx="226" cy="110" r="22" fill="#FFF6D6" ${O2}/>` + A.face(226, 112, 0.6, { sleepy: true }), 'sparkle', '50% 50%');
      s += A.line('M140,150 q30,-6 52,-30 q12,-12 24,-14', 3, '#C9A27E');
      [[160, 142], [182, 128], [196, 114], [214, 104], [172, 150]].forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="4.5" fill="${i % 2 ? m.a1 : '#fff'}" ${O2}/>`; });

      // bamboo stalks
      s += stalk(24, 30, false) + stalk(62, 50, true) + stalk(340, 46, false) + stalk(378, 28, false);

      // top beam and paper lanterns
      s += `<rect x="-4" y="6" width="408" height="16" rx="6" fill="${WOOD}" ${O}/>`;
      for (const x of [128, 272]) s += `<g transform="translate(${x} 22)">` + A.furn(BT.decor.paperLantern.draw(A.pack(m.a1)), 'chime', '50% 0%') + `</g>`;

      // floor (tatami)
      s += `<rect y="272" width="400" height="128" fill="${m.floor}"/><path d="M0,272 H400" ${O}/>`;
      s += A.line('M0,318 H400 M0,364 H400 M100,272 V318 M300,272 V318 M50,318 V364 M250,318 V364 M150,364 V400 M350,364 V400', 2.5, m.floor2);

      // lily pond
      s += A.furn(`<ellipse cx="86" cy="350" rx="64" ry="22" fill="#BDE7FF" ${O}/>` +
        `<path d="M58,346 a12,6 0 1 1 10,6 l-8,-3Z" fill="${GREEN}" ${O2}/><path d="M106,356 a11,5 0 1 1 9,5 l-7,-3Z" fill="${GREEN2}" ${O2}/>` +
        A.face(86, 346, 0.5, { gap: 6 }), 'boop', '50% 50%');

      // low tea table
      s += A.furn(`<rect x="282" y="290" width="8" height="26" rx="3" fill="${WOOD}" ${O2}/><rect x="364" y="290" width="8" height="26" rx="3" fill="${WOOD}" ${O2}/>` +
        `<rect x="270" y="282" width="114" height="12" rx="6" fill="${WOOD}" ${O}/>`, 'boop');

      // cushion for the host
      s += `<rect x="142" y="352" width="116" height="26" rx="12" ${A.f(m.a1)} ${O}/>`;
      s += A.sprinkles(r, { x: 90, y: 200, w: 220, h: 50 }, 5, ['#fff', m.a1]);
      return s;
    }
  });
})(window.BT);
