import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // 图标映射
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

  // --- 安全读取数据的函数 (防止崩溃的关键) ---
  const getSaved = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return defaultValue;
      const parsed = JSON.parse(saved);
      // 检查如果是任务列表，里面是否包含坏掉的对象
      if (key === 'p_tk' && Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0].icon !== 'undefined') {
          return defaultValue; // 发现旧版坏数据，直接重置
        }
      }
      return parsed;
    } catch (e) {
      return defaultValue; // 出错直接重置
    }
  };

  // --- 状态管理 ---
  const [points, setPoints] = useState(() => getSaved('p_pts', 0));
  const [health, setHealth] = useState(() => getSaved('p_hp', 80));
  const [magic, setMagic] = useState(() => getSaved('p_mg', 0));
  const [level, setLevel] = useState(() => getSaved('p_lv', 1));
  const [day, setDay] = useState(() => getSaved('p_dy', 1));
  const [tasks, setTasks] = useState(() => getSaved('p_tk', initialTasks));
  const [message, setMessage] = useState('');

  // --- 自动保存 ---
  useEffect(() => {
    localStorage.setItem('p_pts', JSON.stringify(points));
    localStorage.setItem('p_hp', JSON.stringify(health));
    localStorage.setItem('p_mg', JSON.stringify(magic));
    localStorage.setItem('p_lv', JSON.stringify(level));
    localStorage.setItem('p_dy', JSON.stringify(day));
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
        showMessage(`获得 ${t.points} 颗魔法星星！⭐`);
        return { ...t, done: true };
      }
      return t;
    }));
  };

  const feedPet = () => {
    if (health <= 0) return;
    if (points >= 10) {
      if (health >= 100) return showMessage('小马已经很饱啦！');
      setPoints(p => p - 10);
      setHealth(h => Math.min(100, h + 20));
      showMessage('小马恢复了体力！🍎');
    } else { showMessage('星星不够哦！'); }
  };

  const trainMagic = () => {
    if (health <= 0) return;
    if (points >= 20) {
      setPoints(p => p - 20);
      const newMg = magic + 10;
      setMagic(newMg);
      if (newMg >= level * 50) {
        setLevel(l => l + 1);
        showMessage('✨ 小马升级了！ ✨');
      } else { showMessage('魔法变强了！✨'); }
    } else { showMessage('星星不够哦！'); }
  };

  const nextDay = () => {
    if (health <= 0) return;
    setHealth(h => Math.max(0, h - 40));
    setDay(d => d + 1);
    setTasks(initialTasks);
    showMessage('新的一天开始了！');
  };

  const restartGame = () => {
    localStorage.clear();
    window.location.reload(); // 彻底刷新
  };

  const pet = (() => {
    if (health <= 0) return { emoji: '🪨', name: '变成石头的宠物', ani: '', clr: 'text-gray-500' };
    if (health < 30) return { emoji: '🐴💧', name: '虚弱的小马', ani: 'animate-pulse', clr: 'text-blue-300' };
    if (level === 1) return { emoji: '🐴', name: '可爱小马驹', ani: 'animate-bounce', clr: 'text-orange-800' };
    if (level === 2) return { emoji: '🦄', name: '魔法独角兽', ani: 'animate-bounce', clr: 'text-pink-500' };
    return { emoji: '🦄✨', name: '闪耀天角兽', ani: 'animate-bounce', clr: 'text-purple-500' };
  })();

  return (
    <div className="min-h-screen bg-pink-50 p-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg border-4 border-pink-200 overflow-hidden">
        <div className="bg-pink-400 text-white text-center py-3">
          <h1 className="text-xl font-bold">星光小马养成记</h1>
          <p className="text-xs">第 {day} 天</p>
        </div>

        <div className="p-6 text-center relative">
          {message && <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-pink-600 text-white px-4 py-1 rounded-full text-sm z-50 shadow-md">{message}</div>}
          <div className="flex justify-between mb-4">
            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">⭐ {points}</div>
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">Lv.{level}</div>
          </div>
          <div className="w-32 h-32 bg-pink-50 rounded-full mx-auto flex items-center justify-center border-4 border-white mb-2 shadow-inner">
            <div className={`text-6xl ${pet.ani}`}>{pet.emoji}</div>
          </div>
          <h2 className="font-bold text-lg mb-4 text-purple-700">{pet.name}</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-400"><span>饱腹度</span><span>{health}%</span></div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 transition-all" style={{ width: `${health}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4">
          <button onClick={feedPet} className="bg-green-500 text-white p-3 rounded-xl font-bold active:scale-95 shadow-md">🍎 喂食</button>
          <button onClick={trainMagic} className="bg-purple-500 text-white p-3 rounded-xl font-bold active:scale-95 shadow-md">✨ 魔法</button>
        </div>

        <div className="p-4 bg-gray-50">
          <h3 className="font-bold text-sm mb-3">今日好习惯：</h3>
          {health <= 0 ? (
            <button onClick={restartGame} className="w-full bg-gray-500 text-white p-3 rounded-xl font-bold">小马变石头了，点此重来</button>
          ) : (
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.id} onClick={() => toggleTask(t.id)} className={`flex items-center justify-between p-3 rounded-xl border bg-white cursor-pointer ${t.done ? 'opacity-40' : 'hover:border-pink-300'}`}>
                  <div className="flex items-center space-x-2">
                    {t.done ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-200" />}
                    <span className={`text-sm ${t.done ? 'line-through' : ''}`}>{t.text}</span>
                  </div>
                  {taskIcons[t.id]}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <button onClick={nextDay} className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold shadow-md active:scale-95">结束今天 (消耗饱腹度)</button>
        </div>
      </div>
    </div>
  );
}
