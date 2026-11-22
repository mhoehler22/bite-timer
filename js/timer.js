/* Bite Timer: the countdown (timed from a deadline, so it stays accurate)
   and the screen wake lock that keeps the phone awake during dinner. */
(function (BT) {
  const T = BT.timer = { dur: 15, left: 15, state: 'idle', onTick: null, onDone: null };
  let deadline = 0, raf = 0, backup = 0;

  function loop() {
    cancelAnimationFrame(raf); clearTimeout(backup);
    const step = () => {
      if (T.state !== 'running') return;
      T.left = Math.max(0, (deadline - performance.now()) / 1000);
      if (T.onTick) T.onTick(T.left, T.dur);
      if (T.left <= 0) { T.state = 'done'; if (T.onDone) T.onDone(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // If animation frames stall (some phones throttle them), still finish on time.
    backup = setTimeout(() => { if (T.state === 'running' && performance.now() >= deadline) step(); }, T.left * 1000 + 60);
  }

  T.start = sec => {
    T.dur = sec; T.left = sec;
    deadline = performance.now() + sec * 1000;
    T.state = 'running';
    loop();
  };
  T.pause = () => {
    if (T.state !== 'running') return false;
    T.left = Math.max(0, (deadline - performance.now()) / 1000);
    T.state = 'paused';
    cancelAnimationFrame(raf); clearTimeout(backup);
    if (T.onTick) T.onTick(T.left, T.dur);
    return true;
  };
  T.resume = () => {
    if (T.state !== 'paused') return;
    deadline = performance.now() + T.left * 1000;
    T.state = 'running';
    loop();
  };
  T.stop = () => { T.state = 'idle'; cancelAnimationFrame(raf); clearTimeout(backup); };

  /* ---- keep the screen awake ---- */
  const W = BT.wake = { lock: null, wanted: false };
  W.on = async () => {
    W.wanted = true;
    try {
      if ('wakeLock' in navigator && !W.lock) {
        W.lock = await navigator.wakeLock.request('screen');
        W.lock.addEventListener('release', () => { W.lock = null; });
      }
    } catch (e) { /* not allowed right now; we'll try again when the app is visible */ }
  };
  W.off = () => {
    W.wanted = false;
    if (W.lock) { W.lock.release().catch(() => {}); W.lock = null; }
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden && W.wanted) W.on(); });
})(window.BT);
