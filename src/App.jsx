function applyDamage(dmg) {
    const currentIdx = villainIdxRef.current;
    const currentHp = villainHpRef.current;
    const newHp = Math.max(0, currentHp - dmg);
    setVillainHp(newHp);
    villainHpRef.current = newHp;
    
    // 💥 新增：生成伤害飘字！
    const popupId = Date.now();
    setDamagePopups(prev => [...prev, { id: popupId, val: dmg }]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== popupId));
    }, 800); // 0.8秒后文字消失

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
          setVillainHp(VILLAINS[nextIdx].hp);
          villainHpRef.current = VILLAINS[nextIdx].hp;
          toast('⚔️ 打败了' + v.name + '！新敌人：' + VILLAINS[nextIdx].name + '！');
        }
      }, 600);
    }
  }
