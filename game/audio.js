// audio.js — tiny WebAudio sounds, made in code, no audio files.
// A soft chime on a find, a low buzz on a miss, a click on buttons and a
// little fanfare when a scene is complete. Silent until the first click.

let audioCtx = null;

export function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, dur, type, vol) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol || 0.08, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur);
}

export function playFindSound() {
  tone(660, 0, 0.14, 'sine', 0.09);
  tone(880, 0.09, 0.2, 'sine', 0.09);
  tone(1320, 0.18, 0.24, 'sine', 0.06);
}

export function playMissSound() {
  tone(160, 0, 0.18, 'sawtooth', 0.05);
}

export function playClickSound() {
  tone(520, 0, 0.06, 'triangle', 0.05);
}

export function playHintSound() {
  tone(440, 0, 0.1, 'sine', 0.06);
  tone(587, 0.08, 0.14, 'sine', 0.06);
}

export function playWinSound() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.12, 0.28, 'triangle', 0.09));
}

export function playTickSound() {
  tone(980, 0, 0.05, 'square', 0.03);
}
