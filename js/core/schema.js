/**
 * =========================================================================
 * 1. YARDIMCI FONKSİYONLAR (TÜRKÇE DUYARLI ARAMA & NORMALİZASYON)
 * =========================================================================
 */
function normalizeTurkish(str) {
  if (!str) return '';
  return str
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');
}

/**
 * =========================================================================
 * 2. VERİ ŞEMASI (SCHEMA) & TİP GÜVENLİĞİ
 * =========================================================================
 */
const PhilosophySchema = (function() {
  const VALID_ERAS = ['antik', 'helenistik', 'ortacag', 'aydinlanma', '19yy', '20yy'];
  const VALID_RELATION_TYPES = ['master', 'influence'];

  function validateEntity(entity) {
    // quote/eraName: çekmece (detay paneli) korumasız kullanır; city: hem şema hem UI
    const required = ['id', 'name', 'dates', 'era', 'eraName', 'school', 'city', 'quote', 'summary'];
    for (const field of required) {
      if (!entity[field]) {
        throw new Error(`[Schema Error] Filozof kaydında eksik zorunlu alan: ${field} (id: ${entity.id})`);
      }
    }
    if (!VALID_ERAS.includes(entity.era)) {
      throw new Error(`[Schema Error] Geçersiz dönem: ${entity.era} (id: ${entity.id})`);
    }
    return true;
  }

  function validateRelation(relation) {
    if (!relation.from || !relation.to || !relation.type) {
      throw new Error(`[Schema Error] Geçersiz ilişki tanımı: ${JSON.stringify(relation)}`);
    }
    if (!VALID_RELATION_TYPES.includes(relation.type)) {
      throw new Error(`[Schema Error] Geçersiz ilişki türü: ${relation.type}`);
    }
    return true;
  }

  return Object.freeze({
    VALID_ERAS,
    VALID_RELATION_TYPES,
    validateEntity,
    validateRelation
  });
})();
