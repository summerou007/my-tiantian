import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, Sparkles, Utensils, Trophy, BookOpen, Target, GraduationCap, Crown, Shield, Ghost, Sword, Wind, CloudRain, Flame, Snowflake, CloudLightning, Gem, Infinity } from 'lucide-react';

export default function App() {
  // --- 1. 15个反派配置 ---
  const villains = [
    "", "赖床小鬼", "牙膏逃兵", "乱丢怪", "分心小蝇", "作业拖拉虫", 
    "电子屏怪", "借口大王", "邋遢大象", "忘词狐狸", "发呆乌龟", 
    "抱怨毒蛇", "急躁老虎", "粗心甲虫", "放弃之影", "终极懒惰大魔王"
  ];

  // --- 2. 15级魔法特效配置 ---
  const magicLevelAssets = {
    1: { icon: <Sparkles className="w-8 h-8 text-yellow-200" />, desc: "微光粉末", color: "#fef08a" },
    2: { icon: <Wind className="w-8 h-8 text-blue-200" />, desc: "疾风步", color: "#bfdbfe" },
    3: { icon: <Shield className="w-10 h-10 text-green-400" />, desc: "守护屏障", color: "#4ade80" },
    4: { icon: <CloudRain className="w-10 h-10 text-blue-400" />, desc: "净化雨露", color: "#60a5fa" },
    5: { icon: <Star className="w-12 h-12 text-yellow-400 animate-spin" />, desc: "星辰环绕", color: "#facc15" },
    6: { icon: <Flame className="w-12 h-12 text-orange-500 animate-bounce" />, desc: "勇气火焰", color: "#f87171" },
    7: { icon: <Snowflake className="w-12 h-12 text-blue-100" />, desc: "冷静冰晶", color: "#d1fae5" },
    8: { icon: <Zap className="w-14 h-14 text-yellow-300 animate-pulse" />, desc: "雷霆重击", color: "#fde047" },
    9: { icon: <Target className="w-14 h-14 text-red-500" />, desc: "绝对专注", color: "#ef4444" },
    10: { icon: <CloudLightning className="w-16 h-16 text-purple-400" />, desc: "幻影瞬移", color: "#c084fc" },
    11: { icon: <Gem className="w-16 h-16 text-pink-400 shadow-lg" />, desc: "钻石意志", color: "#f472b6" },
    12: { icon: <Crown className="w-16 h-16 text-yellow-600" />, desc: "王者威严", color: "#ca8a04" },
    13: { icon: <Sparkles className="w-20 h-20 text-indigo-400" />, desc: "时空裂缝", color: "#818cf8" },
    14: { icon: <Infinity className="w-20 h-20 text-white" />, desc: "永恒之光", color: "#ffffff" },
    15: { icon: <div className="text-4xl">🌈</div>, desc: "究极彩虹", color: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)" }
  };

  const initialTasks = [
    { id: 1, text: '听到闹钟立刻起床不赖床', points: 15, done: false },
    { id: 2, text: '自己刷牙洗脸换衣服', points: 10, done: false },
    { id: 3, text: '自己准备书包和饭盒', points: 15, done: false },
    { id: 4, text: '完成作业/阅读打卡', points: 20, done: false },
    { id: 5, text: '闹钟响了立刻上床睡觉', points: 20, done: false },
    { id: 6, text: '🌟 做了自我突破/进步的事', points: 40, done: false, bonus: "双倍奖励!" },
    { id: 7, text: '✍️ 写作业非常专注不发呆', points: 35, done: false, bonus: "双倍奖励!" },
    { id: 8, text: '🧹 整理好自己的私人物品', points: 15, done: false },
    { id: 9, text: '📖 阅读30分钟父母选的书', points: 20, done: false },
  ];

  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3300, 4000, 4800, 5700, 6700, 8000];

  // --- 3. 状态管理 ---
  const [points, setPoints] = useState(() => Number(localStorage.getItem('p_pts')) || 0);
  const [health, setHealth] = useState(() => Number(localStorage.getItem('p_hp')) ?? 80);
  const [magic, setMagic] = useState(() => Number(localStorage.getItem('p_mg')) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem('p_lv')) || 1);
  const [day, setDay] = useState(() => Number(localStorage.getItem('p_dy')) || 1);
  const [tasks, setTasks] = useState(() => {
    try {
      const s = localStorage.getItem('p_tk');
      if (!s) return initialTasks;
      const saved = JSON.parse(s);
      return initialTasks.map(t => {
        const exist = saved.find(st => st.id === t.id);
        return exist ? { ...t, done: exist.done } : t;
      });
    } catch (e) { return initialTasks; }
  });
  const [message, setMessage] = useState('');
  const [isEnding, setIsEnding] = useState(false);

  // --- 4. 强大的音效合成器 ---
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);

      if (type === 'hit') { // 击败怪兽音
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'eat') { // 吃东西音
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'magic') { // 魔法音
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'levelUp') { // 升级音
        [523, 659, 783, 1046].forEach((f, i) => {
          const o = ctx.createOscillator(); const gn = ctx.createGain();
          o.connect(gn); gn.connect(ctx.destination);
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          gn.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
          o.start(ctx.currentTime + i * 0.1); o.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
      } else if (type === 'victory') { // 终极胜利音
        const notes = [523, 523, 523, 659, 783, 783, 659, 783, 1046];
        notes.forEach((f, i) => {
          const o = ctx.createOscillator(); const gn = ctx.createGain();
          o.connect(gn); gn.connect(ctx.destination);
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.15);
          gn.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
          o.start(ctx.currentTime + i * 0.15); o.stop(ctx.currentTime + i * 0.15 + 0.2);
        });
      }
    } catch (e) {}
  };

  // --- 5. 核心逻辑 ---
  useEffect(() => {
    localStorage.setItem('p_pts', points);
    localStorage.setItem('p_hp', health);
    localStorage.setItem('p_mg', magic);
    localStorage.setItem('p_lv', level);
    localStorage.setItem('p_dy', day);
    localStorage.setItem('p_tk', JSON.stringify(tasks));

    if (level === 15 && points >= levelThresholds[15]) {
      if(!isEnding) { playSound('victory'); setIsEnding(true); }
    } else if (points >= levelThresholds[level] && level < 15) {
      setLevel(l => l + 1);
      playSound('levelUp');
      setMessage(`💥 升级！成功习得魔法：${magicLevelAssets[level+1]?.desc || ''}`);
    }
  }, [points, health, magic, level, day, tasks]);

  const toggleTask = (id) => {
    if (health <= 0) return;
    setTasks(prev => prev.map(t => {
      if (t.id === id && !t.done) {
        setPoints(p => p + t.points);
        playSound('hit');
        return { ...t, done: true };
      }
      return t;
    }));
  };

  // --- 6. 动态外观逻辑 ---
  const pet = (() => {
    let res = { emoji: '🐴', mood: '😊', scale: 0.7 + (health / 100) * 0.5, glow: 'none', effect: null };
    if (health <= 0) return { emoji: '🌑', mood: '😵', scale: 0.6, glow: 'none', effect: null };
    if (health < 30) res.mood = '😫';

    if (level >= 4) res.emoji = '🦄';
    if (level >= 7) res.emoji = '🦄✨';
    if (level >= 10) res.emoji = '👑🦄';
    if (level >= 13) res.emoji = '👑🦄🌈';

    const currentMagic = magicLevelAssets[level];
    if (currentMagic) {
      res.effect = currentMagic.icon;
      res.glow = `0 0 ${20 + (level * 2)}px ${currentMagic.color}`;
    }
    return res;
  })();

  // --- 7. 通关画面 ---
  if (isEnding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in duration-1000">
        <div className="bg-black/20 p-10 rounded-[3rem] backdrop-blur-lg border-4 border-white animate-bounce">
          <div className="text-[120px] mb-8">👑🦄🌈</div>
          <h1 className="text-6xl font-black mb-6 drop-shadow-lg">恭喜甜甜！</h1>
          <p className="text-2xl font-bold leading-relaxed mb-10">
            你坚持完成了所有挑战，打败了所有的坏习惯！<br/>
            在这个过程中，你变得更自律、更勇敢、更专注。<br/>
            <span className="text-yellow-200 text-5xl font-black">你就是最强的彩虹女神！</span>
          </p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-white text-pink-600 px-12 py-4 rounded-full font-black text-xl shadow-2xl hover:scale-110 transition-transform">
            开启新篇章
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-white">
      <div className="max-w-md mx-auto bg-slate-900 rounded-[3.5rem] shadow-2xl border-4 border-slate-800 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-indigo-500 to-purple-700 py-8 text-center border-b-4 border-black/20">
          <h1 className="text-2xl font-black tracking-tighter italic">PONY HEROES</h1>
          <div className="flex justify-center space-x-3 mt-3">
            <span className="bg-black/40 px-4 py-1 rounded-full text-[10px] font-bold border border-white/10 text-indigo-200">DAY {day}</span>
            <span className="bg-yellow-400 px-4 py-1 rounded-full text-[10px] font-black text-slate-900 border-2 border-white shadow-sm">LV. {level}</span>
          </div>
        </div>

        {/* Villain Tracker */}
        <div className="bg-black/30 p-4 border-b border-white/5 flex flex-col items-center">
          <div className="text-[9px] text-slate-500 font-black mb-2 uppercase tracking-[0.2em]">当前阻碍进化的坏习惯</div>
          <div className="flex items-center bg-red-950/30 px-6 py-2 rounded-2xl border border-red-900/50">
            <Ghost className="text-red-500 w-5 h-5 mr-3 animate-pulse" />
            <span className="text-lg font-black text-red-200 uppercase tracking-tight">【{villains[level]}】</span>
          </div>
        </div>

        {/* Main Pet Stage */}
        <div className="p-8 text-center relative">
          {message && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-8 py-2 rounded-2xl text-xs font-black z-50 shadow-2xl border-2 border-white animate-bounce">
              {message}
            </div>
          )}

          <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
            {/* 魔法特效背景 */}
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-60">
              {pet.effect}
            </div>
            
            <div 
              className="w-44 h-44 bg-slate-800 rounded-full flex flex-col items-center justify-center border-4 border-slate-700 shadow-inner transition-all duration-700 relative z-10"
              style={{ transform: `scale(${pet.scale})`, boxShadow: pet.glow }}
            >
              <div className="text-7xl mb-1 drop-shadow-xl animate-bounce">{pet.emoji}</div>
              <div className="text-2xl opacity-80">{pet.mood}</div>
            </div>
          </div>

          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
             已习得魔法：{magicLevelAssets[level]?.desc || "无"}
          </div>

          {/* Progress Bars */}
          <div className="space-y-5 px-4 mb-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                <span>ENERGY (饱腹度)</span>
                <span>{health}%</span>
              </div>
              <div className="h-2 bg-black rounded-full overflow-hidden border border-white/5">
                <div className={`h-full rounded-full transition-all duration-1000 ${health > 30 ? 'bg-green-500' : 'bg-red-600'}`} style={{ width: `${health}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">
                <span>Battle Progress (距离打败怪兽)</span>
                <span>{points} / {levelThresholds[level]}</span>
              </div>
              <div className="h-3 bg-black rounded-full overflow-hidden border border-white/5 p-0.5">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${(points/levelThresholds[level])*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-4 px-8 mb-8">
          <button onClick={() => { setPoints(p => p - 10); setHealth(h => Math.min(100, h+20)); playSound('eat'); }} className="group bg-slate-800 border-b-8 border-slate-950 py-4 rounded-[1.5rem] font-black text-green-400 active:border-b-0 active:translate-y-2 transition-all">
            <Utensils className="mx-auto mb-1 w-6 h-6" /> 补充能量
          </button>
          <button onClick={() => { setPoints(p => p - 20); setMagic(m => m + 15); playSound('magic'); }} className="group bg-slate-800 border-b-8 border-slate-950 py-4 rounded-[1.5rem] font-black text-purple-400 active:border-b-0 active:translate-y-2 transition-all">
            <Zap className="mx-auto mb-1 w-6 h-6 animate-pulse" /> 注入魔法
          </button>
        </div>

        {/* Task Log */}
        <div className="px-6 mb-10">
          <div className="bg-black/40 rounded-[2.5rem] p-6 border-2 border-slate-800 shadow-inner">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sword className="text-slate-600 w-4 h-4" />
              <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">Habit Battle Log</h3>
              <Sword className="text-slate-600 w-4 h-4 flip-x" />
            </div>
            <div className="space-y-3">
              {tasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTask(t.id)} 
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${t.done ? 'bg-slate-900/50 opacity-20 border-transparent' : 'bg-slate-800 border-2 border-slate-700 shadow-lg hover:border-indigo-500'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${t.done ? 'bg-slate-600' : 'bg-indigo-500 animate-pulse'}`} />
                    <span className={`font-bold text-xs ${t.done ? 'line-through' : ''}`}>{t.text}</span>
                  </div>
                  <div className="text-yellow-500 font-black text-xs">+{t.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Finish Day */}
        <div className="px-8 pb-12">
          <button onClick={() => { setHealth(h => Math.max(0, h-40)); setDay(d => d+1); setTasks(initialTasks); }} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(79,70,229,0.4)] active:scale-95 transition-all">
             Sleep & Recover
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .flip-x { transform: scaleX(-1); }
      `}</style>
    </div>
  );
}
