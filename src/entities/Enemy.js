/**
 * Enemy.js
 * Sentinela de segurança / Patrulha cibernética com Arcade Physics.
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
    this.speed = 80;
    this.direction = 1;

    this.setImmovable(true);
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
