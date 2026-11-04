/**
 * =========================================================================
 * FELSEFE SOYAĞACI — COĞRAFİ KOORDİNATLAR & DÜNYA HARİTASI MOTORU
 * =========================================================================
 * 79 düşünürün tarihsel kent koordinatları, Mercator izdüşüm projeksiyonu,
 * çoklu düğüm kümeleme (jittering) ve Vis.js canvas Atlas harita motoru.
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

  // Basitleştirilmiş Kıyı Şeritleri (Akdeniz, Avrupa, Karadeniz, Hazar, Mezopotamya)
  const COASTLINES = [
    // Avrupa & Akdeniz Kuzey Kıyıları
    [
      [58.5, -5.0], [56.0, -3.0], [53.5, 0.0], [51.5, 2.0], [49.5, 1.0], [48.5, -4.5],
      [46.5, -2.0], [43.5, -2.0], [43.8, -9.0], [42.0, -9.0], [37.0, -9.0], [36.0, -5.5],
      [36.7, -2.1], [39.0, 0.0], [41.4, 2.2], [43.3, 3.5], [43.3, 5.3], [44.4, 8.9],
      [44.0, 10.0], [41.9, 12.5], [38.0, 15.5], [37.0, 15.0], [38.2, 16.0], [40.5, 17.5],
      [41.3, 16.5], [44.0, 12.5], [45.5, 13.5], [45.0, 14.5], [43.0, 16.0], [42.0, 19.0],
      [39.5, 20.0], [38.0, 21.5], [36.5, 22.5], [37.5, 23.5], [38.5, 24.0], [40.5, 23.0],
      [40.8, 26.0], [41.0, 29.0]
    ],
    // Karadeniz & Anadolu Kuzeyi
    [
      [41.0, 29.0], [42.0, 28.0], [45.0, 29.5], [46.5, 31.0], [45.5, 35.5], [44.5, 38.0],
      [42.0, 41.5], [41.0, 39.5], [41.7, 35.5], [41.5, 32.0], [41.0, 29.0]
    ],
    // Ege & Anadolu Güneyi
    [
      [41.0, 29.0], [38.5, 26.5], [37.0, 27.5], [36.5, 29.0], [36.5, 32.0], [36.0, 35.5],
      // Levant, Mısır & Kuzey Afrika Kıyıları
      [34.5, 36.0], [33.0, 35.0], [31.5, 34.5], [31.2, 32.0], [31.3, 30.0], [31.5, 26.0],
      [32.8, 22.0], [31.0, 17.0], [33.0, 11.5], [37.0, 10.5], [37.0, 8.0], [36.8, 3.0],
      [35.8, -2.0], [35.8, -5.3], [33.5, -7.5], [30.0, -10.0]
    ],
    // Britanya Adası
    [
      [50.0, -5.5], [51.0, 1.5], [53.0, 0.5], [56.0, -2.5], [58.5, -3.5], [58.0, -5.5],
      [55.0, -5.0], [53.5, -3.0], [51.5, -3.5], [50.0, -5.5]
    ],
    // İrlanda
    [
      [51.5, -9.5], [53.0, -6.0], [55.0, -6.5], [54.5, -10.0], [51.5, -9.5]
    ],
    // Hazar Denizi
    [
      [47.0, 52.0], [44.0, 50.5], [40.0, 53.0], [37.0, 54.0], [37.0, 50.0], [39.0, 49.5],
      [40.5, 50.0], [42.5, 47.5], [45.0, 47.5], [47.0, 52.0]
    ],
    // Basra Körfezi
    [
      [30.0, 48.0], [27.0, 51.0], [25.0, 55.0], [26.0, 56.5], [27.5, 56.5], [29.5, 50.5], [30.0, 48.0]
    ]
  ];

  // Coğrafi Bölge Etiketleri
  const REGION_LABELS = [
    { text: 'AKDENİZ / MARE NOSTRUM', lat: 35.5, lng: 16.5, size: 16, tracking: 4 },
    { text: 'İYONYA & EGE', lat: 38.2, lng: 25.5, size: 12, tracking: 2 },
    { text: 'ENDÜLÜS & İBERYA', lat: 39.5, lng: -4.0, size: 13, tracking: 3 },
    { text: 'MEZOPOTAMYA', lat: 34.0, lng: 43.0, size: 13, tracking: 3 },
    { text: 'HORASAN & İPEK YOLU', lat: 36.5, lng: 57.0, size: 14, tracking: 3 },
    { text: 'MAĞRİP & KUZEY AFRİKA', lat: 32.5, lng: 5.0, size: 13, tracking: 3 },
    { text: 'BATI & ORTA AVRUPA', lat: 48.0, lng: 8.0, size: 14, tracking: 3 }
  ];

  // Vis.js Canvas Üzerine Harita Çizimi (beforeDrawing Hook)
  function drawMap(ctx, isDark) {
    ctx.save();

    // 1. Koordinat Izgarası (Graticule)
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(100, 116, 139, 0.12)';
    ctx.setLineDash([4, 6]);

    // Paraleller (Enlemler: 20°N - 60°N)
    for (let lat = 20; lat <= 60; lat += 10) {
      const pStart = projectRaw(lat, -15);
      const pEnd = projectRaw(lat, 75);
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.stroke();

      // Enlem Etiketi
      ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.45)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${lat}° N`, pStart.x - 45, pStart.y + 3);
    }

    // Meridyenler (Boylamlar: -10°W - 70°E)
    for (let lng = -10; lng <= 70; lng += 15) {
      const pTop = projectRaw(62, lng);
      const pBottom = projectRaw(22, lng);
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.stroke();

      // Boylam Etiketi
      ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.45)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`${lng}° E`, pBottom.x - 12, pBottom.y + 16);
    }

    ctx.setLineDash([]);

    // 2. Kıyı Şeritleri & Kıta Hatları
    ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.45)' : 'rgba(180, 83, 9, 0.5)';
    ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.65)';
    ctx.lineWidth = 1.8;

    for (const poly of COASTLINES) {
      if (poly.length < 2) continue;
      ctx.beginPath();
      const first = projectRaw(poly[0][0], poly[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.length; i++) {
        const pt = projectRaw(poly[i][0], poly[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // 3. Bölge & Deniz İsimleri
    ctx.fillStyle = isDark ? 'rgba(226, 232, 240, 0.32)' : 'rgba(71, 85, 105, 0.35)';
    ctx.textAlign = 'center';
    for (const r of REGION_LABELS) {
      const pos = projectRaw(r.lat, r.lng);
      ctx.font = `600 ${r.size}px Cinzel, serif`;
      ctx.fillText(r.text, pos.x, pos.y);
    }

    // 4. Kuzey Pusula Gülü (Compass Rose)
    const compassPos = projectRaw(59, -10);
    ctx.save();
    ctx.translate(compassPos.x, compassPos.y);
    ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.45)' : 'rgba(217, 119, 6, 0.50)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();

    // Ok ucu (Kuzey)
    ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(6, -6);
    ctx.lineTo(0, -10);
    ctx.lineTo(-6, -6);
    ctx.closePath();
    ctx.fill();

    ctx.font = '700 11px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -32);
    ctx.restore();

    ctx.restore();
  }

  return Object.freeze({
    PHILOSOPHER_COORDS,
    getNodePosition,
    getPhilosopherLatLng,
    drawMap
  });
})();

if (typeof window !== 'undefined') {
  window.PhilosophyGeo = PhilosophyGeo;
}
