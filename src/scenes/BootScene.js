/**
 * BootScene.js
 * Pré-carregamento de assets e criação de texturas e paletas visuais.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Barra de progresso visual de carregamento
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'A carregar CryptoLumar...', {
      font: '16px monospace',
      color: '#00f0ff'
    }).setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00f0ff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Criação programática de texturas base para arranque imediato
    this.createProceduralTextures();
  }

  createProceduralTextures() {
    // 1. Textura do Jogador (Criptógrafo)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x00f0ff, 1);
    playerGraphics.fillRoundedRect(0, 0, 32, 32, 6);
    playerGraphics.fillStyle(0x0a192f, 1);
    playerGraphics.fillRect(6, 6, 20, 10); // Visor
    playerGraphics.fillStyle(0x38ef7d, 1);
    playerGraphics.fillCircle(12, 11, 2);
    playerGraphics.fillCircle(20, 11, 2);
    playerGraphics.generateTexture('player', 32, 32);

    // 2. Textura do Inimigo / Sentinela
    const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    enemyGraphics.fillStyle(0xff0055, 1);
    enemyGraphics.fillTriangle(16, 0, 32, 32, 0, 32);
    enemyGraphics.fillStyle(0xffffff, 1);
    enemyGraphics.fillCircle(16, 18, 4);
    enemyGraphics.generateTexture('enemy', 32, 32);

    // 3. Chave Criptográfica Simétrica
    const keyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    keyGraphics.fillStyle(0xffd700, 1);
    keyGraphics.fillCircle(12, 12, 8);
    keyGraphics.fillRect(10, 14, 4, 12);
    keyGraphics.fillRect(14, 20, 5, 3);
    keyGraphics.generateTexture('crypto-key', 24, 28);

    // 4. Barreira Laser Cifrada
    const laserGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    laserGraphics.fillStyle(0xff0033, 0.85);
    laserGraphics.fillRect(0, 0, 96, 16);
    laserGraphics.lineStyle(2, 0xffffff, 1);
    laserGraphics.strokeRect(0, 0, 96, 16);
    laserGraphics.generateTexture('laser-barrier', 96, 16);

    // 5. Pacote de Dados (Data Shard)
    const dataGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    dataGraphics.fillStyle(0x00ff88, 1);
    dataGraphics.fillRoundedRect(0, 0, 24, 24, 4);
    dataGraphics.fillStyle(0x000000, 0.6);
    dataGraphics.fillRect(4, 8, 16, 8);
    dataGraphics.generateTexture('data-packet', 24, 24);

    // 6. Terminal de Extração / Saída
    const exitGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    exitGraphics.fillStyle(0x7928ca, 1);
    exitGraphics.fillCircle(24, 24, 22);
    exitGraphics.lineStyle(3, 0x00f0ff, 1);
    exitGraphics.strokeCircle(24, 24, 22);
    exitGraphics.generateTexture('exit-terminal', 48, 48);
  }

  create() {
    this.scene.start('MenuScene');
  }
}
