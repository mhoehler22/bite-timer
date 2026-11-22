/* Decorations that can show up in any home (unless a home opts out with noShared).
   Home-specific decorations live in each home's own file. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor;

  add({
    id: 'heartPillow', anchors: ['floor', 'shelf'], origin: 'bottom', h: 44, sound: 'squish',
    draw: p => `<path d="M0,-3 C-10,-10 -30,-18 -28,-32 C-26,-44 -10,-46 0,-35 C10,-46 26,-44 28,-32 C30,-18 10,-10 0,-3Z" ${A.f(p.c)} ${O}/>` +
      A.shine(-15, -35, 5, 3.5) + A.face(0, -24, 0.8, { mouth: 'w' })
  });

  add({
    id: 'roundPillow', anchors: ['floor', 'shelf'], origin: 'bottom', h: 40, sound: 'squish',
    draw: p => `<path d="M-25,-4 Q-30,-20 -25,-36 Q0,-41 25,-36 Q30,-20 25,-4 Q0,1 -25,-4Z" ${A.f(p.c)} ${O}/>` +
      [[-25, -36], [25, -36], [-25, -4], [25, -4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${p.acc}" ${O2}/>`).join('') +
      A.shine(-14, -30, 5, 3) + A.face(0, -20, 0.8)
  });

  add({
    id: 'plant', anchors: ['floor', 'shelf'], origin: 'bottom', h: 62, sound: 'chime',
    draw: p => A.leaf(-6, -27, 1.4, -38, '#A9E5BB') + A.leaf(6, -27, 1.4, 38, '#8FDCA8') + A.leaf(0, -29, 1.5, 0, '#B8EFC6') +
      `<path d="M-15,-28 L15,-28 L11,0 L-11,0Z" ${A.f(p.c)} ${O}/>` +
      `<rect x="-18" y="-33" width="36" height="8" rx="4" ${A.f(p.c)} ${O}/>` + A.face(0, -15, 0.7)
  });

  add({
    id: 'cactus', anchors: ['shelf', 'floor'], origin: 'bottom', h: 56, sound: 'chime',
    draw: p => A.limb('M-10,-31 h-5 q-4,0 -4,-5 v-6', '#B5EBC3', 7) + A.limb('M10,-37 h5 q4,0 4,-5 v-4', '#B5EBC3', 7) +
      `<rect x="-11" y="-52" width="22" height="36" rx="11" fill="#B5EBC3" ${O}/>` +
      `<circle cx="0" cy="-53" r="4.5" fill="${p.acc}" ${O2}/>` + A.face(0, -38, 0.6, { gap: 8 }) +
      `<path d="M-14,-18 L14,-18 L11,0 L-11,0Z" ${A.f(p.c)} ${O}/>`
  });

  add({
    id: 'lamp', anchors: ['floor'], origin: 'bottom', h: 108, scale: 0.85, sound: 'chime',
    draw: p => `<circle cx="0" cy="-84" r="27" fill="#FFF3B0" opacity=".5" class="twinkle"/>` +
      `<ellipse cx="0" cy="-3" rx="14" ry="5" fill="${p.d}" ${O}/>` + A.limb('M0,-4 V-74', p.d, 4) +
      `<path d="M-22,-72 L-13,-102 L13,-102 L22,-72Z" ${A.f(p.c)} ${O}/>` + A.face(0, -86, 0.7)
  });

  add({
    id: 'books', anchors: ['shelf', 'floor'], origin: 'bottom', h: 36, sound: 'squish',
    draw: p => `<rect x="-21" y="-34" width="40" height="11" rx="3" ${A.f(p.acc2)} ${O}/>` +
      `<rect x="-18" y="-23" width="38" height="11" rx="3" ${A.f(p.acc)} ${O}/>` +
      `<rect x="-22" y="-12" width="44" height="12" rx="3" ${A.f(p.c)} ${O}/>` +
      A.line('M12,-31 v5 M-12,-20 v5', 1.6) + A.face(0, -6, 0.5, { gap: 8 })
  });

  add({
    id: 'mug', anchors: ['shelf', 'floor'], origin: 'bottom', h: 46, scale: 0.9, sound: 'chime',
    draw: p => A.line('M-5,-35 q-3,-4 0,-8 q3,-4 0,-8 M5,-35 q-3,-4 0,-8 q3,-4 0,-8', 2, PLUM, 'opacity=".4"') +
      A.limb('M14,-23 q9,0 9,8 q0,8 -9,8', p.c, 4) +
      `<rect x="-15" y="-30" width="30" height="30" rx="7" ${A.f(p.c)} ${O}/>` + A.shine(-8, -22, 2.5, 5, 0) + A.face(0, -14, 0.75)
  });

  add({
    id: 'balloon', anchors: ['air'], origin: 'center', h: 72, sound: 'boing',
    draw: p => A.line('M0,10 q-6,8 0,16 q6,8 0,16', 1.6) +
      `<path d="M-3,11 L3,11 L0,6Z" fill="${p.d}" ${O2}/>` +
      `<ellipse cx="0" cy="-10" rx="17" ry="20" ${A.f(p.c)} ${O}/>` + A.shine(-7, -19, 4, 7, 20) + A.face(0, -8, 0.75)
  });

  add({
    id: 'cloud', anchors: ['air', 'wall'], origin: 'center', h: 36, sound: 'chime',
    draw: p => A.cloud(0, 0, 1.1, A.light(p.c, 0.65))
  });

  add({
    id: 'rainbow', anchors: ['wall', 'air'], origin: 'center', h: 50, sound: 'sparkle',
    draw: p => {
      const arc = (r, w, c) => `<path d="M${-r},12 A${r},${r} 0 0 1 ${r},12" fill="none" stroke="${c}" stroke-width="${w}"/>`;
      return arc(27, 27, PLUM) + arc(36, 6, p.c) + arc(30, 6, p.acc) + arc(24, 6, p.acc2) + arc(18, 6, '#FFFFFF') +
        A.cloud(-28, 13, 0.55, '#fff', false) + A.cloud(28, 13, 0.55, '#fff', true);
    }
  });

  add({
    id: 'star', anchors: ['hang', 'air', 'wall'], origin: 'center', h: 40, sound: 'sparkle',
    draw: p => `<path d="${A.starPath(21, 12)}" ${A.f(p.c)} ${O}/>` + A.shine(-5, -8, 2.5, 4, 25) + A.face(0, 2, 0.6, { gap: 7 })
  });

  add({
    id: 'moon', anchors: ['hang', 'wall', 'air'], origin: 'center', h: 44, sound: 'sparkle',
    draw: p => `<circle r="21" ${A.f(p.c)} ${O}/><circle cx="10" cy="-9" r="4" fill="${p.l}"/><circle cx="-11" cy="-11" r="2.5" fill="${p.l}"/>` +
      A.face(-1, 3, 0.75, { sleepy: true }) + A.sparkle(25, -18, 0.5, '#FFE89C', A.O2)
  });

  add({
    id: 'heartFloat', anchors: ['air', 'wall'], origin: 'center', h: 32, sound: 'chime',
    draw: p => `<path transform="scale(1.45)" d="${A.HEART}" ${A.f(p.c)} stroke="${PLUM}" stroke-width="2.1" stroke-linejoin="round"/>` + A.face(0, -1, 0.6, { gap: 7 })
  });

  add({
    id: 'frame', anchors: ['wall'], origin: 'center', h: 52, sound: 'chime',
    draw: p => {
      const k = A.DECOR.indexOf(p.acc) % 3;
      const inside = k === 0 ? A.heart(0, -2, 0.6, p.acc, false)
        : k === 1 ? `<path transform="translate(0 -2) scale(.4)" d="${A.starPath(21, 12)}" fill="${p.acc}"/>`
          : A.cloud(0, -1, 0.42, '#fff', false);
      return A.line('M-13,-22 L0,-33 L13,-22', 1.8) + `<circle cy="-33" r="2.2" fill="${PLUM}"/>` +
        `<rect x="-22" y="-22" width="44" height="40" rx="7" ${A.f(p.c)} ${O}/>` +
        `<rect x="-15" y="-15" width="30" height="26" rx="4" fill="${A.light(p.acc, 0.65)}" ${O2}/>` + inside;
    }
  });

  add({
    id: 'gift', anchors: ['floor', 'shelf'], origin: 'bottom', h: 50, sound: 'boing',
    draw: p => `<path d="M0,-38 C-6,-50 -18,-48 -12,-38Z" fill="${p.acc}" ${O2}/><path d="M0,-38 C6,-50 18,-48 12,-38Z" fill="${p.acc}" ${O2}/>` +
      `<rect x="-20" y="-30" width="40" height="30" rx="5" ${A.f(p.c)} ${O}/>` +
      `<rect x="-23" y="-38" width="46" height="10" rx="4" ${A.f(p.c)} ${O}/>` +
      `<rect x="-4" y="-38" width="8" height="38" fill="${p.acc}" ${O2}/>` + A.face(0, -15, 0.6, { gap: 10.5, mouth: 'w' })
  });

  add({
    id: 'butterfly', anchors: ['air'], origin: 'center', h: 30, sound: 'sparkle',
    draw: p => `<ellipse cx="-9" cy="-6" rx="9" ry="8" ${A.f(p.c)} ${O2}/><ellipse cx="9" cy="-6" rx="9" ry="8" ${A.f(p.c)} ${O2}/>` +
      `<ellipse cx="-7" cy="6" rx="6" ry="6" fill="${p.acc}" ${O2}/><ellipse cx="7" cy="6" rx="6" ry="6" fill="${p.acc}" ${O2}/>` +
      `<ellipse cx="0" cy="0" rx="3.5" ry="11" fill="${PLUM}"/>` + A.line('M-1,-10 q-3,-6 -6,-7 M1,-10 q3,-6 6,-7', 1.5)
  });

  add({
    id: 'starJar', anchors: ['shelf', 'floor'], origin: 'bottom', h: 44, sound: 'sparkle',
    draw: p => `<circle cx="0" cy="-17" r="19" fill="#FFF3B0" opacity=".45" class="twinkle"/>` +
      `<rect x="-15" y="-34" width="30" height="34" rx="9" fill="#ffffff" fill-opacity=".6" ${O}/>` +
      [[-7, -9], [7, -26], [8, -9]].map(([x, y]) => `<path transform="translate(${x} ${y}) scale(.25)" d="${A.starPath(21, 12)}" fill="#FFE89C" stroke="${PLUM}" stroke-width="6" stroke-linejoin="round"/>`).join('') +
      A.face(-2, -21, 0.55, { gap: 7 }) +
      `<rect x="-13" y="-41" width="26" height="8" rx="3" ${A.f(p.c)} ${O}/>`
  });

  add({
    id: 'bulb', anchors: ['hang'], origin: 'top', h: 34, sound: 'chime',
    draw: p => A.line('M0,0 V8') + `<rect x="-4" y="7" width="8" height="6" rx="1.5" fill="${PLUM}"/>` +
      `<circle cx="0" cy="23" r="15" fill="${p.c}" opacity=".4" class="twinkle"/>` +
      `<ellipse cx="0" cy="23" rx="9" ry="11" ${A.f(p.c)} ${O2}/>` + A.face(0, 24, 0.5, { gap: 5, cheeks: false })
  });
})(window.BT);
