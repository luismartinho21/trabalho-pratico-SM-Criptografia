/**
 * Player.js
 * Classe de controlo da personagem jogadora (Criptógrafo / Agente de Segurança).
 * Gere física Arcade, animações, vidas, chaves recolhidas e pontuação.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.speed = 180;
    this.lives = 3;
    this.score = 0;
    this.collectedKeys = []; // Chaves simétricas XOR no inventário
    this.heldPacket = null;   // Pacote de dados para verificação de hash

    // Configuração da caixa de colisão física
    this.body.setSize(24, 28);
    this.body.setOffset(4, 4);
  }

  update(cursors, wasdKeys) {
    let vx = 0;
    let vy = 0;

    // Controlos por Setas ou WASD
    if (cursors.left.isDown || wasdKeys.A.isDown) {
      vx = -this.speed;
    } else if (cursors.right.isDown || wasdKeys.D.isDown) {
      vx = this.speed;
    }

    if (cursors.up.isDown || wasdKeys.W.isDown) {
      vy = -this.speed;
    } else if (cursors.down.isDown || wasdKeys.S.isDown) {
      vy = this.speed;
    }

    // Normalização diagonal para velocidade consistente
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.setVelocity(vx, vy);
  }

  takeDamage(amount = 1) {
    this.lives -= amount;
    this.setTint(0xff0055);
    this.scene.time.delayedCall(200, () => this.clearTint());
    return this.lives <= 0;
  }

  addScore(points) {
    this.score += points;
  }
}
