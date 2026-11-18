/**
 * XorCipher.js
 * Implementação algorítmica do Conceito Técnico 1: Cifra Simétrica por Máscara XOR.
 * Utilizado para decifrar barreiras lógicas e firewalls no Nível 1.
 */
export class XorCipher {
  /**
   * Aplica a operação bitwise XOR entre um valor cifrado e uma chave.
   * @param {number} cipherValue - Valor numérico da barreira (ex: 0b101 ou 5)
   * @param {number} keyValue - Valor numérico da chave simétrica (ex: 0b101 ou 5)
   * @returns {number} Resultado da operação XOR. Se for 0, a barreira é neutralizada.
   */
  static applyXor(cipherValue, keyValue) {
    return cipherValue ^ keyValue;
  }

  /**
   * Verifica se a chave fornecida desbloqueia com sucesso a barreira.
   * @param {number} cipherValue
   * @param {number} keyValue
   * @returns {boolean}
   */
  static isMatch(cipherValue, keyValue) {
    return this.applyXor(cipherValue, keyValue) === 0;
  }

  /**
   * Gera um par de barreira e chave simétrica aleatória dentro de um intervalo.
   * @param {number} maxBits - Número máximo de bits (padrão: 3 -> valores 1 a 7)
   * @returns {{ cipherValue: number, keyValue: number, binaryString: string }}
   */
  static generateRandomCipher(maxBits = 3) {
    const maxVal = Math.pow(2, maxBits) - 1;
    const value = Phaser.Math.Between(1, maxVal);
    return {
      cipherValue: value,
      keyValue: value,
      binaryString: value.toString(2).padStart(maxBits, '0')
    };
  }
}
