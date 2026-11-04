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
  // Dönemlerin tek doğruluk kaynağı (SSOT): id + etiket + kronolojik taban seviyesi.
  // graph-db.js baseLevel'i, app.js count döngüsünü ve layout geometrisini buradan türetir.
  // Filtre pill'leri (index.html) bilinçli olarak sabit kalır: Tailwind sınıfları
  // statik metin olarak taranmak zorunda (tailwind.config.js content globs).
  const ERAS = Object.freeze([
    { id: 'antik', label: 'Antik Yunan', baseLevel: 0 },
    { id: 'helenistik', label: 'Helenistik & Roma', baseLevel: 5 },
    { id: 'ortacag', label: 'Orta Çağ & İslam', baseLevel: 9 },
    { id: 'aydinlanma', label: 'Rönesans & Aydınlanma', baseLevel: 13 },
    { id: '19yy', label: '19. Yüzyıl', baseLevel: 18 },
    { id: '20yy', label: '20. Yüzyıl & Çağdaş', baseLevel: 22 }
  ]);
  const VALID_ERAS = ERAS.map(function(e) { return e.id; });
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
    ERAS,
    VALID_ERAS,
    VALID_RELATION_TYPES,
    validateEntity,
    validateRelation
  });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhilosophySchema, normalizeTurkish };
}
