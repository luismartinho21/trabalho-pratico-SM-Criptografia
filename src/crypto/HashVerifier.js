/**
 * HashVerifier.js
 * Implementação algorítmica do Conceito Técnico 2: Verificação de Integridade por Função Hash.
 * Utilizado para identificar pacotes íntegros e rejeitar pacotes corrompidos por malware no Nível 2.
 */
export class HashVerifier {
  /**
   * Calcula um Hash Criptográfico simplificado (algoritmo polinomial estilo DJB2 / CRC-8)
   * para uma dada sequência de bytes/dados de um pacote.
   * @param {string|Array<number>} data - Dados contidos no pacote
   * @returns {string} Hash em formato hexadecimal
   */
  static calculateHash(data) {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & 0xFFFF; // Manter dentro de 16 bits
    }
    return hash.toString(16).toUpperCase().padStart(4, '0');
  }

  /**
   * Valida se o hash calculado do pacote corresponde ao Digest esperado pelo servidor.
   * @param {string} payload - Conteúdo do pacote
   * @param {string} expectedHash - Hash esperado anunciado pela consola
   * @returns {boolean} True se os dados forem autênticos e íntegros
   */
  static verifyIntegrity(payload, expectedHash) {
    const computed = this.calculateHash(payload);
    return computed === expectedHash.toUpperCase();
  }

  /**
   * Gera um pacote de dados aleatório (com integridade genuína ou adulterada).
   * @param {string} packetId - Identificador único do pacote
   * @param {boolean} isTampered - Se o pacote foi corrompido por Man-in-the-Middle
   * @returns {{ id: string, payload: string, declaredHash: string, isAuthentic: boolean }}
   */
  static generatePacket(packetId, isTampered = false) {
    const payload = `DATA-BLOCK-${packetId}-${Phaser.Math.Between(100, 999)}`;
    let calculated = this.calculateHash(payload);
    
    // Se for adulterado, alteramos o hash declarado ou os dados para não coincidir
    let declaredHash = calculated;
    if (isTampered) {
      declaredHash = ((parseInt(calculated, 16) + 13) % 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }

    return {
      id: packetId,
      payload,
      declaredHash,
      isAuthentic: !isTampered
    };
  }
}
