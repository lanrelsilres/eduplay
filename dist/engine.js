/* Regras independentes da interface. Sem dependências ou acesso à rede. */
(function (root) {
  'use strict';
  const categories = Object.freeze([
    Object.freeze({ id: 0, color: '#2560df', colorName: 'AZUL', shape: 'circle', shapeName: 'CÍRCULO' }),
    Object.freeze({ id: 1, color: '#f7c62f', colorName: 'AMARELO', shape: 'triangle', shapeName: 'TRIÂNGULO' }),
    Object.freeze({ id: 2, color: '#df5046', colorName: 'VERMELHO', shape: 'square', shapeName: 'QUADRADO' }),
    Object.freeze({ id: 3, color: '#218653', colorName: 'VERDE', shape: 'diamond', shapeName: 'LOSANGO' })
  ]);
  function validBoard(board) {
    if (!Array.isArray(board)) return false;
    const size = Math.sqrt(board.length);
    return [2, 3, 4].includes(size) && categories.slice(0, size).every(c => board.filter(x => x === c.id).length === size);
  }
  function correctCount(board) {
    if (!validBoard(board)) throw new Error('Tabuleiro inválido.');
    return board.reduce((total, id, index) => total + Number(id === index % Math.sqrt(board.length)), 0);
  }
  function swap(board, first, second) {
    if (!validBoard(board) || ![first, second].every(i => Number.isInteger(i) && i >= 0 && i < board.length)) throw new Error('Troca inválida.');
    const result = board.slice();
    [result[first], result[second]] = [result[second], result[first]];
    return result;
  }
  function shuffled(size = 3, random = Math.random) {
    if (![2, 3, 4].includes(size)) throw new Error('Tamanho inválido.');
    const board = Array.from({ length: size * size }, (_, i) => i % size);
    for (let i = board.length - 1; i > 0; i--) {
      const value = random();
      if (!Number.isFinite(value) || value < 0 || value >= 1) throw new Error('Sorteio inválido.');
      const j = Math.floor(value * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
    if (correctCount(board) === board.length) return swap(board, 0, 1);
    return board;
  }
  const api = { categories, validBoard, correctCount, swap, shuffled };
  root.EduPlayRules = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
