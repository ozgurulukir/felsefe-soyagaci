/**
 * =========================================================================
 * FELSEFE SOYAĞACI — COĞRAFİ KOORDİNATLAR & DÜNYA HARİTASI MOTORU
 * =========================================================================
 * 79 düşünürün tarihsel kent koordinatları, Mercator izdüşüm projeksiyonu,
 * çoklu düğüm kümeleme (jittering). Atlas canvas çizimi js/core/atlas-engine.js'te.
 */

const PhilosophyGeo = (function () {
  // 79 Düşünürün Doğum/Etkinlik Kent Koordinatları [Enlem, Boylam]
  const PHILOSOPHER_COORDS = Object.freeze({
    // İyonya & Antik Yunan
    thales: [37.53, 27.28], // Miletos
    anaksimandros: [37.53, 27.28], // Miletos
    anaksimenes: [37.53, 27.28], // Miletos
    pythagoras: [37.75, 26.98], // Sisam (Samos)
    herakleitos: [37.94, 27.36], // Efes (Ephesos)
    parmenides: [40.16, 15.15], // Elea (Ascea, İtalya)
    zenon_elea: [40.16, 15.15], // Elea
    demokritos: [40.98, 24.98], // Abdera (Trakya)
    leukippos: [37.53, 27.28], // Miletos
    sokrates: [37.98, 23.72], // Atina
    platon: [37.98, 23.72], // Atina
    aristoteles: [40.59, 23.79], // Stageira / Atina
    theophrastos: [39.17, 25.93], // Midilli (Eresos)
    antisthenes: [37.98, 23.72], // Atina
    diyojen: [42.02, 35.15], // Sinop (Sinope)
    aristippos: [32.82, 21.86], // Kirene (Libya)
    krates: [38.32, 23.32], // Tebai
    zenon_kibris: [34.92, 33.63], // Kition (Larnaka, Kıbrıs)
    hrisippos: [36.74, 34.54], // Soli (Mersin)
    epikuros: [37.75, 26.98], // Sisam / Atina
    lucretius: [41.90, 12.49], // Roma
    seneca: [37.88, -4.78], // Cordoba / Roma
    epiktetos: [37.92, 29.12], // Hierapolis (Pamukkale)
    musonios: [42.65, 11.98], // Volsinii (Bolsena, İtalya)
    aurelius: [41.90, 12.49], // Roma
    pyrrhon: [37.89, 21.37], // Elis (Mora Yarımadası)
    sextus: [31.20, 29.91], // İskenderiye
    plotinos: [27.18, 31.18], // Lykopolis (Asyut, Mısır)

    // Orta Çağ, İslam Dünyası & Skolastik
    augustinus: [36.28, 7.95], // Thagaste (Souk Ahras, Cezayir)
    elkindi: [33.31, 44.36], // Bağdat / Kufe
    elfarabi: [42.85, 68.30], // Farab (Otrar, Kazakistan)
    ibnisina: [39.77, 64.42], // Buhara / Hemedan
    gazali: [36.48, 59.51], // Tus / Nişabur
    omer_hayyam: [36.21, 58.79], // Nişabur (Horasan)
    tusi: [37.39, 46.24], // Meraga Rasathanesi
    ibnrushd: [37.88, -4.78], // Kurtuba (Cordoba, Endülüs)
    aquinas: [41.55, 13.67], // Roccasecca / Napoli
    ockham: [51.29, -0.47], // Ockham (Surrey, İngiltere)
    ibnhaldun: [36.80, 10.18], // Tunus / Kahire

    // Rönesans & Aydınlanma
    machiavelli: [43.76, 11.25], // Floransa
    bacon: [51.50, -0.12], // Londra
    hobbes: [51.58, -2.10], // Malmesbury
    descartes: [46.97, 0.69], // La Haye en Touraine
    spinoza: [52.37, 4.89], // Amsterdam
    leibniz: [51.34, 12.37], // Leipzig
    locke: [51.36, -2.76], // Wrington
    berkeley: [52.65, -7.25], // Dysart Castle (Kilkenny, İrlanda)
    hume: [55.95, -3.18], // Edinburgh
    rousseau: [46.20, 6.14], // Cenevre
    kant: [54.71, 20.51], // Königsberg (Kaliningrad)
    fichte: [51.15, 14.13], // Rammenau
    schelling: [48.80, 9.01], // Leonberg
    hegel: [48.77, 9.18], // Stuttgart
    feuerbach: [48.54, 12.15], // Landshut
    marx: [49.75, 6.64], // Trier
    kierkegaard: [55.67, 12.56], // Kopenhag
    schopenhauer: [54.35, 18.64], // Danzig (Gdansk)
    nietzsche: [51.24, 12.11], // Röcken

    // 19. ve 20. Yüzyıl
    mill: [51.50, -0.12], // Londra
    brentano: [50.65, 13.16], // Marienberg
    husserl: [49.47, 17.11], // Prossnitz
    heidegger: [47.99, 9.03], // Messkirch
    sartre: [48.85, 2.35], // Paris
    beauvoir: [48.85, 2.35], // Paris
    camus: [36.68, 7.75], // Mondovi (Drean, Cezayir)
    frege: [53.89, 11.46], // Wismar
    russell: [51.74, -2.72], // Trellech (Galler)
    wittgenstein: [48.20, 16.37], // Viyana
    popper: [48.20, 16.37], // Viyana
    foucault: [46.58, 0.34], // Poitiers
    derrida: [36.76, 3.03], // El-Biar (Cezayir)
    deleuze: [48.85, 2.35], // Paris
    freud: [49.64, 18.14], // Freiberg (Pribor)
    carnap: [51.22, 7.20], // Ronsdorf (Wuppertal)
    gadamer: [50.81, 8.77], // Marburg
    arendt: [52.37, 9.73], // Hannover
    merleauponty: [45.94, -0.96], // Rochefort-sur-Mer
    fanon: [36.75, 3.05], // Cezayir / Martinik
    canguilhem: [43.31, 1.95] // Castelnaudary
  });

  // Harita Projeksiyon Parametreleri (Avrasya / Akdeniz Odaklı)
  const PROJ_CENTER_LNG = 18;
  const PROJ_CENTER_LAT = 42;
  const PROJ_SCALE_X = 52;
  const PROJ_SCALE_Y = 62;

  function projectRaw(lat, lng) {
    const x = (lng - PROJ_CENTER_LNG) * PROJ_SCALE_X;
    const latRad = (lat * Math.PI) / 180;
    const centerLatRad = (PROJ_CENTER_LAT * Math.PI) / 180;
    const yMerc = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const yCenterMerc = Math.log(Math.tan(Math.PI / 4 + centerLatRad / 2));
    const y = -(yMerc - yCenterMerc) * PROJ_SCALE_Y * 60;
    return { x: Math.round(x), y: Math.round(y) };
  }

  // Aynı şehirdeki filozofların üst üste binmesini önleyen kümeleme (radial jittering)
  let _projectedPositionsCache = null;

  function computeAllPositions() {
    if (_projectedPositionsCache) return _projectedPositionsCache;

    const clusters = new Map();
    for (const [id, [lat, lng]] of Object.entries(PHILOSOPHER_COORDS)) {
      const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
      if (!clusters.has(key)) clusters.set(key, []);
      clusters.get(key).push({ id, lat, lng });
    }

    const positions = {};
    for (const [key, list] of clusters.entries()) {
      const count = list.length;
      list.forEach((item, idx) => {
        const base = projectRaw(item.lat, item.lng);
        if (count === 1) {
          positions[item.id] = base;
          return;
        }
        // Çoklu filozoflar için dairesel takımyıldız açılımı.
        // Kutu genişliği ~140px olduğundan yarıçaplar okunabilirliğe göre seçilir;
        // büyük kümeler (Atina gibi) iki eş merkezli halkaya yayılır.
        let ring, ringIdx, ringCount;
        if (count <= 5) {
          ring = count === 2 ? 64 : 78;
          ringIdx = idx;
          ringCount = count;
        } else if (count <= 10) {
          ring = 96;
          ringIdx = idx;
          ringCount = count;
        } else {
          const firstRing = Math.ceil(count / 2);
          if (idx < firstRing) {
            ring = 90;
            ringIdx = idx;
            ringCount = firstRing;
          } else {
            ring = 170;
            ringIdx = idx - firstRing;
            ringCount = count - firstRing;
          }
        }
        // Dış halkayı yarım adım döndürerek iç halkanın boşluklarına yerleştir
        const angle = (2 * Math.PI * ringIdx) / ringCount - Math.PI / 2
          + (ring > 100 ? Math.PI / ringCount : 0);
        positions[item.id] = {
          x: Math.round(base.x + Math.cos(angle) * ring),
          y: Math.round(base.y + Math.sin(angle) * ring)
        };
      });
    }

    _projectedPositionsCache = positions;
    return positions;
  }

  function getNodePosition(id) {
    const positions = computeAllPositions();
    return positions[id] || { x: 0, y: 0 };
  }

  function getPhilosopherLatLng(id) {
    const raw = PHILOSOPHER_COORDS[id];
    if (!raw) return null;
    const cluster = Object.entries(PHILOSOPHER_COORDS).filter(([k, c]) => Math.abs(c[0] - raw[0]) < 0.05 && Math.abs(c[1] - raw[1]) < 0.05);
    if (cluster.length <= 1) return raw;
    const idx = cluster.findIndex(([k]) => k === id);
    const angle = (2 * Math.PI * idx) / cluster.length - Math.PI / 2;
    const radius = cluster.length > 3 ? 0.35 : 0.22;
    return [raw[0] + Math.cos(angle) * (radius * 0.7), raw[1] + Math.sin(angle) * radius];
  }


  return Object.freeze({
    PHILOSOPHER_COORDS,
    getNodePosition,
    getPhilosopherLatLng,
    projectRaw
  });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhilosophyGeo };
}

if (typeof window !== 'undefined') {
  window.PhilosophyGeo = PhilosophyGeo;
}
