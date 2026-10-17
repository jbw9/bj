(() => {
  const $ = (id) => document.getElementById(id);
  const label = (r) => (r === 1 ? 'A' : String(r));
  const value = (r) => (r >= 2 && r <= 6 ? 1 : r >= 7 && r <= 9 ? 0 : -1);

  let cards = [];
  let decks = 6;
  try {
    cards = JSON.parse(localStorage.getItem('bj.cards')) || [];
    decks = Number(localStorage.getItem('bj.decks')) || 6;
  } catch {}
  $('decks').value = String(decks);

  function render() {
    const rc = cards.reduce((s, r) => s + value(r), 0);
    const remaining = Math.max(0.5, decks - cards.length / 52);
    const run = $('running');
    run.textContent = rc > 0 ? '+' + rc : String(rc);
    run.className = rc > 0 ? 'pos' : rc < 0 ? 'neg' : '';
    $('true').textContent = (rc / remaining).toFixed(1);
    $('seen').textContent = cards.length;
    $('last').textContent = cards.slice(-12).map(label).join(' ');
    try {
      localStorage.setItem('bj.cards', JSON.stringify(cards));
      localStorage.setItem('bj.decks', String(decks));
    } catch {}
  }

  function flash(r) {
    const b = document.querySelector(`.pad [data-r="${r}"]`);
    if (!b) return;
    b.classList.add('flash');
    setTimeout(() => b.classList.remove('flash'), 120);
  }

  window.addCard = (r) => {
    if (!(r >= 1 && r <= 10)) return;
    cards.push(r);
    flash(r);
    render();
  };
  window.undoCard = () => { cards.pop(); render(); };
  window.setVoiceState = (state, message) => {
    const mic = $('mic');
    mic.classList.toggle('on', state === 'listening');
    mic.classList.toggle('err', state === 'error');
    mic.textContent = state === 'listening' ? '🎤 Listening…' : '🎤 Voice';
    if (message) $('hint').textContent = message;
  };

  const newShoe = () => { cards = []; render(); };

  $('pad').addEventListener('click', (e) => {
    const r = e.target.dataset && e.target.dataset.r;
    if (r) window.addCard(Number(r));
  });
  $('undo').addEventListener('click', () => window.undoCard());
  $('reset').addEventListener('click', newShoe);
  $('decks').addEventListener('change', (e) => { decks = Number(e.target.value); render(); });

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.tagName === 'SELECT') return;
    const k = e.key.toLowerCase();
    if (k >= '1' && k <= '9') window.addCard(Number(k));
    else if (k === '0' || k === 't' || k === 'j' || k === 'q' || k === 'k') window.addCard(10);
    else if (k === 'a') window.addCard(1);
    else if (k === 'backspace' || k === 'z' || k === 'u') window.undoCard();
    else if (k === 'n') newShoe();
    else if (k === 'v') $('mic').click();
    else return;
    e.preventDefault();
  });

  render();
})();
