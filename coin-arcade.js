(() => {
  const walletKey = 'mc-clue-credits-v1';
  const games = [
    { id: 'pattern', title: 'Number Pattern', prompt: 'What number comes next? 2, 6, 12, 20, 30, __', answer: '42', reward: 5, detail: 'Look at how much is added each time. The gaps grow by 2.' },
    { id: 'scramble', title: 'Word Scramble', prompt: 'Rearrange these letters to name a planet: N · E · A · P · L · T', answer: 'planet', reward: 5, detail: 'Use all six letters. It is the planet we live on.' },
    { id: 'riddle', title: 'Riddle Room', prompt: 'I have cities but no houses, forests but no trees, and water but no fish. What am I?', answer: 'map', reward: 5, detail: 'You can fold it, carry it, and use it to find places.' }
  ];
  const hintCosts = [3, 5, 7];
  const read = () => Number(localStorage.getItem(walletKey) || 0);
  const write = n => { localStorage.setItem(walletKey, String(n)); document.querySelectorAll('.credit-count').forEach(el => el.textContent = n); };
  const hint = document.querySelector('#hintButton, #case2HintButton, #thirdHintButton');
  const hintStorageKey = hint?.id === 'hintButton' ? 'mc-case-001-hints-v2' : hint?.id === 'case2HintButton' ? 'mc-case-002-hints-v1' : 'mc-case-003-hints-v1';
  const wallet = document.createElement('aside');
  wallet.className = 'credit-arcade';
  const currentHintCost = () => hintCosts[Math.min(Number(localStorage.getItem(hintStorageKey) || 0), hintCosts.length - 1)];
  wallet.innerHTML = `<div class="credit-bar"><span><b><span class="credit-count">${read()}</span> <span class="coin-symbol">◈</span> CLUE CREDITS</b><small class="next-hint-price">${hint && Number(localStorage.getItem(hintStorageKey) || 0) < 3 ? `${currentHintCost()} ◈ NEEDED FOR NEXT HINT` : 'ALL HINTS OPEN'}</small></span><button type="button" class="arcade-open">EVIDENCE ARCADE ↗</button></div><div class="arcade-panel" hidden><div class="arcade-heading"><strong>Solve a mini-game to unlock the next one.</strong><button type="button" class="arcade-close" aria-label="Close arcade">×</button></div><div class="arcade-games"></div></div>`;
  if (hint) document.body.append(wallet);
  const panel = wallet.querySelector('.arcade-panel');
  wallet.querySelector('.arcade-open').addEventListener('click', () => { panel.hidden = !panel.hidden; });
  wallet.querySelector('.arcade-close').addEventListener('click', () => { panel.hidden = true; });
  const gameList = wallet.querySelector('.arcade-games');
  function renderGames() {
    gameList.replaceChildren();
    let previousComplete = true;
    games.forEach(game => {
      const won = localStorage.getItem('mc-arcade-won-' + game.id) === 'true';
      const card = document.createElement('article'); card.className = `arcade-game${won ? ' arcade-game-won' : !previousComplete ? ' arcade-game-locked' : ''}`;
      if (won) {
        card.innerHTML = `<b>${game.title}</b><p>PUZZLE SOLVED</p><small>+${game.reward} ◈ EARNED</small>`;
      } else if (!previousComplete) {
        card.innerHTML = `<b>${game.title}</b><p>LOCKED · SOLVE THE PREVIOUS MINI-GAME FIRST</p>`;
      } else {
        card.innerHTML = `<b>${game.title}</b><p>${game.prompt}</p><label>Your answer <input aria-label="${game.title} answer" autocomplete="off"></label><button type="button">SOLVE · +${game.reward} ◈</button><small class="arcade-feedback" aria-live="polite"></small>`;
        const input = card.querySelector('input'), button = card.querySelector('button'), feedback = card.querySelector('.arcade-feedback');
        button.addEventListener('click', () => {
          if (localStorage.getItem('mc-arcade-won-' + game.id) === 'true') { renderGames(); return; }
          if (input.value.trim().toLowerCase() === game.answer) {
            write(read() + game.reward); localStorage.setItem('mc-arcade-won-' + game.id, 'true'); renderGames();
          } else feedback.textContent = game.detail;
        });
      }
      gameList.append(card);
      previousComplete = previousComplete && won;
    });
    if (games.every(game => localStorage.getItem('mc-arcade-won-' + game.id) === 'true')) {
      const done = document.createElement('p'); done.className = 'arcade-finished'; done.textContent = 'You solved all three mini-games. More games are coming!'; gameList.append(done);
    }
  }
  renderGames();
  window.MysteryCredits = {
    reveal(button, message, hints, index, storageKey) {
      if (index >= Math.min(hints.length, 3)) { message.hidden = false; message.textContent = 'You have opened all three hints for this case.'; wallet.querySelector('.next-hint-price').textContent = 'ALL HINTS OPEN'; return index; }
      const cost = hintCosts[index];
      if (read() < cost) { message.hidden = false; message.textContent = `This hint costs ${cost} ◈. You have ${read()} ◈. Solve a mini-puzzle in the Evidence Arcade to earn more.`; panel.hidden = false; return index; }
      write(read() - cost); message.hidden = false; message.textContent = `HINT ${index + 1} / ${hints.length} · ${hints[index]}`;
      index++; localStorage.setItem(storageKey, String(index)); button.textContent = index >= Math.min(hints.length, 3) ? 'ALL HINTS OPEN ✓' : `OPEN NEXT HINT · ${hintCosts[index]} ◈`;
      wallet.querySelector('.next-hint-price').textContent = index >= 3 ? 'ALL HINTS OPEN' : `${hintCosts[index]} ◈ NEEDED FOR NEXT HINT`;
      return index;
    }
  };
  write(read());
})();
