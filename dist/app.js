(function () {
  'use strict';
  const rules = window.EduPlayRules;
  const $ = id => document.getElementById(id);
  const state = { activity: 'colors', group: 1, sizes: { colors: 3, shapes: 3 }, boards: { colors: rules.shuffled(), shapes: rules.shuffled() }, selected: null, moves: { colors: 0, shapes: 0 }, wordIndex: 0, wordAnswered: false, wordsFinished: false };
  let pendingAction = null;
  let completionAction = null;
  function celebrate(title, description, label, action) {
    $('completion-title').textContent = title;
    $('completion-description').textContent = description;
    $('completion-next').textContent = label;
    completionAction = action;
    $('completion-dialog').showModal();
    $('completion-next').focus();
  }
  $('completion-next').addEventListener('click', () => {
    const action = completionAction;
    $('completion-dialog').close();
    if (action) action();
  });
  $('completion-stay').addEventListener('click', () => $('completion-dialog').close());
  const categoryName = (id, mode = state.activity) => mode === 'shapes' ? rules.categories[id].shapeName : rules.categories[id].colorName;
  function shapeElement(id, mode = state.activity) {
    const item = rules.categories[id];
    const el = document.createElement('span');
    el.className = `shape ${item.shape}`;
    el.style.setProperty('--piece-color', mode === 'shapes' ? '#7040c7' : item.color);
    el.setAttribute('aria-hidden', 'true');
    return el;
  }
  function setFeedback(id, text, positive = false) {
    $(id).textContent = text;
    $(id).classList.toggle('positive', positive);
  }
  function renderBoard(focusIndex) {
    const mode = state.activity;
    const board = state.boards[mode];
    const size = state.sizes[mode];
    const correct = rules.correctCount(board);
    $('board-size').value = String(size);
    document.querySelector('.board-panel').style.setProperty('--columns', size);
    document.querySelector('.board-panel').dataset.size = String(size);
    $('total-count').textContent = String(board.length);
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuemax', String(board.length));
    const won = correct === board.length;
    $('sorting-eyebrow').textContent = mode === 'colors' ? 'JOGO DAS LINHAS COLORIDAS' : 'EXPLORAR AS FORMAS';
    $('sorting-title').textContent = mode === 'colors' ? 'Cada cor no seu lugar.' : 'Cada forma no seu lugar.';
    $('sorting-description').textContent = 'Escolha duas peças para trocar de lugar.';
    $('board-instruction').textContent = won ? 'TODAS NO LUGAR!' : state.selected === null ? 'ESCOLHA UMA PEÇA' : 'AGORA, ESCOLHA OUTRA';
    $('correct-count').textContent = String(correct);
    $('progress-fill').style.width = `${correct / board.length * 100}%`;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(correct));
    $('board').replaceChildren();
    board.forEach((id, index) => {
      const button = document.createElement('button');
      button.className = `piece${state.selected === index ? ' selected' : ''}`;
      button.dataset.index = String(index);
      button.setAttribute('aria-label', `${categoryName(id)}, linha ${Math.floor(index / size) + 1}, coluna ${index % size + 1}`);
      button.setAttribute('aria-pressed', String(state.selected === index));
      button.disabled = won;
      button.append(shapeElement(id));
      button.addEventListener('click', () => selectPiece(index));
      $('board').append(button);
    });
    $('guides').replaceChildren();
    rules.categories.slice(0, size).forEach(item => {
      const guide = document.createElement('div');
      guide.className = 'guide';
      guide.style.setProperty('--piece-color', mode === 'shapes' ? '#7040c7' : item.color);
      guide.append(shapeElement(item.id));
      const label = document.createElement('span');
      label.textContent = categoryName(item.id);
      guide.append(label);
      $('guides').append(guide);
    });
    $('sort-success').hidden = !won;
    $('next-activity').textContent = mode === 'colors' ? 'Explorar as formas →' : 'Descobrir palavras →';
    if (focusIndex !== undefined && !won) $('board').children[focusIndex].focus({ preventScroll: true });
    if (won && focusIndex !== undefined) $('next-activity').focus({ preventScroll: true });
  }
  function selectPiece(index) {
    if (!['colors', 'shapes'].includes(state.activity) || !Number.isInteger(index) || index < 0 || index >= state.boards[state.activity].length) throw new Error('Peça inválida.');
    if (rules.correctCount(state.boards[state.activity]) === state.boards[state.activity].length) return;
    if (state.selected === index) {
      state.selected = null;
      setFeedback('sort-feedback', 'Seleção cancelada. Escolha qualquer peça.');
    } else if (state.selected === null) {
      state.selected = index;
      setFeedback('sort-feedback', 'Agora escolha outra peça para fazer a troca.');
    } else {
      state.boards[state.activity] = rules.swap(state.boards[state.activity], state.selected, index);
      state.selected = null;
      state.moves[state.activity]++;
      const won = rules.correctCount(state.boards[state.activity]) === state.boards[state.activity].length;
      setFeedback('sort-feedback', won ? 'Vocês conseguiram! Todas as peças estão no lugar.' : 'Peças trocadas! Observe as guias e continue.', won);
    }
    renderBoard(index);
    if (rules.correctCount(state.boards[state.activity]) === state.boards[state.activity].length) {
      const colors = state.activity === 'colors';
      celebrate('Vocês conseguiram!', `Todas as ${state.boards[state.activity].length} peças estão no lugar. ${colors ? 'As cores' : 'As formas'} ficaram organizadas!`, colors ? 'Explorar as formas →' : 'Descobrir palavras →', () => switchActivity(colors ? 'shapes' : 'words'));
    }
  }
  function switchActivity(activity, moveFocus = true) {
    if (!['colors', 'shapes', 'words', 'writing'].includes(activity)) throw new Error('Atividade inválida.');
    state.activity = activity;
    state.selected = null;
    document.querySelectorAll('[data-activity]').forEach(button => {
      const active = button.dataset.activity === activity;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    $('sorting-section').hidden = !['colors', 'shapes'].includes(activity);
    $('words-section').hidden = activity !== 'words';
    $('writing-section').hidden = activity !== 'writing';
    if (['colors', 'shapes'].includes(activity)) {
      const won = rules.correctCount(state.boards[activity]) === state.boards[activity].length;
      setFeedback('sort-feedback', won ? 'Vocês conseguiram! Todas as peças estão no lugar.' : 'Vamos encontrar a coluna de cada peça?', won);
      renderBoard();
    } else if (activity === 'words') renderWords();
    if (moveFocus) { $('main').focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'auto' }); }
  }
  function renderWords() {
    const category = rules.categories[state.wordIndex];
    $('word-step').textContent = state.wordsFinished ? '3 de 3 · concluído' : `${state.wordIndex + 1} de 3`;
    $('word-swatch').style.background = category.color;
    $('word-swatch').setAttribute('aria-label', `Cor ${category.colorName.toLowerCase()}, representada também por ${category.shapeName.toLowerCase()}`);
    $('word-swatch').replaceChildren(shapeElement(category.id));
    $('word-swatch').firstChild.style.setProperty('--piece-color', '#fff');
    $('word-options').replaceChildren();
    [2, 0, 1].forEach(id => {
      const button = document.createElement('button');
      button.className = 'word-option';
      button.textContent = rules.categories[id].colorName;
      button.dataset.wordId = String(id);
      button.disabled = state.wordAnswered;
      if (state.wordAnswered && id === state.wordIndex) button.classList.add('correct');
      button.addEventListener('click', () => answerWord(id));
      $('word-options').append(button);
    });
    $('words-success').hidden = !state.wordsFinished;
    $('next-word').hidden = !state.wordAnswered;
    $('next-word').textContent = state.wordsFinished ? 'Experimentar a escrita →' : 'Próxima cor →';
    setFeedback('word-feedback', state.wordsFinished ? 'Vocês descobriram as três palavras! Vamos experimentar a escrita?' : state.wordAnswered ? `Isso! ${category.colorName} é o nome desta cor.` : 'A professora pode ler as opções com vocês.', state.wordAnswered);
  }
  function answerWord(id) {
    if (!Number.isInteger(id) || id < 0 || id > 2 || state.activity !== 'words') throw new Error('Opção inválida.');
    if (state.wordAnswered) return;
    if (id === state.wordIndex) {
      state.wordAnswered = true;
      state.wordsFinished = state.wordIndex === 2;
      renderWords();
      $('next-word').focus({ preventScroll: true });
      if (state.wordsFinished) celebrate('Três palavras descobertas!', 'AZUL, AMARELO e VERMELHO: vocês encontraram o nome de cada cor!', 'Experimentar a escrita →', () => switchActivity('writing'));
    } else {
      document.querySelectorAll('.word-option').forEach(button => button.classList.toggle('try-again', Number(button.dataset.wordId) === id));
      setFeedback('word-feedback', 'Vamos olhar de novo? Peça à professora para ler as opções.');
    }
  }
  function confirmAction(title, description, label, action) {
    pendingAction = action;
    $('confirm-title').textContent = title;
    $('confirm-description').textContent = description;
    $('confirm-ok').textContent = label;
    $('confirm-dialog').showModal();
    $('confirm-cancel').focus();
  }
  function resetGroup() {
    state.group++;
    state.boards = { colors: rules.shuffled(state.sizes.colors), shapes: rules.shuffled(state.sizes.shapes) };
    $('writing-chosen').hidden = true;
    state.moves = { colors: 0, shapes: 0 };
    state.wordIndex = 0;
    state.wordAnswered = false;
    state.wordsFinished = false;
    $('writing-input').value = '';
    document.querySelectorAll('[data-prompt]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    setFeedback('writing-feedback', 'Aqui, cada tentativa é uma descoberta.');
    $('group-tag').textContent = `GRUPO ${state.group}`;
    switchActivity('colors');
  }
  document.querySelectorAll('[data-activity]').forEach(button => button.addEventListener('click', () => switchActivity(button.dataset.activity)));
  $('next-activity').addEventListener('click', () => switchActivity(state.activity === 'colors' ? 'shapes' : 'words'));
  $('shuffle').addEventListener('click', () => confirmAction('Misturar as peças?', 'Este tabuleiro vai recomeçar. As outras atividades continuam como estão.', 'Sim, misturar', () => {
    state.boards[state.activity] = rules.shuffled(state.sizes[state.activity]); state.moves[state.activity] = 0; state.selected = null;
    setFeedback('sort-feedback', 'Uma nova mistura! Vamos tentar juntos?'); renderBoard(0);
  }));
  $('board-size').addEventListener('change', () => {
    const size = Number($('board-size').value);
    state.boards[state.activity] = rules.shuffled(size);
    state.sizes[state.activity] = size; state.selected = null; state.moves[state.activity] = 0;
    setFeedback('sort-feedback', `Novo tabuleiro: ${size} linhas e ${size} colunas. Vamos organizar?`); renderBoard();
  });
  $('restart-words').addEventListener('click', () => {
    state.wordIndex = 0; state.wordAnswered = false; state.wordsFinished = false;
    renderWords(); $('word-options').firstChild.focus();
  });
  $('next-word').addEventListener('click', () => {
    if (state.wordsFinished) switchActivity('writing');
    else if (state.wordAnswered) { state.wordIndex++; state.wordAnswered = false; renderWords(); $('word-options').firstChild.focus(); }
  });
  document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-prompt]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('writing-chosen').hidden = false;
    $('writing-model').textContent = button.dataset.prompt;
    setFeedback('writing-feedback', `Sua ideia é ${button.dataset.prompt}. Experimente escrever do seu jeito.`);
    $('writing-input').focus();
  }));
  $('writing-input').addEventListener('input', () => setFeedback('writing-feedback', 'Experimente as letras do seu jeito. A professora pode ajudar.'));
  $('finish-writing').addEventListener('click', () => setFeedback('writing-feedback', $('writing-input').value.trim() ? 'Obrigado por compartilhar sua escrita! Conte à professora o que você escreveu.' : 'Experimente uma letra ou faça seu registro no papel com a professora.', Boolean($('writing-input').value.trim())));
  $('clear-writing').addEventListener('click', () => {
    if (!$('writing-input').value) { $('writing-input').focus(); return; }
    confirmAction('Limpar a escrita?', 'O que está escrito será apagado para uma nova tentativa.', 'Sim, limpar', () => { $('writing-input').value = ''; setFeedback('writing-feedback', 'Tudo pronto para uma nova descoberta.'); $('writing-input').focus(); });
  });
  function requestNewGroup() {
    if ($('teacher-dialog').open) $('teacher-dialog').close();
    confirmAction('Começar outro grupo?', 'Os jogos e a escrita serão reiniciados. Nenhum registro desta sessão será guardado.', 'Sim, novo grupo', resetGroup);
  }
  $('next-group').addEventListener('click', requestNewGroup);
  $('teacher-new-group').addEventListener('click', requestNewGroup);
  $('open-help').addEventListener('click', () => $('help-dialog').showModal());
  $('open-teacher').addEventListener('click', () => $('teacher-dialog').showModal());
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $('confirm-cancel').addEventListener('click', () => $('confirm-dialog').close());
  $('confirm-ok').addEventListener('click', () => {
    const action = pendingAction; pendingAction = null; $('confirm-dialog').close(); if (action) action();
  });
  $('confirm-dialog').addEventListener('close', () => { pendingAction = null; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.querySelector('dialog[open]') && state.selected !== null) { const index = state.selected; state.selected = null; renderBoard(index); setFeedback('sort-feedback', 'Seleção cancelada. Escolha qualquer peça.'); }
  });
  switchActivity('colors', false);

  // Integração opcional. Navegadores comuns ignoram este bloco.
  const context = document.modelContext;
  if (context && typeof context.registerTool === 'function') {
    const lifecycle = new AbortController();
    const registrations = [{
      name: 'eduplay_read_activity', title: 'Consultar atividade do EduPlay',
      description: 'Lê a atividade e o tabuleiro visíveis, sem revelar ou guardar o texto escrito pela criança.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true }, execute(input) {
        if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('A consulta não aceita parâmetros.');
        return { activity: state.activity, group: state.group, board: ['colors', 'shapes'].includes(state.activity) ? state.boards[state.activity].slice() : null };
      }
    }, {
      name: 'eduplay_open_activity', title: 'Abrir atividade do EduPlay',
      description: 'Muda a atividade visível, preservando as respostas e o tabuleiro. Não resolve a atividade.',
      inputSchema: { type: 'object', properties: { activity: { type: 'string', enum: ['colors', 'shapes', 'words', 'writing'] } }, required: ['activity'], additionalProperties: false },
      annotations: { readOnlyHint: false }, execute(input) {
        if (!input || typeof input !== 'object' || Object.keys(input).some(k => k !== 'activity')) throw new Error('Parâmetros inválidos.');
        if (document.querySelector('dialog[open]')) throw new Error('Feche a janela aberta antes de mudar de atividade.');
        switchActivity(input.activity); return { activity: state.activity };
      }
    }];
    for (const tool of registrations) {
      try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch (_) { /* A integração é opcional. */ }
    }
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }
})();
