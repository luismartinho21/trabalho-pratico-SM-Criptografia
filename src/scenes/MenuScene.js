/**
 * MenuScene.js
 * Ecrã inicial com opções de Jogar, Instruções e Visualização do Recorde.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fundo em grelha cibernética
    this.add.rectangle(0, 0, width, height, 0x070b14).setOrigin(0);

    // Título principal com efeito de brilho
    this.add.text(width / 2, 110, 'CRYPTOLUMAR', {
      fontFamily: 'monospace',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#00f0ff',
      shadow: { blur: 15, color: '#00f0ff', fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 160, 'PROTOCOLO CIPHER: DEFESA & INFILTRAÇÃO', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Recorde guardado localmente (localStorage)
    const highScore = localStorage.getItem('cryptolumar_highscore') || 0;
    this.add.text(width / 2, 210, `MELHOR PONTUAÇÃO: ${highScore}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffd700'
    }).setOrigin(0.5);

    // Botão JOGAR
    const playBtn = this.createButton(width / 2, 290, 'INICIAR MISSÃO', 0x00f0ff, () => {
      this.scene.start('GameScene', { level: 1, score: 0, lives: 3 });
    });

    // Botão INSTRUÇÕES
    const instrBtn = this.createButton(width / 2, 360, 'INSTRUÇÕES & CRIPTOGRAFIA', 0x38ef7d, () => {
      this.scene.start('InstructionsScene');
    });

    // Rodapé informativo
    this.add.text(width / 2, height - 35, 'ESTG - IPVC | Sistemas Multimédia 2026/2027 | Luís Martinho', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#64748b'
    }).setOrigin(0.5);
  }

  createButton(x, y, text, colorHex, callback) {
    const btnContainer = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 320, 48, 0x111827);
    bg.setStrokeStyle(2, colorHex);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    btnContainer.add([bg, label]);
    bg.setInteractive({ useHandCursor: true });

    bg.on('pointerover', () => {
      bg.setFillStyle(colorHex, 0.25);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x111827, 1);
    });
    bg.on('pointerdown', callback);

    return btnContainer;
  }
}
