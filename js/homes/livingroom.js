/* Pastel Living Room: the Kitten's home. A squishy couch, a fluffy rug, string lights,
   a window with curtains, and a floor lamp. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['livingroom'];

  /* ---- decorations that belong here ---- */
  add({
    id: 'rug', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 18, sound: 'squish',
    draw: p => A.line('M-34,-7 h-5 M-34,-3 h-5 M34,-7 h5 M34,-3 h5', 2) +
      `<ellipse cx="0" cy="-6" rx="34" ry="9" ${A.f(p.c)} ${O}/>` +
      `<ellipse cx="0" cy="-6" rx="26" ry="5.5" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>` +
      A.face(0, -8, 0.5, { gap: 7 })
  });
  add({
    id: 'pouf', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 36, sound: 'squish',
    draw: p => `<path d="M-22,-26 L-22,-6 Q0,4 22,-6 L22,-26Z" ${A.f(p.c)} ${O}/>` +
      `<ellipse cx="0" cy="-26" rx="22" ry="7" fill="${p.l}" ${O}/>` + A.face(0, -12, 0.7)
  });
  add({
    id: 'yarn', homes: HOME, anchors: ['floor', 'shelf'], origin: 'bottom', h: 32, sound: 'purr',
    draw: p => A.line('M10,-3 q10,4 16,-1', 2.2, p.d) +
      `<circle cx="0" cy="-15" r="15" ${A.f(p.c)} ${O}/>` +
      A.line('M-11,-24 q10,6 18,-2 M-14,-13 q12,8 27,0', 1.6, p.d) + A.face(-1, -13, 0.55, { gap: 6 })
  });
  add({
    id: 'fishbowl', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 44, sound: 'boop',
    draw: p => `<circle cx="0" cy="-19" r="19" fill="#DFF3FF" ${O}/>` +
      `<path d="M-17,-24 Q0,-20 17,-24" fill="none" stroke="#9ED8F5" stroke-width="2"/>` +
      `<path d="M7,-15 l7,-5 v10Z" fill="${p.c}" ${O2}/><ellipse cx="0" cy="-15" rx="8" ry="6" ${A.f(p.c)} ${O2}/>` +
      `<circle cx="-3" cy="-16" r="1.6" fill="${PLUM}"/>` +
      `<rect x="-13" y="-41" width="26" height="6" rx="3" fill="#fff" ${O2}/>` + A.shine(-10, -28, 2.5, 5, 30)
  });

  /* ---- the home ---- */
  BT.addHome({
    id: 'livingroom', label: 'Living Room',
    contrast: ['wall', 'floor', 'couch'],
    moods: [
      { wall: '#FFE6EF', wall2: '#FFD3E3', floor: '#F3D7BE', floor2: '#E5C2A4', couch: '#FFB7D5', a2: '#B9F3E4', sky: '#CFE8FF', rug: '#FFF4D6' },
      { wall: '#EEE6FF', wall2: '#DED2FA', floor: '#F6E2C9', floor2: '#E8CCA9', couch: '#FFC2DA', a2: '#FFE89C', sky: '#D8EEFF', rug: '#E3F7EF' },
      { wall: '#E3F7EF', wall2: '#CDEEDF', floor: '#F2DCC8', floor2: '#E3C4AA', couch: '#CDB4F6', a2: '#FFCCB0', sky: '#FFE6EF', rug: '#FFE6EF' },
      { wall: '#FFF6DA', wall2: '#FBE9B4', floor: '#EADBF2', floor2: '#D9C3E4', couch: '#A6E7EF', a2: '#FFB7D5', sky: '#E6F3FF', rug: '#FFFFFF' }
    ],
    host: { x: 200, y: 372, s: 1.12, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 50, y: 38, s: 0.6 }, { a: 'hang', x: 150, y: 38, s: 0.6 }, { a: 'hang', x: 250, y: 38, s: 0.6 }, { a: 'hang', x: 350, y: 38, s: 0.6 },
      { a: 'wall', x: 200, y: 122, s: 0.6 }, { a: 'wall', x: 300, y: 104, s: 0.52 },
      { a: 'shelf', x: 78, y: 188, s: 0.42 },
      { a: 'shelf', x: 132, y: 241, s: 0.5 }, { a: 'shelf', x: 200, y: 241, s: 0.5 }, { a: 'shelf', x: 268, y: 241, s: 0.5 },
      { a: 'big', x: 52, y: 334, s: 0.81 }, { a: 'big', x: 336, y: 334, s: 0.81 },
      { a: 'floor', x: 100, y: 390, s: 0.78 }, { a: 'floor', x: 300, y: 390, s: 0.78 }, { a: 'floor', x: 368, y: 384, s: 0.66 }
    ],
    air: { x: 40, y: 60, w: 300, h: 90 },
    draw(m, r) {
      let s = `<rect width="400" height="290" fill="${m.wall}"/>`;
      for (let y = 26; y < 290; y += 36) for (let x = (y / 36) % 2 ? 18 : 36; x < 400; x += 36) s += `<circle cx="${x}" cy="${y}" r="3.5" fill="${m.wall2}"/>`;

      // window with curtains
      s += A.line('M14,76 H142', 4);
      s += `<rect x="30" y="82" width="96" height="100" rx="10" fill="${m.sky}" ${O}/>`;
      s += A.cloud(76, 114, 0.8, '#fff', true);
      s += A.line('M78,84 V180 M32,132 H124', 5, '#fff') + `<rect x="30" y="82" width="96" height="100" rx="10" fill="none" ${O}/>`;
      s += `<path d="M18,78 H48 Q36,120 52,152 Q32,160 18,184Z" ${A.f(m.a2)} ${O}/>`;
      s += `<path d="M138,78 H108 Q120,120 104,152 Q124,160 138,184Z" ${A.f(m.a2)} ${O}/>`;
      s += `<rect x="20" y="184" width="116" height="9" rx="4.5" fill="${m.floor2}" ${O}/>`;

      // floor lamp
      s += A.furn(`<circle cx="360" cy="160" r="30" fill="#FFF3B0" opacity=".5" class="twinkle"/>` +
        `<ellipse cx="360" cy="296" rx="15" ry="5" fill="${m.floor2}" ${O}/>` + A.limb('M360,294 V170', m.floor2, 4) +
        `<path d="M336,176 L346,138 L374,138 L384,176Z" ${A.f(m.a2)} ${O}/>` + A.face(360, 158, 0.7), 'chime');

      // floor and baseboard
      s += `<rect y="288" width="400" height="112" fill="${m.floor}"/><rect y="284" width="400" height="7" fill="${m.floor2}"/>`;
      for (let x = 0; x < 400; x += 50) s += `<path d="M${x},291 L${x - 30},400" stroke="${m.floor2}" stroke-width="2.5"/>`;

      // fluffy rug
      s += A.furn(`<ellipse cx="200" cy="356" rx="160" ry="36" fill="${m.rug}" ${O}/>` +
        `<ellipse cx="200" cy="356" rx="140" ry="26" fill="none" stroke="${m.couch}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>` +
        A.face(92, 356, 0.75), 'squish', '50% 50%');

      // the squishy couch
      s += A.furn(
        `<path d="M84,250 L84,196 Q84,174 108,174 L292,174 Q316,174 316,196 L316,250Z" ${A.f(m.couch)} ${O}/>` +
        A.line('M150,180 v56 M250,180 v56', 2, PLUM, 'opacity=".25"') +
        `<rect x="88" y="234" width="224" height="38" rx="15" ${A.f(m.couch)} ${O}/>` +
        A.line('M164,240 v28 M236,240 v28', 2, PLUM, 'opacity=".25"') +
        `<rect x="60" y="212" width="46" height="70" rx="21" ${A.f(m.couch)} ${O}/>` +
        `<rect x="294" y="212" width="46" height="70" rx="21" ${A.f(m.couch)} ${O}/>` +
        `<rect x="76" y="280" width="10" height="10" rx="3" fill="${PLUM}"/><rect x="314" y="280" width="10" height="10" rx="3" fill="${PLUM}"/>` +
        A.shine(110, 190, 10, 5, -10) + A.face(200, 196, 0.95, { mouth: 'w' }), 'squish');

      s += A.lights(0, 18, 400, 18, 4, 20, [m.a2, '#FFE89C', m.couch, m.sky]);
      s += A.sprinkles(r, { x: 150, y: 60, w: 170, h: 100 }, 7, ['#fff', m.couch]);
      return s;
    }
  });
})(window.BT);
