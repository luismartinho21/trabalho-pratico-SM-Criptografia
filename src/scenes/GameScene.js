import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { XorCipher } from '../crypto/XorCipher.js';
import { HashVerifier } from '../crypto/HashVerifier.js';

/**
 * GameScene.js
 * Cena principal de jogabilidade com gestão de níveis, colisões e mecânicas criptográficas.
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.currentLevel = data.level || 1;
    this.score = data.score || 0;
    this.lives = data.lives !== undefined ? data.lives : 3;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fundo do setor
    this.add.rectangle(0, 0, width, height, 0x0a0f1d).setOrigin(0);

    // Grelha de ciberespaço estilizada
    const grid = this.add.grid(width / 2, height / 2, width, height, 32, 32, 0x000000, 0, 0x1e293b, 0.4);

    // Grupos de Física Arcade
    this.keysGroup = this.physics.add.group();
    this.barriersGroup = this.physics.add.staticGroup();
    this.packetsGroup = this.physics.add.group();
    this.enemiesGroup = this.physics.add.group();

    // Inicialização da Personagem
    this.player = new Player(this, 80, height - 90);
    this.player.lives = this.lives;
    this.player.score = this.score;

    // Teclas de Entrada
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Configuração do Nível correspondente
    if (this.currentLevel === 1) {
      this.setupLevel1();
    } else {
      this.setupLevel2();
    }

    // Configuração do Terminal de Extração (Saída)
    this.exitTerminal = this.physics.add.staticSprite(width - 70, 90, 'exit-terminal');
    this.physics.add.overlap(this.player, this.exitTerminal, this.handleExitReached, null, this);

    // Colisões com Inimigos
    this.physics.add.overlap(this.player, this.enemiesGroup, this.handleEnemyCollision, null, this);

    // Interface HUD
    this.setupHUD();
  }

  setupLevel1() {
    // NÍVEL 1: Cifra Simétrica por Máscara XOR
    const cipherData = XorCipher.generateRandomCipher(3);
    this.activeCipher = cipherData;

    // Criar Barreira Laser Cifrada
    const barrier = this.barriersGroup.create(400, 280, 'laser-barrier');
    barrier.cipherValue = cipherData.cipherValue;
    barrier.activeState = true;

    this.barrierLabel = this.add.text(400, 245, `FIREWALL [XOR: 0b${cipherData.binaryString}]`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ff0055',
      backgroundColor: '#000000'
    }).setOrigin(0.5);

    // Colisão do jogador com a barreira
    this.physics.add.collider(this.player, this.barriersGroup, (player, bar) => {
      if (bar.activeState) {
        this.statusText.setText(`Aviso: Barreira ativa! Necessita da Chave XOR correspondente.`);
      }
    });

    // Criar Chave Simétrica (Aleatoriedade controlada na posição)
    const keyX = Phaser.Math.Between(200, 320);
    const keyY = Phaser.Math.Between(150, 400);
    const cryptoKey = this.keysGroup.create(keyX, keyY, 'crypto-key');
    cryptoKey.keyValue = cipherData.keyValue;

    this.physics.add.overlap(this.player, this.keysGroup, (player, keyItem) => {
      this.player.collectedKeys.push(keyItem.keyValue);
      keyItem.destroy();
      this.player.addScore(150);
      this.updateHUD();
      this.statusText.setText(`Chave simétrica adquirida (0b${cipherData.binaryString})! Pressione [ESPAÇO] junto à barreira para aplicar XOR.`);
    });

    // Adicionar Patrulhas Inimigas
    const sentry1 = new Enemy(this, 300, 150, 100, false);
    const sentry2 = new Enemy(this, 550, 350, 120, true);
    this.enemiesGroup.add(sentry1);
    this.enemiesGroup.add(sentry2);
  }

  setupLevel2() {
    // NÍVEL 2: Verificação de Integridade por Função Hash
    this.targetPacket = HashVerifier.generatePacket('01', false);
    this.tamperedPacket = HashVerifier.generatePacket('02', true);

    // Posicionamento aleatório dos pacotes
    const positions = [
      { x: 260, y: 180 },
      { x: 500, y: 380 }
    ];
    Phaser.Utils.Array.Shuffle(positions);

    // Pacote legítimo
    const p1 = this.packetsGroup.create(positions[0].x, positions[0].y, 'data-packet');
    p1.packetData = this.targetPacket;

    // Pacote adulterado
    const p2 = this.packetsGroup.create(positions[1].x, positions[1].y, 'data-packet');
    p2.packetData = this.tamperedPacket;

    this.physics.add.overlap(this.player, this.packetsGroup, (player, packetSprite) => {
      const data = packetSprite.packetData;
      const isValid = HashVerifier.verifyIntegrity(data.payload, data.declaredHash);

      if (isValid) {
        this.player.addScore(300);
        this.statusText.setText(`SUCESSO: Pacote íntegro [Hash: ${data.declaredHash}] validado!`);
        this.hasAuthenticData = true;
      } else {
        this.player.takeDamage(1);
        this.statusText.setText(`ALERTA: Pacote ADULTERADO detetado! Hash violado (-1 Vida).`);
      }

      packetSprite.destroy();
      this.updateHUD();
      if (this.player.lives <= 0) {
        this.triggerGameOver(false);
      }
    });

    // Inimigos mais rápidos no Nível 2
    const sentry1 = new Enemy(this, 250, 280, 130, false);
    const sentry2 = new Enemy(this, 480, 200, 140, true);
    sentry1.speed = 110;
    sentry2.speed = 110;
    this.enemiesGroup.add(sentry1);
    this.enemiesGroup.add(sentry2);
  }

  setupHUD() {
    const width = this.cameras.main.width;

    this.hudText = this.add.text(16, 16, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#00f0ff'
    });

    this.statusText = this.add.text(16, 45, 'Missão iniciada. Explora o terminal e resolve o desafio criptográfico.', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#cbd5e1'
    });

    this.updateHUD();
  }

  updateHUD() {
    let cryptoInfo = '';
    if (this.currentLevel === 1) {
      const keysCount = this.player.collectedKeys.length;
      cryptoInfo = `Chaves XOR: ${keysCount}`;
    } else {
      cryptoInfo = `Digest Alvo: #${this.targetPacket.declaredHash}`;
    }

    this.hudText.setText(
      `NÍVEL: ${this.currentLevel}/2 | VIDAS: ${this.player.lives} | PONTUAÇÃO: ${this.player.score} | ${cryptoInfo}`
    );
  }

  update() {
    this.player.update(this.cursors, this.wasd);

    // Atualizar sentinelas
    this.enemiesGroup.getChildren().forEach(enemy => enemy.update());

    // Interação com a tecla ESPAÇO para decifrar barreiras
    if (Phaser.Input.Keyboard.JustDown(this.wasd.SPACE)) {
      this.tryDecryptBarrier();
    }
  }

  tryDecryptBarrier() {
    if (this.currentLevel === 1 && this.player.collectedKeys.length > 0) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, 400, 280);
      if (dist < 110) {
        const key = this.player.collectedKeys[0];
        const match = XorCipher.isMatch(this.activeCipher.cipherValue, key);
        if (match) {
          this.barriersGroup.clear(true, true);
          this.barrierLabel.setText('FIREWALL NEUTRALIZADA (XOR = 0x00)').setColor('#38ef7d');
          this.statusText.setText('Cifra decifrada com sucesso! Caminho livre para a extração.');
          this.player.addScore(200);
          this.updateHUD();
        }
      }
    }
  }

  handleEnemyCollision(player, enemy) {
    const isDead = player.takeDamage(1);
    this.updateHUD();
    this.statusText.setText('DANO: Deteção por sentinela cibernética!');
    if (isDead) {
      this.triggerGameOver(false);
    }
  }

  handleExitReached() {
    if (this.currentLevel === 1) {
      this.scene.start('GameScene', {
        level: 2,
        score: this.player.score + 250,
        lives: this.player.lives
      });
    } else {
      this.triggerGameOver(true);
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
