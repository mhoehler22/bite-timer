/* Sweet Bakery: the Puppy's home. A striped awning, pendant lamps, shelves of treats,
   a counter, and a checkered floor. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['bakery'];

  /* ---- decorations that belong here ---- */
  add({
    id: 'cupcake', homes: ['bakery', 'castle'], anchors: ['shelf', 'floor'], origin: 'bottom', h: 54, sound: 'squish',
    draw: p => `<path d="M-15,-22 L15,-22 L11,0 L-11,0Z" fill="${A.light(p.acc, 0.3)}" ${O}/>` +
      A.line('M-7,-21 L-5,-1 M0,-21 V-1 M7,-21 L5,-1', 1.6, PLUM, 'opacity=".25"') +
      A.union(['<ellipse cx="0" cy="-25" rx="19" ry="8"/>', '<ellipse cx="0" cy="-33" rx="14" ry="7"/>', '<ellipse cx="0" cy="-40" rx="8" ry="5"/>'], p.c) +
      A.line('M-9,-28 l3,-2 M6,-27 l3,1 M-2,-35 l2,2 M4,-38 l-2,2', 2, p.acc2) +
      A.line('M0,-47 q2,-5 5,-6', 1.8) + `<circle cx="0" cy="-47" r="4.5" fill="#FF8FB1" ${O2}/>` +
      A.face(0, -12, 0.55, { gap: 6 })
  });
  add({
    id: 'donut', homes: HOME, anchors: ['shelf', 'wall'], origin: 'center', h: 40, sound: 'boop',
    draw: p => `<circle r="19" fill="#F3D3A8" ${O}/>` +
      `<path d="M-17,-2 C-18,-14 -8,-19 0,-18 C10,-19 18,-12 17,-1 C15,4 12,0 9,5 C5,9 2,2 -3,6 C-8,9 -10,2 -14,4 C-17,5 -17,1 -17,-2Z" fill="${p.c}" ${O2}/>` +
      `<ellipse cx="0" cy="-5" rx="6" ry="4.5" fill="#F3D3A8" ${O2}/>` +
      A.line('M-11,-10 l3,-2 M9,-11 l2,3 M-6,-15 l3,1 M12,-4 l-2,2', 2, p.acc) + A.face(0, 10, 0.5, { gap: 6 })
  });
  add({
    id: 'macarons', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 50, sound: 'squish',
    draw: p => [[p.c, 0], [p.acc, -16], [p.acc2, -32]].map(([c, y]) =>
      `<rect x="-15" y="${y - 7}" width="30" height="6" rx="3" fill="#FFF6EA" ${O2}/>` +
      `<path d="M-17,${y - 3} Q-17,${y} -12,${y} L12,${y} Q17,${y} 17,${y - 3} Q17,${y - 7} 0,${y - 7} Q-17,${y - 7} -17,${y - 3}Z" ${A.f(c)} ${O2}/>` +
      `<path d="M-16,${y - 9} Q-16,${y - 16} 0,${y - 16} Q16,${y - 16} 16,${y - 9} Q16,${y - 6} 12,${y - 6} L-12,${y - 6} Q-16,${y - 6} -16,${y - 9}Z" ${A.f(c)} ${O2}/>`).join('') +
      A.face(0, -22, 0.5, { gap: 6 })
  });
  add({
    id: 'teapot', homes: ['bakery', 'bamboo'], anchors: ['shelf', 'floor'], origin: 'bottom', h: 46, sound: 'chime',
    draw: p => A.limb('M18,-18 q10,-2 14,-14', p.c, 5) + A.limb('M-18,-26 q-12,0 -11,10 q1,7 9,6', p.c, 4) +
      `<ellipse cx="0" cy="-17" rx="20" ry="17" ${A.f(p.c)} ${O}/>` +
      `<ellipse cx="0" cy="-33" rx="10" ry="4" fill="${p.acc}" ${O2}/><circle cx="0" cy="-38" r="3.2" fill="${p.acc}" ${O2}/>` +
      A.shine(-9, -24, 3, 5, 20) + A.face(0, -15, 0.7)
  });
  add({
    id: 'cake', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 58, sound: 'sparkle',
    draw: p => `<rect x="-22" y="-24" width="44" height="24" rx="6" ${A.f(p.c)} ${O}/>` +
      `<rect x="-15" y="-40" width="30" height="17" rx="5" ${A.f(p.acc)} ${O}/>` +
      `<path d="M-15,-36 Q-15,-40 -11,-40 L11,-40 Q15,-40 15,-36 L15,-33 Q12,-30 10,-34 Q7,-29 4,-33 Q0,-28 -3,-33 Q-7,-29 -10,-34 Q-13,-30 -15,-33Z" fill="#fff" ${O2}/>` +
      `<rect x="-2" y="-50" width="4" height="10" rx="1.5" fill="${p.acc2}" ${O2}/>` +
      `<path d="M0,-58 q4,4 0,7 q-4,-3 0,-7Z" fill="#FFC56E" stroke="#FFC56E" stroke-width="1.5"/>` +
      A.face(0, -11, 0.65)
  });

  /* ---- the home ---- */
  BT.addHome({
    id: 'bakery', label: 'Bakery',
    contrast: ['wall', 'floor', 'counter'],
    moods: [
      { wall: '#FFF3E2', wall2: '#FFC8DD', floor: '#FFE6EF', floor2: '#FAD1E0', counter: '#B9F3E4', a2: '#FFB7D5', wood: '#E9C7A3' },
      { wall: '#F0F8FF', wall2: '#A9EEC9', floor: '#FFF6DA', floor2: '#F2E2B0', counter: '#FFCCB0', a2: '#CDB4F6', wood: '#E9C7A3' },
      { wall: '#FBF0FF', wall2: '#FFE89C', floor: '#E8F6FF', floor2: '#CBE5F6', counter: '#FFB7D5', a2: '#A9EEC9', wood: '#DDB892' },
      { wall: '#FFF0E8', wall2: '#B0D4FF', floor: '#F3ECFF', floor2: '#DFD3F7', counter: '#FFE89C', a2: '#FFB7D5', wood: '#E9C7A3' }
    ],
    host: { x: 200, y: 392, s: 1.1, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 40, y: 50, s: 0.55 }, { a: 'hang', x: 200, y: 50, s: 0.55 }, { a: 'hang', x: 360, y: 50, s: 0.55 },
      { a: 'shelf', x: 60, y: 158, s: 0.46 }, { a: 'shelf', x: 132, y: 158, s: 0.46 }, { a: 'shelf', x: 268, y: 158, s: 0.46 }, { a: 'shelf', x: 340, y: 158, s: 0.46 },
      { a: 'wall', x: 70, y: 206, s: 0.48 }, { a: 'wall', x: 330, y: 206, s: 0.48 },
      { a: 'shelf', x: 52, y: 244, s: 0.5 }, { a: 'shelf', x: 124, y: 244, s: 0.5 }, { a: 'shelf', x: 200, y: 244, s: 0.5 }, { a: 'shelf', x: 276, y: 244, s: 0.5 }, { a: 'shelf', x: 348, y: 244, s: 0.5 },
      { a: 'floor', x: 46, y: 392, s: 0.72 }, { a: 'floor', x: 118, y: 396, s: 0.74 }, { a: 'floor', x: 284, y: 396, s: 0.74 }, { a: 'floor', x: 356, y: 392, s: 0.72 }
    ],
    air: { x: 40, y: 70, w: 320, h: 60 },
    draw(m, r) {
      let s = `<rect width="400" height="326" fill="${m.wall}"/>`;
      for (let x = 20; x < 400; x += 40) s += `<rect x="${x}" y="44" width="14" height="282" fill="${m.wall2}" opacity=".22"/>`;

      // shelves
      for (const [x0, x1] of [[22, 172], [228, 378]]) {
        s += `<path d="M${x0 + 18},167 v12 l10,-12Z M${x1 - 28},167 v12 l10,-12Z" fill="${m.wood}" ${O2}/>`;
        s += `<rect x="${x0}" y="158" width="${x1 - x0}" height="9" rx="4.5" fill="${m.wood}" ${O}/>`;
      }
      // menu sign
      s += A.furn(`<rect x="166" y="80" width="68" height="62" rx="10" fill="#FFFDF8" stroke="${m.wood}" stroke-width="6"/>` +
        `<rect x="166" y="80" width="68" height="62" rx="10" fill="none" ${O}/>` +
        `<g transform="translate(200 106) scale(.5)">${BT.decor.cupcake ? BT.decor.cupcake.draw(A.pack(m.a2, m.counter)) : ''}</g>` +
        A.heart(186, 128, 0.35, m.a2, false) + A.heart(214, 128, 0.35, m.a2, false) + A.face(200, 128, 0.5, { gap: 6 }), 'chime', '50% 50%');

      // counter
      s += A.furn(`<rect x="16" y="248" width="368" height="80" rx="12" ${A.f(m.counter)} ${O}/>` +
        `<rect x="34" y="262" width="150" height="52" rx="10" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>` +
        `<rect x="216" y="262" width="150" height="52" rx="10" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>` +
        A.face(108, 286, 0.85, { mouth: 'w' }) + A.heart(292, 288, 0.8, m.a2), 'squish');
      s += `<rect x="6" y="238" width="388" height="14" rx="7" fill="${m.wood}" ${O}/>`;

      // checkered floor
      s += `<rect y="326" width="400" height="74" fill="${m.floor}"/>`;
      for (let y = 326, row = 0; y < 400; y += 25, row++) for (let x = row % 2 ? 0 : 25; x < 400; x += 50) s += `<rect x="${x}" y="${y}" width="25" height="25" fill="${m.floor2}"/>`;
      s += `<path d="M0,326 H400" ${O}/>`;

      // striped awning with a scalloped edge
      for (let i = 0; i < 10; i++) {
        const c = i % 2 ? '#FFFFFF' : m.wall2;
        s += `<rect x="${i * 40}" y="0" width="40" height="44" fill="${c}"/>`;
        s += `<path d="M${i * 40},43 a20,20 0 0 0 40,0Z" fill="${c}" ${O}/>`;
      }
      // pendant lamps
      for (const x of [120, 280]) {
        s += A.furn(A.line(`M${x},44 V76`, 2) + `<ellipse cx="${x}" cy="104" rx="24" ry="14" fill="#FFF3B0" opacity=".55" class="twinkle"/>` +
          `<path d="M${x - 22},98 Q${x - 22},74 ${x},74 Q${x + 22},74 ${x + 22},98Z" ${A.f(m.a2)} ${O}/>` + A.face(x, 88, 0.6), 'chime', '50% 0%');
      }
      s += A.sprinkles(r, { x: 30, y: 180, w: 340, h: 50 }, 6, ['#fff', m.a2]);
      return s;
    }
  });
})(window.BT);
