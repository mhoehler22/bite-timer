/* Underwater Mermaid Cove: the Unicorn's home. Light rays, a string of pearls,
   coral rocks, swaying seaweed and a big shell. Visiting friends float in bubbles. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['cove'];

  /* ---- decorations that belong here ---- */
  add({
    id: 'starfish', homes: HOME, anchors: ['floor', 'shelf', 'wall'], origin: 'center', h: 40, sound: 'sparkle',
    draw: p => `<path d="${A.starPath(21, 10)}" ${A.f(p.c)} stroke="${PLUM}" stroke-width="3.4" stroke-linejoin="round"/>` +
      [[0, -12], [10, -3], [6, 9], [-6, 9], [-10, -3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`).join('') +
      A.face(0, 1, 0.55, { gap: 6 })
  });
  add({
    id: 'jellyfish', homes: HOME, anchors: ['hang', 'air'], origin: 'center', h: 48, sound: 'boing',
    draw: p => A.line('M-10,2 q-4,8 0,14 q4,6 0,12 M0,2 q-4,8 0,14 q4,6 0,12 M10,2 q-4,8 0,14 q4,6 0,12', 2.4, p.d) +
      `<path d="M-18,0 Q-18,-20 0,-20 Q18,-20 18,0 Q9,4 0,0 Q-9,4 -18,0Z" ${A.f(p.c)} ${O}/>` +
      A.shine(-8, -12, 3, 5, 25) + A.face(0, -8, 0.65)
  });
  add({
    id: 'shell', homes: HOME, anchors: ['floor', 'shelf'], origin: 'bottom', h: 36, sound: 'chime',
    draw: p => `<path d="M0,0 L-21,-12 Q-23,-31 0,-35 Q23,-31 21,-12Z" ${A.f(p.c)} ${O}/>` +
      A.line('M0,-2 L-12,-30 M0,-2 L0,-33 M0,-2 L12,-30', 1.6, PLUM, 'opacity=".3"') +
      `<circle cx="0" cy="-3" r="4" fill="#fff" ${O2}/>` + A.face(0, -19, 0.55, { gap: 7 })
  });
  add({
    id: 'turtle', homes: HOME, anchors: ['air', 'floor'], origin: 'center', h: 38, sound: 'boop',
    draw: p => `<ellipse cx="-17" cy="9" rx="8" ry="4" fill="#B5EBC3" ${O2} transform="rotate(25 -17 9)"/>` +
      `<ellipse cx="13" cy="10" rx="8" ry="4" fill="#B5EBC3" ${O2} transform="rotate(-25 13 10)"/>` +
      `<circle cx="22" cy="-2" r="9" fill="#B5EBC3" ${O}/>` +
      `<path d="M-22,6 Q-22,-18 0,-18 Q20,-18 20,6Z" ${A.f(p.c)} ${O}/>` +
      A.line('M-12,6 L-8,-8 L6,-8 L10,6 M-8,-8 L-2,-17 M6,-8 L3,-17', 1.6, PLUM, 'opacity=".3"') +
      `<circle cx="24" cy="-4" r="1.8" fill="${PLUM}"/><ellipse cx="25" cy="1" rx="2.4" ry="1.5" fill="${A.CHEEK}"/>`
  });
  add({
    id: 'fish', homes: HOME, anchors: ['air'], origin: 'center', h: 26, sound: 'boop',
    draw: p => `<path d="M-12,0 L-24,-9 L-22,9Z" fill="${p.acc}" ${O2}/>` +
      `<ellipse cx="0" cy="0" rx="15" ry="11" ${A.f(p.c)} ${O}/>` +
      `<path d="M-2,-10 q4,-7 9,-3" fill="${p.acc}" ${O2}/>` +
      `<circle cx="7" cy="-2" r="2.2" fill="${PLUM}"/><ellipse cx="8" cy="3.5" rx="2.6" ry="1.6" fill="${A.CHEEK}"/>` + A.line('M11,2 q2,2 3,0', 1.4)
  });
  add({
    id: 'bubbles', homes: HOME, anchors: ['air'], origin: 'center', h: 34, sound: 'boing',
    draw: () => [[0, 0, 10], [12, -12, 6], [-9, -15, 4.5]].map(([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width="2"/>` +
      A.line(`M${x - r * 0.5},${y - r * 0.35} q${r * 0.2},${-r * 0.3} ${r * 0.5},${-r * 0.35}`, 1.6, '#fff')).join('')
  });

  const pearls = (d, pins) => {
    let s = A.line(d, 2);
    for (let i = 0; i < pins.length - 1; i++) {
      const a = pins[i], b = pins[i + 1], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 32];
      for (let t = 0.1; t < 1; t += 0.2) {
        const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0];
        const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1];
        s += `<circle cx="${A.n(x)}" cy="${A.n(y)}" r="4.5" fill="#FFFBF5" ${O2}/>`;
      }
    }
    return s;
  };

  /* ---- the home ---- */
  BT.addHome({
    id: 'cove', label: 'Mermaid Cove',
    petWrap: 'bubble',
    noShared: ['lamp', 'books', 'mug', 'plant', 'cactus', 'bulb', 'frame', 'balloon', 'roundPillow', 'gift', 'butterfly'],
    moods: [
      { wall: '#C4ECFF', wall2: '#9ED8F5', floor: '#FFEFD2', floor2: '#F5DCB0', coral: '#FFB7D5', rock: '#D6CCF2', a2: '#CDB4F6' },
      { wall: '#CFF5EA', wall2: '#9FE0CF', floor: '#FFE6EF', floor2: '#F6CFDE', coral: '#FFCCB0', rock: '#C9E4FF', a2: '#FFE89C' },
      { wall: '#E1D6FF', wall2: '#BBA9F2', floor: '#FFF3DA', floor2: '#F0DDB4', coral: '#A9EEC9', rock: '#FFD3E3', a2: '#FFB7D5' },
      { wall: '#D3E6FF', wall2: '#A8C8FA', floor: '#FFF0E6', floor2: '#F6D9C7', coral: '#FFE89C', rock: '#E3D5FF', a2: '#A6E7EF' }
    ],
    host: { x: 200, y: 372, s: 1.1, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 50, y: 30, s: 0.6 }, { a: 'hang', x: 150, y: 30, s: 0.6 }, { a: 'hang', x: 250, y: 30, s: 0.6 }, { a: 'hang', x: 350, y: 30, s: 0.6 },
      { a: 'wall', x: 112, y: 124, s: 0.55 }, { a: 'wall', x: 290, y: 112, s: 0.55 }, { a: 'wall', x: 200, y: 172, s: 0.5 },
      { a: 'shelf', x: 40, y: 208, s: 0.48 }, { a: 'shelf', x: 95, y: 208, s: 0.48 }, { a: 'shelf', x: 312, y: 198, s: 0.48 }, { a: 'shelf', x: 366, y: 198, s: 0.48 },
      { a: 'big', x: 58, y: 352, s: 0.78 }, { a: 'big', x: 342, y: 352, s: 0.78 }, { a: 'floor', x: 108, y: 392, s: 0.72 }, { a: 'floor', x: 292, y: 392, s: 0.72 }
    ],
    air: { x: 30, y: 60, w: 340, h: 120 },
    draw(m, r) {
      let s = `<rect width="400" height="310" ${A.f(m.wall)}/>`;
      s += `<path d="M60,0 L110,0 L40,300 L0,300 L0,250Z M170,0 L200,0 L170,300 L130,300Z M290,0 L340,0 L360,300 L300,300Z" fill="#fff" opacity=".18"/>`;

      // coral rocks (the left one has a face)
      s += A.limb('M30,208 q-6,-18 4,-30 M30,190 q8,-8 14,-6', m.coral, 6) + A.limb('M370,198 q6,-20 -4,-32 M370,178 q-9,-6 -14,-2', m.coral, 6);
      s += A.furn(`<path d="M0,300 L0,214 Q0,206 10,206 L106,206 Q120,206 122,222 L128,300Z" ${A.f(m.rock)} ${O}/>` + A.face(62, 252, 0.8), 'boop');
      s += `<path d="M400,300 L400,204 Q400,196 390,196 L294,196 Q280,196 278,212 L272,300Z" ${A.f(m.rock)} ${O}/>`;

      // seaweed
      for (const [x, h, face] of [[150, 150, false], [256, 170, true]]) {
        s += A.furn(A.limb(`M${x},304 q-14,-${h * 0.25} 0,-${h * 0.5} q14,-${h * 0.25} 0,-${h * 0.5}`, '#A9E5BB', 9) +
          A.limb(`M${x + 6},304 q12,-${h * 0.18} 2,-${h * 0.36} q-10,-${h * 0.15} 0,-${h * 0.3}`, '#8FDCA8', 7) +
          (face ? A.face(x, 304 - h * 0.62, 0.55, { gap: 6 }) : ''), 'chime', '50% 100%');
      }

      // sand
      s += `<path d="M0,302 Q50,290 100,302 T200,302 T300,302 T400,302 V400 H0Z" fill="${m.floor}" ${O}/>`;
      for (let i = 0; i < 18; i++) s += `<circle cx="${A.n(r() * 400)}" cy="${A.n(318 + r() * 78)}" r="1.8" fill="${m.floor2}"/>`;

      // the big shell behind the host
      s += A.furn(`<path d="M200,362 L130,330 Q120,258 200,248 Q280,258 270,330Z" ${A.f(m.a2)} ${O}/>` +
        A.line('M200,358 L150,268 M200,358 L178,252 M200,358 L222,252 M200,358 L250,268', 2, PLUM, 'opacity=".25"'), 'chime');

      // pearls along the top
      const sg = A.sag(0, 14, 400, 14, 4, 16);
      s += pearls(sg.d, sg.pins);

      // rising bubbles
      for (let i = 0; i < 6; i++) {
        const x = A.n(20 + r() * 360), y = A.n(150 + r() * 140), rr = A.n(3 + r() * 5);
        s += `<circle class="rise" style="animation-delay:${-(r() * 6).toFixed(2)}s" cx="${x}" cy="${y}" r="${rr}" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="1.5"/>`;
      }
      s += A.sprinkles(r, { x: 30, y: 60, w: 340, h: 120 }, 6, ['#fff', m.a2]);
      return s;
    }
  });
})(window.BT);
