// render.js — every picture is drawn in code. No images, no network.
// Each scene painter takes (ctx, altered): `altered` is a Set of difference
// ids to apply, so the left panel (empty set) and the right panel (all ids)
// differ only where a difference says so. Helpers are shared so both panels
// keep one style.

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function star4(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

export function drawCat(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, 16 * s, 11 * s, 0, 0, Math.PI * 2); ctx.fill();
  circle(ctx, x + 13 * s, y - 10 * s, 8 * s, color);
  ctx.beginPath();
  ctx.moveTo(x + 8 * s, y - 15 * s); ctx.lineTo(x + 10 * s, y - 23 * s); ctx.lineTo(x + 14 * s, y - 15 * s);
  ctx.moveTo(x + 16 * s, y - 16 * s); ctx.lineTo(x + 19 * s, y - 23 * s); ctx.lineTo(x + 21 * s, y - 15 * s);
  ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 15 * s, y - 4 * s);
  ctx.quadraticCurveTo(x - 26 * s, y - 14 * s, x - 22 * s, y - 26 * s);
  ctx.quadraticCurveTo(x - 18 * s, y - 14 * s, x - 10 * s, y - 8 * s); ctx.fill();
  ctx.fillStyle = '#1c2733';
  circle(ctx, x + 15 * s, y - 11 * s, 1.4 * s, '#1c2733');
}

export function drawLantern(ctx, x, y, r, color, lit) {
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - r - 8); ctx.lineTo(x, y - r); ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1.5;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.55, r * 1.15, 0, -0.9 + i * 0.9, 0.9 - i * 0.9); ctx.stroke();
  }
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - 4, y - r * 1.15 - 4, 8, 5);
  ctx.fillRect(x - 4, y + r * 1.15 - 1, 8, 5);
  if (lit) {
    const g = ctx.createRadialGradient(x, y, 2, x, y, r * 2.2);
    g.addColorStop(0, 'rgba(255,214,110,0.55)');
    g.addColorStop(1, 'rgba(255,214,110,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, Math.PI * 2); ctx.fill();
  }
}

function nightSky(ctx, w, h, top, bottom, stars) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (const [x, y, r] of stars) star4(ctx, x, y, r, 'rgba(255,244,200,0.9)');
}

function stringLights(ctx, y, sag, alt, missingX) {
  ctx.strokeStyle = '#2b2118'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, y - 20);
  ctx.quadraticCurveTo(280, y + sag, 560, y - 20); ctx.stroke();
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const x = t * 560;
    const yy = (1 - t) * (1 - t) * (y - 20) + 2 * (1 - t) * t * (y + sag) + t * t * (y - 20);
    if (alt && Math.abs(x - missingX) < 28) continue;
    const cols = ['#ff5d5d', '#ffc93c', '#6ee7b7', '#7dd3fc', '#f9a8d4'];
    circle(ctx, x, yy + 6, 5, cols[i % cols.length]);
  }
}

