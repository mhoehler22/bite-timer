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

  /* ---------- the reading voice (names, letters, optional "Bite time!") ----------
     Uses the phone's own text-to-speech. We pick the most natural-sounding voice installed:
     "Premium"/"Enhanced" (iPhone downloads) and "Natural"/"Neural" (Edge, Android) voices first,
     and never Apple's novelty voices unless a grown-up picks one. */
  S.voiceURI = '';   // grown-up's choice; '' = automatic
  S.pitch = 1.1;
  const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Junior|Organ|Ralph|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred\b|Kathy|Grandpa|Grandma|Rocko|Eddy|Flo|Reed|Sandy|Shelley/i;
  S.voiceScore = v => {
    const n = v.name || '';
    let s = 0;
    if (/premium/i.test(n)) s += 8;
    if (/enhanced/i.test(n)) s += 6;
    if (/natural|neural/i.test(n)) s += 6;
    if (/\bAna\b/.test(n)) s += 3; // a child's voice on Windows/Edge
    if (/Ava|Zoe|Samantha|Allison|Susan|Nicky|Aria|Jenny|Emma|Michelle|Zira|Karen|Moira|Tessa|Google US English/i.test(n)) s += 2;
    if (/David|Mark|Daniel|Alex\b|Aaron|Arthur|Gordon|Rishi|Tom\b|Guy|Ryan|Christopher|Eric|Roger|Thomas|Oliver|Evan|Nathan/i.test(n)) s -= 1;
    if (/en[-_]US/i.test(v.lang)) s += 1;
    if (NOVELTY.test(n)) s -= 30;
    return s;
  };
  S.voices = () => {
    if (!('speechSynthesis' in window)) return [];
    return speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)).sort((a, b) => S.voiceScore(b) - S.voiceScore(a));
  };
  S.voice = () => {
    const list = S.voices();
    return (S.voiceURI && list.find(v => v.voiceURI === S.voiceURI)) || list[0] || null;
  };

  S.say = (text, opts = {}) => {
    if (S.muted || !('speechSynthesis' in window)) { if (opts.onend) opts.onend(); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = S.voice();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = opts.rate || 0.95;
      u.pitch = opts.pitch || S.pitch;
      u.volume = 1;
      if (opts.onend) { let done = false; const fin = () => { if (!done) { done = true; opts.onend(); } }; u.onend = fin; u.onerror = fin; setTimeout(fin, 2500); }
      speechSynthesis.speak(u);
    } catch (e) { if (opts.onend) opts.onend(); }
  };

  /* ---------- creature babble ----------
     Each creature "talks" in a made-up squeaky language, like animals in a cozy video game:
     short pitched syllables shaped by a vowel-like filter. Its voice comes from the creature
     file (pitch, wave, speed, formant, sparkle, growl). Moods: hello, happy, excited, question, sleepy. */
  const VOWEL = [0.62, 0.8, 1, 1.3, 1.65]; // u, o, a, e, i
  function syllable(v, f, t, len, form, vol, fall) {
    const o = ctx.createOscillator();
    o.type = v.wave || 'triangle';
    o.frequency.setValueAtTime(f * 0.93, t);
    o.frequency.linearRampToValueAtTime(f * 1.04, t + len * 0.35);
    o.frequency.linearRampToValueAtTime(f * (fall ? 0.86 : 0.98), t + len);
    if (v.growl) {
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 32; lg.gain.value = f * 0.05;
      lfo.connect(lg).connect(o.frequency); lfo.start(t); lfo.stop(t + len + 0.05);
    }
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = form; bp.Q.value = 2.4;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(5000, form * 2.4);
    const body = ctx.createGain(); body.gain.value = 0.55;
    const g = ctx.createGain();
    const loud = vol * (v.wave === 'square' ? 0.55 : v.wave === 'sawtooth' ? 0.5 : 1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(loud, t + 0.012);
    g.gain.setValueAtTime(loud, t + len * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(bp).connect(g);
    o.connect(lp).connect(body).connect(g);
    g.connect(master);
    o.start(t); o.stop(t + len + 0.05);
  }
  S.babbleOn = true;
  S.babble = (voice, o = {}) => {
    if (!S.babbleOn) return;
    play(t0 => {
      const v = Object.assign({ pitch: 500, wave: 'triangle', speed: 1, formant: 1500 }, voice || {});
      const mood = o.mood || 'happy';
      const n = o.n || (mood === 'excited' ? 5 : mood === 'sleepy' ? 4 : 3);
      const sp = v.speed * (mood === 'excited' ? 1.3 : mood === 'sleepy' ? 0.55 : 1);
      const base = v.pitch * (mood === 'excited' ? 1.2 : mood === 'sleepy' ? 0.82 : 1);
      let t = t0 + 0.02;
      for (let i = 0; i < n; i++) {
        const last = i === n - 1;
        let semis = Math.random() * 7 - 3.5;
        if (last && (mood === 'happy' || mood === 'hello' || mood === 'excited')) semis += 5;
        if (last && mood === 'question') semis += 8;
        if (mood === 'hello' && i === 0) semis += 3;
        if (mood === 'sleepy') semis -= i * 1.6;
        const f = base * Math.pow(2, semis / 12);
        const len = (0.09 / sp) * (last ? 1.7 : 1) * (0.85 + Math.random() * 0.3);
        const form = v.formant * VOWEL[Math.floor(Math.random() * VOWEL.length)];
        syllable(v, f, t, len, form, (o.vol || 0.3), mood === 'sleepy' && last);
        t += len + 0.035 / sp;
      }
      if (v.sparkle && mood !== 'sleepy') ['E7', 'C7', 'E7'].forEach((nm, i) => tine(N[nm], t + i * 0.06, 0.07, 0.5));
    });
  };
})(window.BT);
