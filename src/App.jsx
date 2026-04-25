import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // --- 状态管理 (State) ---
  const [points, setPoints] = useState(0); // 魔法星星（货币）
  const [health, setHealth] = useState(80); // 健康值 (0-100)
  const [magic, setMagic] = useState(0); // 魔法值
  const [level, setLevel] = useState(1); // 等级
  const [day, setDay] = useState(1); // 记录天数
  const [message, setMessage] = useState(''); // 提示信息

  // 每日任务列表
  const initialTasks = [
    { id: 1, text: '听到闹钟立刻起床不赖床', type: 'morning', points: 15, done: false, icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    { id: 2, text: '自己刷牙洗脸换衣服', type: 'morning', points: 10, done: false, icon: <Coffee className="w-5 h-5 text-blue-400" /> },
    { id: 3, text: '自己准备书包和饭盒', type: 'morning', points: 15, done: false, icon: <Star className="w-5 h-5 text-orange-400" /> },
    { id: 4, text: '完成作业/阅读打卡', type: 'day', points: 20, done: false, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
    { id: 5, text: '闹钟响了立刻上床睡觉', type: 'night', points: 20, done: false, icon: <Moon className="w-5 h-5 text-indigo-500" /> },
  ];
  const [tasks, setTasks] = useState(initialTasks);

  // 显示临时提示信息
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // --- 核心逻辑 ---

  // 完成任务
  const toggleTask = (id) => {
    if (health <= 0) return; // 宠物死了不能做任务
    setTasks(tasks.map(task => {
      if (task.id === id && !task.done) {
        setPoints(p => p + task.points);
        showMessage(`太棒了！获得 ${task.points} 颗魔法星星！⭐`);
        return { ...task, done: true };
      }
      return task;
    }));
  };

  // 喂食 (消耗星星，增加健康)
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

  // 学习魔法 (消耗星星，增加魔法值，可能升级)
  const trainMagic = () => {
    if (health <= 0) return;
    if (points >= 20) {
      setPoints(p => p - 20);
      const newMagic = magic + 10;
      setMagic(newMagic);
      
      // 升级逻辑：每50点魔法升一级
      if (newMagic >= level * 50) {
        setLevel(l => l + 1);
        showMessage('✨ 奇迹发生了！小马升级啦！变得更漂亮了！ ✨');
      } else {
        showMessage('咻咻咻！小马的魔法变强了！✨');
      }
    } else {
      showMessage('魔法星星不够哦，小马需要20颗星星才能学习！');
    }
  };

  // 结束今天 (推进时间，降低健康值，重置任务)
  const nextDay = () => {
    if (health <= 0) return;
    // 每天消耗 30 点健康值
    const newHealth = health - 40;
    setHealth(Math.max(0, newHealth));
    setDay(d => d + 1);
    setTasks(initialTasks); // 重置任务状态
    
    if (newHealth <= 0) {
      showMessage('糟糕... 小马饿晕过去了... 😭');
    } else if (newHealth <= 30) {
      showMessage('新的一天开始了！小马肚子好饿，快做任务喂它吧！');
    } else {
      showMessage('新的一天开始了！继续保持好习惯哦！');
    }
  };

  // 重新开始游戏 (复活)
  const restartGame = () => {
    setPoints(0);
    setHealth(80);
    setMagic(0);
    setLevel(1);
    setDay(1);
    setTasks(initialTasks);
    showMessage('神奇的魔法让小马重生了！这次一定要照顾好它哦！');
  };

  // --- UI 渲染辅助 ---

  // 根据等级和健康值决定宠物的样子
  const getPetDisplay = () => {
    if (health <= 0) return { emoji: '🪨', name: '变成石头的宠物', animation: '', color: 'text-gray-500' };
    if (health < 30) {
      if (level === 1) return { emoji: '🐴💧', name: '虚弱的小马驹', animation: 'animate-pulse', color: 'text-blue-300' };
      if (level === 2) return { emoji: '🦄💧', name: '虚弱的独角兽', animation: 'animate-pulse', color: 'text-blue-300' };
      return { emoji: '🦄💧', name: '虚弱的天角兽', animation: 'animate-pulse', color: 'text-blue-300' };
    }
    
    if (level === 1) return { emoji: '🐴', name: '可爱小马驹', animation: 'animate-bounce', color: 'text-orange-800' };
    if (level === 2) return { emoji: '🦄', name: '魔法独角兽', animation: 'animate-bounce', color: 'text-pink-500' };
    if (level === 3) return { emoji: '🦄✨', name: '闪耀天角兽', animation: 'animate-bounce', color: 'text-purple-500' };
    return { emoji: '👑🦄✨🌈', name: '皇家彩虹天角兽', animation: 'animate-bounce', color: 'text-purple-600' };
  };

  const pet = getPetDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 font-sans text-gray-800 p-4 sm:p-6">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-300">
        
        {/* 顶部标题区 */}
        <div className="bg-pink-400 text-white text-center py-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none text-4xl">
            ✨⭐✨⭐✨⭐
          </div>
          <h1 className="text-2xl font-bold tracking-wider relative z-10">🌟 星光小马养成记 🌟</h1>
          <p className="text-sm font-medium opacity-90 relative z-10">第 {day} 天</p>
        </div>

        {/* 宠物展示区 */}
        <div className="p-6 text-center bg-gradient-to-b from-white to-pink-50 relative">
          
          {/* 浮动提示框 */}
          {message && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/90 border-2 border-pink-400 text-pink-600 px-4 py-2 rounded-full shadow-lg text-sm font-bold z-20 animate-fade-in-down">
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

          <div className="relative w-40 h-40 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
            <div className={`text-7xl ${pet.animation} ${pet.color} drop-shadow-md`}>
              {pet.emoji}
            </div>
          </div>
          <h2 className={`text-xl font-bold mb-4 ${health <= 0 ? 'text-gray-500' : 'text-purple-700'}`}>
            {pet.name}
          </h2>

          {/* 状态条 */}
          <div className="space-y-3 px-2">
            {/* 健康条 */}
            <div className="relative">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span className="flex items-center"><Heart className="w-4 h-4 text-red-500 mr-1 fill-current" /> 饱腹度 (健康)</span>
                <span>{health}/100</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${health > 50 ? 'bg-green-400' : health > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
                  style={{ width: `${health}%` }}
                ></div>
              </div>
            </div>

            {/* 魔法条 */}
            <div className="relative">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span className="flex items-center"><Zap className="w-4 h-4 text-purple-500 mr-1 fill-current" /> 魔法值 (升级)</span>
                <span>{magic}/{level * 50}</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-400 transition-all duration-500"
                  style={{ width: `${(magic % 50) / 50 * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-white">
          <button 
            onClick={feedPet}
            disabled={health <= 0}
            className={`py-3 rounded-2xl font-bold flex flex-col items-center justify-center transition-transform active:scale-95 ${health <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm border border-green-200'}`}
          >
            <span className="text-2xl mb-1">🍎</span>
            <span>喂食小马</span>
            <span className="text-xs opacity-70 mt-1">-10 ⭐ | +20 ❤️</span>
          </button>
          
          <button 
            onClick={trainMagic}
            disabled={health <= 0}
            className={`py-3 rounded-2xl font-bold flex flex-col items-center justify-center transition-transform active:scale-95 ${health <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-sm border border-purple-200'}`}
          >
            <span className="text-2xl mb-1">✨</span>
            <span>学习魔法</span>
            <span className="text-xs opacity-70 mt-1">-20 ⭐ | +10 ⚡</span>
          </button>
        </div>

        {/* 任务列表区 */}
        <div className="bg-gray-50 p-4 border-t-2 border-pink-100">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-pink-500" />
            今日好习惯挑战
          </h3>
          
          {health <= 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-gray-600 font-bold mb-4">小马因为太饿变成了石头...</p>
              <button 
                onClick={restartGame}
                className="bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-pink-600 flex items-center mx-auto"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                重新领养一只
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${task.done ? 'bg-pink-50 border-pink-200 opacity-60' : 'bg-white border-pink-100 hover:border-pink-300 shadow-sm'}`}
                >
                  <div className="flex items-center space-x-3">
                    {task.done ? 
                      <CheckCircle className="w-6 h-6 text-pink-500" /> : 
                      <Circle className="w-6 h-6 text-gray-300" />
                    }
                    <div>
                      <p className={`font-bold ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.text}
                      </p>
                      <div className="flex items-center text-xs text-yellow-500 font-bold mt-0.5">
                        <Star className="w-3 h-3 mr-1 fill-current" /> +{task.points} 星星
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-full">
                    {task.icon}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 父母控制/结束一天 */}
        <div className="p-4 bg-gray-100 text-center border-t border-gray-200">
          <button 
            onClick={nextDay}
            disabled={health <= 0}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors ${health <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md'}`}
          >
            <Moon className="w-5 h-5 mr-2" />
            睡觉啦！结束今天
          </button>
          <p className="text-xs text-gray-500 mt-2">点击结束今天，小马会在夜里消耗40点饱腹度哦</p>
        </div>

      </div>
    </div>
  );
}
