import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, Sparkles, Utensils, Trophy, BookOpen, Target, GraduationCap, Crown, Shield, Ghost, Sword, Wind, CloudRain, Flame, Snowflake, CloudLightning, Gem, Infinity, Gift } from 'lucide-react';

export default function App() {
  // --- 1. 配置与反派 ---
  const villains = ["", "赖床小鬼", "牙膏逃兵", "乱丢怪", "分心小蝇", "作业拖拉虫", "电子屏怪", "借口大王", "邋遢大象", "忘词狐狸", "发呆乌龟", "抱怨毒蛇", "急躁老虎", "粗心甲虫", "放弃之影", "终极懒惰大魔王"];
  const villainEmojis = ["", "😴", "🪥", "🧺", "🪰", "🐛", "📱", "🗣️", "🐘", "🦊", "🐢", "🐍", "🐯", "🪲", "👤", "👺"];

  const levelThresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3300, 4000, 4800, 5700, 6700, 8000];

  const initialTasks = [
    { id: 1, text: '听到闹钟立刻起床不赖床', points: 15, done: false },
    { id: 2, text: '自己刷牙洗脸换衣服', points: 10, done: false },
    { id: 3, text: '自己准备书包和饭盒', points: 15, done: false },
    { id: 4, text: '完成作业/阅读打卡', points: 20, done: false },
    { id: 5, text: '闹钟响了立刻上床睡觉', points: 20, done: false },
    { id: 6, text: '🌟 做了自我突破/进步的事', points: 40, done: false, bonus: "双倍伤害!" },
    { id: 7, text: '✍️ 写作业非常专注不发呆', points: 35, done: false, bonus: "双倍伤害!" },
    { id: 8, text: '🧹 整理好自己的私人物品', points: 15, done: false },
    { id: 9, text: '📖 阅读30分钟父母选的书', points: 20, done: false },
  ];

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
  const [isAttacking, setIsAttacking] = useState(false); // 攻击动作
  const [isHit, setIsHit] = useState(false); // 受击动作
  const [isSuper, setIsSuper] = useState(false); // 魔法爆发

  // --- 3. 音效与动作 ---
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      if (type === 'atk') {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'magic') {
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {}
  };

  const triggerAttack = () => {
    setIsAttacking(true);
    setTimeout(() => {
      setIsAttacking(false);
      setIsHit(true);
      playSound('atk');
      setTimeout(() => setIsHit(false), 300);
    }, 400);
  };

  // --- 4. 逻辑钩子 ---
  useEffect(() => {
    localStorage.setItem('p_pts', points);
    localStorage.setItem('p_hp', health);
    localStorage.setItem('p_mg', magic);
    localStorage.setItem('p_lv', level);
    localStorage.setItem('p_dy', day);
    localStorage.setItem('p_tk', JSON.stringify(tasks));

    if (magic >= 100) {
      setIsSuper(true);
      setMagic(0);
      setHealth(100);
      setPoints(p => p + 100);
      playSound('magic');
      setMessage("✨ 奥义爆发：全屏净化！经验大涨！");
      setTimeout(() => setIsSuper(false), 3000);
    }

    if (level === 15 && points >= levelThresholds[15]) {
      setIsEnding(true);
    } else if (points >= levelThresholds[level] && level < 15) {
      setLevel(l => l + 1);
      setMessage(`💥 成功击败怪兽，升级到 LV.${level+1}!`);
    }
  }, [points, health, magic, level, day, tasks]);

  const toggleTask = (id) => {
    if (health <= 0) return;
    setTasks(prev => prev.map(t => {
      if (t.id === id && !t.done) {
        setPoints(p => p + t.points);
        triggerAttack();
        return { ...t, done: true };
      }
      return t;
    }));
  };

  // --- 5. 渲染组件 ---
  if (isEnding) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="text-[120px] mb-8 animate-bounce">👑🦄🌈</div>
      <h1 className="text-6xl font-black mb-6">全胜！</h1>
      <p className="text-2xl font-bold">甜甜打败了所有坏习惯！你是最棒的彩虹战士！</p>
      <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-10 bg-white text-pink-600 px-12 py-4 rounded-full font-black text-xl">重新开启传说</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-2 font-sans text-white flex flex-col">
      <div className="max-w-md mx-auto w-full bg-slate-900 rounded-[3rem] shadow-2xl border-4 border-slate-800 overflow-hidden relative flex flex-col h-full">
        
        {/* 顶部标题与信息 */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-4 text-center">
          <div className="flex justify-around items-center px-4">
            <div className="text-left">
              <p className="text-[10px] text-indigo-300 font-bold uppercase">Player: 甜甜</p>
              <p className="text-sm font-black italic">PONY HERO</p>
            </div>
            <div className="bg-black/30 px-4 py-1 rounded-full border border-white/10">
              <span className="text-yellow-400 font-black">LV. {level}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-indigo-300 font-bold uppercase">Day</p>
              <p className="text-sm font-black">{day}</p>
            </div>
          </div>
        </div>

        {/* 核心对战场区 (Q宠对战风) */}
        <div className="relative h-72 bg-gradient-to-b from-indigo-900 to-slate-900 border-b-4 border-black/50 overflow-hidden">
          
          {/* 背景装饰：流星 */}
          {isSuper && <div className="absolute inset-0 bg-white/20 animate-pulse z-40" />}
          
          {/* 坏习惯怪兽 (右侧) */}
          <div className={`absolute right-8 top-16 transition-all duration-300 ${isHit ? 'translate-x-4 scale-110' : ''}`}>
             <div className="flex flex-col items-center">
                <div className={`text-7xl drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] ${isHit ? 'animate-ping' : 'animate-pulse'}`}>
                  {villainEmojis[level]}
                </div>
                <div className="mt-4 bg-black/60 px-4 py-1 rounded-full border border-red-500/50">
                   <p className="text-[10px] text-red-400 font-black tracking-widest uppercase">Monster: {villains[level]}</p>
                </div>
                {/* 怪兽血条 */}
                <div className="w-24 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden border border-white/10">
                   <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${100 - (points/levelThresholds[level]*100)}%` }}></div>
                </div>
             </div>
          </div>

          {/* 甜甜 (左侧全身像) */}
          <div className={`absolute left-8 bottom-12 transition-all duration-500 z-10 ${isAttacking ? 'translate-x-32 -translate-y-12' : ''}`}>
             <div className="flex flex-col items-center relative">
                {/* 魔法光环 */}
                <div 
                  className={`absolute -inset-8 rounded-full border-2 border-dashed border-purple-400/30 transition-all ${isSuper ? 'animate-spin-fast border-yellow-400' : 'animate-spin-slow'}`}
                  style={{ boxShadow: `0 0 ${20 + (level*3)}px rgba(168, 85, 247, 0.5)` }}
                />
                
                {/* 小马全身模拟 */}
                <div className="relative">
                  <div className={`text-8xl drop-shadow-2xl ${health < 30 ? 'grayscale' : ''}`}>
                    {level < 4 ? '🐴' : level < 7 ? '🦄' : level < 10 ? '🦄✨' : level < 13 ? '👑🦄' : '👑🦄🌈'}
                  </div>
                  {/* 根据饱腹度显示心情 */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-1 text-xl shadow-lg border border-purple-100">
                    {health < 30 ? '😫' : '😊'}
                  </div>
                </div>

                <div className="mt-4 bg-purple-600/80 px-4 py-1 rounded-full shadow-lg border border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-widest">STarlight Form</p>
                </div>
             </div>
          </div>

          {/* 提示气泡 */}
          {message && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white text-indigo-700 px-6 py-2 rounded-2xl font-black text-xs shadow-2xl animate-bounce border-2 border-indigo-500">
              {message}
            </div>
          )}
        </div>

        {/* 状态数据区 */}
        <div className="p-4 grid grid-cols-2 gap-4 bg-slate-800/50">
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-black text-slate-400"><span>HP (Energy)</span><span>{health}%</span></div>
            <div className="h-3 bg-black rounded-full p-0.5 border border-white/5">
              <div className={`h-full rounded-full transition-all duration-1000 ${health > 30 ? 'bg-green-500' : 'bg-red-600'}`} style={{ width: `${health}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-black text-slate-400"><span>MP (Magic)</span><span>{magic}%</span></div>
            <div className="h-3 bg-black rounded-full p-0.5 border border-white/5">
              <div className="h-full rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-500" style={{ width: `${magic}%` }}></div>
            </div>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <button 
            onClick={() => { if(points < 10) return setMessage("Stars Low!"); setPoints(p => p - 10); setHealth(h => Math.min(100, h+20)); }} 
            className="bg-slate-800 border-b-4 border-slate-950 p-3 rounded-2xl flex items-center justify-center space-x-2 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Utensils className="text-green-500" /> <span className="font-black text-sm text-green-400">Heal</span>
          </button>
          <button 
            onClick={() => { if(points < 20) return setMessage("Stars Low!"); setPoints(p => p - 20); setMagic(m => m + 25); }} 
            className="bg-slate-800 border-b-4 border-slate-950 p-3 rounded-2xl flex items-center justify-center space-x-2 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Zap className="text-purple-500" /> <span className="font-black text-sm text-purple-400">Magic</span>
          </button>
        </div>

        {/* 任务列表 (滚动区) */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {tasks.map(t => (
              <div 
                key={t.id} 
                onClick={() => toggleTask(t.id)} 
                className={`p-3 rounded-2xl flex items-center justify-between transition-all border-2 ${t.done ? 'bg-black/20 border-transparent opacity-20' : 'bg-slate-800 border-slate-700 shadow-lg'}`}
              >
                <div className="flex items-center space-x-3">
                  {t.done ? <Sword className="text-slate-600 w-4 h-4" /> : <Sword className="text-indigo-400 w-4 h-4 animate-pulse" />}
                  <div className="text-[11px] font-bold tracking-tight">{t.text}</div>
                </div>
                <div className="text-yellow-500 font-black text-xs">+{t.points}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部导航 */}
        <div className="p-4 bg-slate-950">
          <button onClick={() => { setHealth(h => Math.max(0, h-40)); setDay(d => d+1); setTasks(initialTasks); }} className="w-full bg-indigo-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
             Sleep & Save
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-fast { animation: spin-fast 1s linear infinite; }
      `}</style>
    </div>
  );
}
