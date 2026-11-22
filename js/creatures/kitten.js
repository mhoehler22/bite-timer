/* Kitten: round, with a little bow. Lives in the Living Room. */
(function (BT) {
  const A = BT.art, { O, O2 } = A;
  const INNER = '#FFC4D8';

  const bow = (x, y, c) => `<g transform="translate(${x} ${y}) rotate(18)">` +
    `<path d="M0,0 C-6,-10 -16,-6 -12,2 C-9,7 -3,4 0,0Z" fill="${c}" ${O2}/>` +
    `<path d="M0,0 C6,-10 16,-6 12,2 C9,7 3,4 0,0Z" fill="${c}" ${O2}/>` +
    `<circle r="3.4" fill="${c}" ${O2}/></g>`;

  BT.addCreature({
    id: 'kitten', label: 'Kitten', home: 'livingroom', color: 'pink', sound: 'purr',
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => A.limb('M34,-10 C58,-8 60,-40 46,-48', p.c, 9) +
          `<path d="M-38,-46 L-33,-84 L-12,-64Z" ${A.f(p.c)} ${O}/><path d="M-31,-58 L-30,-76 L-18,-64Z" fill="${INNER}"/>` +
          `<path d="M38,-46 L33,-84 L12,-64Z" ${A.f(p.c)} ${O}/><path d="M31,-58 L30,-76 L18,-64Z" fill="${INNER}"/>` +
          `<ellipse cx="-16" cy="-3" rx="10" ry="6" fill="${p.l}" ${O}/><ellipse cx="16" cy="-3" rx="10" ry="6" fill="${p.l}" ${O}/>` +
          `<path d="${A.blob(82, 66)}" ${A.f(p.c)} ${O}/>` + A.shine(-22, -50, 7, 4.5) +
          A.line('M-6,-62 v6 M0,-63 v7 M6,-62 v6', 2.4, p.d) +
          A.face(0, -36, 1, { mouth: 'w', gap: 12, sleepy: p.sleepy }) +
          A.line('M-24,-33 l-11,-2 M-24,-28 l-11,2 M24,-33 l11,-2 M24,-28 l11,2', 1.6) +
          bow(24, -63, p.acc)
      }
    }
  });
})(window.BT);
