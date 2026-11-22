/* Bite Timer: every sound is made live with Web Audio (no sound files).
   iPhone note: Web Audio is silenced by the ring/silent switch unless the page asks for
   "playback" audio, so unlock() does that (or plays a silent clip on older iOS). */
(function (BT) {
  const S = BT.audio = { muted: false };
  let ctx = null, master = null, echoIn = null, silentEl = null;

  const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    // a soft echo for the music-box shimmer
    echoIn = ctx.createGain(); echoIn.gain.value = 0.22;
    const delay = ctx.createDelay(1); delay.delayTime.value = 0.19;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
    echoIn.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(master);
  }

  // A tiny silent WAV, made in code, for iPhones without the audioSession API.
  function silentWav() {
    const n = 800, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }

  // Call from inside a tap. Safe to call again and again.
  S.unlock = () => {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* older browsers */ }
    if (!ctx) {
      build();
      if (!ctx) return;
      const b = ctx.createBuffer(1, 1, 22050), src = ctx.createBufferSource();
      src.buffer = b; src.connect(ctx.destination); src.start(0);
      if (!navigator.audioSession && isIOS()) {
        silentEl = new Audio(silentWav());
        silentEl.loop = true;
        silentEl.setAttribute('playsinline', '');
        silentEl.play().catch(() => {});
      }
    }
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
  };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  });

  // Play now if audio is running; otherwise wake it first (iOS can start suspended).
  function play(fn) {
    if (!ctx || S.muted) return;
    if (ctx.state === 'running') fn(ctx.currentTime);
    else ctx.resume().then(() => fn(ctx.currentTime)).catch(() => {});
  }

  // One music-box tine: bright attack, long soft decay, faint overtones.
  function tine(freq, t, vel = 0.3, len = 1.4) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(master); g.connect(echoIn);
    [[1, 1], [2, 0.18], [3.01, 0.06]].forEach(([mult, amp]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq * mult; og.gain.value = amp;
      o.connect(og).connect(g); o.start(t); o.stop(t + len + 0.05);
    });
  }

  // A pitch glide: boops, squishes, yawns.
  function glide(type, f0, f1, t, dur, vel = 0.25, opts = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + (opts.attack || 0.015));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (opts.lowpass) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = opts.lowpass; node.connect(f); node = f; }
    if (opts.wobble) {
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = opts.wobble; lg.gain.value = opts.depth || 0.5;
      const am = ctx.createGain(); am.gain.value = 0.5;
      lfo.connect(lg).connect(am.gain); node.connect(am); node = am;
      lfo.start(t); lfo.stop(t + dur + 0.05);
    }
    node.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  // Note names to frequencies (C6 = 1046.5 Hz).
  const N = { C5: 523.3, D5: 587.3, E5: 659.3, G5: 784, A5: 880, C6: 1046.5, D6: 1174.7, E6: 1318.5, G6: 1568, A6: 1760, C7: 2093, E7: 2637 };

  S.chime = () => play(t0 => {
    const t = t0 + 0.02;
    ['C6', 'E6', 'G6', 'C7'].forEach((n, i) => tine(N[n], t + i * 0.13, 0.28));
    tine(N.E6, t + 0.62, 0.2, 2); tine(N.G6, t + 0.62, 0.2, 2);
  });
  S.reminder = () => play(t0 => {
    const t = t0 + 0.02;
    tine(N.G6, t, 0.16); tine(N.E6, t + 0.16, 0.14, 1.6);
  });
  S.pop = () => play(t => {
    glide('sine', 320, 900, t, 0.14, 0.3);
    tine(N.E7, t + 0.08, 0.12, 0.8);
  });
  S.jingle = () => play(t0 => {
    const t = t0 + 0.02;
    ['C6', 'D6', 'E6', 'G6', 'A6', 'C7'].forEach((n, i) => tine(N[n], t + i * 0.08, 0.22, 1));
    tine(N.C7, t + 0.55, 0.22, 2); tine(N.E7, t + 0.55, 0.16, 2); tine(N.G6, t + 0.55, 0.16, 2);
  });
  S.note = i => play(t => tine([N.C6, N.D6, N.E6, N.G6, N.A6, N.C7, N.D6 * 2, N.E7][i % 8], t + 0.01, 0.2, 1));

  // Tap sounds, by name (creatures and decorations say which one they make).
  const tap = {
    chime: t => tine(N.A6, t, 0.18, 1),
    squish: t => glide('sine', 520, 240, t, 0.2, 0.3),
    boop: t => { glide('sine', 880, 600, t, 0.12, 0.25); glide('sine', 990, 700, t + 0.13, 0.12, 0.22); },
    boing: t => glide('triangle', 220, 660, t, 0.25, 0.22, { wobble: 18, depth: 0.6 }),
    sparkle: t => ['C7', 'G6', 'E7', 'C7', 'E7'].forEach((n, i) => tine(N[n], t + i * 0.055, 0.09, 0.6)),
    purr: t => glide('sawtooth', 70, 62, t, 0.9, 0.3, { lowpass: 380, wobble: 24, depth: 0.9, attack: 0.12 }),
    yawn: t => glide('triangle', 620, 230, t, 0.85, 0.2, { lowpass: 1400, attack: 0.12 }),
    squeak: t => glide('sine', 1300, 2000, t, 0.12, 0.18),
    munch: t => { glide('triangle', 300, 200, t, 0.09, 0.25, { lowpass: 900 }); glide('triangle', 320, 210, t + 0.14, 0.09, 0.25, { lowpass: 900 }); },
    peep: t => { glide('sine', 1500, 1900, t, 0.07, 0.15); glide('sine', 1500, 2100, t + 0.11, 0.08, 0.15); },
    rawr: t => glide('sawtooth', 340, 190, t, 0.38, 0.16, { lowpass: 900, wobble: 30, depth: 0.7, attack: 0.03 })
  };
  let lastTap = 0;
  S.tap = name => play(t => {
    if (t - lastTap < 0.12) return; // don't let fast taps pile up
    lastTap = t;
    (tap[name] || tap.chime)(t + 0.01);
  });

  // Spoken words: names, and the optional "Bite time!" cue.
  S.say = (text, opts = {}) => {
    if (S.muted || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts.rate || 0.92; u.pitch = opts.pitch || 1.3; u.volume = 1;
      const voices = speechSynthesis.getVoices();
      const v = voices.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Google US English|Aria|Jenny/i.test(v.name)) || voices.find(v => /^en/i.test(v.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* speech isn't available everywhere */ }
  };
})(window.BT);
