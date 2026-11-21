// differences.js — finding, marking and scoring differences.
// A click counts when it lands within a difference's radius on either panel.
// Found differences are circled on BOTH panels so the two pictures stay in
// sync, and a hint pulses a ring around one difference you have not found yet.

export function findDifferenceAt(scene, x, y, found) {
  let best = null;
  let bestD = Infinity;
  for (const d of scene.differences) {
    if (found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r + 10 && dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  return best;
}

export function drawFoundMarker(ctx, diff, time) {
  const pulse = 1 + 0.06 * Math.sin(time / 180);
  const r = (diff.r + 8) * pulse;
  ctx.save();
  ctx.strokeStyle = '#ffd93c';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#ffd93c';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffd93c';
  ctx.beginPath();
  ctx.arc(diff.x + r * 0.7, diff.y - r * 0.7, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1c2733';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(diff.x + r * 0.7 - 5, diff.y - r * 0.7);
  ctx.lineTo(diff.x + r * 0.7 - 1, diff.y - r * 0.7 + 4);
  ctx.lineTo(diff.x + r * 0.7 + 6, diff.y - r * 0.7 - 5);
  ctx.stroke();
  ctx.restore();
}

export function drawHintRing(ctx, diff, time) {
  const t = (time % 900) / 900;
  const r = diff.r + 6 + t * 14;
  ctx.save();
  ctx.globalAlpha = 1 - t;
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawMissFlash(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#ff5d5d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10); ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

export function pointsForFind(streak, secondsLeft, par) {
  const base = 100;
  const streakBonus = Math.min(streak, 5) * 10;
  const speedBonus = secondsLeft > par ? 25 : 0;
  return base + streakBonus + speedBonus;
}
