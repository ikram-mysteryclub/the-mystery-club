(() => {
  const walletKey = 'mc-clue-credits-v1';
  const games = [
    { id: 'cipher', title: 'The Salt Cipher', prompt: 'A note says each letter moved one place forward. Decode FBTZ. What word was meant?', answer: 'easy', reward: 5, detail: 'Shift each letter back one place.' },
    { id: 'timeline', title: 'The Broken Timeline', prompt: 'The photograph was taken at 1:46. The booth was sealed at 1:48. It uploaded at 2:13. Was it taken before or after the room was sealed?', answer: 'before', reward: 5, detail: 'Compare the capture time (1:46) with the seal time (1:48).' },
    { id: 'tide', title: 'The Tide Relay', prompt: 'The tape was recorded first. Low tide closed the circuit at 12:07, then the voice played. Which triggered the playback: the tide or the bell?', answer: 'tide', reward: 5, detail: 'The tide closes the circuit; the bell only helps you notice the pattern.' }
  ];
  const read = () => Number(localStorage.getItem(walletKey) || 0);
  const write = n => { localStorage.setItem(walletKey, String(n)); document.querySelectorAll('.credit-count').forEach(el => el.textContent = n); };
  const wallet = document.createElement('aside');
  wallet.className = 'credit-arcade';
  wallet.innerHTML = `<div class="credit-bar"><span><b><span class="credit-count">${read()}</span> <span class="coin-symbol">◈</span> CLUE CREDITS</b><small>3 ◈ NEEDED PER HINT</small></span><button type="button" class="arcade-open">EVIDENCE ARCADE ↗</button></div><div class="arcade-panel" hidden><div class="arcade-heading"><strong>Earn credits by solving a mini-puzzle.</strong><button type="button" class="arcade-close" aria-label="Close arcade">×</button></div><div class="arcade-games"></div></div>`;
  const hint = document.querySelector('#hintButton, #case2HintButton, #thirdHintButton');
  if (hint) document.body.append(wallet);
  const panel = wallet.querySelector('.arcade-panel');
  wallet.querySelector('.arcade-open').addEventListener('click', () => { panel.hidden = !panel.hidden; });
  wallet.querySelector('.arcade-close').addEventListener('click', () => { panel.hidden = true; });
  const gameList = wallet.querySelector('.arcade-games');
  games.forEach(game => {
    const card = document.createElement('article'); card.className = 'arcade-game';
    const won = localStorage.getItem('mc-arcade-won-' + game.id) === 'true';
    card.innerHTML = `<b>${game.title}</b><p>${game.prompt}</p><label>Your deduction <input aria-label="${game.title} answer" autocomplete="off"></label><button type="button" ${won ? 'disabled' : ''}>${won ? 'CREDITS EARNED ✓' : `SOLVE · +${game.reward} ◈`}</button><small class="arcade-feedback">${won ? `Solved · +${game.reward} credits` : ''}</small>`;
    const input = card.querySelector('input'), button = card.querySelector('button'), feedback = card.querySelector('.arcade-feedback');
    button.addEventListener('click', () => {
      if (input.value.trim().toLowerCase() === game.answer) {
        write(read() + game.reward); localStorage.setItem('mc-arcade-won-' + game.id, 'true'); button.disabled = true; button.textContent = 'CREDITS EARNED ✓'; feedback.textContent = `Correct deduction · +${game.reward} ◈`;
      } else feedback.textContent = game.detail;
    });
    gameList.append(card);
  });
  window.MysteryCredits = {
    reveal(button, message, hints, index, storageKey) {
      if (index >= hints.length) { message.hidden = false; message.textContent = 'All three gradual hints have been opened.'; return index; }
      const cost = 3;
      if (read() < cost) { message.hidden = false; message.textContent = `This hint costs ${cost} ◈. You have ${read()} ◈. Solve a mini-puzzle in the Evidence Arcade to earn more.`; panel.hidden = false; return index; }
      write(read() - cost); message.hidden = false; message.textContent = `HINT ${index + 1} / ${hints.length} · ${hints[index]}`;
      index++; localStorage.setItem(storageKey, String(index)); button.textContent = index >= hints.length ? 'ALL HINTS OPEN ✓' : `OPEN NEXT HINT · 3 ◈`;
      return index;
    }
  };
  write(read());
})();
