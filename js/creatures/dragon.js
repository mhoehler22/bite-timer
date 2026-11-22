/* Baby Dragon: tiny wings, a tail with a heart on the end. Lives in the Cloud Castle. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;
  const HORN = '#FFF1D0';

  BT.addCreature({
    id: 'dragon', label: 'Dragon', home: 'castle', color: 'aqua', sound: 'rawr',
    voice: { pitch: 240, wave: 'sawtooth', speed: 0.95, formant: 900, growl: true }, // babble voice (see audio.js)
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => `<path d="M-26,-48 C-52,-74 -70,-44 -58,-30 C-52,-38 -46,-30 -40,-36 C-38,-40 -32,-40 -26,-36Z" ${A.f(p.l)} ${O}/>` +
          `<path d="M26,-48 C52,-74 70,-44 58,-30 C52,-38 46,-30 40,-36 C38,-40 32,-40 26,-36Z" ${A.f(p.l)} ${O}/>` +
          A.limb('M36,-12 C58,-10 64,-28 58,-40', p.c, 10) +
          `<path transform="translate(58 -46) scale(.55)" d="${A.HEART}" fill="${p.acc}" stroke="${PLUM}" stroke-width="4" stroke-linejoin="round"/>` +
          [-10, 0, 10].map(x => `<path d="M${x - 5},-62 L${x},-77 L${x + 5},-62Z" fill="${p.acc}" ${O2}/>`).join('') +
          `<path d="M-20,-58 L-28,-75 L-10,-64Z" fill="${HORN}" ${O}/><path d="M20,-58 L28,-75 L10,-64Z" fill="${HORN}" ${O}/>` +
          `<ellipse cx="-17" cy="-3" rx="11" ry="6" fill="${p.d}" ${O}/><ellipse cx="17" cy="-3" rx="11" ry="6" fill="${p.d}" ${O}/>` +
          `<path d="${A.blob(86, 70)}" ${A.f(p.c)} ${O}/>` + A.shine(-24, -54, 7, 4.5) +
          `<ellipse cx="0" cy="-20" rx="21" ry="15" fill="${p.belly}" ${O2}/>` +
          A.line('M-17,-24 h34 M-19,-16 h38', 1.6, p.d) +
          A.face(0, -44, 1, { mouth: 'u', gap: 12, sleepy: p.sleepy })
      }
    }
  });
})(window.BT);
