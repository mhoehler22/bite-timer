/* Bite Timer: the kawaii art kit.
   Every drawing in the app is an SVG string built from these pieces, so any creature,
   decoration or room can be redrawn in any color. Plum outlines, soft gradients,
   dot eyes, rosy cheeks. */
(function (BT) {
  const A = BT.art = {};
  const NS = 'http://www.w3.org/2000/svg';
  const PLUM = A.PLUM = '#5B3A6B';
  const CHEEK = A.CHEEK = '#FF9EBB';

  // The 8 colors the child can pick for tonight's creature.
  A.COLORS = [
    { id: 'lavender', hex: '#CDB4F6', label: 'Lavender' },
    { id: 'pink', hex: '#FFB7D5', label: 'Pink' },
    { id: 'peach', hex: '#FFCCB0', label: 'Peach' },
    { id: 'butter', hex: '#FFE89C', label: 'Yellow' },
    { id: 'mint', hex: '#A9EEC9', label: 'Mint' },
    { id: 'aqua', hex: '#A6E7EF', label: 'Aqua' },
    { id: 'sky', hex: '#B0D4FF', label: 'Blue' },
    { id: 'cream', hex: '#F8EFE4', label: 'Cream' }
  ];
  A.color = id => (A.COLORS.find(c => c.id === id) || A.COLORS[0]).hex;

  // Colors that surprise decorations are drawn in.
  A.DECOR = ['#CDB4F6', '#FFB7D5', '#FFCCB0', '#FFE89C', '#A9EEC9', '#A6E7EF', '#B0D4FF', '#FFC8DD', '#E3D5FF', '#C7EBA8'];

  /* ---------- color math ---------- */
  const h2r = h => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    const v = parseInt(h, 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  };
  const r2h = (r, g, b) => '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  A.mix = (a, b, t) => { const x = h2r(a), y = h2r(b); return r2h(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); };
  A.lum = h => { const [r, g, b] = h2r(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  A.dist = (a, b) => { const x = h2r(a), y = h2r(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  A.light = (c, t = 0.45) => A.mix(c, '#ffffff', t);
  A.deep = (c, t = 0.2) => A.mix(c, PLUM, t);

  // A palette color that stands apart from the given ones. Deterministic, so redraws match.
  A.accentFor = (c, avoid) => {
    const far = A.DECOR.filter(x => A.dist(x, c) > 70 && (!avoid || A.dist(x, avoid) > 50));
    const list = far.length ? far : A.DECOR;
    const seed = h2r(c).reduce((s, v) => s + v, 0) + (avoid ? h2r(avoid)[0] : 0);
    return list[seed % list.length];
  };

  // Everything a drawing needs from one base color.
  A.pack = (c, acc) => {
    acc = acc || A.accentFor(c);
    return {
      c, acc, acc2: A.accentFor(acc, c),
      l: A.light(c, 0.45), belly: A.light(c, 0.72),
      d: A.deep(c, 0.16), dd: A.deep(c, 0.3)
    };
  };

  /* ---------- gradients ----------
     Soft top-to-bottom shading. Live drawings share one hidden <defs> in the page;
     A.collect() also gathers them so a room can be saved as a standalone image. */
  let defsEl = null, collector = null;
  const made = new Set();
  A.gid = c => 'bg' + c.replace('#', '').toLowerCase();
  A.gradMarkup = c => `<linearGradient id="${A.gid(c)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${A.light(c, 0.55)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${A.deep(c, 0.09)}"/></linearGradient>`;
  function liveDefs() {
    if (!defsEl) {
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      defsEl = document.createElementNS(NS, 'defs');
      svg.appendChild(defsEl);
      document.body.insertBefore(svg, document.body.firstChild);
    }
    return defsEl;
  }
  A.g = c => {
    c = c.toLowerCase();
    const id = A.gid(c);
    if (collector) collector.add(c);
    if (!made.has(id) && typeof document !== 'undefined' && document.body) {
      made.add(id);
      const doc = new DOMParser().parseFromString(`<svg xmlns="${NS}">${A.gradMarkup(c)}</svg>`, 'image/svg+xml');
      liveDefs().appendChild(document.importNode(doc.documentElement.firstChild, true));
    }
    return `url(#${id})`;
  };
  A.collect = fn => {
    const prev = collector;
    collector = new Set();
    try { const out = fn(); return { out, defs: [...collector].map(A.gradMarkup).join('') }; }
    finally { collector = prev; }
  };
  A.f = c => `fill="${A.g(c)}"`;

  /* ---------- strokes and small helpers ---------- */
  const n = A.n = v => Math.round(v * 10) / 10;
  A.O = `stroke="${PLUM}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  A.O2 = `stroke="${PLUM}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
  A.line = (d, w = 2, c = PLUM, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

  // A thick outlined stroke: arms, tails, branches, stems.
  A.limb = (d, c, w = 9) => A.line(d, w + 5) + A.line(d, w, c);

  // Several shapes drawn as one outlined silhouette (clouds, manes, bushes). Flat fill only.
  A.union = (shapes, fill, sw = 3) =>
    shapes.map(s => s.replace(/\/>$/, ` fill="${PLUM}" stroke="${PLUM}" stroke-width="${sw * 2}" stroke-linejoin="round"/>`)).join('') +
    shapes.map(s => s.replace(/\/>$/, ` fill="${fill}"/>`)).join('');

  A.shine = (x, y, rx, ry, rot = -25) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="#fff" opacity=".55" transform="rotate(${rot} ${n(x)} ${n(y)})"/>`;

  /* ---------- the kawaii face ----------
     o.mouth: 'u' | 'w' | 'o' | 'open';  o.sleepy;  o.lashes;  o.gap (eye spacing);  o.cheeks=false */
  A.face = (x, y, s = 1, o = {}) => {
    const gap = (o.gap || 11) * s;
    let out = '';
    if (o.cheeks !== false) {
      const cx = gap + 6.5 * s;
      out += `<ellipse cx="${n(x - cx)}" cy="${n(y + 4.5 * s)}" rx="${n(4.6 * s)}" ry="${n(2.9 * s)}" fill="${CHEEK}" opacity=".8"/>`;
      out += `<ellipse cx="${n(x + cx)}" cy="${n(y + 4.5 * s)}" rx="${n(4.6 * s)}" ry="${n(2.9 * s)}" fill="${CHEEK}" opacity=".8"/>`;
    }
    for (const sx of [-1, 1]) {
      const ex = x + sx * gap;
      if (o.sleepy) {
        out += A.line(`M${n(ex - 3.6 * s)},${n(y - 0.6 * s)} q${n(3.6 * s)},${n(3.4 * s)} ${n(7.2 * s)},0`, n(2.1 * s));
      } else {
        out += `<circle cx="${n(ex)}" cy="${n(y)}" r="${n(3.3 * s)}" fill="${PLUM}"/><circle cx="${n(ex - 1 * s)}" cy="${n(y - 1.2 * s)}" r="${n(1.15 * s)}" fill="#fff"/>`;
        if (o.lashes) out += A.line(`M${n(ex + sx * 2.6 * s)},${n(y - 2.2 * s)} l${n(sx * 2.6 * s)},${n(-1.8 * s)}`, n(1.5 * s));
      }
    }
    const m = o.mouth || 'u', my = y + 2.4 * s, w = n(2 * s);
    if (m === 'u') out += A.line(`M${n(x - 3.2 * s)},${n(my)} q${n(3.2 * s)},${n(3.6 * s)} ${n(6.4 * s)},0`, w);
    else if (m === 'w') out += A.line(`M${n(x - 5 * s)},${n(my)} q${n(2.5 * s)},${n(3.4 * s)} ${n(5 * s)},0 q${n(2.5 * s)},${n(3.4 * s)} ${n(5 * s)},0`, w);
    else if (m === 'o') out += `<ellipse cx="${n(x)}" cy="${n(my + 2 * s)}" rx="${n(2 * s)}" ry="${n(2.4 * s)}" fill="${PLUM}"/>`;
    else if (m === 'open') {
      out += `<path d="M${n(x - 4 * s)},${n(my)} q${n(4 * s)},${n(7 * s)} ${n(8 * s)},0z" fill="${PLUM}" stroke="${PLUM}" stroke-width="${n(1.2 * s)}" stroke-linejoin="round"/>`;
      out += `<ellipse cx="${n(x)}" cy="${n(my + 3.4 * s)}" rx="${n(2.3 * s)}" ry="${n(1.4 * s)}" fill="#FF8FB1"/>`;
    }
    return out;
  };

  /* ---------- little shapes ---------- */
  A.SPARKLE = 'M0,-10 C1.2,-2.4 2.4,-1.2 10,0 C2.4,1.2 1.2,2.4 0,10 C-1.2,2.4 -2.4,1.2 -10,0 C-2.4,-1.2 -1.2,-2.4 0,-10Z';
  A.sparkle = (x, y, s = 1, c = '#fff', extra = '') => `<path transform="translate(${n(x)} ${n(y)}) scale(${s})" d="${A.SPARKLE}" fill="${c}" ${extra}/>`;

  // About 24 wide and 21 tall, centered on (0,0).
  A.HEART = 'M0,9 C-3,6 -12,1 -12,-5 C-12,-10 -6,-12 0,-6 C6,-12 12,-10 12,-5 C12,1 3,6 0,9Z';
  A.heart = (x, y, s, c, outline = true) => `<path transform="translate(${n(x)} ${n(y)}) scale(${s})" d="${A.HEART}" fill="${c}"${outline ? ` stroke="${PLUM}" stroke-width="${n(3 / s)}" stroke-linejoin="round"` : ''}/>`;

  A.starPath = (r, ri = r * 0.55, pts = 5) => {
    let d = '';
    for (let i = 0; i < pts * 2; i++) {
      const rr = i % 2 ? ri : r, a = -Math.PI / 2 + i * Math.PI / pts;
      d += (i ? 'L' : 'M') + n(Math.cos(a) * rr) + ',' + n(Math.sin(a) * rr);
    }
    return d + 'Z';
  };

  // A fluffy cloud centered near (x,y), about 50 wide at s=1.
  A.cloud = (x, y, s = 1, c = '#ffffff', face = true) =>
    `<g transform="translate(${n(x)} ${n(y)}) scale(${s})">` +
    A.union(['<circle cx="-13" cy="0" r="11"/>', '<circle cx="2" cy="-7" r="14"/>', '<circle cx="16" cy="1" r="10"/>', '<rect x="-24" y="0" width="50" height="11" rx="5.5"/>'], c) +
    (face ? A.face(1, 2, 0.7, { mouth: 'u' }) : '') + '</g>';

  // A marshmallow body: flat bottom on y=0, dome top at y=-h.
  A.blob = (w, h) => {
    const hw = w / 2, r = h * 0.2;
    return `M${-hw},${n(-r)} C${-hw},${n(-h * 0.88)} ${n(-w * 0.34)},${-h} 0,${-h} C${n(w * 0.34)},${-h} ${hw},${n(-h * 0.88)} ${hw},${n(-r)} Q${hw},0 ${n(hw - r)},0 L${n(-hw + r)},0 Q${-hw},0 ${-hw},${n(-r)}Z`;
  };

  A.leaf = (x, y, s, rot, c) => `<ellipse cx="0" cy="-9" rx="6" ry="10" transform="translate(${n(x)} ${n(y)}) rotate(${rot}) scale(${s})" fill="${c}" ${A.O2}/>`;

  // A string that sags between evenly spaced pins. Returns the path and the low points.
  A.sag = (x0, y0, x1, y1, segs, sag) => {
    let d = `M${n(x0)},${n(y0)}`;
    const dips = [], pins = [[x0, y0]];
    for (let i = 0; i < segs; i++) {
      const ax = x0 + (x1 - x0) * i / segs, ay = y0 + (y1 - y0) * i / segs;
      const bx = x0 + (x1 - x0) * (i + 1) / segs, by = y0 + (y1 - y0) * (i + 1) / segs;
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      d += ` Q${n(mx)},${n(my + sag * 2)} ${n(bx)},${n(by)}`;
      dips.push([mx, my + sag]);
      pins.push([bx, by]);
    }
    return { d, dips, pins };
  };

  // Fairy lights along a sagging string.
  A.lights = (x0, y0, x1, y1, segs, sag, colors) => {
    const s = A.sag(x0, y0, x1, y1, segs, sag);
    let out = A.line(s.d, 2);
    const pts = [];
    for (let i = 0; i < segs; i++) {
      const a = s.pins[i], b = s.pins[i + 1], m = s.dips[i];
      pts.push([(a[0] + m[0]) / 2, (a[1] + m[1]) / 2 + sag * 0.25], m, [(m[0] + b[0]) / 2, (m[1] + b[1]) / 2 + sag * 0.25]);
    }
    pts.forEach((p, i) => {
      const c = colors[i % colors.length];
      out += `<circle cx="${n(p[0])}" cy="${n(p[1] + 7)}" r="9" fill="${c}" opacity=".35" class="twinkle" style="animation-delay:${-(i * 0.37 % 2).toFixed(2)}s"/>`;
      out += `<rect x="${n(p[0] - 2.5)}" y="${n(p[1] - 1)}" width="5" height="4" rx="1" fill="${PLUM}"/>`;
      out += `<ellipse cx="${n(p[0])}" cy="${n(p[1] + 7)}" rx="4.2" ry="5.4" fill="${c}" ${A.O2}/>`;
    });
    return out;
  };

  // Triangle flags along a sagging string.
  A.bunting = (x0, y0, x1, y1, segs, sag, colors) => {
    const s = A.sag(x0, y0, x1, y1, segs, sag);
    let out = '';
    const N = segs * 3;
    for (let i = 0; i < N; i++) {
      const t = (i + 0.5) / N, seg = Math.min(segs - 1, Math.floor(t * segs)), lt = t * segs - seg;
      const a = s.pins[seg], b = s.pins[seg + 1], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag * 2];
      const x = (1 - lt) ** 2 * a[0] + 2 * (1 - lt) * lt * c[0] + lt ** 2 * b[0];
      const y = (1 - lt) ** 2 * a[1] + 2 * (1 - lt) * lt * c[1] + lt ** 2 * b[1];
      out += `<path d="M${n(x - 9)},${n(y)} L${n(x + 9)},${n(y)} L${n(x)},${n(y + 18)}Z" fill="${colors[i % colors.length]}" ${A.O2}/>`;
    }
    return A.line(s.d, 2) + out;
  };

  // Scattered sparkles and tiny hearts for a backdrop (seeded so they stay put).
  A.sprinkles = (r, box, count, colors) => {
    let out = '';
    for (let i = 0; i < count; i++) {
      const x = box.x + r() * box.w, y = box.y + r() * box.h, c = colors[i % colors.length];
      out += i % 3 === 2
        ? `<g class="twinkle" style="animation-delay:${-(r() * 2.5).toFixed(2)}s">${A.heart(x, y, 0.32 + r() * 0.15, c, false)}</g>`
        : `<g class="twinkle" style="animation-delay:${-(r() * 2.5).toFixed(2)}s">${A.sparkle(x, y, 0.45 + r() * 0.4, c)}</g>`;
    }
    return out;
  };

  // A tappable piece of furniture that's part of the backdrop.
  A.furn = (inner, sound = 'squish', origin = '50% 100%') =>
    `<g class="furn" data-sound="${sound}"><g class="tw" style="transform-origin:${origin}">${inner}</g></g>`;
})(window.BT);
