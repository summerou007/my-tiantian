import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // --- 每日初始任务配置 ---
  const initialTasks = [
    { id: 1, text: '听到闹钟立刻起床不赖床', type: 'morning', points: 15, done: false, icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    { id: 2, text: '自己刷牙洗脸换衣服', type: 'morning', points: 10, done: false, icon: <Coffee className="w-5 h-5 text-blue-400" /> },
    { id: 3, text: '自己准备书包和饭盒', type: 'morning', points: 15, done: false, icon: <Star className="w-5 h-5 text-orange-400" /> },
    { id: 4, text: '完成作业/阅读打卡', type: 'day', points: 20, done: false, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
    { id: 5, text: '闹钟响了立刻上床睡觉', type: 'night', points: 20, done: false, icon: <Moon className="w-5 h-5 text-indigo-500" /> },
  ];

  // --- 状态管理 (使用本地存储初始化) ---
  const [points, setPoints] = useState(() => Number(localStorage.getItem('pony_points')) || 0);
  const [health, setHealth] = useState(() => Number(localStorage.getItem('pony_health')) ?? 80);
  const [magic, setMagic] = useState(() => Number(localStorage.getItem('pony_magic')) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem('pony_level')) || 1);
  const [day, setDay] = useState(() => Number(localStorage.getItem('pony_day')) || 1);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('pony_tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [message, setMessage] = useState('');

  // --- 自动保存逻辑：只要数据变了，就存入浏览器小本本 ---
  useEffect(() => {
    localStorage.setItem('pony_points', points);
    localStorage.setItem('pony_health', health);
    localStorage.setItem('pony_magic', magic);
    localStorage.setItem('pony_level', level);
    localStorage.setItem('pony_day', day);
    localStorage.setItem('pony_tasks', JSON.stringify(tasks));
  }, [points, health, magic, level, day, tasks]);

  // 显示临时提示信息
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // 完成任务
  const toggleTask = (id) => {
    if (health <= 0) return;
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id && !task.done) {
        setPoints(p => p + task.points);
        showMessage(`太棒了！获得 ${task.points} 颗魔法星星！⭐`);
        return { ...task, done: true };
      }
      return task;
    }));
  };

  // 喂食
  const feedPet = () => {
    if (health <= 0) return;
    if (points >= 10) {
      if (health >= 100) {
        showMessage('小马已经吃得很饱啦！(健康值已满)');
        return;
      }
      setPoints(p => p - 10);
      setHealth(h => Math.min(100, h + 20));
      showMessage('吧唧吧唧... 小马恢复了体力！🍎');
    } else {
      showMessage('魔法星星不够哦，快去做任务赚星星吧！');
    }
  };

  // 学习魔法
  const trainMagic = () => {
    if (health <= 0) return;
    if (points >= 20) {
      setPoints(p => p - 20);
      const newMagic = magic + 10;
      setMagic(newMagic);
      if (newMagic >= level * 50) {
        setLevel(l => l + 1);
        showMessage('✨ 奇迹发生了！小马升级啦！ ✨');
      } else {
        showMessage('咻咻咻！小马的魔法变强了！✨');
      }
    } else {
      showMessage('魔法星星不够哦，小马需要20颗星星才能学习！');
    }
  };

  // 结束今天
  const nextDay = () => {
    if (health <= 0) return;
    const newHealth = health - 40;
    setHealth(Math.max(0, newHealth));
    setDay(d => d + 1);
    setTasks(initialTasks);
    if (newHealth <= 0) {
      showMessage('糟糕... 小马饿晕过去了... 😭');
    } else {
      showMessage('新的一天开始了！');
    }
  };

  // 重新开始
  const restartGame = () => {
    setPoints(0); setHealth(80); setMagic(0); setLevel(1); setDay(1);
    setTasks(initialTasks);
    showMessage('小马重生了！这次一定要照顾好它哦！');
  };

  // 根据等级决定宠物的样子 (保持原有逻辑)
  const getPetDisplay = () => {
    if (health <= 0) return { emoji: '🪨', name: '变成石头的宠物', animation: '', color: 'text-gray-500' };
    if (health < 30) return { emoji: '🐴💧', name: '虚弱的小马驹', animation: 'animate-pulse', color: 'text-blue-300' };
    if (level === 1) return { emoji: '🐴', name: '可爱小马驹', animation: 'animate-bounce', color: 'text-orange-800' };
    if (level === 2) return { emoji: '🦄', name: '魔法独角兽', animation: 'animate-bounce', color: 'text-pink-500' };
    return { emoji: '🦄✨', name: '闪耀天角兽', animation: 'animate-bounce', color: 'text-purple-500' };
  };

  const pet = getPetDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-300">
        <div className="bg-pink-400 text-white text-center py-4">
          <h1 className="text-2xl font-bold">🌟 星光小马养成记 🌟</h1>
          <p className="text-sm">第 {day} 天</p>
        </div>

        <div className="p-6 text-center relative">
          {message && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/90 border-2 border-pink-400 text-pink-600 px-4 py-2 rounded-full shadow-lg text-sm font-bold z-20">
              {message}
            </div>
          )}

          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-bold">
              <Star className="w-5 h-5 fill-current" />
              <span>{points}</span>
            </div>
            <div className="flex items-center space-x-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold">
              <Zap className="w-5 h-5 fill-current" />
              <span>Lv.{level}</span>
            </div>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-4 bg-pink-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
            <div className={`text-6xl ${pet.animation}`}>{pet.emoji}</div>
          </div>
          <h2 className="text-xl font-bold text-purple-700 mb-4">{pet.name}</h2>

          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-400" style={{ width: `${health}%` }}></div>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400" style={{ width: `${(magic % 50) / 50 * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <button onClick={feedPet} disabled={health <= 0} className="bg-green-100 p-3 rounded-2xl font-bold text-green-700">🍎 喂食 (-10⭐)</button>
          <button onClick={trainMagic} disabled={health <= 0} className="bg-purple-100 p-3 rounded-2xl font-bold text-purple-700">✨ 魔法 (-20⭐)</button>
        </div>

        <div className="bg-gray-50 p-4 border-t">
          <h3 className="font-bold mb-3">今日任务</h3>
          {health <= 0 ? (
            <button onClick={restartGame} className="w-full bg-pink-500 text-white p-3 rounded-xl font-bold">重新领养小马</button>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center justify-between p-3 rounded-xl border-2 ${task.done ? 'bg-gray-100 opacity-50' : 'bg-white border-pink-100'}`}>
                   <div className="flex items-center space-x-2">
                     {task.done ? <CheckCircle className="text-green-500" /> : <Circle className="text-gray-300" />}
                     <span className={task.done ? 'line-through' : ''}>{task.text}</span>
                   </div>
                   {task.icon}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-100">
          <button onClick={nextDay} disabled={health <= 0} className="w-full bg-indigo-500 text-white p-3 rounded-xl font-bold flex items-center justify-center">
            <Moon className="mr-2" /> 睡觉啦！结束今天
          </button>
        </div>
      </div>
    </div>
  );
}
