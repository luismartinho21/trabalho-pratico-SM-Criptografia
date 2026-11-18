import { gameConfig } from './config.js';

/**
 * main.js
 * Ponto de arranque da aplicação Phaser CryptoLumar.
 */
window.addEventListener('load', () => {
  const game = new Phaser.Game(gameConfig);
  window.CryptoLumarGame = game;
});