// ---- Scene 1: Pasar Malam -------------------------------------------------
export function drawMarket(ctx, alt) {
  const W = 560, H = 420;
  nightSky(ctx, W, H, '#1b2340', '#3b2b52', [[40, 30, 3], [150, 55, 2], [250, 28, 3], [420, 40, 2], [500, 90, 2], [200, 80, 2]]);
  if (alt.has('star')) star4(ctx, 88, 42, 4, 'rgba(255,244,200,0.95)');
  circle(ctx, 480, 55, 22, '#f6e27a');
  circle(ctx, 472, 50, 20, '#3b2b52');
  // back buildings
  ctx.fillStyle = '#241d33';
  ctx.fillRect(0, 130, 120, 130); ctx.fillRect(440, 110, 120, 150);
  ctx.fillStyle = '#ffd166';
  for (let i = 0; i < 4; i++) { ctx.fillRect(18 + i * 28, 150, 14, 18); ctx.fillRect(458 + i * 26, 130, 14, 18); }
  // ground
  ctx.fillStyle = '#4a3b52'; ctx.fillRect(0, 300, W, 120);
  ctx.fillStyle = '#5a4860';
  for (let i = 0; i < 8; i++) ctx.fillRect(i * 70 + 10, 340, 50, 4);
  // left stall
  ctx.fillStyle = '#6b4a2f'; ctx.fillRect(50, 210, 130, 90);
  ctx.fillStyle = alt.has('awning') ? '#2a9d8f' : '#d94f3d';
  ctx.beginPath(); ctx.moveTo(40, 210); ctx.lineTo(190, 210); ctx.lineTo(180, 175); ctx.lineTo(50, 175); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(58 + i * 26, 210, 8, 0, Math.PI); ctx.fill(); }
  ctx.fillStyle = '#ffd166'; ctx.font = 'bold 20px Georgia'; ctx.fillText('SATE', 92, 200);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(60, 300, 110, 12);
  // satay sticks on the grill
  ctx.fillStyle = '#3a2a1a'; ctx.fillRect(70, 285, 90, 10);
  const sticks = alt.has('satay') ? 4 : 5;
  for (let i = 0; i < sticks; i++) {
    ctx.strokeStyle = '#e8c07a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(78 + i * 16, 288); ctx.lineTo(82 + i * 16, 262); ctx.stroke();
    circle(ctx, 82 + i * 16, 260, 4, '#b4552d');
  }
  ctx.fillStyle = 'rgba(200,200,210,0.35)';
  ctx.beginPath(); ctx.ellipse(120, 250, 26, 8, 0, 0, Math.PI * 2); ctx.fill();
  // right stall with sign
  ctx.fillStyle = '#5d4028'; ctx.fillRect(360, 215, 140, 85);
  ctx.fillStyle = '#e8b23a';
  rr(ctx, 368, 150, 124, 42, 8); ctx.fill();
  ctx.fillStyle = '#5d2a1a'; ctx.font = 'bold 18px Georgia'; ctx.fillText('ES TEH', 392, 177);
  // chili icon on the sign (drawn as a small red pepper)
  if (!alt.has('chili')) {
    ctx.fillStyle = '#d9382b';
    ctx.beginPath(); ctx.ellipse(478, 172, 9, 4, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2f7d32'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(485, 168); ctx.quadraticCurveTo(490, 162, 492, 166); ctx.stroke();
  }
  ctx.fillStyle = '#ffd166'; ctx.font = 'bold 16px Georgia'; ctx.fillText('Rp 5rb', 400, 240);
  // string lights + lanterns
  stringLights(ctx, 60, 46, false, 0);
  if (!alt.has('lantern')) drawLantern(ctx, 302, 62, 13, '#ff6b5e', true);
  drawLantern(ctx, 180, 78, 11, '#ffc93c', true);
  drawLantern(ctx, 430, 74, 11, '#ff6b5e', true);
  // balloon
  if (!alt.has('balloon')) {
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(118, 138); ctx.quadraticCurveTo(110, 180, 118, 210); ctx.stroke();
    ctx.fillStyle = '#3fae6a';
    ctx.beginPath(); ctx.ellipse(118, 118, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(112, 110, 5, 8, -0.4, 0, Math.PI * 2); ctx.fill();
  }
  // crates + cat
  ctx.fillStyle = '#8a6a42'; ctx.fillRect(430, 320, 70, 40); ctx.fillRect(445, 290, 50, 30);
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 2;
  ctx.strokeRect(430, 320, 70, 40); ctx.strokeRect(445, 290, 50, 30);
  if (alt.has('cat')) drawCat(ctx, 470, 332, 1, '#e8912d');
  // vendor figure
  ctx.fillStyle = '#2f6f4f'; circle(ctx, 250, 260, 16, '#f2c29b');
  ctx.fillStyle = '#2f6f4f'; rr(ctx, 232, 272, 36, 55, 10); ctx.fill();
  ctx.fillStyle = '#f2c29b'; circle(ctx, 250, 258, 13, '#f2c29b');
  ctx.fillStyle = '#1c2733'; circle(ctx, 245, 256, 2, '#1c2733'); circle(ctx, 255, 256, 2, '#1c2733');
}

// ---- Scene 2: The Old Library ---------------------------------------------
export function drawLibrary(ctx, alt) {
  const W = 560, H = 420;
  ctx.fillStyle = '#3d2b1f'; ctx.fillRect(0, 0, W, H);
  // window with moon
  ctx.fillStyle = '#1b2340'; rr(ctx, 470, 25, 70, 90, 6); ctx.fill();
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 4; ctx.strokeRect(470, 25, 70, 90);
  ctx.beginPath(); ctx.moveTo(505, 25); ctx.lineTo(505, 115); ctx.moveTo(470, 70); ctx.lineTo(540, 70); ctx.stroke();
  if (!alt.has('moon')) { circle(ctx, 512, 52, 14, '#f6e27a'); circle(ctx, 507, 48, 12, '#1b2340'); }
  // clock
  circle(ctx, 282, 62, 26, '#f5ead2');
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(282, 62, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#1c2733'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(282, 62);
  if (alt.has('clock')) { ctx.lineTo(282, 44); } else { ctx.lineTo(296, 62); }
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(282, 62);
  if (alt.has('clock')) { ctx.lineTo(296, 70); } else { ctx.lineTo(282, 80); }
  ctx.stroke();
  // shelves
  for (let s = 0; s < 3; s++) {
    const y = 95 + s * 78;
    ctx.fillStyle = '#5d4028'; ctx.fillRect(20, y + 52, 400, 10);
    for (let i = 0; i < 14; i++) {
      const bx = 28 + i * 28;
      let col = ['#a63a2e', '#2e6f8e', '#c98a2b', '#4a7d4f', '#7d4a8e'][i % 5];
      if (s === 0 && i === 4 && alt.has('book')) col = '#2e6f8e';
      if (s === 0 && i === 4 && !alt.has('book')) col = '#a63a2e';
      ctx.fillStyle = col;
      ctx.fillRect(bx, y + 8, 22, 44);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(bx + 3, y + 14, 16, 3);
    }
  }
  // ladder
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(200, 95); ctx.lineTo(200, 330); ctx.moveTo(228, 95); ctx.lineTo(228, 330); ctx.stroke();
  ctx.lineWidth = 4;
  const rungs = alt.has('rung') ? [130, 180, 230, 280] : [130, 180, 230, 280, 300];
  // rung at y=300 is the missing one (near the desk)
  const rungYs = alt.has('rung') ? [130, 180, 230] : [130, 180, 230, 300];
  void rungs;
  for (const ry of rungYs) {
    ctx.beginPath(); ctx.moveTo(200, ry); ctx.lineTo(228, ry); ctx.stroke();
  }
  // desk
  ctx.fillStyle = '#6b4a2f'; ctx.fillRect(300, 320, 220, 14);
  ctx.fillRect(310, 334, 14, 60); ctx.fillRect(496, 334, 14, 60);
  // candle
  ctx.fillStyle = '#f5ead2'; ctx.fillRect(366, 288, 12, 32);
  if (!alt.has('flame')) {
    ctx.fillStyle = '#ffb703';
    ctx.beginPath(); ctx.ellipse(372, 276, 5, 10, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(372, 276, 2, 372, 276, 30);
    g.addColorStop(0, 'rgba(255,200,80,0.4)'); g.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(372, 276, 30, 0, Math.PI * 2); ctx.fill();
  }
  // books on desk + globe
  ctx.fillStyle = '#a63a2e'; ctx.fillRect(400, 300, 46, 10);
  ctx.fillStyle = '#2e6f8e'; ctx.fillRect(404, 290, 40, 10);
  circle(ctx, 452, 300, 20, '#7db8d9');
  ctx.fillStyle = '#4a9e5c';
  if (alt.has('globe')) {
    ctx.beginPath(); ctx.ellipse(458, 306, 10, 7, 0.4, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.ellipse(446, 294, 10, 7, -0.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(452, 320); ctx.lineTo(452, 326); ctx.stroke();
  // plant
  ctx.fillStyle = alt.has('pot') ? '#2e6f8e' : '#b4552d';
  ctx.beginPath(); ctx.moveTo(52, 330); ctx.lineTo(82, 330); ctx.lineTo(77, 356); ctx.lineTo(57, 356); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3f7d3a'; ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.moveTo(67, 330);
    ctx.quadraticCurveTo(67 + (i - 2) * 12, 305, 67 + (i - 2) * 18, 292); ctx.stroke();
  }
  // cat on top shelf
  if (alt.has('cat')) drawCat(ctx, 490, 88, 0.9, '#e8e0d0');
  // rug
  ctx.fillStyle = '#7d2e3a'; rr(ctx, 180, 380, 220, 26, 6); ctx.fill();
  ctx.fillStyle = '#c98a2b'; rr(ctx, 195, 386, 190, 14, 4); ctx.fill();
}

// ---- Scene 3: Botanical Garden ---------------------------------------------
function drawFlower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 14, y + Math.sin(a) * 14, 9, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  circle(ctx, x, y, 10, center);
}

function drawButterfly(ctx, x, y, s) {
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.ellipse(x - 8 * s, y, 9 * s, 12 * s, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 8 * s, y, 9 * s, 12 * s, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7c3aed';
  circle(ctx, x - 8 * s, y - 3 * s, 3 * s, '#7c3aed');
  circle(ctx, x + 8 * s, y - 3 * s, 3 * s, '#7c3aed');
  ctx.fillStyle = '#1c2733'; ctx.fillRect(x - 1.5 * s, y - 8 * s, 3 * s, 16 * s);
}

export function drawGarden(ctx, alt) {
  const W = 560, H = 420;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#bfe3f0'); g.addColorStop(0.6, '#dff3d8'); g.addColorStop(1, '#a8d08a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  circle(ctx, 80, 60, 26, '#ffd93c');
  ctx.strokeStyle = '#f2b705'; ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(80 + Math.cos(a) * 32, 60 + Math.sin(a) * 32);
    ctx.lineTo(80 + Math.cos(a) * 42, 60 + Math.sin(a) * 42); ctx.stroke();
  }
  if (!alt.has('cloud')) {
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.ellipse(460, 55, 34, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(438, 62, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(482, 62, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.ellipse(200, 45, 30, 13, 0, 0, Math.PI * 2); ctx.fill();
  // glasshouse frame
  ctx.strokeStyle = '#5d7d8a'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, 120); ctx.lineTo(560, 120); ctx.stroke();
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(i * 80, 0); ctx.lineTo(i * 80, 120); ctx.stroke(); }
  // ground + path
  ctx.fillStyle = '#7fae62'; ctx.fillRect(0, 300, W, 120);
  ctx.fillStyle = '#d9c49a'; ctx.beginPath(); ctx.ellipse(280, 400, 180, 22, 0, 0, Math.PI * 2); ctx.fill();
  // pond
  ctx.fillStyle = '#5fb3d9'; ctx.beginPath(); ctx.ellipse(420, 345, 90, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3f9e6a'; ctx.beginPath(); ctx.ellipse(390, 338, 22, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(445, 352, 24, 8, 0, 0, Math.PI * 2); ctx.fill();
  if (alt.has('frog')) {
    ctx.fillStyle = '#4caf50'; circle(ctx, 420, 330, 12, '#4caf50');
    circle(ctx, 412, 320, 5, '#4caf50'); circle(ctx, 428, 320, 5, '#4caf50');
    ctx.fillStyle = '#fff'; circle(ctx, 412, 319, 2.5, '#fff'); circle(ctx, 428, 319, 2.5, '#fff');
    ctx.fillStyle = '#1c2733'; circle(ctx, 412, 319, 1.2, '#1c2733'); circle(ctx, 428, 319, 1.2, '#1c2733');
  }
  // flower beds
  ctx.strokeStyle = '#3f7d3a'; ctx.lineWidth = 4;
  const stems = [[150, 190], [230, 210], [310, 180], [90, 230], [180, 260]];
  for (const [x, y] of stems) { ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, y + 10); ctx.stroke(); }
  drawFlower(ctx, 150, 190, alt.has('flower') ? '#b388eb' : '#ff7eb6', '#ffd93c');
  drawFlower(ctx, 230, 210, '#ff9f43', '#7c3aed');
  drawFlower(ctx, 310, 180, '#ff7eb6', '#ffd93c');
  drawFlower(ctx, 90, 230, '#7dd3fc', '#f59e0b');
  drawFlower(ctx, 180, 260, '#ff9f43', '#7c3aed');
  // butterfly + bee
  if (!alt.has('butterfly')) drawButterfly(ctx, 330, 120, 1);
  if (!alt.has('bee')) {
    ctx.fillStyle = '#f2b705'; ctx.beginPath(); ctx.ellipse(250, 90, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1c2733'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(247, 84); ctx.lineTo(247, 96); ctx.moveTo(252, 84); ctx.lineTo(252, 96); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.ellipse(246, 82, 5, 3, -0.5, 0, Math.PI * 2); ctx.fill();
  }
  // mushroom
  ctx.fillStyle = '#f5ead2'; ctx.fillRect(74, 350, 10, 16);
  ctx.fillStyle = alt.has('mushroom') ? '#3b82f6' : '#d9382b';
  ctx.beginPath(); ctx.arc(79, 350, 16, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fff'; circle(ctx, 73, 344, 2.5, '#fff'); circle(ctx, 85, 340, 2.5, '#fff');
  // watering can
  if (!alt.has('can')) {
    ctx.fillStyle = '#5b8c5a'; rr(ctx, 480, 330, 34, 22, 4); ctx.fill();
    ctx.strokeStyle = '#5b8c5a'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(480, 338); ctx.lineTo(466, 322); ctx.stroke();
    ctx.fillStyle = '#7fb3d9';
    circle(ctx, 462, 318, 2, '#7fb3d9'); circle(ctx, 458, 326, 2, '#7fb3d9');
  }
  // snail on a leaf
  ctx.fillStyle = '#4a9e5c'; ctx.beginPath(); ctx.ellipse(215, 372, 26, 9, -0.2, 0, Math.PI * 2); ctx.fill();
  if (alt.has('snail')) {
    ctx.fillStyle = '#c98a2b'; ctx.beginPath(); ctx.arc(215, 364, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(215, 364, 5, 0, Math.PI * 1.5); ctx.stroke();
  }
}

// ---- Scene 4: Bakery at Dawn -----------------------------------------------
export function drawBakery(ctx, alt) {
  const W = 560, H = 420;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#f7d9a0'); g.addColorStop(0.55, '#f3e2c0'); g.addColorStop(1, '#e8cfa8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // window with dawn sky + cat
  ctx.fillStyle = '#f9a86a'; rr(ctx, 470, 90, 70, 90, 6); ctx.fill();
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 4; ctx.strokeRect(470, 90, 70, 90);
  ctx.beginPath(); ctx.moveTo(505, 90); ctx.lineTo(505, 180); ctx.moveTo(470, 135); ctx.lineTo(540, 135); ctx.stroke();
  circle(ctx, 525, 108, 12, '#fff3c4');
  if (alt.has('cat')) drawCat(ctx, 505, 130, 0.8, '#5b4a68');
  // wall clock
  circle(ctx, 282, 62, 26, '#fffaf0');
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(282, 62, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#1c2733'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(282, 62);
  if (alt.has('clock')) { ctx.lineTo(300, 62); } else { ctx.lineTo(282, 44); }
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(282, 62); ctx.lineTo(282, 80); ctx.stroke();
  // shelves with loaves
  for (let s = 0; s < 2; s++) {
    const y = 120 + s * 70;
    ctx.fillStyle = '#8a6a42'; ctx.fillRect(30, y + 42, 300, 10);
    for (let i = 0; i < 4; i++) {
      if (s === 0 && i === 2 && alt.has('loaf')) continue;
      ctx.fillStyle = '#c98a2b';
      ctx.beginPath(); ctx.ellipse(60 + i * 70, y + 30, 26, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#a66a1a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(48 + i * 70, y + 26); ctx.lineTo(72 + i * 70, y + 26); ctx.stroke();
    }
  }
  // oven
  ctx.fillStyle = '#4a4a52'; rr(ctx, 360, 190, 130, 130, 8); ctx.fill();
  ctx.fillStyle = '#1c2733'; rr(ctx, 375, 210, 100, 70, 6); ctx.fill();
  ctx.fillStyle = '#ff9d45';
  ctx.beginPath(); ctx.ellipse(425, 260, 34, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f7c948'; circle(ctx, 385, 300, 5, '#f7c948'); circle(ctx, 410, 300, 5, '#f7c948');
  // oven mitt hanging
  ctx.fillStyle = alt.has('mitt') ? '#3f9e6a' : '#d9382b';
  rr(ctx, 338, 195, 20, 30, 8); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(342, 200, 12, 4);
  // counter
  ctx.fillStyle = '#a0714f'; ctx.fillRect(30, 320, 500, 16);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(30, 336, 500, 60);
  // croissants on a tray
  ctx.fillStyle = '#d9d9d9'; rr(ctx, 130, 296, 120, 14, 6); ctx.fill();
  const croissants = alt.has('croissant') ? 2 : 3;
  for (let i = 0; i < croissants; i++) {
    ctx.fillStyle = '#e8a33d';
    ctx.beginPath(); ctx.ellipse(160 + i * 38, 292, 15, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b57a1e'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(152 + i * 38, 288); ctx.lineTo(168 + i * 38, 288); ctx.stroke();
  }
  // cookie jar
  ctx.fillStyle = 'rgba(220,235,245,0.85)'; rr(ctx, 430, 240, 50, 60, 10); ctx.fill();
  ctx.fillStyle = '#8a6a42'; ctx.fillRect(428, 236, 54, 8);
  if (!alt.has('jar')) {
    ctx.fillStyle = '#7d4a2d';
    circle(ctx, 445, 285, 8, '#7d4a2d'); circle(ctx, 462, 278, 8, '#7d4a2d'); circle(ctx, 455, 292, 8, '#7d4a2d');
    ctx.fillStyle = '#2e1c10'; circle(ctx, 443, 283, 1.5, '#2e1c10'); circle(ctx, 464, 276, 1.5, '#2e1c10');
  }
  // rolling pin
  if (!alt.has('pin')) {
    ctx.fillStyle = '#d9b380'; rr(ctx, 80, 326, 52, 12, 6); ctx.fill();
    circle(ctx, 76, 332, 5, '#b08a5a'); circle(ctx, 136, 332, 5, '#b08a5a');
  }
  // baker figure
  ctx.fillStyle = '#f2c29b'; circle(ctx, 290, 300, 14, '#f2c29b');
  ctx.fillStyle = '#fff'; rr(ctx, 268, 312, 44, 34, 8); ctx.fill();
  ctx.fillStyle = '#e8e8e8'; ctx.beginPath(); ctx.ellipse(290, 292, 16, 8, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#1c2733'; circle(ctx, 285, 298, 2, '#1c2733'); circle(ctx, 295, 298, 2, '#1c2733');
  // flour sacks
  ctx.fillStyle = '#e8ddc8'; rr(ctx, 40, 352, 44, 34, 6); ctx.fill();
  ctx.fillStyle = '#c98a2b'; ctx.font = 'bold 13px Georgia'; ctx.fillText('FLOUR', 48, 372);
}

// ---- Scene 5: Kite Festival -------------------------------------------------
function drawKite(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 34 * s); ctx.lineTo(x + 24 * s, y); ctx.lineTo(x, y + 34 * s); ctx.lineTo(x - 24 * s, y);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, y - 34 * s); ctx.lineTo(x, y + 34 * s); ctx.moveTo(x - 24 * s, y); ctx.lineTo(x + 24 * s, y); ctx.stroke();
}

export function drawKites(ctx, alt) {
  const W = 560, H = 420;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#7ec8f2'); g.addColorStop(0.6, '#bfe8f7'); g.addColorStop(1, '#e8f7d8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  circle(ctx, 505, 55, 26, '#ffd93c');
  ctx.strokeStyle = '#f2b705'; ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(505 + Math.cos(a) * 32, 55 + Math.sin(a) * 32);
    ctx.lineTo(505 + Math.cos(a) * 42, 55 + Math.sin(a) * 42); ctx.stroke();
  }
  if (!alt.has('cloud')) {
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.ellipse(90, 70, 34, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(112, 76, 20, 11, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.ellipse(400, 50, 26, 11, 0, 0, Math.PI * 2); ctx.fill();
  if (!alt.has('bird')) {
    ctx.strokeStyle = '#1c2733'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(440, 95); ctx.quadraticCurveTo(448, 88, 456, 95);
    ctx.quadraticCurveTo(464, 88, 472, 95); ctx.stroke();
  }
  // hills
  ctx.fillStyle = '#8fc97a'; ctx.beginPath(); ctx.ellipse(140, 400, 260, 90, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#7dbb68'; ctx.beginPath(); ctx.ellipse(470, 410, 240, 80, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#6aae58'; ctx.fillRect(0, 360, W, 60);
  // flag pole
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(60, 360); ctx.lineTo(60, 210); ctx.stroke();
  ctx.fillStyle = alt.has('flag') ? '#2e6f8e' : '#d9382b';
  ctx.beginPath(); ctx.moveTo(60, 210); ctx.lineTo(96, 220); ctx.lineTo(60, 232); ctx.closePath(); ctx.fill();
  // big kite + tail
  drawKite(ctx, 280, 130, 1, alt.has('kite') ? '#ffd93c' : '#d9382b');
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(280, 164); ctx.quadraticCurveTo(290, 200, 300, 230); ctx.stroke();
  const bows = alt.has('tail') ? 2 : 3;
  for (let i = 0; i < bows; i++) {
    const by = 185 + i * 22;
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath(); ctx.moveTo(288 + i * 4, by - 6); ctx.lineTo(298 + i * 4, by); ctx.lineTo(288 + i * 4, by + 6); ctx.closePath(); ctx.fill();
  }
  // second kite appears in the altered panel
  if (alt.has('kite2')) {
    drawKite(ctx, 470, 180, 0.6, '#7c3aed');
    ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(470, 200); ctx.quadraticCurveTo(474, 220, 478, 235); ctx.stroke();
  }
  // small kite
  drawKite(ctx, 150, 100, 0.55, '#3fae6a');
  // kite flyer child
  ctx.strokeStyle = '#6b4a2f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(205, 300); ctx.quadraticCurveTo(240, 260, 272, 200); ctx.stroke();
  ctx.fillStyle = '#f2c29b'; circle(ctx, 205, 290, 13, '#f2c29b');
  ctx.fillStyle = alt.has('hat') ? '#2e6f8e' : '#d9382b';
  ctx.beginPath(); ctx.arc(205, 286, 13, Math.PI, 0); ctx.fill();
  ctx.fillRect(192, 284, 26, 3);
  ctx.fillStyle = '#3f7d3a'; rr(ctx, 190, 302, 30, 42, 8); ctx.fill();
  ctx.fillStyle = '#2b3a55'; ctx.fillRect(192, 344, 10, 22); ctx.fillRect(208, 344, 10, 22);
  // ball
  if (!alt.has('ball')) {
    circle(ctx, 400, 370, 14, '#f5ead2');
    ctx.fillStyle = '#d9382b';
    ctx.beginPath(); ctx.moveTo(400, 356); ctx.lineTo(410, 368); ctx.lineTo(400, 380); ctx.lineTo(390, 368); ctx.closePath(); ctx.fill();
  }
  // flowers
  for (const [x, y, c] of [[100, 380, '#ff7eb6'], [330, 390, '#ffd93c'], [500, 385, '#ff7eb6'], [250, 395, '#b388eb']]) {
    circle(ctx, x, y, 5, c); circle(ctx, x, y - 8, 3, '#ffd93c');
  }
}

// ---- Dispatcher -------------------------------------------------------------
export const PAINTERS = {
  market: drawMarket,
  library: drawLibrary,
  garden: drawGarden,
  bakery: drawBakery,
  kites: drawKites,
};

export function drawScene(ctx, scene, altered) {
  const paint = PAINTERS[scene.id];
  ctx.save();
  ctx.clearRect(0, 0, 560, 420);
  paint(ctx, altered);
  ctx.restore();
}
