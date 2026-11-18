import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { InstructionsScene } from './scenes/InstructionsScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

/**
 * config.js
 * Configuração global do Phaser com motor Arcade Physics.
 */
export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 520,
  backgroundColor: '#070b14',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // Jogo top-down / sem gravidade vertical
      debug: false
    }
  },
  scene: [
    BootScene,
    MenuScene,
    InstructionsScene,
    GameScene,
    GameOverScene
  ]
};
