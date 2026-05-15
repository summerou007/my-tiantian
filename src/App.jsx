import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

import icon1 from './icon1.jpg';
import icon2 from './icon2.jpg';
import icon3 from './icon3.jpg';
import icon4 from './icon4.jpg';
import icon5 from './icon5.jpg';
import icon6 from './icon6.jpg';
import icon7 from './icon7.jpg';
import icon8 from './icon8.jpg';
import icon9 from './icon9.jpg';
import p1 from './h/1.png';
import p2 from './h/2.png';
import p3 from './h/3.png';
import p4 from './h/4.png';
import p5 from './h/5.png';
import p6 from './h/6.png';
import p7 from './h/7.png';
import p8 from './h/8.png';
import p9 from './h/9.png';
import p10 from './h/10.png';
import p11 from './h/11.png';
import p12 from './h/12.png';
import p13 from './h/13.png';
import p14 from './h/14.png';
import p15 from './h/15.png';

const PONY_PICS = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15];

const TASKS = [
  { id: 1, icon: icon1, text: '听到闹钟立刻起床不赖床', pts: 15, double: false, attackType: 'sunrise' },
  { id: 2, icon: icon2, text: '自己刷牙洗脸换衣服', pts: 10, double: false, attackType: 'bubble' },
  { id: 3, icon: icon3, text: '自己准备书包和饭盒', pts: 15, double: false, attackType: 'star_throw' },
  { id: 4, icon: icon4, text: '完成作业/阅读打卡', pts: 20, double: false, attackType: 'book_blast' },
  { id: 5, icon: icon5, text: '闹钟响了立刻上床睡觉', pts: 20, double: false, attackType: 'moon_beam' },
  { id: 6, icon: icon6, text: '做了自我突破/有进步的事', pts: 15, double: true, sub: '双倍积分！', attackType: 'rainbow' },
  { id: 7, icon: icon7, text: '专注写作业，不发呆不做无关事', pts: 15, double: true, sub: '双倍积分！', attackType: 'laser' },
  { id: 8, icon: icon8, text: '整理自己的东西', pts: 10, double: false, attackType: 'whirlwind' },
  { id: 9, icon: icon9, text: '阅读30分钟爸爸妈妈选书', pts: 15, double: false, attackType: 'book_blast' },
];

const LEVELS = [
  { lv: 1, name: '小马驹', color: '#fed7aa', dark: '#f97316' },
  { lv: 2, name: '独角小马', color: '#fce7f3', dark: '#f472b6' },
  { lv: 3, name: '彩虹马驹', color: '#fef9c3', dark: '#eab308' },
  { lv: 4, name: '魔法独角兽', color: '#dcfce7', dark: '#22c55e' },
  { lv: 5, name: '星光飞马', color: '#dbeafe', dark: '#3b82f6' },
  { lv: 6, name: '幻影独角兽', color: '#ede9fe', dark: '#8b5cf6' },
  { lv: 7, name: '火焰战马', color: '#fef2f2', dark: '#ef4444' },
  { lv: 8, name: '冰晶飞马', color: '#e0f2fe', dark: '#0ea5e9' },
  { lv: 9, name: '雷霆神驹', color: '#fefce8', dark: '#ca8a04' },
  { lv: 10, name: '星河独角兽', color: '#fdf4ff', dark: '#d946ef' },
  { lv: 11, name: '时空飞马', color: '#f0fdf4', dark: '#16a34a' },
  { lv: 12, name: '宇宙战神', color: '#fff7ed', dark: '#ea580c' },
  { lv: 13, name: '彩虹守护者', color: '#fdf2f8', dark: '#ec4899' },
  { lv: 14, name: '星辰圣马', color: '#f5f3ff', dark: '#7c3aed' },
  { lv: 15, name: '彩虹传说', color: '#ffffff', dark: '#a855f7' },
];

function mgThreshold() { return 600; }

const VILLAINS = [
  { name: '赖床怪', desc: '喜欢让你赖床的怪兽', color: '#7f1d1d', body: '#ef4444', hp: 100, shieldColor: '#94a3b8', armorColor: '#64748b' },
  { name: '邋遢精', desc: '让你不收拾东西的妖怪', color: '#78350f', body: '#f97316', hp: 120, shieldColor: '#b45309', armorColor: '#92400e' },
  { name: '拖延魔', desc: '总叫你拖到明天再做！', color: '#365314', body: '#84cc16', hp: 140, shieldColor: '#4d7c0f', armorColor: '#365314' },
  { name: '零食鬼', desc: '让你不好好吃饭的馋鬼', color: '#7c2d12', body: '#fb923c', hp: 160, shieldColor: '#c2410c', armorColor: '#9a3412' },
  { name: '发呆精', desc: '让你上课发呆走神！', color: '#1e3a5f', body: '#60a5fa', hp: 180, shieldColor: '#1d4ed8', armorColor: '#1e40af' },
  { name: '哭闹王', desc: '让你乱发脾气的暴君', color: '#4a044e', body: '#c026d3', hp: 200, shieldColor: '#7e22ce', armorColor: '#6b21a8' },
  { name: '骗人妖', desc: '让你说谎欺骗的妖精', color: '#052e16', body: '#16a34a', hp: 220, shieldColor: '#15803d', armorColor: '#166534' },
  { name: '夜猫怪', desc: '让你熬夜不睡觉的恶魔', color: '#1e1b4b', body: '#6366f1', hp: 240, shieldColor: '#4338ca', armorColor: '#3730a3' },
  { name: '乱丢怪', desc: '让你到处乱丢东西！', color: '#422006', body: '#d97706', hp: 260, shieldColor: '#b45309', armorColor: '#92400e' },
  { name: '偷懒仙', desc: '让你什么都不想做！', color: '#0f172a', body: '#64748b', hp: 280, shieldColor: '#475569', armorColor: '#334155' },
  { name: '骄傲龙', desc: '让你觉得自己总是对的', color: '#450a0a', body: '#dc2626', hp: 300, shieldColor: '#b91c1c', armorColor: '#991b1b' },
  { name: '嫉妒精', desc: '让你嫉妒别人的绿妖', color: '#14532d', body: '#15803d', hp: 320, shieldColor: '#166534', armorColor: '#14532d' },
  { name: '逃避鬼', desc: '让你逃避困难的幽灵', color: '#1c1917', body: '#78716c', hp: 340, shieldColor: '#57534e', armorColor: '#44403c' },
  { name: '懒虫王', desc: '懒惰的终极大BOSS！', color: '#1a1a2e', body: '#4338ca', hp: 380, shieldColor: '#3730a3', armorColor: '#312e81' },
  { name: '混沌魔王', desc: '所有坏习惯的源头！', color: '#0f0f0f', body: '#7c3aed', hp: 450, shieldColor: '#6d28d9', armorColor: '#5b21b6' },
];

