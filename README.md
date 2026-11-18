# CryptoLumar: Protocolo Cipher

**Unidade Curricular:** Sistemas Multimédia (2026-2027)  
**Instituição:** Instituto Politécnico de Viana do Castelo — Escola Superior de Tecnologia e Gestão (ESTG)  
**Curso:** Engenharia da Computação Gráfica e Multimédia (ECGM)  
**Estudante:** Luís Martinho Oliveira Lopes  
**Tema Atribuído:** `g) Criptografia e proteção de informação`  
**Framework:** [Phaser.io](https://phaser.io) (v4) com Arcade Physics  

---

## 1. Descrição e Objetivo do Jogo

**CryptoLumar** é um jogo 2D de infiltração e resolução tática de puzzles criptográficos. O jogador assume o papel de um especialista em cibersegurança encarregado de recuperar pacotes de dados confidenciais num complexo de servidores comprometidos por malware, enquanto neutraliza firewalls e contorna patrulhas de defesa de sistemas.

O objetivo do jogador consiste em completar os níveis de segurança, recolhendo chaves criptográficas, validando dados autênticos e alcançando a saída de cada setor antes que o sistema de contra-medidas esgote as suas vidas ou o tempo limite.

A pontuação é calculada com base em:
* Número de pacotes de dados recuperados com integridade verificada;
* Barreira/firewalls decifradas com recurso a chaves simétricas;
* Tempo restante na conclusão de cada nível;
* Bónus de vidas intactas.

---

## 2. Conceitos Técnicos de Criptografia Integrados

De acordo com os requisitos da unidade curricular, o jogo integra **dois conceitos técnicos distintos**, implementados de forma algorítmica e mecânica (não apenas visual):

### Conceito 1: Cifra Simétrica por Máscara XOR (Bitwise Stream Cipher)
* **Mecânica de Jogo:** As barreiras laser e firewalls possuem um estado binário cifrado. O jogador recolhe fragmentos de chave simétrica ($K$). Ao ativar a chave em frente a um terminal ou barreira, o algoritmo executa a operação `Estado_Barreira XOR Chave`. Apenas quando a operação resulta no padrão neutro (`0x00`), o campo de forças é desativado, permitindo a passagem. Se a chave for incorreta, o circuito repele o jogador e causa dano.

### Conceito 2: Verificação de Integridade de Dados por Função Hash (Cryptographic Checksum / Digest)
* **Mecânica de Jogo:** Nos terminais do Nível 2, existem pacotes de dados dispersos. Alguns são dados genuínos e outros foram adulterados por um ataque *Man-in-the-Middle*. O jogador consulta o *Hash Digest* legítimo divulgado pelo servidor e deve inspecionar/selecionar os pacotes cujo cálculo de hash coincide com a assinatura esperada. A recolha de dados corrompidos reduz a integridade do jogador e ativa alarmes sonoros.

---

## 3. Arquitetura e Estrutura de Classes

O projeto adota uma arquitetura modular orientada a objetos (ES6 Modules / Classes JavaScript):

```
├── index.html                  # Ponto de entrada do jogo
├── assets/                     # Sprites, áudio, tilemaps
│   ├── audio/
│   ├── images/
│   └── maps/
├── src/
│   ├── config.js               # Configuração do Phaser e física Arcade
│   ├── main.js                 # Inicialização do jogo
│   ├── crypto/
│   │   ├── XorCipher.js        # Algoritmo de cifra simétrica XOR
│   │   └── HashVerifier.js     # Algoritmo de verificação de hash e integridade
│   ├── entities/
│   │   ├── Player.js           # Classe de jogador (movimento, vidas, inventário de chaves)
│   │   └── Enemy.js            # Sentinelas e patrulhas com física Arcade
│   └── scenes/
│       ├── BootScene.js        # Pré-carregamento de assets
│       ├── MenuScene.js        # Menu principal (Jogar, Instruções, Configurações)
│       ├── InstructionsScene.js# Ecrã de instruções e regras
│       ├── GameScene.js        # Cena principal de jogabilidade (Níveis 1 e 2)
│       └── GameOverScene.js    # Ecrã de resultados, pontuação e recomeço
├── docs/                       # Documentação e relatórios
└── Trabalho_ECGM_SM_2627.pdf   # Enunciado oficial
```

---

## 4. Requisitos Técnicos Cumpridos

* [x] Jogo original em HTML5 / Phaser (v4);
* [x] Suporte para Desktop (controlos por Teclado / Setas / WASD / Rato);
* [x] Dois conceitos técnicos distintos de criptografia com impacto direto nas regras e mecânicas;
* [x] 2 níveis de progressão (Nível 1: Cifra Simétrica; Nível 2: Integridade e Hashes);
* [x] Aleatoriedade controlada na geração de pacotes e posicionamento de chaves;
* [x] Cenas estruturadas (`BootScene`, `MenuScene`, `InstructionsScene`, `GameScene`, `GameOverScene`);
* [x] Personagens com sprites animados e colisões com `Arcade Physics`;
* [x] Efeitos sonoros de interação, recolha, alarme e conclusão;
* [x] Armazenamento local de pontuações (`localStorage`);
* [x] Código versionado no Git com commits progressivos.

---

## 5. Como Executar Localmente

1. Clonar o repositório:
   ```bash
   git clone https://github.com/luismartinho21/trabalho-pratico-SM-Criptografia.git
   cd trabalho-pratico-SM-Criptografia
   ```
2. Executar com um servidor HTTP local (devido às políticas de CORS do navegador para carregar assets do Phaser):
   * Com a extensão **Live Server** no VS Code (clicar em "Go Live");
   * Ou via terminal com Node.js:
     ```bash
     npx serve .
     ```
3. Aceder ao endereço local no browser (ex: `http://localhost:3000` ou `http://localhost:5500`).
