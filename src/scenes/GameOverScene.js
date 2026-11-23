/**
 * GameOverScene.js
 * Ecrã de resultados, pontuação final, recordes e opção de recomeçar.
 */
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.victory = data.victory || false;
    this.score = data.score || 0;
    this.finalLevel = data.level || 1;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x05070e).setOrigin(0);

    const titleColor = this.victory ? '#38ef7d' : '#ff0055';
    const titleText = this.victory ? 'MISSÃO CUMPRIDA!' : 'SISTEMA COMPROMETIDO';
    const subText = this.victory
      ? 'Todos os protocolos criptográficos foram resgatados com sucesso!'
      : 'As sentinelas intercetaram a sua ligação cibernética.';

    this.add.text(width / 2, 95, titleText, {
      fontFamily: 'monospace',
      fontSize: '34px',
      fontStyle: 'bold',
      color: titleColor
    }).setOrigin(0.5);

    this.add.text(width / 2, 145, subText, {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Gestão de Recorde Pessoal (localStorage)
    const currentHigh = parseInt(localStorage.getItem('cryptolumar_highscore') || '0', 10);
    let isNewRecord = false;
    if (this.score > currentHigh) {
      localStorage.setItem('cryptolumar_highscore', this.score.toString());
      isNewRecord = true;
    }

    this.add.text(width / 2, 215, `PONTUAÇÃO FINAL: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    if (isNewRecord) {
      this.add.text(width / 2, 255, '★ NOVO RECORDE REGISTADO! ★', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#ffd700'
      }).setOrigin(0.5);
    }

    // Botão Jogar Novamente
    const restartBtn = this.add.rectangle(width / 2, 335, 240, 46, 0x111827)
      .setStrokeStyle(2, 0x00f0ff)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 335, 'JOGAR NOVAMENTE', {
      fontFamily: 'monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    restartBtn.on('pointerdown', () => {
      this.sound.play('snd_click', { volume: 0.6 });
      this.scene.start('GameScene', { level: 1, score: 0, lives: 3 });
    });

    // Botão Menu Inicial
    const menuBtn = this.add.rectangle(width / 2, 400, 240, 42, 0x111827)
      .setStrokeStyle(2, 0x64748b)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 400, 'MENU PRINCIPAL', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    menuBtn.on('pointerdown', () => {
      this.sound.play('snd_click', { volume: 0.6 });
      this.scene.start('MenuScene');
    });
  }
}
