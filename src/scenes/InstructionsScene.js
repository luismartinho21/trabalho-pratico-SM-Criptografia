/**
 * InstructionsScene.js
 * Ecrã de instruções detalhando os controlos e a aplicação prática dos conceitos de criptografia.
 */
export class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionsScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x070b14).setOrigin(0);

    this.add.text(width / 2, 50, 'INSTRUÇÕES & PROTOCOLOS', {
      fontFamily: 'monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#38ef7d'
    }).setOrigin(0.5);

    const instructionsText = [
      'CONTROLOS DO AGENTE:',
      '• Movimento: Setas do Teclado ou Teclas [W, A, S, D]',
      '• Interagir / Aplicar Chave: Tecla [ESPAÇO]',
      '',
      'CONCEITOS CRIPTOGRÁFICOS DO JOGO:',
      '1. CIFRA SIMÉTRICA XOR (Nível 1):',
      '   - As barreiras contêm um valor binário/máscara cifrada.',
      '   - Recolhe chaves simétricas e ativa o decifrador.',
      '   - O jogo calcula (Estado XOR Chave); se o resultado for 0, o caminho abre.',
      '',
      '2. INTEGRIDADE & HASHES CRIPTOGRÁFICOS (Nível 2):',
      '   - Infiltra-te no servidor e recolhe os pacotes de dados.',
      '   - Atenção ao Hash Digest esperado anunciado pelo terminal.',
      '   - Pacotes com integridade comprometida ativam o alarme e causam dano.',
      '',
      'OBJETIVO: Neutralizar as firewalls, recolher os dados legítimos e alcançar a saída!'
    ];

    this.add.text(70, 100, instructionsText, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#cbd5e1',
      lineSpacing: 6
    });

    // Botão Voltar ao Menu
    const backBtn = this.add.rectangle(width / 2, height - 50, 200, 40, 0x1e293b)
      .setStrokeStyle(2, 0x38ef7d)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height - 50, 'VOLTAR AO MENU', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    backBtn.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
