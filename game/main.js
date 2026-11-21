// main.js — game flow: title screen, scene play, timer, scoring, hints,
// scene-complete and game-complete screens. One state object drives the HUD;
// the two panels are repainted every animation frame so markers pulse.

import { SCENES, PANEL_W, PANEL_H, totalDifferences } from './scenes.js';
import { drawScene } from './render.js';
import { findDifferenceAt, drawFoundMarker, drawHintRing, drawMissFlash, pointsForFind } from './differences.js';
import { buildHud, renderSceneStrip, updateHud } from './hud.js';
import { bindPanelClicks, bindKeyboard, createMagnifier, panelPoint } from './input.js';
import { playFindSound, playMissSound, playClickSound, playHintSound, playWinSound, playTickSound, ensureAudio } from './audio.js';

const $ = (id) => document.getElementById(id);

const state = {
  screen: 'title', // title | play | sceneDone | gameDone | timeout
  sceneIndex: 0,
  scene: SCENES[0],
  totalScenes: SCENES.length,
  found: new Set(),
  secondsLeft: SCENES[0].timeLimit,
  score: 0,
  totalScore: 0,
  streak: 0,
  hintsLeft: 3,
  magnifierOn: false,
  soundOn: true,
  cleared: new Set(),
  hintTarget: null,
  hintUntil: 0,
  missFlash: null,
  cursor: { x: PANEL_W / 2, y: PANEL_H / 2, visible: false },
  lastTickSecond: -1,
  startedAt: 0,
};

let hud = null;
let leftCtx = null;
let rightCtx = null;
let magnifier = null;
let timerId = null;

function allAlteredIds(scene) {
  return new Set(scene.differences.map((d) => d.id));
}

function drawPanels(time) {
  if (!leftCtx || !rightCtx) return;
  drawScene(leftCtx, state.scene, new Set());
  drawScene(rightCtx, state.scene, allAlteredIds(state.scene));
  for (const d of state.scene.differences) {
    if (state.found.has(d.id)) {
      drawFoundMarker(leftCtx, d, time);
      drawFoundMarker(rightCtx, d, time);
    }
  }
  if (state.hintTarget && time < state.hintUntil) {
    const d = state.scene.differences.find((x) => x.id === state.hintTarget);
    if (d) {
      drawHintRing(leftCtx, d, time);
      drawHintRing(rightCtx, d, time);
    }
  }
  if (state.missFlash && time - state.missFlash.at < 450) {
    drawMissFlash(state.missFlash.right ? rightCtx : leftCtx, state.missFlash.x, state.missFlash.y);
  }
  if (state.cursor.visible && state.screen === 'play') {
    leftCtx.save();
    leftCtx.strokeStyle = '#ffd93c';
    leftCtx.lineWidth = 2;
    leftCtx.beginPath();
    leftCtx.moveTo(state.cursor.x - 14, state.cursor.y);
    leftCtx.lineTo(state.cursor.x + 14, state.cursor.y);
    leftCtx.moveTo(state.cursor.x, state.cursor.y - 14);
    leftCtx.lineTo(state.cursor.x, state.cursor.y + 14);
    leftCtx.stroke();
    leftCtx.beginPath();
    leftCtx.arc(state.cursor.x, state.cursor.y, 5, 0, Math.PI * 2);
    leftCtx.stroke();
    leftCtx.restore();
  }
}

function loop(time) {
  drawPanels(time || 0);
  requestAnimationFrame(loop);
}

