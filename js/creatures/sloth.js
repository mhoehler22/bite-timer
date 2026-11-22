/* Sloth: chubby, sleepy, smiling. Lives in the Treehouse. Can sit, hang, or hug a pillow. */
(function (BT) {
  const A = BT.art, { O, O2, PLUM } = A;

  // Light face mask, droopy eye patches, button nose.
  function mask(p, y) {
    return `<ellipse cx="0" cy="${y}" rx="27" ry="19" fill="${p.belly}" ${O2}/>` +
      `<ellipse cx="-11" cy="${y}" rx="9" ry="5.8" fill="${p.dd}" opacity=".5" transform="rotate(-24 -11 ${y})"/>` +
      `<ellipse cx="11" cy="${y}" rx="9" ry="5.8" fill="${p.dd}" opacity=".5" transform="rotate(24 11 ${y})"/>` +
      A.face(0, y - 1, 0.95, { mouth: 'none', sleepy: p.sleepy, gap: 11.5 }) +
      `<ellipse cx="0" cy="${y + 2}" rx="3.2" ry="2.2" fill="${PLUM}"/>` +
      A.line(`M-3.6,${y + 6} q3.6,3.6 7.2,0`, 2);
  }
  const claws = (x, y, dir) => A.line(`M${x},${y} l${4 * dir},-3 M${x},${y} l${5 * dir},0 M${x},${y} l${4 * dir},3`, 1.6);
  const tuft = y => A.line(`M-5,${y} q2,-8 6,-2 q3,-7 7,0`, 2.4);

  function body(p, armless) {
    return `<ellipse cx="-17" cy="-3" rx="11" ry="6" fill="${p.d}" ${O}/>` +
      `<ellipse cx="17" cy="-3" rx="11" ry="6" fill="${p.d}" ${O}/>` +
      `<path d="${A.blob(86, 72)}" ${A.f(p.c)} ${O}/>` + A.shine(-24, -56, 8, 5) + tuft(-71);
  }

  BT.addCreature({
    id: 'sloth', label: 'Sloth', home: 'treehouse', color: 'peach', sound: 'yawn',
    voice: { pitch: 290, wave: 'triangle', speed: 0.7, formant: 1100 }, // babble voice (see audio.js)
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => body(p) + mask(p, -42) +
          A.limb('M-37,-30 Q-34,-12 -16,-14', p.d, 9) + A.limb('M37,-30 Q34,-12 16,-14', p.d, 9) +
          claws(-15, -14, 1) + claws(15, -14, -1)
      },
      hug: {
        anchors: ['floor'],
        draw: p => body(p) + mask(p, -47) +
          `<path transform="translate(0,-14) scale(1.35)" d="${A.HEART}" ${A.f(p.acc)} stroke="${PLUM}" stroke-width="2.2" stroke-linejoin="round"/>` +
          A.face(0, -17, 0.55, { mouth: 'u' }) +
          A.limb('M-37,-32 Q-30,-14 -14,-20', p.d, 9) + A.limb('M37,-32 Q30,-14 14,-20', p.d, 9)
      },
      hang: {
        anchors: ['hang'],
        draw: p => A.limb('M-24,44 Q-34,18 -22,3', p.d, 10) + A.limb('M24,44 Q34,18 22,3', p.d, 10) +
          A.line('M-27,1 q2,-7 7,-3 M-22,0 q2,-6 6,-2 M27,1 q-2,-7 -7,-3 M22,0 q-2,-6 -6,-2', 1.8) +
          `<g transform="translate(0,98)">` +
          `<ellipse cx="-16" cy="-2" rx="9" ry="7" fill="${p.d}" ${O}/><ellipse cx="16" cy="-2" rx="9" ry="7" fill="${p.d}" ${O}/>` +
          `<path d="${A.blob(80, 70)}" ${A.f(p.c)} ${O}/>` + A.shine(-22, -54, 7, 4.5) + tuft(-69) + mask(p, -40) +
          `</g>`
      }
    }
  });
})(window.BT);
