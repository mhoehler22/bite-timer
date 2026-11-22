/* Panda: a cream body with patches in the chosen color. Lives in the Bamboo Grove. */
(function (BT) {
  const A = BT.art, { O, PLUM } = A;
  const BODY = '#FFF9F2';

  BT.addCreature({
    id: 'panda', label: 'Panda', home: 'bamboo', color: 'mint', sound: 'munch',
    voice: { pitch: 340, wave: 'triangle', speed: 0.85, formant: 1000 }, // babble voice (see audio.js)
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => {
          // Patches in the chosen color. Very light colors (cream, yellow) would vanish on the
          // cream body, so they turn into a warm honey/caramel version of themselves instead.
          const pc = A.lum(p.c) > 0.88 ? A.deep(A.mix(p.c, '#EDB24A', 0.45), 0.14) : A.deep(p.c, 0.12);
          const eye = x => p.sleepy
            ? A.line(`M${x - 3.6},-45 q3.6,3.4 7.2,0`, 2.1, PLUM)
            : `<circle cx="${x}" cy="-45" r="4.4" fill="#fff"/><circle cx="${x}" cy="-45" r="3" fill="${PLUM}"/><circle cx="${x - 1}" cy="-46.3" r="1.1" fill="#fff"/>`;
          return `<circle cx="-29" cy="-60" r="12" fill="${pc}" ${O}/><circle cx="29" cy="-60" r="12" fill="${pc}" ${O}/>` +
            `<ellipse cx="-17" cy="-3" rx="12" ry="7" fill="${pc}" ${O}/><ellipse cx="17" cy="-3" rx="12" ry="7" fill="${pc}" ${O}/>` +
            `<path d="${A.blob(86, 72)}" ${A.f(BODY)} ${O}/>` + A.shine(-24, -56, 7, 4.5) +
            `<ellipse cx="-37" cy="-27" rx="10" ry="16" transform="rotate(20 -37 -27)" fill="${pc}" ${O}/>` +
            `<ellipse cx="37" cy="-27" rx="10" ry="16" transform="rotate(-20 37 -27)" fill="${pc}" ${O}/>` +
            `<ellipse cx="-12" cy="-44" rx="9.5" ry="11.5" transform="rotate(30 -12 -44)" fill="${pc}"/>` +
            `<ellipse cx="12" cy="-44" rx="9.5" ry="11.5" transform="rotate(-30 12 -44)" fill="${pc}"/>` +
            eye(-12) + eye(12) +
            `<ellipse cx="-25" cy="-33" rx="4.6" ry="2.9" fill="${A.CHEEK}" opacity=".8"/><ellipse cx="25" cy="-33" rx="4.6" ry="2.9" fill="${A.CHEEK}" opacity=".8"/>` +
            `<ellipse cx="0" cy="-36" rx="3.4" ry="2.4" fill="${PLUM}"/>` +
            A.line('M-4.4,-32 q2.2,2.8 4.4,0 q2.2,2.8 4.4,0', 1.9);
        }
      }
    }
  });
})(window.BT);
