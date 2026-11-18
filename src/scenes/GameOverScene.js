/**
 * GameOverScene.js
 * Ecrã de fim de jogo com apresentação de resultados, gravação de recordes e opção de recomeço.
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
      : 'As sentinelas intercetaram a tua ligação cibernética.';

    this.add.text(width / 2, 100, titleText, {
      fontFamily: 'monospace',
      fontSize: '36px',
      fontStyle: 'bold',
      color: titleColor
    }).setOrigin(0.5);

    this.add.text(width / 2, 150, subText, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Gestão de Recorde Pessoal (localStorage)
    const currentHigh = parseInt(localStorage.getItem('cryptolumar_highscore') || '0', 10);
    let isNewRecord = false;
    if (this.score > currentHigh) {
      localStorage.setItem('cryptolumar_highscore', this.score.toString());
      isNewRecord = true;
    }

    this.add.text(width / 2, 220, `PONTUAÇÃO FINAL: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    if (isNewRecord) {
      this.add.text(width / 2, 260, '★ NOVO RECORDE REGISTADO! ★', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffd700'
      }).setOrigin(0.5);
    }

    // Botão Jogar Novamente
    const restartBtn = this.add.rectangle(width / 2, 340, 240, 48, 0x111827)
      .setStrokeStyle(2, 0x00f0ff)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 340, 'JOGAR NOVAMENTE', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    restartBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { level: 1, score: 0, lives: 3 });
    });

    // Botão Menu Inicial
    const menuBtn = this.add.rectangle(width / 2, 410, 240, 44, 0x111827)
      .setStrokeStyle(2, 0x64748b)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 410, 'MENU PRINCIPAL', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    menuBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
