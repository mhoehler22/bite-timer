/* Penguin: round, with a cozy scarf. Lives in the Snowy Wonderland. */
(function (BT) {
  const A = BT.art, { O, O2 } = A;

  BT.addCreature({
    id: 'penguin', label: 'Penguin', home: 'snow', color: 'sky', sound: 'peep',
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => `<ellipse cx="-37" cy="-30" rx="8" ry="17" transform="rotate(25 -37 -30)" fill="${p.d}" ${O}/>` +
          `<ellipse cx="37" cy="-30" rx="8" ry="17" transform="rotate(-25 37 -30)" fill="${p.d}" ${O}/>` +
          `<ellipse cx="-14" cy="-2" rx="11" ry="5" fill="#FFC27A" ${O}/><ellipse cx="14" cy="-2" rx="11" ry="5" fill="#FFC27A" ${O}/>` +
          `<path d="${A.blob(80, 76)}" ${A.f(p.c)} ${O}/>` + A.shine(-22, -60, 7, 4.5) +
          `<ellipse cx="0" cy="-20" rx="25" ry="18" fill="#FFFDF8" ${O2}/>` +
          A.face(0, -54, 1, { mouth: 'none', gap: 12, sleepy: p.sleepy }) +
          `<path d="M-6,-48 Q0,-42 6,-48 Q0,-52 -6,-48Z" fill="#FFC56E" ${O2}/>` +
          `<path d="M-38,-40 Q0,-30 38,-40 L37,-32 Q0,-22 -37,-32Z" fill="${p.acc}" ${O2}/>` +
          `<path d="M14,-31 l3,18 l9,-2 l-3,-17Z" fill="${p.acc}" ${O2}/>` +
          A.line('M18,-13 v4 M22,-14 v4', 1.6)
      }
    }
  });
})(window.BT);
