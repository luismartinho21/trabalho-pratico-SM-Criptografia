/**
 * InstructionsScene.js
 * Ecrã de instruções com controlos e conceitos criptográficos.
 */
export class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionsScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x070b14).setOrigin(0);

    this.add.text(width / 2, 45, 'INSTRUÇÕES & PROTOCOLOS', {
      fontFamily: 'monospace',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#38ef7d'
    }).setOrigin(0.5);

    const instructionsText = [
      'CONTROLOS DO AGENTE:',
      '• Movimento: Setas do Teclado ou Teclas [W, A, S, D]',
      '• Interagir / Aplicar Chave XOR: Tecla [ESPAÇO]',
      '',
      'CONCEITOS CRIPTOGRÁFICOS DO JOGO:',
      '1. CIFRA SIMÉTRICA XOR (Nível 1):',
      '   - As firewalls possuem um valor de máscara binária.',
      '   - Recolha a chave simétrica e pressione [ESPAÇO] junto à barreira.',
      '   - O algoritmo calcula (Estado XOR Chave); se o valor for 0, a passagem abre.',
      '',
      '2. INTEGRIDADE & FUNÇÃO HASH (Nível 2):',
      '   - Servidor sob ataque Man-in-the-Middle com pacotes adulterados.',
      '   - Inspecione e recolha apenas o bloco cujo Hash coincide com o digest alvo.',
      '   - Pacotes adulterados causam alarme sonoro e reduzem vidas.',
      '',
      'OBJETIVO: Resgatar os dados íntegros e alcançar o terminal de extração!'
    ];

    this.add.text(60, 95, instructionsText, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#cbd5e1',
      lineSpacing: 5
    });

    const backBtn = this.add.rectangle(width / 2, height - 45, 200, 38, 0x1e293b)
      .setStrokeStyle(2, 0x38ef7d)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height - 45, 'VOLTAR AO MENU', {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    backBtn.on('pointerdown', () => {
      this.sound.play('snd_click', { volume: 0.6 });
      this.scene.start('MenuScene');
    });
  }
}
