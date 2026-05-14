cat > /mnt/user-data/outputs/App.jsx << 'ENDOFFILE'
import React, { useState, useEffect, useRef } from 'react';

// ── TASKS ─────────────────────────────────────────────
const TASKS = [
  { id: 1, icon: '☀️', text: '听到闹钟立刻起床不赖床', pts: 15, double: false },
  { id: 2, icon: '🪥', text: '自己刷牙洗脸换衣服', pts: 10, double: false },
  { id: 3, icon: '🎒', text: '自己准备书包和饭盒', pts: 15, double: false },
  { id: 4, icon: '📚', text: '完成作业/阅读打卡', pts: 20, double: false },
  { id: 5, icon: '🌙', text: '闹钟响了立刻上床睡觉', pts: 20, double: false },
  { id: 6, icon: '🌟', text: '做了自我突破/有进步的事', pts: 15, double: true, sub: '双倍积分！' },
  { id: 7, icon: '🎯', text: '专注写作业，不发呆不做无关事', pts: 15, double: true, sub: '双倍积分！' },
  { id: 8, icon: '🧹', text: '整理自己的东西', pts: 10, double: false },
  { id: 9, icon: '📖', text: '阅读30分钟爸爸妈妈选书', pts: 15, double: false },
];

// ── LEVELS (15 levels) ────────────────────────────────
const LEVELS = [
  { lv: 1,  name: '小马驹',     color: '#fed7aa', dark: '#f97316' },
  { lv: 2,  name: '独角小马',   color: '#fce7f3', dark: '#f472b6' },
  { lv: 3,  name: '彩虹马驹',   color: '#fef9c3', dark: '#eab308' },
  { lv: 4,  name: '魔法独角兽', color: '#dcfce7', dark: '#22c55e' },
  { lv: 5,  name: '星光飞马',   color: '#dbeafe', dark: '#3b82f6' },
  { lv: 6,  name: '幻影独角兽', color: '#ede9fe', dark: '#8b5cf6' },
  { lv: 7,  name: '火焰战马',   color: '#fef2f2', dark: '#ef4444' },
  { lv: 8,  name: '冰晶飞马',   color: '#e0f2fe', dark: '#0ea5e9' },
  { lv: 9,  name: '雷霆神驹',   color: '#fefce8', dark: '#ca8a04' },
  { lv: 10, name: '星河独角兽', color: '#fdf4ff', dark: '#d946ef' },
  { lv: 11, name: '时空飞马',   color: '#f0fdf4', dark: '#16a34a' },
  { lv: 12, name: '宇宙战神',   color: '#fff7ed', dark: '#ea580c' },
  { lv: 13, name: '彩虹守护者', color: '#fdf2f8', dark: '#ec4899' },
  { lv: 14, name: '星辰圣马',   color: '#f5f3ff', dark: '#7c3aed' },
  { lv: 15, name: '彩虹传说',   color: '#ffffff', dark: '#a855f7' },
];

function mgThreshold(lv) { return 600 + (lv - 1) * 100; }

