import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, AlertCircle, RefreshCw, Sparkles, Utensils } from 'lucide-react';

export default function App() {
  // 静态配置：图标和初始任务
  const taskIcons = {
    1: <Sun className="w-5 h-5 text-yellow-500" />,
    2: <Coffee className="w-5 h-5 text-blue-400" />,
    3: <Star className="w-5 h-5 text-orange-400" />,
    4: <CheckCircle className="w-5 h-5 text-green-500" />,
    5: <Moon className="w-5 h-5 text-indigo-500" />
  };

  const initialTasks = [
    { id: 1, text: '听到闹钟立刻起床不赖床', points: 15, done: false },
    { id: 2, text: '自己刷牙洗脸换衣服', points: 10, done: false },
    { id: 3, text: '自己准备书包和饭盒', points: 15, done: false },
    { id: 4, text: '完成作业/阅读打卡', points: 20, done: false },
    { id: 5, text: '闹钟响了立刻上床睡觉', points: 20, done: false },
  ];

  // --- 状态管理 (带安全读取逻辑) ---
  const [points, setPoints] = useState(() => Number(localStorage.getItem('p_pts')) || 0);
  const [health, setHealth] = useState(() => {
    const s = localStorage.getItem('p_hp');
    return s !== null ? Number(s) : 80;
  });
  const [magic, setMagic] = useState(() => Number(localStorage.getItem('p_mg')) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem('p_lv')) || 1);
  const [day, setDay] = useState(() => Number(localStorage.getItem('p_dy')) || 1);
  const [tasks, setTasks] = useState(() => {
    try {
      const s = localStorage.getItem('p_tk');
      if (!s) return initialTasks;
      const parsed = JSON.parse(s);
      // 如果发现旧版本带Icon对象的脏数据，强行重置
      if (parsed.length > 0 && typeof parsed[0].icon !== 'undefined') return initialTasks;
      return parsed;
    } catch (e) { return initialTasks; }
  });
  const [message, setMessage] = useState('');

  // --- 自动保存 ---
  useEffect(() => {
    localStorage.setItem('p_pts', points);
    localStorage.setItem('p_hp', health);
    localStorage.setItem('p_mg', magic);
    localStorage.setItem('p_lv', level);
    localStorage.setItem('p_dy', day);
    localStorage.setItem('p_tk', JSON.stringify(tasks));
  }, [points, health, magic, level, day, tasks]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const toggleTask = (id) => {
    if (health <= 0) return;
    setTasks(prev => prev.map(t => {
      if (t.id === id && !t.done) {
        setPoints(p => p + t.points);
        showMessage(`太棒了！获得 ${t.points} 星星 ⭐`);
        return { ...t, done: true };
      }
      return t;
    }));
  };

  const feedPet = () => {
    if (health <= 0) return;
    if (points >= 10) {
      if (health >= 100) return showMessage('小马吃撑啦！🍎');
      setPoints(p => p - 10);
      setHealth(h => Math.min(100, h + 20));
      showMessage('小马吃得好开心！🍎');
    } else { showMessage('星星不够哦，快去做任务吧！'); }
  };

  const trainMagic = () => {
    if (health <= 0) return;
    if (points >= 20) {
      setPoints(p => p - 20);
      const newMg = magic + 10;
      setMagic(newMg);
      if (newMg >= level * 50) {
        setLevel(l => l + 1);
        showMessage('✨ 奇迹发生了！小马升级啦！ ✨');
      } else { showMessage('咻咻咻！魔法变强了！✨'); }
    } else { showMessage('星星不够学习魔法哦！'); }
  };

  const nextDay = () => {
    if (health <= 0) return;
    setHealth(h => Math.max(0, h - 40));
    setDay(d => d + 1);
    setTasks(initialTasks);
    showMessage('新的一天，也要加油哦！');
  };

  const restartGame = () => {
    localStorage.clear();
    window.location.reload();
  };

  // 宠物显示逻辑
  const pet = (() => {
    if (health <= 0) return { emoji: '🌑', name: '变成石头的宠物', ani: '', clr: 'text-gray-400' };
    if (health < 30) return { emoji: '🐴💧', name: '虚弱的小马', ani: 'animate-pulse', clr: 'text-blue-300' };
    if (level === 1) return { emoji: '🐴', name: '可爱小马驹', ani: 'animate-bounce', clr: 'text-orange-800' };
    if (level === 2) return { emoji: '🦄', name: '魔法独角兽', ani: 'animate-bounce', clr: 'text-pink-500' };
    return { emoji: '🦄✨', name: '闪耀天角兽', ani: 'animate-bounce', clr: 'text-purple-500' };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-2xl border-4 border-white overflow-hidden relative">
        {/* 装饰性背景 */}
        <div className="absolute top-0 left-0 w-full h-32 bg-pink-400 opacity-10"></div>

        {/* 顶部标题 */}
        <div className="bg-pink-400 text-white text-center py-5 relative">
          <h1 className="text-2xl font-black tracking-widest">星光小马养成记</h1>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-pink-500 px-4 py-1 rounded-full text-xs font-bold shadow-sm">
            第 {day} 天
          </div>
        </div>

        {/* 消息弹窗 */}
        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-400 text-pink-600 px-6 py-2 rounded-full text-sm font-black z-50 shadow-xl animate-bounce">
            {message}
          </div>
        )}

        <div className="p-8 text-center pt-10">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-yellow-100 border-2 border-yellow-200 text-yellow-700 px-4 py-1 rounded-2xl flex items-center font-black">
              <Star className="w-4 h-4 mr-1 fill-yellow-500" /> {points}
            </div>
            <div className="bg-purple-100 border-2 border-purple-200 text-purple-700 px-4 py-1 rounded-2xl flex items-center font-black">
              <Zap className="w-4 h-4 mr-1 fill-purple-500" /> Lv.{level}
            </div>
          </div>

          <div className="w-40 h-40 bg-gradient-to-br from-pink-50 to-white rounded-full mx-auto flex items-center justify-center border-8 border-pink-100 mb-4 shadow-inner relative">
            <div className={`text-7xl ${pet.ani} drop-shadow-lg`}>{pet.emoji}</div>
          </div>
          <h2 className={`font-black text-2xl mb-6 ${pet.clr}`}>{pet.name}</h2>

          {/* 状态条 */}
          <div className="space-y-4 px-4">
            <div>
              <div className="flex justify-between text-xs font-black text-gray-400 mb-1">
                <span className="flex items-center"><Heart className="w-3 h-3 mr-1 fill-red-400 text-red-400" /> 饱腹度</span>
                <span>{health}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full p-1 shadow-inner">
                <div className={`h-full rounded-full transition-all duration-500 ${health > 30 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${health}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 交互按钮 */}
        <div className="grid grid-cols-2 gap-4 px-6 pb-6">
          <button onClick={feedPet} className="group relative bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center">
            <Utensils className="mb-1" /> 喂食小马
          </button>
          <button onClick={trainMagic} className="group relative bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(147,51,234)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center">
            <Sparkles className="mb-1" /> 学习魔法
          </button>
        </div>

        {/* 任务列表 */}
        <div className="mx-6 mb-6 p-4 bg-pink-50 rounded-[1.5rem] border-2 border-pink-100">
          <h3 className="font-black text-pink-700 text-sm mb-4 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" /> 今日挑战
          </h3>
          {health <= 0 ? (
            <button onClick={restartGame} className="w-full bg-pink-500 text-white py-4 rounded-xl font-black flex items-center justify-center hover:bg-pink-600 transition-colors">
              <RefreshCw className="w-5 h-5 mr-2" /> 点击让小马复活
            </button>
          ) : (
            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t.id} onClick={() => toggleTask(t.id)} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${t.done ? 'bg-white/50 border-transparent opacity-50' : 'bg-white border-white hover:border-pink-300 shadow-sm'}`}>
                  <div className="flex items-center space-x-3">
                    {t.done ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-pink-200" />}
                    <span className={`font-bold text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{t.text}</span>
                  </div>
                  {taskIcons[t.id]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="px-6 pb-8">
          <button onClick={nextDay} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(67,56,202)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center">
            <Moon className="w-5 h-5 mr-2" /> 结束今天，去睡觉
          </button>
        </div>
      </div>
    </div>
  );
}
