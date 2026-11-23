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

    // Fundo estilizado
    this.add.rectangle(0, 0, width, height, 0x070b14).setOrigin(0);

    // Título principal com efeito neon
    this.add.text(width / 2, 105, 'CRYPTOLUMAR', {
      fontFamily: 'monospace',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#00f0ff',
      shadow: { blur: 15, color: '#00f0ff', fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 155, 'PROTOCOLO CIPHER: INFILTRAÇÃO CRIPTOGRÁFICA', {
      fontFamily: 'sans-serif',
      fontSize: '13px',
      color: '#94a3b8',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Recorde guardado localmente (localStorage)
    const highScore = localStorage.getItem('cryptolumar_highscore') || 0;
    this.add.text(width / 2, 205, `★ MELHOR PONTUAÇÃO: ${highScore} ★`, {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#ffd700'
    }).setOrigin(0.5);

    // Botão JOGAR
    this.createButton(width / 2, 285, 'INICIAR MISSÃO', 0x00f0ff, () => {
      this.sound.play('snd_click', { volume: 0.6 });
      this.scene.start('GameScene', { level: 1, score: 0, lives: 3 });
    });

    // Botão INSTRUÇÕES
    this.createButton(width / 2, 355, 'INSTRUÇÕES & CRIPTOGRAFIA', 0x38ef7d, () => {
      this.sound.play('snd_click', { volume: 0.6 });
      this.scene.start('InstructionsScene');
    });

    // Rodapé institucional
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
      fontSize: '15px',
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