// ── AUDIO ─────────────────────────────────────────────
let actx = null;
function ac() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(f, d, type = 'sine', vol = 0.25, delay = 0) {
  try {
    const c = ac(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.value = f;
    const t = c.currentTime + delay;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.start(t); o.stop(t + d + 0.05);
  } catch (e) {}
}
function sfxTask()        { tone(523,0.08); tone(659,0.08,'sine',0.25,0.09); tone(784,0.15,'sine',0.25,0.18); }
function sfxFeed()        { tone(440,0.06,'triangle'); tone(550,0.1,'triangle',0.25,0.08); }
function sfxMagicCharge() { [300,400,500,600,750,900].forEach((f,i) => tone(f,0.08,'sine',0.2,i*0.055)); }
function sfxMagicBeam()   { [200,400,800,1200,1600].forEach((f,i) => tone(f,0.15,'square',0.15,i*0.04)); setTimeout(() => { [1600,1200,800].forEach((f,i) => tone(f,0.12,'sine',0.2,i*0.05)); }, 300); }
function sfxLevelUp()     { [523,659,784,1047,1319].forEach((f,i) => tone(f,0.18,'sine',0.35,i*0.1)); }
function sfxVillainDead() { [400,350,300,250,200,150].forEach((f,i) => tone(f,0.12,'sawtooth',0.25,i*0.07)); }
function sfxWin()         { const m=[523,587,659,698,784,880,988,1047]; m.forEach((f,i) => tone(f,0.2,'sine',0.4,i*0.15)); }

// ── HELPERS ───────────────────────────────────────────
function sn(k, d, min, max) {
  const v = localStorage.getItem(k);
  if (v === null || isNaN(Number(v))) return d;
  let n = Number(v);
  if (min !== undefined) n = Math.max(min, n);
  if (max !== undefined) n = Math.min(max, n);
  return n;
}
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

function drawStars(canvas) {
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 420;
  canvas.height = canvas.offsetHeight || 200;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width, y = Math.random() * canvas.height, r = Math.random() * 1.5 + 0.3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.3})`; ctx.fill();
  }
}
// ── VILLAIN DRAW ──────────────────────────────────────
function drawVillain(canvas, villainIdx, villainHp, flash, armorPieces) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 100, 140);
  const v = VILLAINS[Math.min(villainIdx, VILLAINS.length - 1)];
  const hpPct = Math.max(0, villainHp / v.hp);

  if (flash) {
    ctx.fillStyle = 'rgba(255,50,50,0.6)';
    ctx.fillRect(0, 0, 100, 140);
  }

  ctx.save(); ctx.globalAlpha = 0.3;
  ctx.beginPath(); ctx.ellipse(50, 128, 26, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();

  const angry = hpPct < 0.3;
  if (angry) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 15; }
  else { ctx.shadowColor = v.body; ctx.shadowBlur = 8; }

  const vi = villainIdx % 5;
  const eyeY = vi === 2 ? 82 : vi === 3 ? 74 : 76;

  if (vi === 0) {
    ctx.beginPath(); ctx.ellipse(50, 82, 27, 30, 0, 0, Math.PI * 2);
    ctx.fillStyle = v.body; ctx.fill();
  } else if (vi === 1) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2, r = i % 2 === 0 ? 34 : 22;
      if (i === 0) ctx.moveTo(50 + Math.cos(a) * r, 76 + Math.sin(a) * r);
      else ctx.lineTo(50 + Math.cos(a) * r, 76 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fillStyle = v.body; ctx.fill();
  } else if (vi === 2) {
    ctx.beginPath(); ctx.moveTo(50, 42); ctx.lineTo(80, 112); ctx.lineTo(20, 112); ctx.closePath();
    ctx.fillStyle = v.body; ctx.fill();
  } else if (vi === 3) {
    ctx.beginPath(); ctx.roundRect(22, 50, 56, 64, 8);
    ctx.fillStyle = v.body; ctx.fill();
  } else {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 === 0 ? 32 : 18;
      if (i === 0) ctx.moveTo(50 + Math.cos(a) * r, 76 + Math.sin(a) * r);
      else ctx.lineTo(50 + Math.cos(a) * r, 76 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fillStyle = v.body; ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(42, eyeY, 6, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill();
  ctx.beginPath(); ctx.arc(58, eyeY, 6, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill();
  if (angry || hpPct < 0.5) {
    ctx.beginPath(); ctx.moveTo(37, eyeY - 9); ctx.lineTo(47, eyeY - 5);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(63, eyeY - 9); ctx.lineTo(53, eyeY - 5); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(44, eyeY - 1, 2, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill();
  ctx.beginPath(); ctx.arc(60, eyeY - 1, 2, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill();
  ctx.beginPath();
  if (hpPct < 0.3) { ctx.arc(50, eyeY + 10, 7, 0, Math.PI); ctx.fillStyle = '#ef4444'; ctx.fill(); }
  else { ctx.moveTo(44, eyeY + 10); ctx.lineTo(56, eyeY + 10); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = 'bold 9px system-ui';
  ctx.textAlign = 'center'; ctx.fillText(v.name, 50, 20);

  // Armor
  const shield = armorPieces.shield;
  const shoulderL = armorPieces.shoulderL;
  const shoulderR = armorPieces.shoulderR;
  const chestPlate = armorPieces.chest;
  const helm = armorPieces.helm;

  if (shield > 0) {
    ctx.save();
    ctx.globalAlpha = shield === 3 ? 0.95 : shield === 2 ? 0.65 : 0.35;
    ctx.beginPath();
    ctx.moveTo(10, 60); ctx.lineTo(2, 70); ctx.lineTo(2, 100); ctx.lineTo(10, 114); ctx.lineTo(26, 100); ctx.lineTo(26, 70); ctx.closePath();
    ctx.fillStyle = v.shieldColor; ctx.fill();
    if (shield === 3) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center'; ctx.fillText('✦', 14, 90);
    }
    if (shield <= 2) {
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(8, 72); ctx.lineTo(20, 88); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, 70); ctx.lineTo(6, 90); ctx.stroke();
    }
    if (shield === 1) {
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(5, 95); ctx.lineTo(22, 78); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, 108); ctx.lineTo(24, 85); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 60); ctx.lineTo(2, 70); ctx.lineTo(2, 100); ctx.lineTo(10, 114); ctx.lineTo(26, 100); ctx.lineTo(26, 70); ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  if (helm > 0) {
    ctx.save();
    ctx.globalAlpha = helm === 2 ? 0.9 : 0.5;
    ctx.beginPath();
    ctx.arc(50, eyeY - 30, 22, Math.PI, 0, false);
    ctx.lineTo(70, eyeY - 16); ctx.lineTo(30, eyeY - 16); ctx.closePath();
    ctx.fillStyle = v.armorColor; ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(36, eyeY - 24, 28, 5);
    if (helm === 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(40, eyeY - 36); ctx.lineTo(52, eyeY - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(55, eyeY - 38); ctx.lineTo(48, eyeY - 18); ctx.stroke();
    }
    ctx.save(); ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(42, eyeY - 36, 8, 0.8, 2.2, false);
    ctx.strokeStyle = 'white'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    ctx.restore();
  }

  if (shoulderL > 0) {
    ctx.save();
    ctx.globalAlpha = shoulderL === 2 ? 0.85 : 0.45;
    ctx.beginPath(); ctx.ellipse(20, 68, 12, 9, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = v.armorColor; ctx.fill();
    if (shoulderL === 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(14, 64); ctx.lineTo(26, 74); ctx.stroke();
    }
    ctx.restore();
  }
  if (shoulderR > 0) {
    ctx.save();
    ctx.globalAlpha = shoulderR === 2 ? 0.85 : 0.45;
    ctx.beginPath(); ctx.ellipse(80, 68, 12, 9, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = v.armorColor; ctx.fill();
    if (shoulderR === 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(74, 64); ctx.lineTo(86, 74); ctx.stroke();
    }
    ctx.restore();
  }

  if (chestPlate > 0) {
    ctx.save();
    ctx.globalAlpha = chestPlate === 2 ? 0.8 : 0.4;
    ctx.beginPath(); ctx.roundRect(32, 66, 36, 34, 4);
    ctx.fillStyle = v.armorColor; ctx.fill();
    if (chestPlate === 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(36, 70, 12, 4); ctx.fillRect(52, 70, 12, 4);
    }
    if (chestPlate === 1) {
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(38, 68); ctx.lineTo(50, 90); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(55, 70); ctx.lineTo(44, 98); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(35, 80); ctx.lineTo(65, 72); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(32, 66, 36, 34, 4); ctx.stroke();
    ctx.restore();
  }
}
function getArmorPieces(hpPct) {
  const shield = hpPct > 0.75 ? 3 : hpPct > 0.55 ? 2 : hpPct > 0.3 ? 1 : 0;
  const helm = hpPct > 0.6 ? 2 : hpPct > 0.25 ? 1 : 0;
  const shoulderL = hpPct > 0.5 ? 2 : hpPct > 0.2 ? 1 : 0;
  const shoulderR = hpPct > 0.45 ? 2 : hpPct > 0.15 ? 1 : 0;
  const chest = hpPct > 0.4 ? 2 : hpPct > 0.1 ? 1 : 0;
  return { shield, helm, shoulderL, shoulderR, chest };
}

// ── ATTACK EFFECTS ────────────────────────────────────
function drawAttackEffect(canvas, attackType, progress, lvInfo) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const w = canvas.width, h = canvas.height;
  const t = progress;

  switch (attackType) {
    case 'sunrise': {
      const cx = w * 0.15, cy = h * 0.5;
      const maxR = w * t * 1.2;
      ctx.save(); ctx.globalAlpha = Math.sin(t * Math.PI) * 0.7;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, '#fbbf24'); grad.addColorStop(0.4, '#f97316'); grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.globalAlpha = Math.sin(t * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20);
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.restore(); break;
    }
    case 'bubble': {
      const bubbles = [
        { x: 0.1, y: 0.3, size: 18, color: '#60a5fa', delay: 0 },
        { x: 0.15, y: 0.6, size: 14, color: '#f472b6', delay: 0.1 },
        { x: 0.05, y: 0.5, size: 22, color: '#a78bfa', delay: 0.05 },
        { x: 0.2, y: 0.4, size: 12, color: '#34d399', delay: 0.15 },
        { x: 0.08, y: 0.7, size: 16, color: '#fbbf24', delay: 0.08 },
      ];
      bubbles.forEach(b => {
        const bt = Math.max(0, t - b.delay);
        const bx = w * (b.x + bt * 0.85);
        const by = h * b.y + Math.sin(bt * 8) * 12;
        ctx.save(); ctx.globalAlpha = Math.min(1, bt * 3) * (1 - Math.max(0, (bt - 0.7) * 3));
        ctx.beginPath(); ctx.arc(bx, by, b.size, 0, Math.PI * 2);
        ctx.strokeStyle = b.color; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = b.color + '33'; ctx.fill();
        ctx.beginPath(); ctx.arc(bx - b.size * 0.3, by - b.size * 0.3, b.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
        ctx.restore();
      }); break;
    }
    case 'star_throw': {
      const stars = [
        { x0: 0.05, y0: 0.4, vy: -0.05, delay: 0, color: '#fbbf24' },
        { x0: 0.08, y0: 0.6, vy: 0.03, delay: 0.08, color: '#f472b6' },
        { x0: 0.03, y0: 0.5, vy: 0.0, delay: 0.04, color: '#60a5fa' },
      ];
      stars.forEach(s => {
        const st = Math.max(0, t - s.delay);
        if (st <= 0) return;
        const sx = w * s.x0 + w * st * 0.9;
        const sy = h * s.y0 + h * s.vy * st * 5;
        ctx.save(); ctx.globalAlpha = Math.min(1, st * 4) * (1 - Math.max(0, (st - 0.75) * 4));
        ctx.translate(sx, sy); ctx.rotate(st * 10);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i * 4 / 5 - 0.5) * Math.PI;
          const r = i % 2 === 0 ? 14 : 6;
          if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fillStyle = s.color; ctx.fill();
        ctx.globalAlpha *= 0.4;
        for (let tr = 1; tr <= 3; tr++) {
          const tx = sx - (w * 0.9 * st / 3) * tr * 0.1;
          ctx.beginPath(); ctx.arc(tx - sx, 0, 4 - tr, 0, Math.PI * 2);
          ctx.fillStyle = s.color; ctx.fill();
        }
        ctx.restore();
      }); break;
    }
    case 'book_blast': {
      ctx.save();
      const bx = w * (0.05 + t * 0.7), by = h * 0.5;
      ctx.globalAlpha = Math.sin(t * Math.PI) * 0.85;
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(bx - 16, by - 20, 32, 28);
      ctx.fillStyle = 'white';
      ctx.fillRect(bx - 12, by - 16, 10, 20);
      ctx.fillRect(bx + 2, by - 16, 10, 20);
      for (let p = 0; p < 5; p++) {
        const pt = t - p * 0.08;
        if (pt < 0) continue;
        const px = bx + Math.cos(p * 1.3 + t * 4) * pt * 60;
        const py = by + Math.sin(p * 1.7 + t * 3) * pt * 40;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - pt * 1.5) * Math.sin(t * Math.PI);
        ctx.translate(px, py); ctx.rotate(pt * 5 + p);
        ctx.fillStyle = 'white'; ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1;
        ctx.fillRect(-8, -10, 16, 20); ctx.strokeRect(-8, -10, 16, 20);
        ctx.strokeStyle = '#bfdbfe'; ctx.lineWidth = 0.8;
        for (let l = 0; l < 4; l++) { ctx.beginPath(); ctx.moveTo(-6, -6 + l * 4); ctx.lineTo(6, -6 + l * 4); ctx.stroke(); }
        ctx.restore();
      }
      ctx.restore(); break;
    }
    case 'moon_beam': {
      ctx.save();
      ctx.globalAlpha = Math.sin(t * Math.PI) * 0.85;
      const grad = ctx.createLinearGradient(0, h * 0.45, w * t, h * 0.55);
      grad.addColorStop(0, '#a78bfa'); grad.addColorStop(0.5, '#7c3aed'); grad.addColorStop(1, '#312e81');
      ctx.beginPath();
      ctx.moveTo(0, h * 0.45);
      ctx.quadraticCurveTo(w * t * 0.5, h * 0.3, w * t, h * 0.5);
      ctx.quadraticCurveTo(w * t * 0.5, h * 0.7, 0, h * 0.55);
      ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
      for (let s = 0; s < 6; s++) {
        const st2 = s / 6 * t;
        const sx = w * st2, sy = h * 0.5 + Math.sin(s * 2) * 15;
        ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; ctx.fill();
      }
      if (t > 0.5) {
        const tip = { x: w * t, y: h * 0.5 };
        ctx.beginPath(); ctx.arc(tip.x, tip.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#c4b5fd'; ctx.fill();
        ctx.beginPath(); ctx.arc(tip.x + 7, tip.y - 4, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#1e1b4b'; ctx.fill();
      }
      ctx.restore(); break;
    }
    case 'rainbow': {
      ctx.save();
      const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
      const maxAngle = t * Math.PI;
      colors.forEach((col, i) => {
        ctx.beginPath();
        ctx.arc(w * 0.1, h * 0.9, 60 + i * 14, Math.PI, Math.PI + maxAngle, false);
        ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.globalAlpha = 0.8; ctx.stroke();
      });
      if (t > 0.3) {
        const tipAngle = Math.PI + maxAngle;
        const tipR = 60 + 3.5 * 14;
        const tipX = w * 0.1 + Math.cos(tipAngle) * tipR;
        const tipY = h * 0.9 + Math.sin(tipAngle) * tipR;
        for (let sp = 0; sp < 5; sp++) {
          ctx.beginPath();
          ctx.arc(tipX + Math.cos(sp * 1.3) * 8, tipY + Math.sin(sp * 1.3) * 8, 3, 0, Math.PI * 2);
          ctx.fillStyle = colors[sp % 7]; ctx.globalAlpha = 0.9; ctx.fill();
        }
      }
      ctx.restore(); break;
    }
    case 'laser': {
      ctx.save();
      if (t < 0.4) {
        const cx = w * (0.3 + t * 1.5), cy = h * 0.5;
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.stroke();
      } else {
        const bt = (t - 0.4) / 0.6;
        ctx.globalAlpha = 1 - bt * 0.7;
        ctx.beginPath(); ctx.moveTo(w * 0.15, h * 0.5); ctx.lineTo(w * 0.85, h * 0.5);
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4 + bt * 2; ctx.stroke();
        ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(w * 0.85, h * 0.5, bt * 25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239,68,68,${(1 - bt) * 0.6})`; ctx.fill();
      }
      ctx.restore(); break;
    }
    case 'whirlwind': {
      ctx.save();
      const wx = w * (0.1 + t * 0.8), wy = h * 0.5;
      ctx.globalAlpha = Math.sin(t * Math.PI) * 0.8;
      for (let ring = 0; ring < 3; ring++) {
        const r = 15 + ring * 10;
        ctx.beginPath(); ctx.arc(wx, wy, r, -t * 8, -t * 8 + Math.PI * 1.5);
        ctx.strokeStyle = ring === 0 ? '#60a5fa' : ring === 1 ? '#a78bfa' : '#34d399';
        ctx.lineWidth = 4 - ring; ctx.stroke();
      }
      for (let d = 0; d < 6; d++) {
        const da = d / 6 * Math.PI * 2 + t * 10;
        const dr = 20 + Math.sin(t * 5 + d) * 10;
        ctx.fillStyle = '#94a3b8'; ctx.globalAlpha = Math.sin(t * Math.PI) * 0.6;
        ctx.fillRect(wx + Math.cos(da) * dr - 2, wy + Math.sin(da) * dr - 2, 4, 4);
      }
      ctx.restore(); break;
    }
    default: {
      ctx.save(); ctx.globalAlpha = Math.sin(t * Math.PI) * 0.5;
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  if (t > 0.65) {
    const bt = (t - 0.65) / 0.35;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = bt * 40;
      const px = w * 0.82 + Math.cos(angle) * dist;
      const py = h * 0.5 + Math.sin(angle) * dist;
      ctx.save(); ctx.globalAlpha = (1 - bt) * 0.9;
      ctx.fillStyle = i % 2 === 0 ? '#94a3b8' : '#64748b';
      ctx.translate(px, py); ctx.rotate(angle + bt * 5);
      ctx.fillRect(-4, -2, 8, 4); ctx.restore();
    }
  }
}

