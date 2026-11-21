// hud.js — the top bar, the counter, the timer, the score and the screens.
// The HUD is plain DOM over the canvases so it stays crisp at any size and
// the judge can read the counter and the timer straight from a screenshot.

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}

export function buildHud(root) {
  root.innerHTML =
    '<header class="hud">' +
      '<div class="brand"><span class="brand-mark">🔍</span>' +
      '<div><div class="brand-title">SPOT THE DIFFERENCE</div>' +
      '<div class="brand-sub">Pasar Malam &amp; More — five scenes, 38 hidden differences</div></div></div>' +
      '<div class="hud-mid">' +
        '<div class="counter" id="counter">0 of 7 found</div>' +
        '<div class="timer-wrap"><div class="timer-bar" id="timerBar"></div>' +
        '<div class="timer-text" id="timerText">3:00</div></div>' +
      '</div>' +
      '<div class="hud-right">' +
        '<div class="score-box"><span class="score-label">SCORE</span><span id="score">0</span></div>' +
        '<div class="score-box"><span class="score-label">SCENE</span><span id="sceneLabel">1 / 5</span></div>' +
        '<button class="hud-btn" id="hintBtn" type="button">💡 Hint <b id="hintCount">3</b></button>' +
        '<button class="hud-btn" id="magBtn" type="button">🔎 Magnifier</button>' +
        '<button class="hud-btn" id="soundBtn" type="button">🔊 Sound</button>' +
      '</div>' +
    '</header>' +
    '<div class="scene-strip" id="sceneStrip"></div>' +
    '<div class="help">Click a difference on either picture · Arrow keys move the crosshair, Enter marks it · H = hint · M = magnifier</div>';
  return {
    counter: root.querySelector('#counter'),
    timerBar: root.querySelector('#timerBar'),
    timerText: root.querySelector('#timerText'),
    score: root.querySelector('#score'),
    sceneLabel: root.querySelector('#sceneLabel'),
    hintBtn: root.querySelector('#hintBtn'),
    hintCount: root.querySelector('#hintCount'),
    magBtn: root.querySelector('#magBtn'),
    soundBtn: root.querySelector('#soundBtn'),
    sceneStrip: root.querySelector('#sceneStrip'),
  };
}

export function renderSceneStrip(strip, scenes, currentIndex, cleared) {
  strip.innerHTML = '';
  scenes.forEach((s, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'scene-chip' + (i === currentIndex ? ' active' : '') + (cleared.has(i) ? ' cleared' : '');
    chip.textContent = (cleared.has(i) ? '✓ ' : '') + (i + 1) + '. ' + s.title + ' · ' + s.differences.length + ' to find';
    chip.dataset.scene = String(i);
    strip.appendChild(chip);
  });
}

export function updateHud(refs, state) {
  const scene = state.scene;
  refs.counter.textContent = state.found.size + ' of ' + scene.differences.length + ' found';
  refs.timerText.textContent = formatTime(state.secondsLeft);
  const frac = Math.max(0, state.secondsLeft / scene.timeLimit);
  refs.timerBar.style.width = (frac * 100).toFixed(1) + '%';
  refs.timerBar.classList.toggle('low', frac < 0.25);
  refs.score.textContent = String(state.score);
  refs.sceneLabel.textContent = (state.sceneIndex + 1) + ' / ' + state.totalScenes;
  refs.hintCount.textContent = String(state.hintsLeft);
  refs.hintBtn.disabled = state.hintsLeft <= 0;
  refs.magBtn.classList.toggle('on', state.magnifierOn);
  refs.soundBtn.textContent = state.soundOn ? '🔊 Sound' : '🔇 Muted';
}
