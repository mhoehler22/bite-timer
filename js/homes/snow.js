/* Snowy Wonderland: the Penguin's home. Aurora sky, a snowflake garland,
   a smiling igloo, snowy pine trees and ice blocks. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const add = BT.addDecor, HOME = ['snow'];
  const PINE = '#A9E5BB';

  /* ---- decorations that belong here ---- */
  add({
    id: 'snowman', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 66, sound: 'boop',
    draw: p => `<circle cx="0" cy="-18" r="18" fill="#FFFFFF" ${O}/>` +
      `<circle cx="0" cy="-46" r="13" fill="#FFFFFF" ${O}/>` +
      `<path d="M-14,-36 Q0,-29 14,-36 L14,-31 Q0,-24 -14,-31Z" fill="${p.c}" ${O2}/><path d="M7,-32 l2,11 l6,-1 l-2,-10Z" fill="${p.c}" ${O2}/>` +
      A.face(0, -48, 0.6, { gap: 6, mouth: 'none' }) + `<path d="M0,-44 L8,-42 L0,-40Z" fill="#FFB37A" stroke="#FFB37A" stroke-width="1"/>` +
      `<circle cx="0" cy="-20" r="2" fill="${PLUM}"/><circle cx="0" cy="-11" r="2" fill="${PLUM}"/>` +
      `<circle cx="-13" cy="-52" r="5" fill="${p.acc}" ${O2}/><circle cx="13" cy="-52" r="5" fill="${p.acc}" ${O2}/>` + A.line('M-13,-57 Q0,-66 13,-57', 2.4)
  });
  add({
    id: 'snowflake', homes: HOME, anchors: ['hang', 'air'], origin: 'center', h: 38, sound: 'sparkle',
    draw: p => {
      let d = '';
      for (let a = 0; a < 360; a += 60) {
        const rad = a * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
        const P = (x, y) => `${A.n(x * c - y * s)},${A.n(x * s + y * c)}`;
        d += `M${P(0, 0)} L${P(0, -17)} M${P(0, -10)} L${P(-5, -14)} M${P(0, -10)} L${P(5, -14)} `;
      }
      return A.limb(d, p.c, 3.5) + `<circle r="8" fill="#fff" ${O2}/>` + A.face(0, 0, 0.42, { gap: 4, cheeks: false });
    }
  });
  add({
    id: 'mitten', homes: HOME, anchors: ['hang'], origin: 'top', h: 46, sound: 'squish',
    draw: p => A.line('M0,0 V8') +
      `<path d="M-11,40 L-11,20 Q-11,8 0,8 Q11,8 11,20 L11,40Z" ${A.f(p.c)} ${O}/>` +
      `<path d="M-11,22 Q-20,20 -19,28 Q-18,34 -11,32" ${A.f(p.c)} ${O}/>` +
      `<rect x="-13" y="38" width="26" height="9" rx="4" fill="${p.acc}" ${O2}/>` + A.heart(1, 24, 0.35, p.acc, false)
  });
  add({
    id: 'cocoa', homes: HOME, anchors: ['shelf', 'floor'], origin: 'bottom', h: 46, sound: 'chime',
    draw: p => A.limb('M14,-23 q9,0 9,8 q0,8 -9,8', p.c, 4) +
      `<rect x="-15" y="-30" width="30" height="30" rx="7" ${A.f(p.c)} ${O}/>` +
      A.union(['<circle cx="-8" cy="-32" r="6"/>', '<circle cx="1" cy="-36" r="7"/>', '<circle cx="9" cy="-31" r="5.5"/>', '<rect x="-14" y="-33" width="28" height="5" rx="2.5"/>'], '#FFFFFF', 2) +
      `<rect x="-5" y="-42" width="7" height="6" rx="2" fill="#FFD6E7" ${O2}/>` + A.face(0, -14, 0.7)
  });
  add({
    id: 'pine', homes: HOME, anchors: ['floor'], origin: 'bottom', h: 68, sound: 'chime',
    draw: p => {
      const g = A.mix(p.c, PINE, 0.7);
      return `<rect x="-4" y="-12" width="8" height="12" rx="2" fill="#E7C49F" ${O2}/>` +
        [[-12, 24], [-28, 19], [-43, 14]].map(([y, w]) => `<path d="M${-w},${y} L0,${y - 22} L${w},${y}Z" fill="${g}" stroke="${PLUM}" stroke-width="3" stroke-linejoin="round"/>`).join('') +
        `<path d="M-9,-47 L0,-57 L9,-47 Q4,-44 0,-47 Q-4,-44 -9,-47Z" fill="#fff"/>` +
        `<path transform="translate(0 -60) scale(.3)" d="${A.starPath(21, 12)}" fill="#FFE89C" stroke="${PLUM}" stroke-width="7" stroke-linejoin="round"/>` +
        A.face(0, -22, 0.5, { gap: 6 });
    }
  });

  /* ---- the home ---- */
  BT.addHome({
    id: 'snow', label: 'Snowy Wonderland',
    contrast: ['wall'],
    noShared: ['cactus', 'plant', 'lamp', 'frame', 'books', 'roundPillow', 'butterfly'],
    moods: [
      { wall: '#DCE9FF', wall2: '#C2F0DF', aur: '#E7D6FF', floor: '#FFFFFF', floor2: '#E2ECFF', ice: '#CFE6FF', a2: '#FFB7D5' },
      { wall: '#EDE3FF', wall2: '#FFD3E3', aur: '#CFEFFF', floor: '#FDFBFF', floor2: '#E9E1FA', ice: '#E1D6FF', a2: '#A9EEC9' },
      { wall: '#FFE9F1', wall2: '#D4E6FF', aur: '#FFF1C2', floor: '#FFFFFF', floor2: '#F3E6EE', ice: '#D8ECFF', a2: '#CDB4F6' },
      { wall: '#D9F3F0', wall2: '#E3D5FF', aur: '#FFD3E3', floor: '#FFFFFF', floor2: '#DDF0EE', ice: '#C9F0EA', a2: '#FFE89C' }
    ],
    host: { x: 200, y: 372, s: 1.1, pose: 'sit', a: 'floor' },
    slots: [
      { a: 'hang', x: 50, y: 30, s: 0.6 }, { a: 'hang', x: 150, y: 30, s: 0.6 }, { a: 'hang', x: 250, y: 30, s: 0.6 }, { a: 'hang', x: 350, y: 30, s: 0.6 },
      { a: 'wall', x: 112, y: 130, s: 0.5 }, { a: 'wall', x: 290, y: 124, s: 0.5 },
      { a: 'shelf', x: 108, y: 298, s: 0.46 }, { a: 'shelf', x: 292, y: 298, s: 0.46 },
      { a: 'big', x: 48, y: 338, s: 0.78 }, { a: 'big', x: 352, y: 338, s: 0.78 },
      { a: 'floor', x: 58, y: 394, s: 0.76 }, { a: 'floor', x: 135, y: 396, s: 0.74 }, { a: 'floor', x: 268, y: 396, s: 0.74 }, { a: 'floor', x: 345, y: 394, s: 0.76 }
    ],
    air: { x: 40, y: 60, w: 320, h: 110 },
    draw(m, r) {
      let s = `<rect width="400" height="270" ${A.f(m.wall)}/>`;
      s += `<path d="M-10,96 C80,50 140,130 220,84 S340,40 410,86 L410,118 C330,76 270,150 200,118 S70,90 -10,130Z" fill="${m.wall2}" opacity=".7"/>`;
      s += `<path d="M-10,142 C90,108 160,170 250,132 S350,110 410,140 L410,160 C340,136 260,186 180,158 S60,140 -10,170Z" fill="${m.aur}" opacity=".7"/>`;
      s += A.sprinkles(r, { x: 20, y: 50, w: 360, h: 130 }, 10, ['#fff', '#FFF6C8']);

      // far snowy hills
      s += `<ellipse cx="70" cy="262" rx="150" ry="52" fill="#F4F7FF" ${O2}/><ellipse cx="340" cy="266" rx="160" ry="56" fill="#F8F6FF" ${O2}/>`;

      // pine trees
      for (const [x, sc] of [[48, 1.25], [354, 1.1]]) {
        s += A.furn(`<g transform="translate(${x} 270) scale(${sc})">` + BT.decor.pine.draw(A.pack('#A9E5BB', m.a2)) + `</g>`, 'chime');
      }

      // the igloo
      s += A.furn(`<path d="M122,266 Q122,186 200,186 Q278,186 278,266Z" ${A.f(m.ice)} ${O}/>` +
        A.line('M134,236 H266 M128,256 H272 M146,214 H254 M168,196 H232 M170,236 V256 M230,236 V256 M200,214 V236 M150,214 V236 M250,214 V236', 2, PLUM, 'opacity=".2"') +
        `<path d="M178,266 L178,246 Q178,228 200,228 Q222,228 222,246 L222,266Z" fill="${A.deep(m.ice, 0.2)}" ${O}/>` +
        A.face(200, 208, 0.8), 'boop');

      // snowy ground
      s += `<path d="M0,268 Q60,256 120,266 T240,264 T400,268 V400 H0Z" fill="${m.floor}" ${O}/>`;
      for (let i = 0; i < 6; i++) s += `<ellipse cx="${A.n(r() * 400)}" cy="${A.n(300 + r() * 90)}" rx="${A.n(14 + r() * 16)}" ry="4" fill="${m.floor2}"/>`;

      // ice blocks
      for (const x of [108, 292]) s += A.furn(`<rect x="${x - 26}" y="296" width="52" height="34" rx="7" ${A.f(m.ice)} ${O}/>` + A.shine(x - 14, 304, 6, 3, 0), 'chime');

      // snowflake garland
      const sg = A.sag(0, 14, 400, 14, 4, 16);
      s += A.line(sg.d, 2);
      sg.pins.slice(1, -1).forEach(([x, y]) => { s += `<g transform="translate(${x} ${y + 6}) scale(.45)">` + BT.decor.snowflake.draw(A.pack('#ffffff')) + `</g>`; });

      // falling snow
      for (let i = 0; i < 14; i++) s += `<circle class="fall" style="animation-delay:${-(r() * 8).toFixed(2)}s" cx="${A.n(r() * 400)}" cy="${A.n(r() * 260)}" r="${A.n(1.5 + r() * 2)}" fill="#fff"/>`;
      return s;
    }
  });
})(window.BT);
