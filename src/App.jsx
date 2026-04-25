import React, { useState, useEffect } from 'react';
import { Heart, Star, Zap, CheckCircle, Circle, Sun, Moon, Coffee, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // 任务图标映射表（不存入本地，只用于显示）
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

  // --- 状态管理 ---
  const [points, setPoints] = useState(() => Number(localStorage.getItem('p_pts')) || 0);
  const [health, setHealth] = useState(() => {
    const saved = localStorage.getItem('p_hp');
    return saved !== null ? Number(saved) : 80;
  });
  const [magic, setMagic] = useState(() => Number(localStorage.getItem('p_mg')) || 0);
  const [level, setLevel] = useState(() => Number(localStorage.getItem('p_lv')) || 1);
  const [day, setDay] = useState(() => Number(localStorage.getItem('p_dy')) || 1);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('p_tk');
    return saved ? JSON.parse(saved) : initialTasks;
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
    } else {
      showMessage('星星不够哦！');
    }
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
      } else {
        showMessage('魔法变强了！✨');
      }
    } else {
      showMessage('星星不够哦！');
    }
  };

  const nextDay = () => {
    if (health <= 0) return;
    setHealth(h => Math.max(0, h - 40));
    setDay(d => d + 1);
    setTasks(initialTasks);
    showMessage('新的一天开始了！');
  };

  const restartGame = () => {
    setPoints(0); setHealth(80); setMagic(0); setLevel(1); setDay(1);
    setTasks(initialTasks);
    loca
