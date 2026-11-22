/* Puppy: fluffy, floppy ears, bandana. Lives in the Bakery. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;

  BT.addCreature({
    id: 'puppy', label: 'Puppy', home: 'bakery', color: 'butter', sound: 'boop',
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => A.limb('M36,-16 q14,-4 13,-22', p.c, 9) +
          `<ellipse cx="-17" cy="-3" rx="11" ry="6" fill="${p.d}" ${O}/><ellipse cx="17" cy="-3" rx="11" ry="6" fill="${p.d}" ${O}/>` +
          `<path d="${A.blob(86, 70)}" ${A.f(p.c)} ${O}/>` + A.shine(-24, -54, 7, 4.5) +
          `<ellipse cx="15" cy="-46" rx="11" ry="9" fill="${p.d}" opacity=".7"/>` +
          `<path d="M-27,-64 C-46,-64 -52,-36 -43,-26 C-35,-20 -28,-40 -21,-58Z" fill="${p.dd}" ${O}/>` +
          `<path d="M27,-64 C46,-64 52,-36 43,-26 C35,-20 28,-40 21,-58Z" fill="${p.dd}" ${O}/>` +
          `<ellipse cx="0" cy="-30" rx="15" ry="10.5" fill="${p.belly}" ${O2}/>` +
          A.face(0, -45, 1, { mouth: 'none', gap: 13, cheeks: false, sleepy: p.sleepy }) +
          `<ellipse cx="-25" cy="-34" rx="4.6" ry="2.9" fill="${A.CHEEK}" opacity=".8"/><ellipse cx="25" cy="-34" rx="4.6" ry="2.9" fill="${A.CHEEK}" opacity=".8"/>` +
          `<path d="M-5,-36 h10 q0,5 -5,6.5 q-5,-1.5 -5,-6.5Z" fill="${PLUM}"/>` +
          `<path d="M-2.6,-26 q2.6,7 5.2,0Z" fill="#FF8FB1" ${O2}/>` +
          A.line('M-6,-27 q3,3 6,0 q3,3 6,0', 2) +
          `<path d="M-26,-15 Q0,-7 26,-15 L3,-1 Q0,1 -3,-1Z" fill="${p.acc}" ${O2}/>`
      }
    }
  });
})(window.BT);
