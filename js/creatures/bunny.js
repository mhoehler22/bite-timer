/* Bunny: tall ears, pom-pom tail. Lives in the Strawberry Garden. */
(function (BT) {
  const A = BT.art, { O } = A;
  const INNER = '#FFC4D8';

  BT.addCreature({
    id: 'bunny', label: 'Bunny', home: 'garden', color: 'cream', sound: 'squeak',
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => `<g transform="rotate(-10 -14 -60)"><ellipse cx="-14" cy="-86" rx="10" ry="26" ${A.f(p.c)} ${O}/><ellipse cx="-14" cy="-84" rx="5" ry="17" fill="${INNER}"/></g>` +
          `<g transform="rotate(12 14 -60)"><ellipse cx="14" cy="-86" rx="10" ry="26" ${A.f(p.c)} ${O}/><ellipse cx="14" cy="-84" rx="5" ry="17" fill="${INNER}"/></g>` +
          `<circle cx="41" cy="-14" r="9" fill="${p.belly}" ${O}/>` +
          `<ellipse cx="-18" cy="-3" rx="12" ry="6" fill="${p.l}" ${O}/><ellipse cx="18" cy="-3" rx="12" ry="6" fill="${p.l}" ${O}/>` +
          `<path d="${A.blob(80, 66)}" ${A.f(p.c)} ${O}/>` + A.shine(-22, -50, 7, 4.5) +
          A.face(0, -35, 1, { mouth: 'w', gap: 12, sleepy: p.sleepy }) +
          `<path d="M-2.6,-36 h5.2 l-2.6,3Z" fill="#FF8FB1" stroke="#FF8FB1" stroke-width="1.5" stroke-linejoin="round"/>`
      }
    }
  });
})(window.BT);