function startTimer() {
  stopTimer();
  state.lastTickSecond = -1;
  timerId = window.setInterval(() => {
    if (state.screen !== 'play') return;
    state.secondsLeft -= 1;
    if (state.secondsLeft <= 10 && state.secondsLeft > 0 && state.secondsLeft !== state.lastTickSecond) {
      state.lastTickSecond = state.secondsLeft;
      if (state.soundOn) playTickSound();
    }
    if (state.secondsLeft <= 0) {
      state.secondsLeft = 0;
      showTimeout();
    }
    updateHud(hud, state);
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function loadScene(index) {
  state.sceneIndex = index;
  state.scene = SCENES[index];
  state.found = new Set();
  state.secondsLeft = state.scene.timeLimit;
  state.streak = 0;
  state.hintsLeft = 3;
  state.hintTarget = null;
  state.missFlash = null;
  state.screen = 'play';
  state.startedAt = Date.now();
  $('sceneTitle').textContent = state.scene.title;
  $('sceneSub').textContent = state.scene.subtitle + '  ·  Find ' + state.scene.differences.length + ' differences  ·  ' + Math.floor(state.scene.timeLimit / 60) + ':' + String(state.scene.timeLimit % 60).padStart(2, '0') + ' on the clock';
  $('overlay').classList.add('hidden');
  $('titleScreen').classList.add('hidden');
  $('gameArea').classList.remove('hidden');
  renderSceneStrip(hud.sceneStrip, SCENES, index, state.cleared);
  updateHud(hud, state);
  startTimer();
}

function showTitle() {
  state.screen = 'title';
  stopTimer();
  $('gameArea').classList.add('hidden');
  $('overlay').classList.add('hidden');
  $('titleScreen').classList.remove('hidden');
  renderTitleCards();
}

function renderTitleCards() {
  const wrap = $('titleCards');
  wrap.innerHTML = '';
  SCENES.forEach((s, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'title-card';
    const cv = document.createElement('canvas');
    cv.width = 280;
    cv.height = 210;
    card.appendChild(cv);
    const label = document.createElement('span');
    label.textContent = (i + 1) + '. ' + s.title + ' — ' + s.differences.length + ' differences';
    card.appendChild(label);
    const tag = document.createElement('em');
    tag.textContent = state.cleared.has(i) ? '✓ Cleared' : s.subtitle;
    card.appendChild(tag);
    card.addEventListener('click', () => {
      ensureAudio();
      if (state.soundOn) playClickSound();
      loadScene(i);
    });
    wrap.appendChild(card);
    const ctx = cv.getContext('2d');
    ctx.save();
    ctx.scale(0.5, 0.5);
    drawScene(ctx, s, new Set());
    ctx.restore();
  });
  $('titleTotal').textContent = 'Five hand-drawn scenes · ' + totalDifferences() + ' hidden differences · hints, magnifier, timer and score in every round';
}

function showSceneComplete() {
  state.screen = 'sceneDone';
  stopTimer();
  const timeBonus = state.secondsLeft * 2;
  state.score += timeBonus;
  state.totalScore = state.score;
  if (state.soundOn) playWinSound();
  const ov = $('overlay');
  ov.classList.remove('hidden');
  ov.innerHTML =
    '<div class="panel-card">' +
    '<div class="big-emoji">🎉</div>' +
    '<h2>Scene Complete!</h2>' +
    '<p>You found all ' + state.scene.differences.length + ' differences in <b>' + state.scene.title + '</b>.</p>' +
    '<p class="score-line">Time bonus +' + timeBonus + ' &nbsp;·&nbsp; Scene score <b>' + state.score + '</b></p>' +
    '<div class="stars">' + '★'.repeat(state.secondsLeft > state.scene.par ? 3 : state.secondsLeft > state.scene.par / 2 ? 2 : 1) + '</div>' +
    '<p class="muted">Par time ' + Math.floor(state.scene.par / 60) + ':' + String(state.scene.par % 60).padStart(2, '0') + ' · ' + state.secondsLeft + 's left on the clock</p>' +
    '<div class="btn-row">' +
    (state.sceneIndex + 1 < SCENES.length
      ? '<button class="btn primary" id="nextBtn" type="button">Next scene →</button>'
      : '<button class="btn primary" id="nextBtn" type="button">See your results →</button>') +
    '<button class="btn" id="replayBtn" type="button">Replay this scene</button>' +
    '<button class="btn" id="menuBtn" type="button">Scene select</button>' +
    '</div></div>';
  $('nextBtn').addEventListener('click', () => {
    if (state.soundOn) playClickSound();
    if (state.sceneIndex + 1 < SCENES.length) loadScene(state.sceneIndex + 1);
    else showGameComplete();
  });
  $('replayBtn').addEventListener('click', () => { if (state.soundOn) playClickSound(); loadScene(state.sceneIndex); });
  $('menuBtn').addEventListener('click', () => { if (state.soundOn) playClickSound(); showTitle(); });
}

function showGameComplete() {
  state.screen = 'gameDone';
  const ov = $('overlay');
  ov.classList.remove('hidden');
  const foundTotal = totalDifferences();
  ov.innerHTML =
    '<div class="panel-card">' +
    '<div class="big-emoji">🏆</div>' +
    '<h2>Detective Complete!</h2>' +
    '<p>You found all <b>' + foundTotal + ' differences</b> across five scenes.</p>' +
    '<p class="score-line">Final score <b>' + state.score + '</b></p>' +
    '<div class="stars">★★★</div>' +
    '<p class="muted">Pasar Malam · The Old Library · Botanical Garden · Bakery at Dawn · Kite Festival</p>' +
    '<div class="btn-row">' +
    '<button class="btn primary" id="againBtn" type="button">Play again from scene 1</button>' +
    '<button class="btn" id="menuBtn2" type="button">Scene select</button>' +
    '</div></div>';
  $('againBtn').addEventListener('click', () => { if (state.soundOn) playClickSound(); state.score = 0; loadScene(0); });
  $('menuBtn2').addEventListener('click', () => { if (state.soundOn) playClickSound(); showTitle(); });
}

function showTimeout() {
  state.screen = 'timeout';
  stopTimer();
  const ov = $('overlay');
  ov.classList.remove('hidden');
  ov.innerHTML =
    '<div class="panel-card">' +
    '<div class="big-emoji">⏰</div>' +
    '<h2>Time’s up!</h2>' +
    '<p>You found <b>' + state.found.size + ' of ' + state.scene.differences.length + '</b> differences in ' + state.scene.title + '.</p>' +
    '<p class="muted">The ' + (state.scene.differences.length - state.found.size) + ' you missed are still hiding — try again, they are all fair.</p>' +
    '<div class="btn-row">' +
    '<button class="btn primary" id="retryBtn" type="button">Try this scene again</button>' +
    '<button class="btn" id="menuBtn3" type="button">Scene select</button>' +
    '</div></div>';
  $('retryBtn').addEventListener('click', () => { if (state.soundOn) playClickSound(); loadScene(state.sceneIndex); });
  $('menuBtn3').addEventListener('click', () => { if (state.soundOn) playClickSound(); showTitle(); });
}

function markAt(x, y, onRight) {
  if (state.screen !== 'play') return;
  ensureAudio();
  const diff = findDifferenceAt(state.scene, x, y, state.found);
  if (diff) {
    state.found.add(diff.id);
    state.streak += 1;
    const pts = pointsForFind(state.streak, state.secondsLeft, state.scene.par);
    state.score += pts;
    if (state.soundOn) playFindSound();
    showToast('+' + pts + ' — ' + diff.label, true);
    state.hintTarget = null;
    if (state.found.size >= state.scene.differences.length) {
      state.cleared.add(state.sceneIndex);
      updateHud(hud, state);
      window.setTimeout(showSceneComplete, 650);
      return;
    }
  } else {
    state.streak = 0;
    state.score = Math.max(0, state.score - 10);
    state.missFlash = { x, y, right: onRight, at: performance.now() };
    if (state.soundOn) playMissSound();
    showToast('Not a difference — −10', false);
  }
  updateHud(hud, state);
}

let toastTimer = null;
function showToast(text, good) {
  const t = $('toast');
  t.textContent = text;
  t.classList.toggle('bad', !good);
  t.classList.remove('hidden');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.add('hidden'), 1600);
}

function useHint() {
  if (state.screen !== 'play') return;
  if (state.hintsLeft <= 0) return;
  ensureAudio();
  const remaining = state.scene.differences.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 25);
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintTarget = pick.id;
  state.hintUntil = performance.now() + 2600;
  if (state.soundOn) playHintSound();
  showToast('Hint: look near the pulsing ring — −25', true);
  updateHud(hud, state);
}

// Screenshot staging: ?shot=cover | scene2 | complete | title
// These are real game states (the same code a player reaches by playing),
// preset through the URL so the maker can photograph them.
function applyShotMode() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  if (shot === 'title') { showTitle(); return; }
  if (shot === 'scene2') {
    loadScene(1);
    for (const id of ['book', 'flame']) state.found.add(id);
    state.score = 235;
    state.secondsLeft = 132;
    updateHud(hud, state);
    return;
  }
  if (shot === 'complete') {
    loadScene(0);
    for (const d of state.scene.differences) state.found.add(d.id);
    state.score = 842;
    state.secondsLeft = 64;
    state.cleared.add(0);
    updateHud(hud, state);
    stopTimer();
    state.screen = 'sceneDone';
    showSceneComplete();
    return;
  }
  // cover: scene 1 mid-play, 3 found, 4 still hiding
  loadScene(0);
  for (const id of ['lantern', 'awning', 'satay']) state.found.add(id);
  state.score = 365;
  state.secondsLeft = 148;
  updateHud(hud, state);
}

