/**
 * Player.js
 * Classe de controlo da personagem jogadora (Criptógrafo / Agente de Segurança).
 * Gere física Arcade, animações com spritesheet, vidas e inventário de chaves.
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
    this.collectedKeys = [];
    this.isInvulnerable = false;

    // Caixa de colisão ajustada para 32x32
    this.body.setSize(20, 24);
    this.body.setOffset(6, 6);

    this.play('player_idle');
  }

  update(cursors, wasdKeys) {
    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasdKeys.A.isDown) {
      vx = -this.speed;
      this.setFlipX(true);
    } else if (cursors.right.isDown || wasdKeys.D.isDown) {
      vx = this.speed;
      this.setFlipX(false);
    }

    if (cursors.up.isDown || wasdKeys.W.isDown) {
      vy = -this.speed;
    } else if (cursors.down.isDown || wasdKeys.S.isDown) {
      vy = this.speed;
    }

    // Normalização diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.setVelocity(vx, vy);

    // Controlo de animações de movimento
    if (vx !== 0 || vy !== 0) {
      if (this.anims.currentAnim?.key !== 'player_walk') {
        this.play('player_walk');
      }
    } else {
      if (this.anims.currentAnim?.key !== 'player_idle') {
        this.play('player_idle');
      }
    }
  }

  takeDamage(amount = 1) {
    if (this.isInvulnerable) return false;

    this.lives -= amount;
    this.isInvulnerable = true;
    this.setTint(0xff0055);

    // Som de alerta/dano
    if (this.scene.sound) {
      this.scene.sound.play('snd_alarm', { volume: 0.6 });
    }

    // Efeito de piscar durante invulnerabilidade temporária
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      yoyo: true,
      repeat: 4,
      duration: 100,
      onComplete: () => {
        this.alpha = 1;
        this.clearTint();
        this.isInvulnerable = false;
      }
    });

    return this.lives <= 0;
  }

  addScore(points) {
    this.score += points;
  }
}