// ── TASK ROW (memo) ───────────────────────────────────
const attackTypeLabels = {
  sunrise: '☀️ 晨光冲击', bubble: '🫧 泡泡攻击', star_throw: '⭐ 星星飞镖',
  book_blast: '📚 知识爆破', moon_beam: '🌙 月光光束', rainbow: '🌈 彩虹冲击',
  laser: '🎯 精准激光', whirlwind: '🌀 旋风清扫',
};

const TaskRow = memo(function TaskRow({ task, isDone, onToggle }) {
  const earned = task.double ? task.pts * 2 : task.pts;
  const atkLabel = attackTypeLabels[task.attackType] || '';
  return (
    <div onClick={onToggle}
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 9px', borderRadius: 10, border: '0.5px solid #e5e7eb', marginBottom: 5, cursor: 'pointer', background: isDone ? '#f9fafb' : 'white', opacity: isDone ? 0.45 : 1 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (isDone ? '#22c55e' : '#d1d5db'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, background: isDone ? '#22c55e' : 'transparent', color: 'white' }}>
        {isDone ? '✓' : ''}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 11, color: isDone ? '#9ca3af' : '#111827', textDecoration: isDone ? 'line-through' : 'none' }}>
          <img src={task.icon} alt="" style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: '4px', filter: isDone ? 'grayscale(100%) opacity(50%)' : 'none' }} />
          <span>{task.text}</span>
        </div>
        <div style={{ fontSize: 9, color: '#a855f7', marginTop: 1 }}>
          {atkLabel}{task.sub ? ` · ⚡ ${task.sub}` : ''}
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 8, color: task.double ? '#7c3aed' : '#d97706', background: task.double ? '#ede9fe' : '#fef9c3' }}>
        +{earned}⭐
      </span>
    </div>
  );
});
// ── CSS 动画注入 ──────────────────────────────────────
const COMBAT_STYLES = `
@keyframes arenaShake {
  0%,100% { transform: translateX(0); }
  15%      { transform: translateX(-6px) rotate(-0.5deg); }
  30%      { transform: translateX(6px)  rotate(0.5deg); }
  45%      { transform: translateX(-4px); }
  60%      { transform: translateX(4px); }
  75%      { transform: translateX(-2px); }
}
@keyframes floatUp {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  60%  { opacity: 1; transform: translateY(-36px) scale(1.15); }
  100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
}
@keyframes comboIn {
  0%   { opacity: 0; transform: scale(0.5); }
  60%  { opacity: 1; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes comboPulse {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.1); }
}
`;

