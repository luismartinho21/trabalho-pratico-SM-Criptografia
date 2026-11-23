/**
 * BootScene.js
 * Pré-carregamento de assets (tilemaps, spritesheets, áudio) e criação de animações.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Interface visual de carregamento
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x111827, 0.85);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 45, 'A carregar CryptoLumar...', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#00f0ff'
    }).setOrigin(0.5);

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

    // 1. Tilemaps e Tilesets
    this.load.image('tileset', 'assets/images/tileset.png');
    this.load.tilemapTiledJSON('map_level1', 'assets/maps/level1.json');
    this.load.tilemapTiledJSON('map_level2', 'assets/maps/level2.json');

    // 2. Spritesheets
    this.load.spritesheet('player', 'assets/images/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('enemy', 'assets/images/enemy.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('laser', 'assets/images/laser.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // 3. Imagens / Itens
    this.load.image('crypto-key', 'assets/images/key.png');
    this.load.image('data-packet', 'assets/images/data_packet.png');
    this.load.image('terminal', 'assets/images/terminal.png');

    // 4. Efeitos Sonoros
    this.load.audio('snd_pickup', 'assets/audio/pickup.wav');
    this.load.audio('snd_unlock', 'assets/audio/unlock.wav');
    this.load.audio('snd_alarm', 'assets/audio/alarm.wav');
    this.load.audio('snd_click', 'assets/audio/click.wav');
    this.load.audio('snd_complete', 'assets/audio/complete.wav');
  }

  create() {
    // Criação de Animações Globais
    this.anims.create({
      key: 'player_idle',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_pulse',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'laser_glow',
      frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    this.scene.start('MenuScene');
  }
}