// ── VILLAINS (15 villains) ────────────────────────────
const VILLAINS = [
  { name: '赖床怪',   desc: '喜欢让你赖床的怪兽',   color: '#7f1d1d', body: '#ef4444', hp: 100 },
  { name: '邋遢精',   desc: '让你不收拾东西的妖怪',  color: '#78350f', body: '#f97316', hp: 120 },
  { name: '拖延魔',   desc: '总叫你拖到明天再做！',  color: '#365314', body: '#84cc16', hp: 140 },
  { name: '零食鬼',   desc: '让你不好好吃饭的馋鬼',  color: '#7c2d12', body: '#fb923c', hp: 160 },
  { name: '发呆精',   desc: '让你上课发呆走神！',    color: '#1e3a5f', body: '#60a5fa', hp: 180 },
  { name: '哭闹王',   desc: '让你乱发脾气的暴君',    color: '#4a044e', body: '#c026d3', hp: 200 },
  { name: '骗人妖',   desc: '让你说谎欺骗的妖精',    color: '#052e16', body: '#16a34a', hp: 220 },
  { name: '夜猫怪',   desc: '让你熬夜不睡觉的恶魔',  color: '#1e1b4b', body: '#6366f1', hp: 240 },
  { name: '乱丢怪',   desc: '让你到处乱丢东西！',    color: '#422006', body: '#d97706', hp: 260 },
  { name: '偷懒仙',   desc: '让你什么都不想做！',    color: '#0f172a', body: '#64748b', hp: 280 },
  { name: '骄傲龙',   desc: '让你觉得自己总是对的',  color: '#450a0a', body: '#dc2626', hp: 300 },
  { name: '嫉妒精',   desc: '让你嫉妒别人的绿妖',    color: '#14532d', body: '#15803d', hp: 320 },
  { name: '逃避鬼',   desc: '让你逃避困难的幽灵',    color: '#1c1917', body: '#78716c', hp: 340 },
  { name: '懒虫王',   desc: '懒惰的终极大BOSS！',     color: '#1a1a2e', body: '#4338ca', hp: 380 },
  { name: '混沌魔王', desc: '所有坏习惯的源头！',     color: '#0f0f0f', body: '#7c3aed', hp: 450 },
];

// ── AUDIO ─────────────────────────────────────────────
let actx = null;
function ac() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); return actx; }
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
function sn(k, d) { const v = localStorage.getItem(k); return v !== null && !isNaN(Number(v)) ? Number(v) : d; }
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

