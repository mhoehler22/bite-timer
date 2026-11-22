/* Bite Timer: sparkles, floating hearts, the heart-and-star shower, and cheer banners.
   They live in one full-screen layer that never blocks taps. */
(function (BT) {
  const A = BT.art;
  const F = BT.fx = {};
  const PAL = ['#FFB7D5', '#CDB4F6', '#A9EEC9', '#B0D4FF', '#FFE89C', '#FFCCB0'];
  let layer;
  const reduce = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getLayer = () => layer || (layer = document.getElementById('fx'));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function piece(svgInner, size, x, y) {
    const el = document.createElement('div');
    el.className = 'fxp';
    el.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px`;
    el.innerHTML = `<svg viewBox="-14 -14 28 28" width="${size}" height="${size}">${svgInner}</svg>`;
    getLayer().appendChild(el);
    return el;
  }
  const heartSVG = c => `<path d="${A.HEART}" fill="${c}" stroke="${A.PLUM}" stroke-width="2" stroke-linejoin="round"/>`;
  const starSVG = c => `<path d="${A.starPath(12, 6.6)}" fill="${c}" stroke="${A.PLUM}" stroke-width="2" stroke-linejoin="round"/>`;
  const sparkSVG = c => `<path transform="scale(1.2)" d="${A.SPARKLE}" fill="${c}"/>`;

  // Hearts drifting up from a point (tapping a pet).
  F.hearts = (x, y, n = 4) => {
    for (let i = 0; i < n; i++) {
      const el = piece(heartSVG(pick(PAL)), rnd(18, 28), x + rnd(-14, 14), y + rnd(-6, 6));
      const dx = rnd(-40, 40), dy = rnd(-90, -150);
      el.animate([
        { transform: 'translate(0,0) scale(.3)', opacity: 0 },
        { transform: `translate(${dx * 0.3}px,${dy * 0.3}px) scale(1)`, opacity: 1, offset: 0.25 },
        { transform: `translate(${dx}px,${dy}px) scale(.8)`, opacity: 0 }
      ], { duration: rnd(1000, 1500), delay: i * 70, easing: 'ease-out', fill: 'both' }).onfinish = () => el.remove();
    }
  };

  // A burst of sparkles (a new reward popping in).
  F.burst = (x, y, n = 10) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(40, 80);
      const el = piece(i % 3 ? sparkSVG(pick(['#fff', '#FFE89C', '#FFB7D5'])) : heartSVG(pick(PAL)), rnd(14, 24), x, y);
      el.animate([
        { transform: 'translate(0,0) scale(.2)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${Math.cos(a) * d * 1.2}px,${Math.sin(a) * d * 1.2}px) scale(.4)`, opacity: 0 }
      ], { duration: 850, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'both' }).onfinish = () => el.remove();
    }
  };

  // The gentle shower of pastel hearts and stars (every 5 bites).
  F.shower = (n = 42) => {
    const W = innerWidth, H = innerHeight;
    const count = reduce() ? 12 : n;
    for (let i = 0; i < count; i++) {
      const el = piece(i % 2 ? heartSVG(pick(PAL)) : starSVG(pick(PAL)), rnd(18, 34), rnd(0, W), -30);
      const sway = rnd(-60, 60), spin = rnd(-200, 200);
      el.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
        { opacity: 1, offset: 0.1 },
        { transform: `translate(${sway}px,${H * 0.55}px) rotate(${spin / 2}deg)`, offset: 0.55 },
        { transform: `translate(${-sway / 2}px,${H + 60}px) rotate(${spin}deg)`, opacity: 0.9 }
      ], { duration: rnd(2400, 3600), delay: rnd(0, 900), easing: 'ease-in', fill: 'both' }).onfinish = () => el.remove();
    }
  };

  // A bouncy banner in the middle of the screen.
  F.banner = (text, ms = 2300) => {
    const el = document.createElement('div');
    el.className = 'banner';
    el.textContent = text;
    getLayer().appendChild(el);
    el.animate([
      { transform: 'translate(-50%,-50%) scale(.3)', opacity: 0 },
      { transform: 'translate(-50%,-50%) scale(1.08)', opacity: 1, offset: 0.12 },
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0.2 },
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0.85 },
      { transform: 'translate(-50%,-50%) scale(.9)', opacity: 0 }
    ], { duration: ms, easing: 'ease-out', fill: 'both' }).onfinish = () => el.remove();
  };

  // A squishy wiggle on any element (buttons, the star counter).
  F.squish = el => {
    if (!el) return;
    el.classList.remove('squish');
    void el.getBoundingClientRect();
    el.classList.add('squish');
  };
})(window.BT);
