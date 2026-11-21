// input.js — mouse, touch and keyboard play, plus the magnifier lens.
// Clicks and taps are mapped from the page into 560x420 panel coordinates.
// The keyboard crosshair lives on the left picture: arrows move it, Enter
// marks the spot under it, H asks for a hint, M toggles the magnifier.

import { PANEL_W, PANEL_H } from './scenes.js';

export function panelPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * PANEL_W,
    y: ((clientY - rect.top) / rect.height) * PANEL_H,
  };
}

export function bindPanelClicks(leftCanvas, rightCanvas, onMark) {
  for (const canvas of [leftCanvas, rightCanvas]) {
    canvas.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      const p = panelPoint(canvas, ev.clientX, ev.clientY);
      onMark(p.x, p.y, canvas === rightCanvas);
    });
  }
}

export function bindKeyboard(onKey) {
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      const step = ev.shiftKey ? 3 : 12;
      onKey({
        type: 'move',
        dx: ev.key === 'ArrowLeft' ? -step : ev.key === 'ArrowRight' ? step : 0,
        dy: ev.key === 'ArrowUp' ? -step : ev.key === 'ArrowDown' ? step : 0,
      });
    } else if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      onKey({ type: 'mark' });
    } else if (ev.key === 'h' || ev.key === 'H') {
      onKey({ type: 'hint' });
    } else if (ev.key === 'm' || ev.key === 'M') {
      onKey({ type: 'magnifier' });
    }
  });
}

// The magnifier is a small round lens that follows the pointer and shows the
// panel underneath it at 2.5x, so a tiny colour change can be checked closely.
export function createMagnifier(lensCanvas) {
  const ctx = lensCanvas.getContext('2d');
  const SIZE = 170;
  lensCanvas.width = SIZE;
  lensCanvas.height = SIZE;
  return {
    show(sourceCanvas, px, py, clientX, clientY) {
      const zoom = 2.5;
      const srcW = SIZE / zoom;
      const srcH = SIZE / zoom;
      ctx.save();
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(sourceCanvas, px - srcW / 2, py - srcH / 2, srcW, srcH, 0, 0, SIZE, SIZE);
      ctx.restore();
      ctx.strokeStyle = '#ffd93c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,217,60,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(SIZE / 2 - 10, SIZE / 2); ctx.lineTo(SIZE / 2 + 10, SIZE / 2);
      ctx.moveTo(SIZE / 2, SIZE / 2 - 10); ctx.lineTo(SIZE / 2, SIZE / 2 + 10);
      ctx.stroke();
      lensCanvas.style.display = 'block';
      const pad = 18;
      let lx = clientX + pad;
      let ly = clientY - SIZE - pad;
      if (lx + SIZE > window.innerWidth) lx = clientX - SIZE - pad;
      if (ly < 0) ly = clientY + pad;
      lensCanvas.style.left = lx + 'px';
      lensCanvas.style.top = ly + 'px';
    },
    hide() {
      lensCanvas.style.display = 'none';
    },
  };
}