// ── MAIN COMPONENT ────────────────────────────────────
export default function App() {
  const [pts, setPts]               = useState(() => sn('p_pts', 0, 0, 99999));
  const [hp, setHp]                 = useState(() => sn('p_hp', 80, 0, 100));
  const [mg, setMg]                 = useState(() => sn('p_mg', 0, 0, 600));
  const [lv, setLv]                 = useState(() => sn('p_lv', 1, 1, 15));
  const [day, setDay]               = useState(() => sn('p_dy', 1, 1, 99999));
  const [villainIdx, setVillainIdx] = useState(() => sn('p_vi', 0, 0, VILLAINS.length - 1));
  const [villainHp, setVillainHp]   = useState(() => {
    const idx = sn('p_vi', 0, 0, VILLAINS.length - 1);
    const saved = sn('p_vhp', -1);
    return saved < 0 ? VILLAINS[idx].hp : Math.min(saved, VILLAINS[idx].hp);
  });
  const [done, setDone]             = useState(() => JSON.parse(localStorage.getItem('p_done') || '[]'));
  const [lastDate, setLastDate]     = useState(() => localStorage.getItem('p_date') || '');
  const [parent, setParent]         = useState(false);
  const [message, setMessage]       = useState('');
  const [gameWon, setGameWon]       = useState(false);
  const [playerAnim, setPlayerAnim] = useState('idle');
  const [villainFlash, setVillainFlash] = useState(false);
  const [showBeam, setShowBeam]     = useState(false);
  const [currentAttackType, setCurrentAttackType] = useState(null);
  const [showAttackCanvas, setShowAttackCanvas] = useState(false);
  // 新增战斗感状态
  const [arenaShake, setArenaShake]       = useState(false);
  const [villainKnockback, setVillainKnockback] = useState(false);
  const [floatingNums, setFloatingNums]   = useState([]);   // [{id,dmg,isCrit,x,y}]
  const [villainHpLag, setVillainHpLag]   = useState(() => { // 双层HP条黄色延迟层
    const idx = sn('p_vi', 0, 0, VILLAINS.length - 1);
    const saved = sn('p_vhp', -1);
    return saved < 0 ? VILLAINS[idx].hp : Math.min(saved, VILLAINS[idx].hp);
  });
  const [combo, setCombo]                 = useState(0);
  const [showCombo, setShowCombo]         = useState(false);

  const villainCanvasRef = useRef(null);
  const starsCanvasRef   = useRef(null);
  const beamCanvasRef    = useRef(null);
  const attackCanvasRef  = useRef(null);
  const msgTimer         = useRef(null);
  const attackAnimRef    = useRef(null);
  const persistTimer     = useRef(null);
  const lagTimer         = useRef(null);
  const comboTimer       = useRef(null);
  const floatIdRef       = useRef(0);

  // 防抖存储 - 300ms 内多次变化只写一次
  useEffect(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      localStorage.setItem('p_pts', pts);
      localStorage.setItem('p_hp', hp);
      localStorage.setItem('p_mg', mg);
      localStorage.setItem('p_lv', lv);
      localStorage.setItem('p_dy', day);
      localStorage.setItem('p_vi', villainIdx);
      localStorage.setItem('p_vhp', villainHp);
      localStorage.setItem('p_done', JSON.stringify(done));
      localStorage.setItem('p_date', lastDate);
    }, 300);
    return () => clearTimeout(persistTimer.current);
  }, [pts, hp, mg, lv, day, villainIdx, villainHp, done, lastDate]);

  // 清理定时器
  useEffect(() => {
    return () => {
      clearTimeout(msgTimer.current);
      if (attackAnimRef.current) cancelAnimationFrame(attackAnimRef.current);
    };
  }, []);
  // 跨天检测 - 带提示
  useEffect(() => {
    const today = todayStr();
    if (lastDate && lastDate !== today && hp > 0) {
      setHp(h => Math.max(0, h - 40));
      setDay(d => d + 1);
      setDone([]);
      setLastDate(today);
      setTimeout(() => toast(hp <= 40 ? '😭 小马饿晕了...' : '🌅 新的一天开始了！小马消耗了体力，快完成任务补充吧！'), 300);
    }
    if (!lastDate) setLastDate(today);
  }, []);

  useEffect(() => { drawStars(starsCanvasRef.current); }, []);

  useEffect(() => {
    const v = VILLAINS[Math.min(villainIdx, VILLAINS.length - 1)];
    const hpPct = Math.max(0, villainHp / v.hp);
    const armor = getArmorPieces(hpPct);
    drawVillain(villainCanvasRef.current, villainIdx, villainHp, villainFlash, armor);
  }, [villainIdx, villainHp, villainFlash]);

  useEffect(() => {
    if (!currentAttackType || !showAttackCanvas) return;
    const canvas = attackCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 420;
    canvas.height = canvas.offsetHeight || 200;
    const lvInfo = LEVELS[Math.min(lv - 1, LEVELS.length - 1)];
    let start = null;
    const duration = 700;
    function frame(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const prog = Math.min(1, elapsed / duration);
      drawAttackEffect(canvas, currentAttackType, prog, lvInfo);
      if (prog < 1) attackAnimRef.current = requestAnimationFrame(frame);
      else {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShowAttackCanvas(false);
        setCurrentAttackType(null);
      }
    }
    attackAnimRef.current = requestAnimationFrame(frame);
    return () => { if (attackAnimRef.current) cancelAnimationFrame(attackAnimRef.current); };
  }, [currentAttackType, showAttackCanvas, lv]);

  const toast = useCallback((msg) => {
    setMessage(msg);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(''), 3000);
  }, []);
  function attackAnim(onHit, attackType) {
    const phases = ['idle', 'jump', 'attack', 'attack', 'jump', 'idle'];
    let i = 0;
    if (attackType) { setCurrentAttackType(attackType); setShowAttackCanvas(true); }
    function step() {
      setPlayerAnim(phases[Math.min(i, phases.length - 1)]);
      if (i === 2) { setVillainFlash(true); onHit(); }
      if (i === 3) setVillainFlash(false);
      i++;
      if (i < phases.length) setTimeout(step, 80);
      else setPlayerAnim('idle');
    }
    step();
  }

  function magicBeamAnim(onDone) {
    const bc = beamCanvasRef.current;
    if (!bc) { onDone(); return; }
    bc.width = bc.offsetWidth || 420;
    bc.height = bc.offsetHeight || 200;
    setShowBeam(true);
    const ctx = bc.getContext('2d');
    const lvInfo = LEVELS[Math.min(lv - 1, LEVELS.length - 1)];
    let frame = 0;
    function step() {
      ctx.clearRect(0, 0, bc.width, bc.height);
      const progress = frame / 20;
      const beamW = bc.width * progress;
      if (lv >= 10) {
        ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7'].forEach((col, i) => {
          ctx.beginPath(); ctx.moveTo(0, 60 + i * 8 - 24); ctx.lineTo(beamW, 60 + i * 8 - 24);
          ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.globalAlpha = 0.7; ctx.stroke();
        });
      } else {
        const grad = ctx.createLinearGradient(0, 0, beamW, 0);
        grad.addColorStop(0, lvInfo.dark); grad.addColorStop(1, '#fbbf24');
        ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(beamW, 80);
        ctx.strokeStyle = grad; ctx.lineWidth = 12; ctx.globalAlpha = 0.8; ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (frame > 15) {
        ctx.beginPath(); ctx.arc(bc.width - 40, 80, (frame - 15) * 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,0,${0.6 - (frame - 15) * 0.06})`; ctx.fill();
      }
      frame++;
      if (frame < 25) requestAnimationFrame(step);
      else {
        setShowBeam(false); ctx.clearRect(0, 0, bc.width, bc.height);
        setVillainFlash(true); setTimeout(() => { setVillainFlash(false); onDone(); }, 200);
      }
    }
    step();
  }
  // 使用 ref 追踪最新的 villainIdx/villainHp 避免闭包陷阱
  const villainIdxRef = useRef(villainIdx);
  const villainHpRef = useRef(villainHp);
  useEffect(() => { villainIdxRef.current = villainIdx; }, [villainIdx]);
  useEffect(() => { villainHpRef.current = villainHp; }, [villainHp]);

  function triggerHitEffects(dmg, isCrit = false) {
    // 屏幕震动
    setArenaShake(true);
    setTimeout(() => setArenaShake(false), 400);
    // 怪兽后退
    setVillainKnockback(true);
    setTimeout(() => setVillainKnockback(false), 300);
    // 浮动伤害数字（随机偏移避免重叠）
    const id = ++floatIdRef.current;
    const x = 55 + (Math.random() - 0.5) * 30;
    const y = 30 + Math.random() * 20;
    setFloatingNums(prev => [...prev, { id, dmg, isCrit, x, y }]);
    setTimeout(() => setFloatingNums(prev => prev.filter(n => n.id !== id)), 900);
    // 双层HP条：立刻更新真实HP，延迟500ms再更新黄色lag层
    if (lagTimer.current) clearTimeout(lagTimer.current);
    lagTimer.current = setTimeout(() => {
      setVillainHpLag(villainHpRef.current);
    }, 500);
  }

  function applyDamage(dmg, isCrit = false) {
    const currentIdx = villainIdxRef.current;
    const currentHp = villainHpRef.current;
    const newHp = Math.max(0, currentHp - dmg);
    setVillainHp(newHp);
    villainHpRef.current = newHp;
    triggerHitEffects(dmg, isCrit);
    if (newHp <= 0) {
      sfxVillainDead();
      setTimeout(() => {
        const v = VILLAINS[currentIdx];
        if (currentIdx >= VILLAINS.length - 1) {
          setGameWon(true); sfxWin();
        } else {
          const nextIdx = currentIdx + 1;
          setVillainIdx(nextIdx);
          villainIdxRef.current = nextIdx;
          const nextHp = VILLAINS[nextIdx].hp;
          setVillainHp(nextHp);
          setVillainHpLag(nextHp);
          villainHpRef.current = nextHp;
          toast('⚔️ 打败了' + v.name + '！新敌人：' + VILLAINS[nextIdx].name + '！');
        }
      }, 600);
    }
  }

  function feedPet() {
    if (hp <= 0) return;
    if (pts < 10) { toast('星星不够！需要10⭐'); return; }
    if (hp >= 100) { toast('小马已经很饱了！'); return; }
    setPts(p => p - 10); setHp(h => Math.min(100, h + 20));
    sfxFeed(); toast('🍎 小马吃得好开心！+20体力');
    attackAnim(() => {}, null);
  }

  function fireUltimate() {
    if (hp <= 0) return;
    const mgT = mgThreshold();
    if (mg < mgT) { toast('魔法还没蓄满！继续完成挑战！'); return; }
    sfxMagicBeam();
    const dmg = Math.floor(villainHpRef.current * 0.45 + 30);
    magicBeamAnim(() => {
      applyDamage(dmg, true);
      toast('💥 大招释放！造成' + dmg + '点伤害！');
    });
    setMg(0);
    if (lv < 15) {
      setTimeout(() => {
        setLv(l => {
          const newLv = Math.min(l + 1, 15);
          sfxLevelUp();
          toast('✨ 升级！成为' + LEVELS[Math.min(newLv - 1, 14)].name + '！');
          return newLv;
        });
      }, 800);
    }
  }
  const toggleTask = useCallback((id) => {
    if (hp <= 0) return;
    if (!parent) { toast('请家长开启家长模式后打勾！'); return; }
    if (done.includes(id)) return;
    const t = TASKS.find(t => t.id === id); if (!t) return;
    const earnedPts = t.pts;
    const earnedMg  = t.double ? t.pts * 2 : t.pts;
    const mgT = mgThreshold();
    setDone(d => [...d, id]);
    setPts(p => p + earnedPts);
    setMg(m => {
      const newMg = Math.min(mgT, m + earnedMg);
      if (newMg >= mgT && m < mgT) {
        setTimeout(() => { sfxMagicCharge(); toast('⚡ 魔法已蓄满！快发动大招！'); }, 400);
      }
      return newMg;
    });
    sfxTask();
    // 连击计数
    setCombo(c => {
      const newCombo = c + 1;
      if (newCombo >= 2) {
        setShowCombo(true);
        if (comboTimer.current) clearTimeout(comboTimer.current);
        comboTimer.current = setTimeout(() => setShowCombo(false), 1500);
      }
      return newCombo;
    });
    const directDmg = Math.floor(earnedPts / 5) + 3;
    attackAnim(() => applyDamage(directDmg, false), t.attackType);
    toast(`太棒了！+${earnedPts}⭐  魔法+${earnedMg}✨`);
  }, [hp, parent, done, toast]);

  function nextDay() {
    if (hp <= 0) return;
    setHp(h => Math.max(0, h - 40));
    setDay(d => d + 1); setDone([]); setLastDate(todayStr());
    setCombo(0); setShowCombo(false);
    toast('晚安！明天继续加油！');
  }

  function restartGame() {
    localStorage.clear();
    setPts(0); setHp(80); setMg(0); setLv(1); setDay(1);
    setVillainIdx(0);
    const initHp = VILLAINS[0].hp;
    setVillainHp(initHp); setVillainHpLag(initHp);
    villainIdxRef.current = 0; villainHpRef.current = initHp;
    setDone([]); setLastDate(todayStr()); setGameWon(false);
    setCombo(0); setShowCombo(false);
    toast('小马重生了！加油！');
  }

  const lvInfo = LEVELS[Math.min(lv - 1, LEVELS.length - 1)];
  const mgT = mgThreshold();
  const mgFull = mg >= mgT;
  const v = VILLAINS[Math.min(villainIdx, VILLAINS.length - 1)];
  const dead = hp <= 0;
  const hdrColors = [
    ['#f472b6','#a855f7'],['#f472b6','#ec4899'],['#fbbf24','#f59e0b'],
    ['#4ade80','#22c55e'],['#60a5fa','#3b82f6'],['#a78bfa','#8b5cf6'],
    ['#f87171','#ef4444'],['#38bdf8','#0ea5e9'],['#fde047','#ca8a04'],
    ['#e879f9','#d946ef'],['#34d399','#10b981'],['#fb923c','#ea580c'],
    ['#f472b6','#ec4899'],['#a78bfa','#7c3aed'],['#c084fc','#a855f7'],
  ];
  const [c1, c2] = hdrColors[Math.min(lv - 1, 14)];
  const hpPct = Math.max(0, villainHp / v.hp);
  const armorPieces = getArmorPieces(hpPct);
  const shieldLabels = ['', '盾牌残片', '盾牌碎裂', '盾牌完整'];
  const armorLabel = hpPct > 0.6 ? '铠甲完整' : hpPct > 0.3 ? '铠甲破损' : hpPct > 0.1 ? '铠甲碎裂' : '铠甲全毁';
  return (
    <div className="min-h-screen bg-pink-50 p-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <style>{COMBAT_STYLES}</style>
      {gameWon && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'linear-gradient(135deg,#fdf4ff,#ede9fe,#fce7f3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🌈</div>
          <div style={{ fontSize: 22, fontWeight: 700, background: 'linear-gradient(90deg,#f472b6,#a855f7,#3b82f6,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12, lineHeight: 1.3 }}>
            恭喜甜甜！<br />你成功打败了<br />所有不良习惯！
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7,#ec4899)', margin: '12px 0', width: 200 }} />
          <div style={{ fontSize: 14, color: '#7c3aed', marginBottom: 20, lineHeight: 1.6 }}>
            你就是最强的彩虹！🦄✨<br />所有坏习惯怪兽都被你消灭了<br />你是最棒的小孩！
          </div>
          <div style={{ fontSize: 36, margin: '8px 0' }}>🏆⭐🌟💫✨🎉🎊🦄🌈</div>
          <button onClick={restartGame} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#f472b6,#a855f7)', color: 'white', border: 'none', borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            重新开始新旅程 🌟
          </button>
        </div>
      )}

      {/* TOAST - fixed */}
      {message && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1.5px solid #f472b6', color: '#be185d', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500, zIndex: 999, whiteSpace: 'nowrap' }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {/* 卡片容器：去掉 overflow:hidden，改用各部分自己的圆角，这样 sticky 才能生效 */}
        <div style={{ background: 'white', borderRadius: 20, border: '0.5px solid #e5e7eb' }}>
          {/* HEADER */}
          <div style={{ background: `linear-gradient(135deg,${c1},${c2})`, textAlign: 'center', padding: '14px 12px 22px', position: 'relative', borderRadius: '20px 20px 0 0' }}>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: 'white', letterSpacing: 1 }}>🌟 星光小马养成记 🌟</h1>
            <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', background: 'white', color: '#a855f7', padding: '3px 16px', borderRadius: 20, fontSize: 11, fontWeight: 500, border: '0.5px solid #e9d5ff', whiteSpace: 'nowrap' }}>
              第 {day} 天 · {lvInfo.name}
            </div>
          </div>
          {/* ARENA - sticky 固定在顶部，滚动时始终可见 */}
          <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
            <div
              style={{
                position: 'relative', height: 210,
                background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 40%,#4c1d95 70%,#7c3aed 100%)',
                overflow: 'hidden', marginTop: 12,
                animation: arenaShake ? 'arenaShake 0.4s ease' : 'none',
              }}
            >
              <canvas ref={starsCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
              <canvas ref={attackCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: showAttackCanvas ? 'block' : 'none', zIndex: 8 }} />
              <canvas ref={beamCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: showBeam ? 'block' : 'none', zIndex: 10 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(180deg,#7c3aed,#5b21b6)', borderTop: '2px solid #a78bfa' }} />

              {/* Player */}
              <div style={{ position: 'absolute', bottom: 32, left: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 70, height: 5, background: 'rgba(0,0,0,0.4)', borderRadius: 5, overflow: 'hidden', marginBottom: 2 }}>
                  <div style={{ width: hp + '%', height: '100%', background: 'linear-gradient(90deg,#4ade80,#22c55e)', borderRadius: 5, transition: 'width 0.4s' }} />
                </div>
                <img
                  src={PONY_PICS[Math.min(lv - 1, 14)]}
                  alt="甜甜的小马"
                  style={{
                    width: 85, height: 85, objectFit: 'contain', borderRadius: '8px',
                    transform: playerAnim === 'jump' ? 'translateY(-18px)' : playerAnim === 'attack' ? 'translateX(15px)' : 'none',
                    transition: 'transform 0.1s ease',
                    filter: dead ? 'grayscale(100%) opacity(70%)' : (mgFull ? 'drop-shadow(0 0 12px #fbbf24)' : 'none')
                  }}
                />
                <div style={{ width: 50, height: 8, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', marginTop: -4 }} />
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>甜甜 Lv.{lv}</div>
              </div>

              {/* Villain - 受击后退 */}
              <div style={{
                position: 'absolute', bottom: 32, right: 8,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                transform: villainKnockback ? 'translateX(14px)' : 'translateX(0)',
                transition: villainKnockback ? 'transform 0.08s ease-out' : 'transform 0.25s ease-in',
              }}>
                {/* 双层HP条：黄色lag层在下，红色实际层在上 */}
                <div style={{ width: 80, height: 5, background: 'rgba(0,0,0,0.4)', borderRadius: 5, overflow: 'hidden', marginBottom: 2, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: (Math.max(0, villainHpLag / v.hp) * 100) + '%', height: '100%', background: '#fbbf24', borderRadius: 5, transition: 'width 0.5s ease' }} />
                  <div style={{ position: 'absolute', left: 0, top: 0, width: (hpPct * 100) + '%', height: '100%', background: 'linear-gradient(90deg,#f87171,#ef4444)', borderRadius: 5, transition: 'width 0.15s ease' }} />
                </div>
                <canvas ref={villainCanvasRef} width={100} height={140} />
                <div style={{ width: 55, height: 8, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', marginTop: -4 }} />
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{v.name}</div>
                {/* 浮动伤害数字 */}
                {floatingNums.map(n => (
                  <div key={n.id} style={{
                    position: 'absolute',
                    right: n.x, top: n.y,
                    fontSize: n.isCrit ? 18 : 13,
                    fontWeight: 700,
                    color: n.isCrit ? '#fbbf24' : '#fff',
                    textShadow: n.isCrit ? '0 0 8px #f97316, 0 1px 3px #000' : '0 1px 3px #000',
                    pointerEvents: 'none',
                    animation: 'floatUp 0.9s ease-out forwards',
                    zIndex: 20,
                    whiteSpace: 'nowrap',
                  }}>
                    {n.isCrit ? `💥${n.dmg}!` : `-${n.dmg}`}
                  </div>
                ))}
              </div>

              {/* 连击显示 */}
              {showCombo && combo >= 2 && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: combo >= 5 ? 22 : 16,
                  fontWeight: 700,
                  color: combo >= 5 ? '#fbbf24' : '#f472b6',
                  textShadow: '0 0 12px rgba(0,0,0,0.8), 0 2px 4px #000',
                  animation: 'comboIn 0.3s ease, comboPulse 0.6s ease 0.3s infinite',
                  pointerEvents: 'none',
                  zIndex: 15,
                  letterSpacing: 1,
                }}>
                  {combo >= 9 ? '🔥' : combo >= 5 ? '⚡' : '✨'} {combo} 连击！
                </div>
              )}

              {/* Armor labels */}
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 5 }}>
                {armorPieces.shield > 0 && (
                  <div style={{ fontSize: 8, padding: '1px 5px', borderRadius: 6, background: 'rgba(0,0,0,0.5)', color: armorPieces.shield === 3 ? '#94a3b8' : armorPieces.shield === 2 ? '#fbbf24' : '#f87171', whiteSpace: 'nowrap' }}>
                    🛡 {shieldLabels[armorPieces.shield]}
                  </div>
                )}
                {hpPct < 1 && (
                  <div style={{ fontSize: 8, padding: '1px 5px', borderRadius: 6, background: 'rgba(0,0,0,0.5)', color: hpPct > 0.4 ? '#94a3b8' : hpPct > 0.2 ? '#fbbf24' : '#f87171', whiteSpace: 'nowrap' }}>
                    🛡 {armorLabel}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* STATS ROW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px 4px', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '0.5px solid #e5e7eb', background: '#f9fafb' }}>
              ⭐<span>{pts}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '0.5px solid #e5e7eb', background: '#f9fafb' }}>
              ✨ Lv.<span>{lv}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '0.5px solid #e5e7eb', background: '#f9fafb' }}>
              🗓 第{day}天
            </div>
          </div>

          {/* BARS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 14px 6px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                <span>🍎 体力</span><span>{hp}/100</span>
              </div>
              <div style={{ height: 9, background: '#f3f4f6', borderRadius: 9, overflow: 'hidden', border: '0.5px solid #e5e7eb' }}>
                <div style={{ width: hp + '%', height: '100%', borderRadius: 9, background: hp < 30 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#4ade80,#22c55e)', transition: 'width 0.5s' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2, fontWeight: mgFull ? 600 : 400, color: mgFull ? '#7c3aed' : '#6b7280' }}>
                <span>{mgFull ? '⚡ 大招蓄满！快释放！' : '✨ 魔法蓄能 — 完成挑战来充能'}</span>
                <span>{mg}/{mgT}</span>
              </div>
              <div style={{ height: 9, background: '#f3f4f6', borderRadius: 9, overflow: 'hidden', border: '0.5px solid #e5e7eb', position: 'relative' }}>
                <div style={{ width: (mg / mgT * 100) + '%', height: '100%', borderRadius: 9, background: mgFull ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#c084fc,#a855f7)', transition: 'width 0.5s' }} />
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ position: 'absolute', top: 0, left: (i * 20) + '%', width: 1, height: '100%', background: 'rgba(255,255,255,0.5)' }} />
                ))}
              </div>
            </div>
          </div>
          {/* ACTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '4px 14px 8px' }}>
            <button onClick={feedPet} disabled={dead || pts < 10 || hp >= 100}
              style={{ padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 500, border: '0.5px solid #86efac', cursor: (dead || pts < 10 || hp >= 100) ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#15803d', background: '#f0fdf4', opacity: (dead || pts < 10 || hp >= 100) ? 0.4 : 1 }}>
              🍎
              <span style={{ fontSize: 11 }}>喂食回血</span>
              <span style={{ fontSize: 10, color: '#6b7280' }}>-10⭐ / +20体力</span>
            </button>
            <button onClick={fireUltimate} disabled={dead || !mgFull}
              style={{
                padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                border: mgFull ? '2px solid #fbbf24' : '0.5px solid #d8b4fe',
                cursor: (dead || !mgFull) ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                color: mgFull ? '#78350f' : '#c4b5fd',
                background: mgFull ? 'linear-gradient(135deg,#fef9c3,#fde68a)' : '#faf5ff',
                opacity: dead ? 0.35 : 1,
                boxShadow: mgFull ? '0 0 12px rgba(251,191,36,0.5)' : 'none',
                transition: 'all 0.3s',
              }}>
              <span style={{ fontSize: 18 }}>{mgFull ? '💥' : '🔮'}</span>
              <span style={{ fontSize: 11 }}>{mgFull ? '释放大招！' : '魔法蓄能中…'}</span>
              <span style={{ fontSize: 10, color: mgFull ? '#92400e' : '#a78bfa' }}>
                {mgFull ? '点击重击敌人！' : `还差 ${mgT - mg} 点`}
              </span>
            </button>
          </div>

          {/* TASKS */}
          <div style={{ borderTop: '0.5px solid #e5e7eb', padding: '8px 14px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>今日挑战</span>
              <button onClick={() => { setParent(p => !p); toast(parent ? '家长模式关闭' : '家长模式开启！'); }}
                style={{ fontSize: 10, padding: '2px 9px', borderRadius: 10, border: '0.5px solid #e5e7eb', cursor: 'pointer', background: parent ? '#fef3c7' : '#f9fafb', color: parent ? '#92400e' : '#6b7280', borderColor: parent ? '#fcd34d' : '#e5e7eb' }}>
                {parent ? '🔓 家长模式已开' : '家长模式'}
              </button>
            </div>
            {dead ? (
              <div style={{ textAlign: 'center', padding: 8 }}>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>小马饿晕了 😭</p>
                <button onClick={restartGame} style={{ width: '100%', background: '#f472b6', color: 'white', border: 'none', padding: 11, borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>让小马复活 🐴</button>
              </div>
            ) : (
              TASKS.map(t => (
                <TaskRow key={t.id} task={t} isDone={done.includes(t.id)} onToggle={() => toggleTask(t.id)} />
              ))
            )}
          </div>

          {/* FOOTER */}
          <div style={{ padding: '8px 14px 14px', borderTop: '0.5px solid #e5e7eb', borderRadius: '0 0 20px 20px' }}>
            <button onClick={nextDay} disabled={dead} style={{ width: '100%', background: '#818cf8', color: 'white', border: 'none', padding: 11, borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: dead ? 'not-allowed' : 'pointer', opacity: dead ? 0.35 : 1 }}>
              🌙 睡觉啦！结束今天
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