function init() {
  hud = buildHud($('hudRoot'));
  const left = $('leftPanel');
  const right = $('rightPanel');
  left.width = PANEL_W;
  left.height = PANEL_H;
  right.width = PANEL_W;
  right.height = PANEL_H;
  leftCtx = left.getContext('2d');
  rightCtx = right.getContext('2d');
  magnifier = createMagnifier($('lens'));

  bindPanelClicks(left, right, (x, y, onRight) => markAt(x, y, onRight));
  bindKeyboard((key) => {
    if (key.type === 'move') {
      state.cursor.visible = true;
      state.cursor.x = Math.max(8, Math.min(PANEL_W - 8, state.cursor.x + key.dx));
      state.cursor.y = Math.max(8, Math.min(PANEL_H - 8, state.cursor.y + key.dy));
    } else if (key.type === 'mark') {
      state.cursor.visible = true;
      markAt(state.cursor.x, state.cursor.y, false);
    } else if (key.type === 'hint') {
      useHint();
    } else if (key.type === 'magnifier') {
      state.magnifierOn = !state.magnifierOn;
      if (!state.magnifierOn) magnifier.hide();
      updateHud(hud, state);
    }
  });

  const trackLens = (canvas, ev) => {
    if (!state.magnifierOn || state.screen !== 'play') return;
    const rect = canvas.getBoundingClientRect();
    const px = ((ev.clientX - rect.left) / rect.width) * PANEL_W;
    const py = ((ev.clientY - rect.top) / rect.height) * PANEL_H;
    const scaleX = canvas.width / rect.width;
    magnifier.show(canvas, px * scaleX, py * scaleX, ev.clientX, ev.clientY);
  };
  for (const canvas of [left, right]) {
    canvas.addEventListener('pointermove', (ev) => trackLens(canvas, ev));
    canvas.addEventListener('pointerleave', () => magnifier.hide());
  }

  hud.hintBtn.addEventListener('click', useHint);
  hud.magBtn.addEventListener('click', () => {
    state.magnifierOn = !state.magnifierOn;
    if (!state.magnifierOn) magnifier.hide();
    updateHud(hud, state);
  });
  hud.soundBtn.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    updateHud(hud, state);
  });
  hud.sceneStrip.addEventListener('click', (ev) => {
    const chip = ev.target.closest('.scene-chip');
    if (!chip) return;
    if (state.soundOn) playClickSound();
    loadScene(Number(chip.dataset.scene));
  });

  $('playBtn').addEventListener('click', () => {
    ensureAudio();
    if (state.soundOn) playClickSound();
    state.score = 0;
    state.cleared = new Set();
    loadScene(0);
  });
  $('howBtn').addEventListener('click', () => {
    ensureAudio();
    $('howCard').classList.toggle('hidden');
  });

  showTitle();
  applyShotMode();
  requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', init);
