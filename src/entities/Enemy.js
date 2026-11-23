/**
 * Enemy.js
 * Sentinela de segurança com animações de alerta e física Arcade.
 */
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, patrolDistance = 120, isVertical = false) {
    super(scene, x, y, 'enemy');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.startX = x;
    this.startY = y;
    this.patrolDistance = patrolDistance;
    this.isVertical = isVertical;
    this.speed = 85;
    this.direction = 1;

    this.setImmovable(true);
    this.body.setSize(22, 22);
    this.body.setOffset(5, 5);

    this.play('enemy_pulse');
  }

  update() {
    if (this.isVertical) {
      this.setVelocityY(this.speed * this.direction);
      if (Math.abs(this.y - this.startY) >= this.patrolDistance) {
        this.direction *= -1;
      }
    } else {
      this.setVelocityX(this.speed * this.direction);
      if (Math.abs(this.x - this.startX) >= this.patrolDistance) {
        this.direction *= -1;
      }
    }
  }
}
