/* Unicorn: pastel, with a curly rainbow mane. Lives in the Mermaid Cove. */
(function (BT) {
  const A = BT.art, { O, O2 } = A;
  const HORN = '#FFE7A8';

  BT.addCreature({
    id: 'unicorn', label: 'Unicorn', home: 'cove', color: 'lavender', sound: 'sparkle',
    poses: {
      sit: {
        anchors: ['floor', 'shelf'],
        draw: p => {
          const m = [p.acc, p.acc2, A.mix(p.acc, p.acc2, 0.5)];
          return `<circle cx="50" cy="-37" r="7" fill="${m[2]}" ${O2}/><circle cx="49" cy="-24" r="8" fill="${m[1]}" ${O2}/><circle cx="40" cy="-14" r="9" fill="${m[0]}" ${O2}/>` +
            `<path d="M-26,-56 L-22,-76 L-11,-62Z" ${A.f(p.c)} ${O}/><path d="M26,-56 L22,-76 L11,-62Z" ${A.f(p.c)} ${O}/>` +
            `<ellipse cx="-17" cy="-3" rx="11" ry="6" fill="${p.dd}" ${O}/><ellipse cx="17" cy="-3" rx="11" ry="6" fill="${p.dd}" ${O}/>` +
            `<path d="${A.blob(82, 68)}" ${A.f(p.c)} ${O}/>` + A.shine(-22, -52, 7, 4.5) +
            `<path d="M-7,-63 L0,-100 L7,-63Z" fill="${HORN}" ${O}/>` +
            A.line('M-5,-72 L5,-76 M-3.5,-81 L3.5,-84 M-2,-90 L2,-92', 1.6) +
            `<circle cx="-37" cy="-38" r="7" fill="${m[0]}" ${O2}/><circle cx="-31" cy="-51" r="8" fill="${m[2]}" ${O2}/>` +
            `<circle cx="-20" cy="-61" r="9" fill="${m[1]}" ${O2}/><circle cx="-7" cy="-66" r="8.5" fill="${m[0]}" ${O2}/>` +
            A.face(5, -36, 1, { mouth: 'u', lashes: true, sleepy: p.sleepy });
        }
      }
    }
  });
})(window.BT);
