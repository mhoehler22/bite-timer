/* Magical Treehouse: the Sloth's home. A big branch to hang from, a round window,
   fairy lights, a ladder, and a mushroom stool. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['treehouse'];

  /* ---- decorations that belong here ---- */
  add({
    id: 'mushroom', homes: ['treehouse', 'garden'], anchors: ['floor', 'shelf'], origin: 'bottom', h: 44, sound: 'boop',
    draw: p => `<path d="M-9,0 L-7,-20 L7,-20 L9,0Z" fill="#FFF6EA" ${O}/>` +
      `<path d="M-24,-17 Q-24,-42 0,-42 Q24,-42 24,-17 Q0,-12 -24,-17Z" ${A.f(p.c)} ${O}/>` +
      `<circle cx="-14" cy="-30" r="3.5" fill="#fff"/><circle cx="15" cy="-32" r="3" fill="#fff"/><circle cx="2" cy="-38" r="2.5" fill="#fff"/>` +
      A.face(0, -25, 0.65, { gap: 8 })
  });
  add({
    id: 'acorn', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 46, sound: 'boop',
    draw: p => `<path d="M-15,-24 Q-17,-4 0,0 Q17,-4 15,-24Z" ${A.f(A.mix(p.c, '#F0CFA8', 0.5))} ${O}/>` +
      `<path d="M-19,-23 Q-19,-40 0,-40 Q19,-40 19,-23Z" fill="${A.mix(p.c, '#C9A27E', 0.6)}" ${O}/>` +
      A.line('M-12,-35 l8,8 M-2,-39 l12,12 M8,-38 l7,7', 1.4, PLUM, 'opacity=".35"') +
      A.line('M0,-40 q1,-6 5,-7', 3) + A.face(0, -14, 0.6, { gap: 7 })
  });
  add({
    id: 'lantern', homes: ['treehouse', 'castle'], anchors: ['hang'], origin: 'top', h: 52, sound: 'chime',
    draw: p => A.line('M0,0 V8') + `<circle cx="0" cy="29" r="22" fill="#FFF3B0" opacity=".5" class="twinkle"/>` +
      `<path d="M-14,15 L14,15 L9,7 L-9,7Z" ${A.f(p.c)} ${O2}/>` +
      `<rect x="-13" y="14" width="26" height="30" rx="6" fill="#FFF7C8" ${O}/>` +
      `<rect x="-15" y="43" width="30" height="7" rx="3" ${A.f(p.c)} ${O2}/>` + A.face(0, 29, 0.6, { gap: 6 })
  });
  add({
    id: 'bird', homes: ['treehouse', 'garden'], anchors: ['air'], origin: 'center', h: 30, sound: 'peep',
    draw: p => `<path d="M-12,0 L-22,-5 L-20,6Z" fill="${p.c}" ${O2}/>` +
      `<path d="M-14,2 Q-16,-16 0,-16 Q16,-16 17,0 Q10,14 -4,12 Q-12,10 -14,2Z" ${A.f(p.c)} ${O}/>` +
      `<path d="M-6,0 Q2,-6 8,2 Q0,8 -6,0Z" fill="${p.d}" ${O2}/>` +
      `<path d="M16,-7 L23,-4 L16,-1Z" fill="#FFC56E" ${O2}/>` +
      `<circle cx="8" cy="-7" r="2.4" fill="${PLUM}"/><ellipse cx="10" cy="-1.5" rx="3" ry="2" fill="${A.CHEEK}" opacity=".8"/>`
  });

  /* ---- the home ---- */
  BT.addHome({
    id: 'treehouse', label: 'Treehouse',
    moods: [
      { wall: '#F6DFC3', wall2: '#EACBA6', floor: '#E2BE97', floor2: '#CFA57C', leaf: '#A9E5BB', leaf2: '#8ED6A4', a2: '#FFC8DD', sky: '#CFE8FF' },
      { wall: '#EEDCF7', wall2: '#DEC6EE', floor: '#D7C0EA', floor2: '#C2A6DA', leaf: '#B9F3E4', leaf2: '#98E6D0', a2: '#FFE89C', sky: '#FFE6EF' },
      { wall: '#FFE3D8', wall2: '#F6CDBE', floor: '#EFC0AC', floor2: '#E0A893', leaf: '#CDEFAE', leaf2: '#B3E290', a2: '#B0D4FF', sky: '#E6F3FF' },
      { wall: '#E3F4FF', wall2: '#CBE6FA', floor: '#F3D9B8', floor2: '#E3C29B', leaf: '#FFC8DD', leaf2: '#FFB0CC', a2: '#CDB4F6', sky: '#FFF4D6' }
    ],
    host: { x: 272, y: 38, s: 1.1, pose: 'hang', a: 'hang' },
    slots: [
      { a: 'hang', x: 42, y: 38, s: 0.62 }, { a: 'hang', x: 152, y: 42, s: 0.6 }, { a: 'hang', x: 206, y: 38, s: 0.56 }, { a: 'hang', x: 352, y: 40, s: 0.58 },
      { a: 'wall', x: 198, y: 165, s: 0.55 }, { a: 'wall', x: 326, y: 214, s: 0.5 },
      { a: 'shelf', x: 40, y: 246, s: 0.5 }, { a: 'shelf', x: 112, y: 246, s: 0.5 }, { a: 'shelf', x: 105, y: 197, s: 0.42 },
      { a: 'shelf', x: 335, y: 323, s: 0.46 },
      { a: 'floor', x: 66, y: 332, s: 0.64 }, { a: 'floor', x: 145, y: 322, s: 0.62 }, { a: 'floor', x: 222, y: 320, s: 0.62 }, { a: 'floor', x: 280, y: 338, s: 0.64 },
      { a: 'floor', x: 42, y: 392, s: 0.78 }, { a: 'floor', x: 125, y: 390, s: 0.8 }, { a: 'floor', x: 210, y: 393, s: 0.8 }, { a: 'floor', x: 292, y: 393, s: 0.76 }
    ],
    air: { x: 30, y: 85, w: 320, h: 140 },
    draw(m, r) {
      let s = `<rect width="400" height="292" fill="${m.wall}"/>`;
      for (let x = 28; x < 400; x += 57) s += `<path d="M${x},0 V292" stroke="${m.wall2}" stroke-width="4"/>`;
      for (let i = 0; i < 6; i++) s += `<ellipse cx="${A.n(20 + r() * 360)}" cy="${A.n(80 + r() * 190)}" rx="5" ry="3" fill="${m.wall2}"/>`;

      // round window onto the leaves
      s += `<circle cx="105" cy="138" r="60" fill="${m.floor2}" ${O}/>`;
      // (no clipPath: ids repeat when two rooms are on the page, so everything stays inside the circle by shape)
      s += `<circle cx="105" cy="138" r="50" fill="${m.sky}"/>` +
        `<path d="M66.6,170 A50,50 0 0 0 143.4,170Z" fill="${m.leaf2}"/>` +
        `<circle cx="84" cy="172" r="13" fill="${m.leaf}"/><circle cx="121" cy="169" r="14" fill="${m.leaf}"/><circle cx="102" cy="176" r="11" fill="${m.leaf2}"/>` +
        A.cloud(108, 118, 0.85, '#fff', true);
      s += `<circle cx="105" cy="138" r="50" fill="none" ${O}/>`;
      s += A.limb('M105,90 V186 M57,138 H153', m.floor2, 5);
      s += `<rect x="58" y="192" width="94" height="10" rx="5" fill="${m.floor2}" ${O}/>`;

      // little wall shelf
      s += `<path d="M30,255 v12 l10,-12Z M118,255 v12 l10,-12Z" fill="${m.floor2}" ${O2}/>`;
      s += `<rect x="12" y="246" width="135" height="9" rx="4.5" fill="${m.floor2}" ${O}/>`;

      // ladder
      s += A.limb('M356,64 V292', m.floor2, 6) + A.limb('M388,64 V292', m.floor2, 6);
      for (let y = 92; y < 290; y += 34) s += A.limb(`M357,${y} H387`, m.floor2, 5);

      // floor boards and a leafy rug
      s += `<rect y="290" width="400" height="110" fill="${m.floor}"/><rect y="286" width="400" height="7" fill="${m.floor2}"/>`;
      for (const y of [322, 358]) s += `<path d="M0,${y} H400" stroke="${m.floor2}" stroke-width="3"/>`;
      for (let i = 0; i < 6; i++) { const x = A.n(r() * 400), y = i % 2 ? 322 : 358; s += `<path d="M${x},${y} v${i % 2 ? 36 : 42}" stroke="${m.floor2}" stroke-width="3"/>`; }
      s += `<ellipse cx="185" cy="362" rx="122" ry="26" fill="${A.light(m.leaf, 0.35)}" ${O2}/>`;
      s += `<ellipse cx="185" cy="362" rx="106" ry="19" fill="none" stroke="${m.leaf2}" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>`;

      // mushroom stool
      s += `<g transform="translate(335 382)">` + A.furn(
        `<path d="M-13,0 L-10,-34 L10,-34 L13,0Z" fill="#FFF6EA" ${O}/>` +
        `<path d="M-34,-30 Q-34,-62 0,-62 Q34,-62 34,-30 Q0,-24 -34,-30Z" ${A.f(m.a2)} ${O}/>` +
        `<circle cx="-17" cy="-46" r="5" fill="#fff"/><circle cx="16" cy="-49" r="4" fill="#fff"/><circle cx="0" cy="-56" r="3" fill="#fff"/>` +
        A.face(0, -16, 0.6, { gap: 6 }), 'boop') + `</g>`;

      // the big branch across the top
      const br = 'M-10,36 C80,24 160,44 240,32 S360,26 410,40';
      s += A.line(br, 30, PLUM) + A.line(br, 24, m.floor2) + A.line('M-10,30 C80,18 160,38 240,26 S360,20 410,34', 4, '#fff', 'opacity=".35"');
      [[22, 22, -30], [92, 50, 160], [176, 24, -20], [236, 50, 170], [318, 20, 20], [388, 48, 160]].forEach(([x, y, rot], i) => { s += A.leaf(x, y, 1.25, rot, i % 2 ? m.leaf : m.leaf2); });
      s += A.furn(`<g transform="translate(112 24)">` +
        A.union(['<circle cx="-12" cy="2" r="11"/>', '<circle cx="2" cy="-6" r="13"/>', '<circle cx="15" cy="3" r="10"/>', '<circle cx="2" cy="8" r="11"/>'], m.leaf) +
        A.face(2, 2, 0.7) + `</g>`, 'chime', '50% 50%');

      s += A.lights(0, 62, 400, 66, 4, 14, [m.a2, '#FFE89C', m.leaf, m.sky]);
      s += A.sprinkles(r, { x: 170, y: 90, w: 200, h: 170 }, 8, ['#fff', m.a2]);
      return s;
    }
  });
})(window.BT);
