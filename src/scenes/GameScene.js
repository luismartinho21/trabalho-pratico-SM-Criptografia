import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { XorCipher } from '../crypto/XorCipher.js';
import { HashVerifier } from '../crypto/HashVerifier.js';

/**
 * GameScene.js
 * Cena de jogabilidade com Tilemaps, Arcade Physics, animações e efeitos sonoros.
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.currentLevel = data.level || 1;
    this.score = data.score || 0;
    this.lives = data.lives !== undefined ? data.lives : 3;
    this.hasAuthenticData = false;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 1. Carregamento e renderização do Tilemap
    const mapKey = this.currentLevel === 1 ? 'map_level1' : 'map_level2';
    this.map = this.make.tilemap({ key: mapKey });
    const tileset = this.map.addTilesetImage('cyber_tileset', 'tileset');

    this.groundLayer = this.map.createLayer('Ground', tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('Walls', tileset, 0, 0);

    // Ativar colisão em todos os tiles de parede marcados
    this.wallsLayer.setCollisionByProperty({ collides: true });

    // 2. Grupos de Física Arcade
    this.keysGroup = this.physics.add.group();
    this.barriersGroup = this.physics.add.staticGroup();
    this.packetsGroup = this.physics.add.group();
    this.enemiesGroup = this.physics.add.group();

    // 3. Inicialização do Jogador
    const startX = 64;
    const startY = height - 80;
    this.player = new Player(this, startX, startY);
    this.player.lives = this.lives;
    this.player.score = this.score;

    // Colisão do jogador com as paredes do mapa
    this.physics.add.collider(this.player, this.wallsLayer);

    // 4. Controlos
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // 5. Configuração específica do Nível
    if (this.currentLevel === 1) {
      this.setupLevel1();
    } else {
      this.setupLevel2();
    }

    // 6. Terminal de Extração (Saída)
    this.exitTerminal = this.physics.add.staticSprite(720, 80, 'terminal');
    this.physics.add.overlap(this.player, this.exitTerminal, this.handleExitReached, null, this);

    // 7. Colisões com Inimigos e Barreiras
    this.physics.add.overlap(this.player, this.enemiesGroup, this.handleEnemyCollision, null, this);
    this.physics.add.collider(this.enemiesGroup, this.wallsLayer);

    // 8. Interface HUD e Áudio
    this.setupHUD();
  }

  setupLevel1() {
    // NÍVEL 1: Cifra Simétrica por Máscara XOR
    const cipherData = XorCipher.generateRandomCipher(3);
    this.activeCipher = cipherData;

    // Barreira Laser animada na passagem estratégica do mapa
    const barrierY = 336;
    const barrier = this.barriersGroup.create(432, barrierY, 'laser');
    barrier.play('laser_glow');
    barrier.cipherValue = cipherData.cipherValue;
    barrier.activeState = true;
    barrier.refreshBody();

    this.barrierLabel = this.add.text(432, barrierY - 26, `FIREWALL [0b${cipherData.binaryString}]`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ff0055',
      backgroundColor: '#0a0f1d',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    // Colisão com barreira
    this.physics.add.collider(this.player, this.barriersGroup, () => {
      this.statusText.setText(`Aviso: Barreira laser ativa! Necessita da Chave XOR correta.`);
    });

    // Posicionamento da Chave Criptográfica na sala superior esquerda
    const cryptoKey = this.keysGroup.create(144, 144, 'crypto-key');
    cryptoKey.keyValue = cipherData.keyValue;

    // Efeito de flutuação na chave
    this.tweens.add({
      targets: cryptoKey,
      y: 138,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Recolha da chave
    this.physics.add.overlap(this.player, this.keysGroup, (player, keyItem) => {
      this.sound.play('snd_pickup', { volume: 0.7 });
      this.player.collectedKeys.push(keyItem.keyValue);
      keyItem.destroy();
      this.player.addScore(150);
      this.updateHUD();
      this.statusText.setText(`Chave simétrica adquirida (0b${cipherData.binaryString})! Pressione [ESPAÇO] junto à Firewall.`);
    });

    // Patrulhas Sentinelas
    const sentry1 = new Enemy(this, 300, 430, 90, false);
    const sentry2 = new Enemy(this, 620, 260, 110, true);
    this.enemiesGroup.add(sentry1);
    this.enemiesGroup.add(sentry2);
  }

  setupLevel2() {
    // NÍVEL 2: Verificação de Integridade por Função Hash
    this.targetPacket = HashVerifier.generatePacket('01', false);
    this.tamperedPacket = HashVerifier.generatePacket('02', true);

    const positions = [
      { x: 176, y: 144 },
      { x: 528, y: 368 }
    ];
    Phaser.Utils.Array.Shuffle(positions);

    // Pacote autêntico
    const p1 = this.packetsGroup.create(positions[0].x, positions[0].y, 'data-packet');
    p1.packetData = this.targetPacket;

    // Pacote corrompido
    const p2 = this.packetsGroup.create(positions[1].x, positions[1].y, 'data-packet');
    p2.packetData = this.tamperedPacket;

    // Animação de flutuação nos pacotes
    this.tweens.add({
      targets: [p1, p2],
      y: '+=6',
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    this.physics.add.overlap(this.player, this.packetsGroup, (player, packetSprite) => {
      const data = packetSprite.packetData;
      const isValid = HashVerifier.verifyIntegrity(data.payload, data.declaredHash);

      if (isValid) {
        this.sound.play('snd_unlock', { volume: 0.8 });
        this.player.addScore(300);
        this.statusText.setText(`SUCESSO: Pacote autêntico [Hash #${data.declaredHash}] validado! Siga para a extração.`);
        this.hasAuthenticData = true;
      } else {
        this.sound.play('snd_alarm', { volume: 0.8 });
        this.player.takeDamage(1);
        this.statusText.setText(`ALERTA: Pacote ADULTERADO por Man-in-the-Middle! Hash incorreto (-1 Vida).`);
      }

      packetSprite.destroy();
      this.updateHUD();
      if (this.player.lives <= 0) {
        this.triggerGameOver(false);
      }
    });

    // Sentinelas do Nível 2
    const sentry1 = new Enemy(this, 300, 224, 110, false);
    const sentry2 = new Enemy(this, 560, 224, 110, true);
    sentry1.speed = 105;
    sentry2.speed = 105;
    this.enemiesGroup.add(sentry1);
    this.enemiesGroup.add(sentry2);
  }

  setupHUD() {
    this.hudText = this.add.text(16, 12, '', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#00f0ff',
      backgroundColor: '#0a0f1d',
      padding: { x: 6, y: 3 }
    });

    this.statusText = this.add.text(16, 38, 'Missão iniciada. Explore os corredores e resolva o desafio criptográfico.', {
      fontFamily: 'sans-serif',
      fontSize: '11px',
      color: '#cbd5e1',
      backgroundColor: '#0a0f1d',
      padding: { x: 6, y: 2 }
    });

    this.updateHUD();
  }

  updateHUD() {
    let cryptoInfo = '';
    if (this.currentLevel === 1) {
      cryptoInfo = `Chave XOR: ${this.player.collectedKeys.length > 0 ? 'ADQUIRIDA' : 'EM FALTA'}`;
    } else {
      cryptoInfo = `Hash Alvo: #${this.targetPacket.declaredHash}`;
    }

    this.hudText.setText(
      `NÍVEL: ${this.currentLevel}/2 | VIDAS: ${'♥'.repeat(Math.max(0, this.player.lives))} | PONTOS: ${this.player.score} | ${cryptoInfo}`
    );
  }

  update() {
    this.player.update(this.cursors, this.wasd);
    this.enemiesGroup.getChildren().forEach(enemy => enemy.update());

    if (Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)) {
      this.tryDecryptBarrier();
    }
  }

  tryDecryptBarrier() {
    if (this.currentLevel === 1 && this.player.collectedKeys.length > 0) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, 432, 336);
      if (dist < 90) {
        const key = this.player.collectedKeys[0];
        const match = XorCipher.isMatch(this.activeCipher.cipherValue, key);

        if (match) {
          this.sound.play('snd_unlock', { volume: 0.8 });
          this.barriersGroup.clear(true, true);
          this.barrierLabel.setText('0b101 ⊕ 0b101 = 0b000 (DESBLOQUEADO)').setColor('#38ef7d');
          this.statusText.setText('Cálculo XOR bem-sucedido! Acesso aberto para o terminal de extração.');
          this.player.addScore(200);
          this.updateHUD();
        }
      }
    }
  }

  handleEnemyCollision(player, enemy) {
    const isDead = player.takeDamage(1);
    this.updateHUD();
    this.statusText.setText('DANO: Deteção e interferência de sentinela cibernética!');
    if (isDead) {
      this.triggerGameOver(false);
    }
  }

  handleExitReached() {
    if (this.currentLevel === 1) {
      this.sound.play('snd_complete', { volume: 0.8 });
      this.scene.start('GameScene', {
        level: 2,
        score: this.player.score + 250,
        lives: this.player.lives
      });
    } else {
      if (this.hasAuthenticData) {
        this.sound.play('snd_complete', { volume: 0.8 });
        this.triggerGameOver(true);
      } else {
        this.statusText.setText('ACESSO NEGADO: Deve recuperar e validar o bloco de dados autêntico primeiro!');
      }
    }
  }

  triggerGameOver(isVictory) {
    this.scene.start('GameOverScene', {
      victory: isVictory,
      score: this.player.score,
      level: this.currentLevel
    });
  }
}
