import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, Sparkles, Utensils, Trophy, BookOpen, Target, GraduationCap, Crown, Shield, Ghost, Sword, Wind, CloudRain, Flame, Snowflake, CloudLightning, Gem, Infinity } from 'lucide-react';

export default function App() {
  // --- 1. 配置信息 ---
  const villains = ["", "赖床小鬼", "牙膏逃兵", "乱丢怪", "分心小蝇", "作业拖拉虫", "电子屏怪", "借口大王", "邋遢大象", "忘词狐狸", "发呆乌龟", "抱怨毒蛇", "急躁老虎", "粗心甲虫", "放弃之影", "终极懒惰大魔王"];

  const magicLevelAssets = {
    1: { icon: <Sparkles />, desc: "微光粉末", color: "#fef08a" },
    2: { icon: <Wind />, desc: "疾风步", color: "#bfdbfe" },
    3: { icon: <Shield />, desc: "守护屏障", color: "#4ade80" },
    4: { icon: <CloudRain />, desc: "净化雨露", color: "#60a5fa" },
    5: { icon: <Star className="animate-spin" />, desc: "星辰环绕", color: "#facc15" },
    6: { icon: <Flame className="animate-bounce" />, desc: "勇气火焰", color: "#f87171" },
    7: { icon: <Snowflake />, desc: "冷静冰晶", color: "#d1fae5" },
    8: { icon: <Zap className="animate-pulse" />, desc: "雷霆重击", color: "#fde047" },
    9: { icon: <Target />, desc: "绝对专注", color: "#ef4444" },
    10: { icon: <CloudLightning />, desc: "幻影瞬移", color: "#c084fc" },
    11: { icon: <Gem />, desc: "钻石意志", color: "#f472b6" },
    12: { icon: <Crown />, desc: "王者威严", color: "#ca8a04" },
    13: { icon: <Sparkles className="scale-150" />, desc: "时空裂缝", color: "#818cf8" },
    14: { icon: <Infinity />, desc: "永恒之光", color: "#ffffff" },
    15: { icon: <div className="text-4xl">🌈</div>, desc: "究极彩虹", color: "#ff0000" }
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

  // --- 2. 状态管理 ---
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
  const [isMagicFlashing, setIsMagicFlashing] = useState(false); // 魔法闪烁反馈

  // --- 3. 音效合成器 ---
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      if (type === 'hit') {
        osc.type = 'square'; osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'eat') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'magic') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'levelUp') {
        [523, 659, 783, 1046].forEach((f, i) => {
          const o = ctx.createOscillator(); const gn = ctx.createGain();
          o.connect(gn); gn.connect(ctx.destination);
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          gn.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
          o.start(ctx.currentTime + i * 0.1); o.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
      }
    } catch (e) {}
  };

  // --- 4. 核心逻辑 ---
  useEffect(() => {
    localStorage.setItem('p_pts', points);
    localStorage.setItem('p_hp', health);
    localStorage.setItem('p_mg', magic);
    localStorage.setItem('p_lv', level);
    localStorage.setItem('p_dy', day);
    localStorage.setItem('p_tk', JSON.stringify(tasks));

    if (level === 15 && points >= levelThresholds[15]) {
      setIsEnding(true);
    } else if (points >= levelThresholds[level] && level < 15) {
      setLevel(l => l + 1);
      playSound('levelUp');
      setMessage(`进化！习得魔法：${magicLevelAssets[level+1]?.desc || ''}`);
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

  // 喂食逻辑（加了扣分检查）
  const feedPet = () => {
    if (health <= 0) return;
    if (points >= 10) {
      setPoints(p => p - 10);
      setHealth(h => Math.min(100, h + 20));
      playSound('eat');
      setMessage('吃了好吃的，能量满满！🍎');
    } else {
      setMessage('星星不够哦，快去打败怪兽赚星星！⭐');
    }
  };

  // 注入魔法逻辑（修复不显示特效+防止扣成负数）
  const trainMagic = () => {
    if (health <= 0) return;
    if (points >= 20) {
      setPoints(p => p - 20);
      setMagic(m => m + 15);
      setPoints(p => p + 5); // 注入魔法会额外奖励一点经验值
      setIsMagicFlashing(true);
      setTimeout(() => setIsMagicFlashing(false), 500);
      playSound('magic');
      setMessage('魔法能量正在涌入小马体内！✨');
    } else {
      setMessage('星星不足，小马还无法学习魔法！⭐');
    }
  };

  // --- 5. 外观逻辑 ---
  const pet = (() => {
    let res = { emoji: '🐴', mood: '😊', scale: 0.7 + (health / 100) * 0.5 };
    if (health <= 0) return { emoji: '🌑', mood: '😵', scale: 0.6, glow: 'none' };
    
    if (level >= 4) res.emoji = '🦄';
    if (level >= 7) res.emoji = '🦄✨';
    if (level >= 10) res.emoji = '👑🦄';
    if (level >= 13) res.emoji = '👑🦄🌈';

    // 魔法数值决定光圈大小和旋转速度
    const currentMagic = magicLevelAssets[level];
    const magicPower = magic / 10;
    res.glow = `0 0 ${20 + magicPower}px ${currentMagic?.color || '#fff'}`;
    res.effectIcon = currentMagic?.icon;
    res.spinSpeed = `${Math.max(15 - level, 2)}s`; // 越高级转得越快

    return res;
  })();

  if (isEnding) return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex flex-col items-center justify-center p-6 text-white text-center">
       <div className="text-[120px] mb-8 animate-bounce">👑🦄🌈</div>
       <h1 className="text-6xl font-black mb-6">甜甜大胜利！</h1>
       <p className="text-2xl font-bold">你战胜了所有不良习惯，成为了最强的彩虹女神！</p>
       <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-10 bg-white text-pink-600 px-12 py-4 rounded-full font-black">重新开始冒险</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-white">
      <div className={`max-w-md mx-auto bg-slate-900 rounded-[3.5rem] shadow-2xl border-4 ${isMagicFlashing ? 'border-yellow-400 scale-105' : 'border-slate-800'} transition-all duration-300 overflow-hidden relative`}>
        
        {/* 顶部标题 */}
        <div className="bg-gradient-to-b from-indigo-500 to-purple-700 py-6 text-center">
          <h1 className="text-2xl font-black italic">PONY HEROES</h1>
          <div className="flex justify-center space-x-3 mt-2">
            <span className="bg-black/40 px-4 py-1 rounded-full text-[10px] font-bold">第 {day} 天</span>
            <span className="bg-yellow-400 px-4 py-1 rounded-full text-[10px] font-black text-slate-900">LV. {level}</span>
          </div>
        </div>

        {/* 当前反派 */}
        <div className="bg-black/30 p-4 flex flex-col items-center border-b border-white/5">
          <div className="text-[9px] text-slate-500 font-black mb-2 uppercase tracking-widest">阻碍进化的反派</div>
          <div className="flex items-center text-red-400 font-black">
            <Ghost className="w-5 h-5 mr-2 animate-pulse" />
            <span className="text-lg">【{villains[level]}】</span>
          </div>
        </div>

        {/* 宠物展示 */}
        <div className="p-8 text-center relative">
          {message && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-8 py-2 rounded-2xl text-xs font-black z-50 shadow-2xl border-2 border-white animate-bounce">
              {message}
            </div>
          )}

          <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
            {/* 魔法特效背景 - 会根据等级换图标，根据魔法值变亮 */}
            <div 
                className="absolute inset-0 flex items-center justify-center opacity-60"
                style={{ animation: `spin-slow ${pet.spinSpeed} linear infinite` }}
            >
              <div className="scale-[2.5]">{pet.effectIcon}</div>
            </div>
            
            <div 
              className="w-44 h-44 bg-slate-800 rounded-full flex flex-col items-center justify-center border-4 border-slate-700 shadow-inner transition-all duration-700 relative z-10"
              style={{ transform: `scale(${pet.scale})`, boxShadow: pet.glow }}
            >
              <div className="text-7xl mb-1 drop-shadow-xl animate-bounce">{pet.emoji}</div>
              <div className="text-2xl opacity-80">{health < 30 ? '😫' : '😊'}</div>
            </div>
          </div>

          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
             习得技能：{magicLevelAssets[level]?.desc}
          </div>

          {/* 进度条 */}
          <div className="space-y-4 px-4 mb-4">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                <span>ENERGY (能量)</span>
                <span>{health}%</span>
              </div>
              <div className="h-2 bg-black rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${health > 30 ? 'bg-green-500' : 'bg-red-600'}`} style={{ width: `${health}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                <span>MAGIC (魔法储能)</span>
                <span>{magic}</span>
              </div>
              <div className="h-2 bg-black rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${Math.min(magic / 5, 100)}%` }}></div>
              </div>
            </div>
            <div className="bg-yellow-900/20 p-2 rounded-xl">
               <div className="flex justify-between text-[9px] font-black text-yellow-500 mb-1">
                 <span>EXP (击败怪兽进度)</span>
                 <span>{points} / {levelThresholds[level]}</span>
               </div>
               <div className="h-1 bg-black rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${(points/levelThresholds[level])*100}%` }}></div>
               </div>
            </div>
          </div>
        </div>

        {/* 按钮 */}
        <div className="grid grid-cols-2 gap-4 px-8 mb-8">
          <button onClick={feedPet} className="bg-slate-800 border-b-8 border-slate-950 py-4 rounded-2xl font-black text-green-400 active:border-b-0 active:translate-y-2 transition-all">
            <Utensils className="mx-auto mb-1" /> 补充能量
          </button>
          <button onClick={trainMagic} className="bg-slate-800 border-b-8 border-slate-950 py-4 rounded-2xl font-black text-purple-400 active:border-b-0 active:translate-y-2 transition-all">
            <Zap className="mx-auto mb-1 animate-pulse" /> 注入魔法
          </button>
        </div>

        {/* 任务列表 */}
        <div className="px-6 mb-10">
          <div className="bg-black/40 rounded-[2.5rem] p-6 border-2 border-slate-800 shadow-inner">
            <div className="space-y-3">
              {tasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTask(t.id)} 
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${t.done ? 'bg-slate-900/50 opacity-20' : 'bg-slate-800 border-2 border-slate-700 shadow-lg hover:border-indigo-500'}`}
                >
                  <div className="flex items-center space-x-3">
                    <Sword className={`w-4 h-4 ${t.done ? 'text-slate-600' : 'text-indigo-400'}`} />
                    <span className={`font-bold text-xs ${t.done ? 'line-through' : ''}`}>{t.text}</span>
                  </div>
                  <div className="text-yellow-500 font-black text-xs">+{t.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 结束今天 */}
        <div className="px-8 pb-12">
          <button onClick={() => { setHealth(h => Math.max(0, h-40)); setDay(d => d+1); setTasks(initialTasks); }} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-5 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
             SLEEP & SAVE (休息与存档)
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