// ── CANVAS DRAWING ────────────────────────────────────
function drawStars(canvas) {
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 420;
  canvas.height = canvas.offsetHeight || 168;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * canvas.width, y = Math.random() * canvas.height, r = Math.random() * 1.5 + 0.3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.3})`; ctx.fill();
  }
}

function drawPlayer(canvas, lv, hp, mg, anim) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 80, 110);
  const lvInfo = LEVELS[Math.min(lv - 1, LEVELS.length - 1)];
  const mgT = mgThreshold(lv);
  const mgFull = mg >= mgT;
  const mgPct = Math.min(1, mg / mgT);
  const bodyColor = hp >= 70 ? lvInfo.color : hp >= 40 ? '#fef9c3' : '#fecaca';
  const darkColor = hp >= 70 ? lvInfo.dark : '#ef4444';

  if (mgFull) { ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20; }
  else if (mgPct > 0.6) { ctx.shadowColor = lvInfo.dark; ctx.shadowBlur = 10 * mgPct; }
  else { ctx.shadowBlur = 0; }

  const offsetY = anim === 'jump' ? -18 : anim === 'attack' ? -8 : 0;
  const ox = anim === 'attack' ? 12 : 0;
  const y = offsetY;

  // tail
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.moveTo(15 + ox, 75 + y); ctx.quadraticCurveTo(2, 65 + y, 8, 50 + y);
  ctx.strokeStyle = darkColor; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();

  if (mgFull) { ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20; }
  else if (mgPct > 0.6) { ctx.shadowColor = lvInfo.dark; ctx.shadowBlur = 10 * mgPct; }

  // body
  ctx.beginPath(); ctx.ellipse(40 + ox, 75 + y, 22, 17, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor; ctx.fill(); ctx.strokeStyle = darkColor; ctx.lineWidth = 1.5; ctx.stroke();

  // neck+head
  ctx.beginPath(); ctx.ellipse(52 + ox, 58 + y, 13, 15, Math.PI / 8, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor; ctx.fill(); ctx.strokeStyle = darkColor; ctx.lineWidth = 1.5; ctx.stroke();

  // legs
  [[26,90],[34,90],[46,90],[54,90]].forEach(([lx, ly]) => {
    ctx.beginPath(); ctx.moveTo(lx + ox, ly - 12 + y); ctx.lineTo(lx + ox, ly + y);
    ctx.strokeStyle = darkColor; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.arc(lx + ox, ly + y, 4, 0, Math.PI * 2);
    ctx.fillStyle = darkColor; ctx.fill();
  });

  ctx.shadowBlur = 0;
  // eye
  ctx.beginPath(); ctx.arc(56 + ox, 52 + y, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#1f2937'; ctx.fill();
  ctx.beginPath(); ctx.arc(57.5 + ox, 51 + y, 1.2, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill();
  // cheek
  ctx.beginPath(); ctx.ellipse(52 + ox, 57 + y, 3, 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(253,164,175,${hp >= 50 ? 0.9 : 0.4})`; ctx.fill();
  // mane
  ctx.beginPath(); ctx.moveTo(44 + ox, 44 + y); ctx.bezierCurveTo(38 + ox, 35 + y, 50 + ox, 30 + y, 52 + ox, 40 + y);
  ctx.bezierCurveTo(54 + ox, 30 + y, 62 + ox, 32 + y, 60 + ox, 44 + y);
  ctx.fillStyle = darkColor; ctx.fill();

  // horn (lv>=2)
  if (lv >= 2) {
    ctx.beginPath(); ctx.moveTo(58 + ox, 44 + y); ctx.lineTo(62 + ox, 28 + y); ctx.lineTo(54 + ox, 40 + y);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    if (mgFull) {
      ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.moveTo(62 + ox, 28 + y);
      for (let i = 0; i < 5; i++) { ctx.lineTo(62 + ox + Math.cos(i * 1.2) * 6, 28 + y - i * 3); }
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // wings (lv>=5)
  if (lv >= 5) {
    ctx.save(); ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(22 + ox, 68 + y); ctx.bezierCurveTo(5, 50 + y, 8, 40 + y, 18 + ox, 55 + y);
    ctx.bezierCurveTo(10, 58 + y, 15, 65 + y, 22 + ox, 68 + y);
    ctx.fillStyle = lvInfo.color; ctx.fill(); ctx.strokeStyle = lvInfo.dark; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  }

  // magic particles (lv>=3)
  if (lv >= 3 && mgPct > 0.3) {
    const count = Math.floor(mgPct * 6);
    for (let i = 0; i < count; i++) {
      const px = 30 + ox + Math.cos(Date.now() / 300 + i) * 20;
      const py = 60 + y + Math.sin(Date.now() / 300 + i * 1.3) * 15;
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = lvInfo.dark; ctx.fill();
    }
  }

  // cosmic aura (lv>=10)
  if (lv >= 10) {
    ctx.save(); ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.ellipse(40 + ox, 68 + y, 30, 22, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(40 + ox, 68 + y, 5, 40 + ox, 68 + y, 30);
    grad.addColorStop(0, lvInfo.dark); grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad; ctx.fill(); ctx.restore();
  }
}

function drawVillain(canvas, villainIdx, villainHp, flash) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 80, 110);
  const v = VILLAINS[Math.min(villainIdx, VILLAINS.length - 1)];
  const hpPct = Math.max(0, villainHp / v.hp);

  if (flash) { ctx.fillStyle = 'rgba(255,50,50,0.5)'; ctx.fillRect(0, 0, 80, 110); }

  // ground shadow
  ctx.save(); ctx.globalAlpha = 0.3;
  ctx.beginPath(); ctx.ellipse(40, 105, 22, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();

  const angry = hpPct < 0.3;
  if (angry) { ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 15; }
  else { ctx.shadowColor = v.body; ctx.shadowBlur = 8; }

  const vi = villainIdx % 5;
  const eyeY = vi === 2 ? 65 : vi === 3 ? 58 : 60;

  if (vi === 0) {
    ctx.beginPath(); ctx.ellipse(40, 65, 22, 25, 0, 0, Math.PI * 2);
    ctx.fillStyle = v.body; ctx.fill();
  } else if (vi === 1) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2, r = i % 2 === 0 ? 28 : 18;
      if (i === 0) ctx.moveTo(40 + Math.cos(a) * r, 60 + Math.sin(a) * r);
      else ctx.lineTo(40 + Math.cos(a) * r, 60 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fillStyle = v.body; ctx.fill();
  } else if (vi === 2) {
    ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(65, 90); ctx.lineTo(15, 90); ctx.closePath();
    ctx.fillStyle = v.body; ctx.fill();
  } else if (vi === 3) {
    ctx.beginPath(); ctx.roundRect(18, 38, 44, 52, 8);
    ctx.fillStyle = v.body; ctx.fill();
  } else {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 === 0 ? 26 : 14;
      if (i === 0) ctx.moveTo(40 + Math.cos(a) * r, 60 + Math.sin(a) * r);
      else ctx.lineTo(40 + Math.cos(a) * r, 60 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fillStyle = v.body; ctx.fill();
  }

  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(33, eyeY, 5, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill();
  ctx.beginPath(); ctx.arc(47, eyeY, 5, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill();
  if (angry || hpPct < 0.5) {
    ctx.beginPath(); ctx.moveTo(29, eyeY - 7); ctx.lineTo(37, eyeY - 4);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(51, eyeY - 7); ctx.lineTo(43, eyeY - 4); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(35, eyeY - 1, 1.5, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill();
  ctx.beginPath(); ctx.arc(49, eyeY - 1, 1.5, 0, Math.PI * 2); ctx.fillStyle = 'white'; ctx.fill();
  ctx.beginPath();
  if (hpPct < 0.3) { ctx.arc(40, eyeY + 8, 6, 0, Math.PI); ctx.fillStyle = '#ef4444'; ctx.fill(); }
  else { ctx.moveTo(35, eyeY + 8); ctx.lineTo(45, eyeY + 8); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = 'bold 8px system-ui';
  ctx.textAlign = 'center'; ctx.fillText(v.name, 40, 15);
}

// ── MAIN COMPONENT ────────────────────────────────────
export default function App() {
  const [pts, setPts]               = useState(() => sn('p_pts', 0));
  const [hp, setHp]                 = useState(() => sn('p_hp', 80));
  const [mg, setMg]                 = useState(() => sn('p_mg', 0));
  const [lv, setLv]                 = useState(() => sn('p_lv', 1));
  const [day, setDay]               = useState(() => sn('p_dy', 1));
  const [villainIdx, setVillainIdx] = useState(() => sn('p_vi', 0));
  const [villainHp, setVillainHp]   = useState(() => {
    const saved = sn('p_vhp', -1);
    return saved < 0 ? VILLAINS[Math.min(sn('p_vi', 0), VILLAINS.length - 1)].hp : saved;
  });
  const [done, setDone]             = useState(() => JSON.parse(localStorage.getItem('p_done') || '[]'));
  const [lastDate, setLastDate]     = useState(() => localStorage.getItem('p_date') || '');
  const [parent, setParent]         = useState(false);
  const [message, setMessage]       = useState('');
  const [gameWon, setGameWon]       = useState(false);
  const [playerAnim, setPlayerAnim] = useState('idle');
  const [villainFlash, setVillainFlash] = useState(false);
  const [showBeam, setShowBeam]     = useState(false);

  const playerCanvasRef  = useRef(null);
  const villainCanvasRef = useRef(null);
  const starsCanvasRef   = useRef(null);
  const beamCanvasRef    = useRef(null);
  const msgTimer         = useRef(null);

  // ── SAVE ────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('p_pts', pts);
    localStorage.setItem('p_hp', hp);
    localStorage.setItem('p_mg', mg);
    localStorage.setItem('p_lv', lv);
    localStorage.setItem('p_dy', day);
    localStorage.setItem('p_vi', villainIdx);
    localStorage.setItem('p_vhp', villainHp);
    localStorage.setItem('p_done', JSON.stringify(done));
    localStorage.setItem('p_date', lastDate);
  }, [pts, hp, mg, lv, day, villainIdx, villainHp, done, lastDate]);

  // ── AUTO RESET ──────────────────────────────────────
  useEffect(() => {
    const today = todayStr();
    if (lastDate && lastDate !== today && hp > 0) {
      setHp(h => Math.max(0, h - 40));
      setDay(d => d + 1);
      setDone([]);
      setLastDate(today);
      toast(hp <= 40 ? '😭 小马饿晕了...' : '新的一天！加油！');
    }
    if (!lastDate) setLastDate(today);
    // migrate old task format
    try {
      const old = localStorage.getItem('p_tk');
      if (old) { localStorage.removeItem('p_tk'); }
    } catch (e) {}
  }, []);

  // ── STARS ───────────────────────────────────────────
  useEffect(() => { drawStars(starsCanvasRef.current); }, []);

  // ── DRAW LOOP ───────────────────────────────────────
  useEffect(() => {
    drawPlayer(playerCanvasRef.current, lv, hp, mg, playerAnim);
  }, [lv, hp, mg, playerAnim]);

  useEffect(() => {
    drawVillain(villainCanvasRef.current, villainIdx, villainHp, villainFlash);
  }, [villainIdx, villainHp, villainFlash]);

  // animate magic particles
  useEffect(() => {
    if (lv < 3) return;
    const id = setInterval(() => {
      drawPlayer(playerCanvasRef.current, lv, hp, mg, 'idle');
    }, 500);
    return () => clearInterval(id);
  }, [lv, hp, mg]);

  // ── TOAST ───────────────────────────────────────────
  function toast(msg) {
    setMessage(msg);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(''), 3000);
  }

  // ── ATTACK ANIM ─────────────────────────────────────
  function attackAnim(onHit) {
    const phases = ['idle', 'jump', 'attack', 'attack', 'jump', 'idle'];
    let i = 0;
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

  // ── MAGIC BEAM ──────────────────────────────────────
  function magicBeamAnim(onDone) {
    const bc = beamCanvasRef.current;
    if (!bc) { onDone(); return; }
    bc.width = bc.offsetWidth || 420;
    bc.height = bc.offsetHeight || 168;
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

  // ── DAMAGE VILLAIN ──────────────────────────────────
  function applyDamage(dmg, currentVillainIdx, currentVillainHp) {
    const newHp = Math.max(0, currentVillainHp - dmg);
    setVillainHp(newHp);
    if (newHp <= 0) {
      sfxVillainDead();
      setTimeout(() => {
        const v = VILLAINS[currentVillainIdx];
        if (currentVillainIdx >= VILLAINS.length - 1) {
          setGameWon(true); sfxWin();
        } else {
          const nextIdx = currentVillainIdx + 1;
          setVillainIdx(nextIdx);
          setVillainHp(VILLAINS[nextIdx].hp);
          toast('⚔️ 打败了' + v.name + '！新敌人：' + VILLAINS[nextIdx].name + '！');
        }
      }, 600);
    }
  }

  // ── ACTIONS ─────────────────────────────────────────
  function feedPet() {
    if (hp <= 0) return;
    if (pts < 10) { toast('星星不够！需要10⭐'); return; }
    if (hp >= 100) { toast('小马已经很饱了！'); return; }
    setPts(p => p - 10); setHp(h => Math.min(100, h + 20));
    sfxFeed(); toast('🍎 小马吃得好开心！');
    attackAnim(() => {});
  }

  function doMagic() {
    if (hp <= 0) return;
    const mgT = mgThreshold(lv);
    if (mg >= mgT) {
      sfxMagicBeam();
      const dmg = Math.floor(mgT / 3);
      magicBeamAnim(() => {
        applyDamage(dmg, villainIdx, villainHp);
        toast('💥 魔法大招！造成' + dmg + '点伤害！');
      });
      setMg(0);
      // check level up
      if (lv < 15) {
        setLv(l => {
          const newLv = l + 1;
          sfxLevelUp();
          toast('✨ 升级！成为' + LEVELS[Math.min(newLv - 1, 14)].name + '！');
          return newLv;
        });
      }
    } else {
      if (pts < 20) { toast('需要20⭐才能学魔法！'); return; }
      setPts(p => p - 20);
      setMg(m => Math.min(mgT, m + Math.floor(mgT / 10)));
      sfxMagicCharge();
      attackAnim(() => applyDamage(8, villainIdx, villainHp));
      toast('✨ 魔法充能中！');
    }
  }

  function toggleTask(id) {
    if (hp <= 0) return;
    if (!parent) { toast('请家长开启家长模式后打勾！'); return; }
    if (done.includes(id)) return;
    const t = TASKS.find(t => t.id === id); if (!t) return;
    const earned = t.double ? t.pts * 2 : t.pts;
    setDone(d => [...d, id]); setPts(p => p + earned);
    sfxTask();
    attackAnim(() => applyDamage(Math.floor(earned / 3), villainIdx, villainHp));
    toast('太棒了！获得' + earned + '⭐' + (t.double ? ' 双倍！' : ''));
  }

  function nextDay() {
    if (hp <= 0) return;
    setHp(h => Math.max(0, h - 40));
    setDay(d => d + 1); setDone([]); setLastDate(todayStr());
    toast('晚安！明天继续加油！');
  }

  function restartGame() {
    localStorage.clear();
    setPts(0); setHp(80); setMg(0); setLv(1); setDay(1);
    setVillainIdx(0); setVillainHp(VILLAINS[0].hp);
    setDone([]); setLastDate(todayStr()); setGameWon(false);
    toast('小马重生了！加油！');
  }

  // ── COMPUTED ─────────────────────────────────────────
  const lvInfo = LEVELS[Math.min(lv - 1, LEVELS.length - 1)];
  const mgT = mgThreshold(lv);
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

  return (
    <div className="min-h-screen bg-pink-50 p-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* WIN SCREEN */}
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

      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '0.5px solid #e5e7eb' }}>
          {/* HEADER */}
          <div style={{ background: `linear-gradient(135deg,${c1},${c2})`, textAlign: 'center', padding: '14px 12px 22px', position: 'relative' }}>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: 'white', letterSpacing: 1 }}>🌟 星光小马养成记 🌟</h1>
            <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', background: 'white', color: '#a855f7', padding: '3px 16px', borderRadius: 20, fontSize: 11, fontWeight: 500, border: '0.5px solid #e9d5ff', whiteSpace: 'nowrap' }}>
              第 {day} 天 · {lvInfo.name}
            </div>
          </div>

          {/* TOAST */}
          {message && (
            <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1.5px solid #f472b6', color: '#be185d', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500, zIndex: 999, whiteSpace: 'nowrap' }}>
              {message}
            </div>
          )}

          {/* ARENA */}
          <div style={{ position: 'relative', height: 200, background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 40%,#4c1d95 70%,#7c3aed 100%)', overflow: 'hidden', marginTop: 12 }}>
            <canvas ref={starsCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 168 }} />
            <canvas ref={beamCanvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 168, pointerEvents: 'none', display: showBeam ? 'block' : 'none', zIndex: 10 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(180deg,#7c3aed,#5b21b6)', borderTop: '2px solid #a78bfa' }} />
            {/* Player */}
            <div style={{ position: 'absolute', bottom: 32, left: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 70, height: 5, background: 'rgba(0,0,0,0.4)', borderRadius: 5, overflow: 'hidden', marginBottom: 2 }}>
                <div style={{ width: hp + '%', height: '100%', background: 'linear-gradient(90deg,#4ade80,#22c55e)', borderRadius: 5, transition: 'width 0.4s' }} />
              </div>
              <canvas ref={playerCanvasRef} width={80} height={110} />
              <div style={{ width: 50, height: 8, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', marginTop: -4 }} />
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>甜甜 Lv.{lv}</div>
            </div>
            {/* Villain */}
            <div style={{ position: 'absolute', bottom: 32, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 70, height: 5, background: 'rgba(0,0,0,0.4)', borderRadius: 5, overflow: 'hidden', marginBottom: 2 }}>
                <div style={{ width: (Math.max(0, villainHp / v.hp) * 100) + '%', height: '100%', background: 'linear-gradient(90deg,#f87171,#ef4444)', borderRadius: 5, transition: 'width 0.4s' }} />
              </div>
              <canvas ref={villainCanvasRef} width={80} height={110} />
              <div style={{ width: 50, height: 8, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', marginTop: -4 }} />
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{v.name}</div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px 4px', gap: 6 }}>
            {[['⭐', pts], ['✨ Lv.', lv]].map(([label, val], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '0.5px solid #e5e7eb', background: '#f9fafb' }}>
                {label}<span>{val}</span>
              </div>
            ))}
          </div>

          {/* BARS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 14px 6px' }}>
            {/* HP bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                <span>🍎 饱食度</span><span>{hp}/100</span>
              </div>
              <div style={{ height: 9, background: '#f3f4f6', borderRadius: 9, overflow: 'hidden', border: '0.5px solid #e5e7eb' }}>
                <div style={{ width: hp + '%', height: '100%', borderRadius: 9, background: hp < 30 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#4ade80,#22c55e)', transition: 'width 0.5s' }} />
              </div>
            </div>
            {/* Magic bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: mgFull ? '#7c3aed' : '#6b7280', marginBottom: 2, fontWeight: mgFull ? 600 : 400 }}>
                <span>{mgFull ? '⚡ 魔法已满！可发动大招！' : '✨ 魔法储能'}</span>
                <span>{mg}/{mgT}</span>
              </div>
              <div style={{ height: 9, background: '#f3f4f6', borderRadius: 9, overflow: 'hidden', border: '0.5px solid #e5e7eb' }}>
                <div style={{ width: (mg / mgT * 100) + '%', height: '100%', borderRadius: 9, background: mgFull ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#c084fc,#a855f7)', transition: 'width 0.5s' }} />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '4px 14px 8px' }}>
            <button onClick={feedPet} disabled={dead} style={{ padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 500, border: '0.5px solid #86efac', cursor: dead ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: '#15803d', background: '#f0fdf4', opacity: dead ? 0.35 : 1 }}>
              🍎<span>喂食 (-10⭐)</span>
            </button>
            <button onClick={doMagic} disabled={dead} style={{ padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 500, border: mgFull ? '0.5px solid #fbbf24' : '0.5px solid #d8b4fe', cursor: dead ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: mgFull ? '#92400e' : '#7e22ce', background: mgFull ? '#fef9c3' : '#faf5ff', opacity: dead ? 0.35 : 1 }}>
              <span>{mgFull ? '💥' : '✨'}</span>
              <span>{mgFull ? '发动大招！' : '学魔法 (-20⭐)'}</span>
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
              TASKS.map(t => {
                const isDone = done.includes(t.id);
                const earned = t.double ? t.pts * 2 : t.pts;
                return (
                  <div key={t.id} onClick={() => toggleTask(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 9px', borderRadius: 10, border: '0.5px solid #e5e7eb', marginBottom: 5, cursor: 'pointer', background: isDone ? '#f9fafb' : 'white', opacity: isDone ? 0.45 : 1 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (isDone ? '#22c55e' : '#d1d5db'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, background: isDone ? '#22c55e' : 'transparent', color: 'white' }}>
                      {isDone ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: isDone ? '#9ca3af' : '#111827', textDecoration: isDone ? 'line-through' : 'none' }}>{t.icon} {t.text}</div>
                      {t.sub && <div style={{ fontSize: 9, color: '#a855f7', marginTop: 1 }}>⚡ {t.sub}</div>}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 8, color: t.double ? '#7c3aed' : '#d97706', background: t.double ? '#ede9fe' : '#fef9c3' }}>
                      +{earned}⭐
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          <div style={{ padding: '8px 14px 14px', borderTop: '0.5px solid #e5e7eb' }}>
            <button onClick={nextDay} disabled={dead} style={{ width: '100%', background: '#818cf8', color: 'white', border: 'none', padding: 11, borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: dead ? 'not-allowed' : 'pointer', opacity: dead ? 0.35 : 1 }}>
              🌙 睡觉啦！结束今天
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
ENDOFFILE
echo "Done"
