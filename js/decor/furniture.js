/* Big furniture: the larger pieces. They fill each home's "big" spots first, then ordinary floor spots.
   Each piece lists the homes it belongs in. Drawn with feet on y = 0, about 80 wide and 50-110 tall. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = d => BT.addDecor(Object.assign({ anchors: ['big', 'floor'], origin: 'bottom' }, d));
  const WOOD = '#E7C49F', GOLD = '#FFE08A', GREEN = '#A9E5BB', GREEN2 = '#8FDCA8';
  const INDOOR = ['livingroom', 'treehouse'];
  const feet = (xs, y = -7, h = 7) => xs.map(x => `<rect x="${x - 3}" y="${y}" width="6" height="${h}" rx="2" fill="${PLUM}"/>`).join('');
  const drawOther = (id, p) => BT.decor[id] ? BT.decor[id].draw(p) : '';

  add({
    id: 'armchair', homes: ['livingroom', 'treehouse', 'bamboo', 'bakery'], h: 82, sound: 'squish',
    draw: p => `<path d="M-34,-38 L-34,-62 Q-34,-80 -16,-80 L16,-80 Q34,-80 34,-62 L34,-38Z" ${A.f(p.c)} ${O}/>` +
      [-14, 0, 14].map(x => `<circle cx="${x}" cy="-47" r="2" fill="${p.d}"/>`).join('') +
      `<rect x="-34" y="-42" width="68" height="22" rx="10" ${A.f(p.l)} ${O}/>` +
      `<rect x="-47" y="-56" width="20" height="44" rx="10" ${A.f(p.c)} ${O}/><rect x="27" y="-56" width="20" height="44" rx="10" ${A.f(p.c)} ${O}/>` +
      `<rect x="-42" y="-20" width="84" height="13" rx="6" fill="${p.d}" ${O}/>` + feet([-34, 34]) +
      A.shine(-20, -71, 6, 3, -10) + A.face(0, -63, 0.85, { mouth: 'w' })
  });

  add({
    id: 'bookshelf', homes: ['livingroom', 'treehouse', 'castle'], h: 106, sound: 'chime',
    draw: p => {
      const wood = A.mix(p.c, WOOD, 0.55), inside = A.light(p.c, 0.6);
      const books = (y, list) => list.map(([x, w, h, c]) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="1.5" fill="${c}" ${O2}/>`).join('');
      return `<rect x="-34" y="-104" width="68" height="98" rx="8" ${A.f(wood)} ${O}/>` +
        `<rect x="-27" y="-97" width="54" height="26" rx="4" fill="${inside}" ${O2}/>` +
        `<rect x="-27" y="-66" width="54" height="26" rx="4" fill="${inside}" ${O2}/>` +
        books(-71, [[-24, 7, 22, p.acc], [-16, 6, 19, p.acc2], [-9, 8, 23, p.c], [0, 6, 18, p.acc]]) +
        `<circle cx="17" cy="-79" r="7" fill="${p.acc2}" ${O2}/>` +
        A.leaf(-14, -52, 0.8, -30, GREEN) + A.leaf(-14, -52, 0.8, 30, GREEN2) +
        `<path d="M-21,-52 h14 l-2,12 h-10Z" fill="${p.acc}" ${O2}/>` +
        books(-40, [[4, 7, 20, p.c], [12, 6, 22, p.acc2], [19, 6, 17, p.acc]]) +
        `<rect x="-27" y="-35" width="54" height="24" rx="4" ${A.f(p.c)} ${O2}/>` + A.face(0, -24, 0.6, { gap: 8 }) +
        feet([-26, 26]);
    }
  });

  add({
    id: 'dresser', homes: INDOOR, h: 94, sound: 'boop',
    draw: p => `<rect x="-40" y="-70" width="80" height="62" rx="10" ${A.f(p.c)} ${O}/>` +
      `<rect x="-44" y="-76" width="88" height="10" rx="5" fill="${p.d}" ${O}/>` +
      [-60, -42, -24].map(y => `<rect x="-32" y="${y}" width="64" height="15" rx="5" fill="${p.l}" ${O2}/>`).join('') +
      A.face(0, -53, 0.55, { gap: 9 }) +
      [-35, -17].map(y => `<circle cx="-14" cy="${y + 0.5}" r="2.6" fill="${p.acc}" ${O2}/><circle cx="14" cy="${y + 0.5}" r="2.6" fill="${p.acc}" ${O2}/>`).join('') +
      feet([-32, 32], -9, 9) +
      `<rect x="17" y="-88" width="12" height="12" rx="4" fill="${p.acc}" ${O2}/>` + A.line('M23,-88 v-4', 1.8, '#8FDCA8') +
      `<circle cx="23" cy="-94" r="4.5" fill="#FFB7D5" ${O2}/>`
  });

  add({
    id: 'piano', homes: ['livingroom', 'bakery', 'castle', 'cove'], h: 88, sound: 'sparkle',
    draw: p => `<rect x="-42" y="-86" width="84" height="48" rx="10" ${A.f(p.c)} ${O}/>` +
      `<rect x="-20" y="-80" width="40" height="15" rx="3" fill="#FFFBF2" ${O2}/>` +
      A.line('M-10.5,-69 v-8 l6,-2 v8 M8.5,-71 v-6', 1.4) +
      `<circle cx="-12.5" cy="-69" r="2" fill="${PLUM}"/><circle cx="-6.5" cy="-71" r="2" fill="${PLUM}"/><circle cx="6.5" cy="-71" r="2" fill="${PLUM}"/>` +
      A.face(0, -51, 0.65, { gap: 9 }) +
      `<rect x="-46" y="-40" width="92" height="11" rx="4" fill="#fff" ${O}/>` +
      [-36, -27, -12, -3, 6, 21, 30].map(x => `<rect x="${x}" y="-40" width="5" height="6" rx="1" fill="${PLUM}"/>`).join('') +
      `<rect x="-40" y="-30" width="80" height="24" rx="6" ${A.f(p.c)} ${O}/>` + feet([-34, 34]) +
      `<circle cx="-5" cy="-11" r="2.4" fill="${GOLD}" ${O2}/><circle cx="5" cy="-11" r="2.4" fill="${GOLD}" ${O2}/>`
  });

  add({
    id: 'beanbag', homes: INDOOR, h: 58, sound: 'squish',
    draw: p => `<path d="M-40,-4 Q-46,-30 -20,-46 Q0,-58 20,-46 Q46,-30 40,-4 Q0,4 -40,-4Z" ${A.f(p.c)} ${O}/>` +
      A.line('M-24,-38 q8,8 4,20 M22,-36 q-6,10 -2,22', 2, PLUM, 'opacity=".25"') + A.shine(-18, -40, 7, 4) +
      A.face(0, -23, 0.9, { mouth: 'w' })
  });

  add({
    id: 'toyChest', homes: ['livingroom', 'treehouse', 'castle', 'snow'], h: 72, sound: 'boing',
    draw: p => `<circle cx="20" cy="-62" r="10" fill="${p.acc}" ${O}/>` + A.line('M11,-65 q9,6 18,0', 1.8, '#fff') +
      `<circle cx="-24" cy="-64" r="6" fill="#E7C49F" ${O2}/><circle cx="-12" cy="-65" r="6" fill="#E7C49F" ${O2}/>` +
      `<rect x="-38" y="-44" width="76" height="40" rx="8" ${A.f(p.c)} ${O}/>` +
      `<path d="M-40,-44 Q-40,-60 -24,-60 L24,-60 Q40,-60 40,-44Z" ${A.f(p.l)} ${O}/>` +
      A.heart(22, -22, 0.55, p.acc) + A.face(-8, -25, 0.7) + feet([-30, 30], -5, 5)
  });

  add({
    id: 'bigPlant', homes: ['livingroom', 'bakery', 'treehouse', 'bamboo'], h: 108, sound: 'chime',
    draw: p => [[-58, 0.75, GREEN2], [58, 0.75, GREEN2], [-28, 0.95, GREEN], [28, 0.95, GREEN], [0, 1.08, GREEN]].map(([r, s, c]) =>
      `<g transform="translate(0 -36) rotate(${r}) scale(${s})"><path d="M0,0 C-17,-14 -17,-46 0,-62 C17,-46 17,-14 0,0Z" fill="${c}" ${O2}/>` +
      A.line('M0,-4 V-54 M0,-22 l-8,-6 M0,-36 l8,-6', 1.6, '#fff', 'opacity=".6"') + `</g>`).join('') +
      `<path d="M-20,-34 L20,-34 L15,0 L-15,0Z" ${A.f(p.c)} ${O}/>` +
      `<rect x="-23" y="-40" width="46" height="9" rx="4.5" ${A.f(p.c)} ${O}/>` + A.face(0, -17, 0.75)
  });

  add({
    id: 'roundTable', homes: ['livingroom', 'bakery', 'garden', 'castle', 'snow', 'bamboo'], h: 70, sound: 'chime',
    draw: p => `<path d="M-42,-46 Q-44,-24 -40,-6 Q-34,-1 -28,-6 Q-21,-1 -14,-6 Q-7,-1 0,-6 Q7,-1 14,-6 Q21,-1 28,-6 Q34,-1 40,-6 Q44,-24 42,-46Z" ${A.f(p.c)} ${O}/>` +
      `<ellipse cx="0" cy="-46" rx="42" ry="9" fill="${p.l}" ${O}/>` +
      `<g transform="translate(-14 -47) scale(.42)">${drawOther('teapot', A.pack(p.acc, p.c))}</g>` +
      `<g transform="translate(20 -47) scale(.48)">${drawOther('cupcake', A.pack(p.acc2, p.c))}</g>` +
      A.face(0, -26, 0.8, { mouth: 'w' })
  });

  add({
    id: 'petBed', homes: ['livingroom', 'treehouse', 'bakery', 'bamboo', 'snow', 'castle'], h: 42, sound: 'squish',
    draw: p => `<ellipse cx="0" cy="-20" rx="43" ry="20" ${A.f(p.c)} ${O}/>` +
      `<ellipse cx="0" cy="-20" rx="30" ry="10" fill="${p.belly}" ${O2}/>` + A.heart(15, -23, 0.42, p.acc) +
      `<path d="M-43,-20 Q-43,0 0,0 Q43,0 43,-20 Q32,-8 0,-8 Q-32,-8 -43,-20Z" ${A.f(p.c)} ${O}/>` +
      A.face(0, -5, 0.5, { gap: 12 })
  });

  add({
    id: 'easel', homes: ['livingroom', 'garden', 'treehouse'], h: 104, sound: 'sparkle',
    draw: p => A.limb('M0,-96 L2,-4', A.deep(WOOD, 0.1), 3) + A.limb('M-22,0 L-6,-100', WOOD, 4) + A.limb('M22,0 L6,-100', WOOD, 4) +
      `<rect x="-26" y="-90" width="52" height="54" rx="4" fill="#FFFDF8" ${O}/>` +
      `<path d="M-23,-40 Q-8,-58 4,-48 Q14,-60 23,-47 L23,-39 L-23,-39Z" fill="${GREEN}"/>` +
      `<circle cx="-8" cy="-70" r="10" fill="${p.c}" ${O2}/>` + A.face(-8, -70, 0.42, { gap: 4.5, cheeks: false }) +
      A.heart(12, -72, 0.42, p.acc, false) +
      `<rect x="-29" y="-38" width="58" height="5" rx="2" fill="${WOOD}" ${O2}/>` + A.line('M8,-40 l14,-6', 2.6, p.acc2)
  });

  /* ---- bakery ---- */
  add({
    id: 'oven', homes: ['bakery'], h: 88, sound: 'chime',
    draw: p => `<rect x="-38" y="-86" width="76" height="80" rx="12" ${A.f(p.c)} ${O}/>` +
      `<rect x="-38" y="-86" width="76" height="20" rx="10" fill="${p.l}" ${O}/>` +
      [-26, -16, 16, 26].map(x => `<circle cx="${x}" cy="-76" r="3.4" fill="#fff" ${O2}/>`).join('') +
      A.face(0, -77, 0.5, { gap: 6 }) +
      `<rect x="-24" y="-62" width="48" height="5" rx="2.5" fill="${GOLD}" ${O2}/>` +
      `<circle cx="0" cy="-35" r="22" fill="#FFE7B0" opacity=".6" class="twinkle"/>` +
      `<rect x="-27" y="-54" width="54" height="38" rx="8" fill="#FFE7B0" ${O2}/>` +
      `<path d="M-14,-24 Q0,-42 14,-24Z" fill="#F3C08A" ${O2}/>` + A.line('M-6,-30 l3,-3 M3,-32 l3,3', 1.4) +
      feet([-30, 30])
  });
  add({
    id: 'bigCake', homes: ['bakery', 'castle'], h: 102, sound: 'sparkle',
    draw: p => {
      const drip = (x0, x1, y) => `<path d="M${x0},${y} H${x1} V${y + 4} Q${x1 - 4},${y + 9} ${x1 - 7},${y + 4} Q${(x0 + x1) / 2},${y + 10} ${x0 + 7},${y + 4} Q${x0 + 4},${y + 9} ${x0},${y + 4}Z" fill="#fff" ${O2}/>`;
      return `<path d="M-8,0 L-5,-14 L5,-14 L8,0Z" fill="#FFFDF8" ${O2}/><ellipse cx="0" cy="-15" rx="34" ry="5" fill="#FFFDF8" ${O2}/>` +
        `<rect x="-28" y="-46" width="56" height="30" rx="6" ${A.f(p.c)} ${O}/>` + drip(-28, 28, -46) +
        `<rect x="-20" y="-68" width="40" height="22" rx="6" ${A.f(p.acc)} ${O}/>` + drip(-20, 20, -68) +
        `<rect x="-12" y="-86" width="24" height="18" rx="5" ${A.f(p.acc2)} ${O}/>` + drip(-12, 12, -86) +
        A.line('M0,-90 q2,-5 5,-6', 1.8) + `<circle cx="0" cy="-91" r="5" fill="#FF8FB1" ${O2}/>` +
        A.line('M-18,-58 l3,-2 M10,-60 l3,1 M-4,-55 l2,2', 2, '#fff') + A.face(0, -29, 0.75);
    }
  });

  /* ---- mermaid cove (and castle) ---- */
  add({
    id: 'treasureChest', homes: ['cove', 'castle'], h: 74, sound: 'sparkle',
    draw: p => {
      const wood = A.mix(p.c, '#E2B07E', 0.55);
      return `<path d="M-36,-46 L-34,-70 Q0,-80 34,-70 L36,-46Z" fill="${A.deep(wood, 0.08)}" ${O}/>` +
        [[-22, -48], [-10, -52], [2, -50], [14, -53], [26, -48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${GOLD}" ${O2}/>`).join('') +
        `<path d="M-2,-60 l6,-7 l6,7 l-6,8Z" fill="${p.acc}" ${O2}/><circle cx="-16" cy="-58" r="4" fill="#FFFBF5" ${O2}/>` +
        `<rect x="-38" y="-48" width="76" height="44" rx="7" fill="${wood}" ${O}/>` +
        `<rect x="-38" y="-48" width="76" height="7" fill="${GOLD}" ${O2}/>` +
        `<rect x="-28" y="-41" width="7" height="37" fill="${GOLD}" ${O2}/><rect x="21" y="-41" width="7" height="37" fill="${GOLD}" ${O2}/>` +
        `<rect x="-7" y="-40" width="14" height="13" rx="3" fill="${GOLD}" ${O2}/>` + A.heart(0, -33.5, 0.22, PLUM, false) +
        A.face(0, -16, 0.65, { gap: 8 }) + A.sparkle(30, -64, 0.6, '#fff', A.O2);
    }
  });
  add({
    id: 'sandcastle', homes: ['cove'], h: 86, sound: 'boop',
    draw: p => {
      const sand = '#F7DDAA';
      const crenel = (x, w, y) => { let s = ''; for (let i = 0; i < 3; i++) s += `<rect x="${x + i * w / 2.5}" y="${y - 6}" width="${w / 5}" height="7" fill="${sand}" ${O2}/>`; return s; };
      return A.line('M0,-70 V-86', 2) + `<path d="M0,-86 l15,4 l-15,5Z" fill="${p.c}" ${O2}/>` +
        crenel(-40, 22, -48) + crenel(18, 22, -48) + crenel(-16, 32, -70) +
        `<rect x="-40" y="-48" width="22" height="44" fill="${sand}" ${O}/><rect x="18" y="-48" width="22" height="44" fill="${sand}" ${O}/>` +
        `<rect x="-16" y="-70" width="32" height="66" fill="${sand}" ${O}/>` +
        `<path d="M-8,-4 L-8,-18 Q-8,-26 0,-26 Q8,-26 8,-18 L8,-4Z" fill="${A.deep(sand, 0.22)}" ${O2}/>` +
        `<rect x="-44" y="-8" width="88" height="8" rx="4" fill="${sand}" ${O}/>` +
        `<path d="M-29,-30 l-5,-8 h10Z M29,-30 l-5,-8 h10Z" fill="${p.acc}" ${O2}/>` +
        A.face(0, -48, 0.65, { gap: 7 });
    }
  });
  add({
    id: 'bigShell', homes: ['cove'], h: 78, sound: 'chime',
    draw: p => `<path d="M-40,-30 Q-44,-74 0,-76 Q44,-74 40,-30Z" ${A.f(p.c)} ${O}/>` +
      A.line('M0,-32 L-26,-66 M0,-32 L-9,-74 M0,-32 L9,-74 M0,-32 L26,-66', 1.6, PLUM, 'opacity=".3"') +
      `<circle cx="0" cy="-32" r="14" fill="#FFFBF5" ${O}/>` + A.shine(-5, -38, 3, 4.5, 30) + A.face(0, -31, 0.6, { gap: 6 }) +
      `<path d="M-42,-30 Q-40,0 0,-2 Q40,0 42,-30 Q20,-18 0,-20 Q-20,-18 -42,-30Z" ${A.f(p.c)} ${O}/>` +
      A.line('M0,-4 L-24,-22 M0,-4 L0,-18 M0,-4 L24,-22', 1.6, PLUM, 'opacity=".3"')
  });

  /* ---- strawberry garden ---- */
  add({
    id: 'bench', homes: ['garden', 'snow'], h: 68, sound: 'boop',
    draw: p => `<rect x="-38" y="-66" width="6" height="46" fill="${p.d}" ${O2}/><rect x="32" y="-66" width="6" height="46" fill="${p.d}" ${O2}/>` +
      `<rect x="-44" y="-66" width="88" height="12" rx="5" ${A.f(p.c)} ${O}/>` +
      `<rect x="-44" y="-50" width="88" height="10" rx="5" ${A.f(p.c)} ${O}/>` +
      `<rect x="-48" y="-32" width="96" height="10" rx="5" ${A.f(p.c)} ${O}/>` +
      `<rect x="-42" y="-22" width="6" height="22" fill="${p.d}" ${O2}/><rect x="36" y="-22" width="6" height="22" fill="${p.d}" ${O2}/>` +
      A.face(0, -60, 0.55, { gap: 10 }) + A.heart(-28, -45, 0.32, p.acc, false) + A.heart(28, -45, 0.32, p.acc, false)
  });
  add({
    id: 'birdhouse', homes: ['garden', 'treehouse'], h: 112, sound: 'peep',
    draw: p => `<ellipse cx="0" cy="-3" rx="14" ry="4" fill="${GREEN}" ${O2}/>` + A.limb('M0,-2 V-60', '#D9B48C', 6) +
      `<rect x="-22" y="-96" width="44" height="38" rx="6" ${A.f(p.c)} ${O}/>` +
      `<path d="M-30,-92 L0,-112 L30,-92Z" fill="${p.acc}" stroke="${PLUM}" stroke-width="3" stroke-linejoin="round"/>` +
      A.face(0, -88, 0.6, { mouth: 'none', gap: 9 }) + `<circle cx="0" cy="-74" r="6.5" fill="${PLUM}"/>` +
      A.limb('M-6,-63 h12', '#D9B48C', 2)
  });
  add({
    id: 'wheelbarrow', homes: ['garden'], h: 64, sound: 'boing',
    draw: p => A.limb('M-14,-34 L-48,-46', '#D9B48C', 4) + A.limb('M-24,-28 L-28,-3', '#D9B48C', 4) +
      [[-16, -50, p.acc], [0, -56, '#FFE89C'], [14, -52, p.acc2], [27, -47, '#FFB7D5']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}" ${O2}/><circle cx="${x}" cy="${y}" r="2.5" fill="#fff"/>`).join('') +
      A.leaf(-6, -46, 0.7, -50, GREEN) + A.leaf(22, -46, 0.7, 40, GREEN2) +
      `<path d="M-30,-46 L36,-46 L26,-20 L-22,-20Z" ${A.f(p.c)} ${O}/>` +
      `<circle cx="16" cy="-12" r="11" fill="#fff" ${O}/><circle cx="16" cy="-12" r="3" fill="${PLUM}"/>` +
      A.face(3, -34, 0.65, { gap: 8 })
  });

  /* ---- bamboo grove (and garden) ---- */
  add({
    id: 'bonsai', homes: ['bamboo'], h: 90, sound: 'chime',
    draw: p => A.limb('M0,-20 C-4,-36 12,-46 2,-58 C-6,-68 -16,-62 -20,-70', '#C9A27E', 7) +
      A.union(['<circle cx="-22" cy="-76" r="14"/>', '<circle cx="-6" cy="-82" r="13"/>', '<circle cx="10" cy="-72" r="12"/>', '<circle cx="24" cy="-62" r="11"/>'], GREEN) +
      `<path d="M-38,-20 L38,-20 L30,0 L-30,0Z" ${A.f(p.c)} ${O}/>` +
      `<rect x="-42" y="-25" width="84" height="7" rx="3.5" ${A.f(p.c)} ${O2}/>` + A.face(0, -10, 0.65, { gap: 9 })
  });
  add({
    id: 'parasol', homes: ['bamboo', 'garden'], h: 102, sound: 'chime',
    draw: p => A.limb('M0,-78 L4,-6', '#C9A27E', 3) + A.line('M4,-6 q1,6 7,4', 2.6, '#C9A27E') +
      `<path d="M-46,-74 Q0,-118 46,-74 Q34,-80 23,-74 Q11,-80 0,-74 Q-11,-80 -23,-74 Q-34,-80 -46,-74Z" ${A.f(p.c)} ${O}/>` +
      A.line('M0,-95 L-23,-75 M0,-95 L0,-75 M0,-95 L23,-75', 1.4, PLUM, 'opacity=".3"') +
      `<circle cx="0" cy="-97" r="3.5" fill="${p.acc}" ${O2}/>` + A.face(-16, -84, 0.45, { gap: 5 })
  });

  /* ---- snowy wonderland ---- */
  add({
    id: 'sled', homes: ['snow'], h: 46, sound: 'boing',
    draw: p => A.limb('M-30,-6 V-16 M14,-6 V-16', p.d, 3) +
      A.limb('M-44,-4 H30 Q46,-4 44,-18 Q42,-26 34,-22', p.dd, 4) +
      `<path d="M-28,-26 Q-18,-42 2,-35 Q16,-30 22,-26Z" fill="${p.acc}" ${O2}/>` +
      `<rect x="-40" y="-27" width="76" height="12" rx="5" ${A.f(p.c)} ${O}/>` +
      A.face(-4, -21, 0.5, { gap: 9 })
  });
  add({
    id: 'snowFort', homes: ['snow'], h: 76, sound: 'boop',
    draw: p => A.line('M30,-44 V-74', 2) + `<path d="M30,-74 l16,5 l-16,5Z" fill="${p.c}" ${O2}/>` +
      `<path d="M-44,0 V-34 H-36 V-44 H-22 V-34 H-8 V-44 H8 V-34 H22 V-44 H36 V-34 H44 V0Z" fill="${A.light(p.c, 0.82)}" ${O}/>` +
      A.line('M-44,-17 H44 M-22,-34 V-17 M22,-34 V-17 M-32,-17 V0 M32,-17 V0', 1.6, PLUM, 'opacity=".25"') +
      [[48, -6], [56, -6], [52, -13]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#fff" ${O2}/>`).join('') +
      A.face(0, -26, 0.6, { gap: 8 })
  });

  /* ---- cloud castle ---- */
  add({
    id: 'throne', homes: ['castle', 'cove'], h: 112, sound: 'sparkle',
    draw: p => `<path d="M-30,-40 L-30,-84 Q-30,-104 0,-104 Q30,-104 30,-84 L30,-40Z" ${A.f(p.c)} ${O}/>` +
      `<path d="M-23,-44 L-23,-82 Q-23,-97 0,-97 Q23,-97 23,-82 L23,-44" fill="none" stroke="${GOLD}" stroke-width="3"/>` +
      `<g transform="translate(0 -101) scale(.5)">${drawOther('crown', A.pack(p.acc))}</g>` +
      A.face(0, -79, 0.7) + A.heart(0, -60, 0.5, p.acc) +
      `<rect x="-42" y="-56" width="14" height="36" rx="6" fill="${GOLD}" ${O}/><rect x="28" y="-56" width="14" height="36" rx="6" fill="${GOLD}" ${O}/>` +
      `<rect x="-34" y="-46" width="68" height="14" rx="7" fill="${p.acc}" ${O}/>` +
      `<rect x="-36" y="-32" width="72" height="24" rx="6" ${A.f(p.c)} ${O}/>` + feet([-30, 30], -8, 8)
  });
})(window.BT);
