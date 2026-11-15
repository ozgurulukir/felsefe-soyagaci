/**
 * =========================================================================
 * ATLAS ENGINE — VIS.JS CANVAS ÜZERİNE HARİTA ÇİZİMİ (beforeDrawing Hook)
 * =========================================================================
 * Kapalı kıta/ada poligonları, iç denizler, nehirler, enlem-boylam ızgarası,
 * bölge etiketleri ve pusula gülü. Veri dosyasından (geo-coordinates.js)
 * ayrı bir renderer modülüdür; projeksiyon (projectRaw) dışarıdan enjekte
 * edilir — atlas arka planı ile düğüm konumları tek projeksiyonu paylaşır (SSOT).
 */

const PhilosophyAtlas = (function () {

  // Harita Çerçevesi Sınırları [Enlem, Boylam]
  const BOUNDS = Object.freeze({ minLat: 22, maxLat: 62, minLng: -15, maxLng: 75 });

  // Kapalı Kıta ve Ada Poligonları (Birleşik Avrasya-Kuzey Afrika, İskandinavya ve Adalar)
  const LANDMASSES = [
    // 1. Birleşik Kıta Avrupası, Anadolu, Yakın Doğu, İran/Horasan ve Kuzey Afrika
    [
      [36.0, -5.6], [37.0, -9.0], [38.7, -9.5], [41.2, -8.7], [43.0, -9.3], [43.5, -7.0],
      [43.4, -1.5], [46.2, -1.2], [47.3, -2.5], [48.4, -4.8], [48.7, -1.8], [49.7, -1.9],
      [49.4, 0.1], [50.9, 1.6], [51.4, 3.4], [52.1, 4.3], [53.2, 5.0], [53.4, 6.9],
      [53.9, 8.7], [55.5, 8.1], [57.1, 8.6], [57.7, 10.6], [56.1, 10.3], [54.4, 10.2],
      [54.0, 10.9], [54.1, 12.1], [54.4, 13.6], [54.0, 14.8], [54.5, 16.9], [54.4, 18.7],
      [54.7, 20.5], [55.7, 21.1], [57.0, 24.1], [59.4, 24.8], [60.0, 29.5], [62.0, 30.0],
      [62.0, 75.0], [22.0, 75.0], [22.0, 59.5], [25.0, 57.0], [26.6, 56.3], [27.2, 56.3],
      [27.8, 52.0], [29.0, 50.8], [30.0, 49.5], [30.0, 48.0], [29.0, 48.1], [27.0, 49.6],
      [25.2, 51.5], [24.2, 54.5], [26.1, 56.2], [22.5, 59.5], [22.0, 40.5], [28.0, 34.5],
      [29.9, 32.5], [28.0, 33.2], [22.0, 36.8], [22.0, -15.0], [28.0, -13.0], [31.5, -9.8],
      [33.6, -7.6], [35.8, -5.9], [35.9, -5.3], [35.2, -3.0], [35.7, -0.6], [36.8, 3.0],
      [36.9, 7.8], [37.3, 9.9], [36.8, 10.3], [35.8, 10.6], [33.9, 10.1], [32.9, 13.2],
      [32.4, 15.1], [31.2, 16.6], [30.6, 19.0], [32.1, 20.1], [32.9, 21.9], [32.0, 24.0],
      [31.5, 25.2], [31.1, 28.0], [31.2, 29.9], [31.5, 31.0], [31.3, 32.3], [31.3, 34.3],
      [32.8, 35.0], [33.9, 35.5], [35.5, 35.8], [36.6, 36.2], [36.8, 34.5], [36.1, 32.8],
      [36.9, 30.7], [36.2, 29.6], [36.7, 27.4], [37.5, 27.3], [37.9, 27.3], [38.4, 26.8],
      [39.5, 26.2], [40.0, 26.2], [40.4, 27.8], [40.3, 28.9], [41.0, 29.1], [41.5, 32.0],
      [42.0, 35.2], [41.3, 36.4], [41.0, 39.7], [41.6, 41.6], [43.2, 40.3], [44.5, 38.0],
      [45.3, 36.8], [46.6, 38.3], [47.1, 39.2], [46.5, 35.5], [45.3, 36.5], [44.4, 33.8],
      [45.4, 32.5], [46.1, 33.5], [46.6, 30.8], [45.2, 29.7], [44.2, 28.6], [42.5, 27.5],
      [41.2, 29.0], [41.0, 28.8], [40.4, 26.7], [40.9, 24.9], [40.6, 23.0], [39.3, 23.0],
      [38.0, 24.1], [37.4, 23.5], [36.4, 23.1], [36.4, 22.4], [36.8, 21.7], [37.9, 21.3],
      [38.3, 21.8], [39.0, 20.7], [40.5, 19.4], [41.8, 19.5], [43.5, 16.4], [45.6, 13.7],
      [45.4, 12.3], [44.0, 12.6], [42.0, 15.0], [41.2, 16.8], [40.1, 18.5], [40.4, 17.2],
      [39.1, 17.1], [37.9, 15.7], [38.2, 15.6], [40.1, 15.1], [40.8, 14.3], [41.8, 12.3],
      [43.7, 10.3], [44.4, 8.9], [43.8, 7.5], [43.3, 5.4], [43.0, 3.1], [41.4, 2.2],
      [39.5, -0.3], [38.3, -0.5], [36.7, -2.2], [36.7, -4.4], [36.0, -5.6]
    ],
    // 3. İskandinavya Güneyi
    [
      [55.4, 13.0], [56.2, 16.0], [58.8, 17.8], [59.4, 18.5], [60.5, 18.0], [62.0, 17.5],
      [62.0, 5.0], [60.4, 5.2], [58.9, 5.6], [58.0, 7.5], [59.0, 10.2], [59.9, 10.7],
      [58.9, 11.1], [57.7, 11.9], [56.0, 12.7], [55.4, 13.0]
    ],
    // 4. Büyük Britanya Adası
    [
      [50.0, -5.7], [50.4, -3.5], [50.7, -1.0], [51.1, 1.4], [51.4, 1.4], [51.8, 1.0],
      [52.7, 1.7], [53.6, 0.1], [54.5, -0.6], [55.8, -2.1], [56.0, -3.2], [56.4, -2.8],
      [57.7, -2.0], [57.6, -4.0], [58.6, -3.1], [58.6, -5.0], [57.2, -5.8], [56.0, -5.6],
      [55.0, -5.1], [54.7, -3.6], [53.4, -3.1], [53.3, -4.5], [52.4, -4.1], [51.7, -5.1],
      [51.5, -3.2], [51.2, -4.2], [50.0, -5.7]
    ],
    // 5. İrlanda Adası
    [
      [51.5, -9.8], [51.9, -8.0], [52.2, -6.4], [53.3, -6.1], [54.6, -5.5], [55.3, -7.3],
      [54.5, -8.5], [53.9, -10.0], [53.2, -9.8], [52.1, -10.4], [51.5, -9.8]
    ],
    // 6. Sicilya, 7. Sardinya, 8. Korsika, 9. Girit, 10. Kıbrıs
    [[38.2, 15.6], [37.5, 15.1], [36.7, 15.1], [37.2, 13.6], [37.8, 12.4], [38.2, 13.3], [38.2, 15.6]],
    [[41.2, 9.4], [40.0, 9.7], [38.9, 9.5], [38.9, 8.4], [40.6, 8.2], [41.2, 9.4]],
    [[43.0, 9.4], [42.0, 9.5], [41.4, 9.2], [41.9, 8.6], [42.6, 8.7], [43.0, 9.4]],
    [[35.6, 23.6], [35.4, 24.5], [35.2, 26.3], [35.0, 25.2], [35.2, 23.6], [35.6, 23.6]],
    [[35.7, 34.6], [35.0, 34.1], [34.6, 33.0], [34.9, 32.3], [35.2, 32.6], [35.4, 33.4], [35.7, 34.6]]
  ];

  // İç Denizler ve Göller (Kara üzerine deniz dolgusu ile oyulur: Hazar Denizi & Aral Gölü)
  const INLAND_SEAS = [
    [
      [47.0, 52.0], [45.5, 50.5], [44.5, 50.2], [42.0, 52.5], [40.0, 53.0], [37.0, 54.0],
      [36.7, 52.0], [37.5, 49.2], [39.5, 49.4], [40.4, 50.3], [41.8, 48.5], [44.0, 47.0],
      [46.5, 48.0], [47.0, 52.0]
    ],
    [[46.5, 60.5], [45.0, 61.2], [43.6, 59.5], [44.2, 58.3], [46.0, 58.8], [46.5, 60.5]]
  ];

  // Tarihsel Nehir Hatları (Nil, Fırat, Dicle, Ceyhun, Tuna, Ren)
  const RIVERS = [
    [[24.0, 32.9], [26.2, 32.0], [27.2, 31.2], [29.0, 31.2], [30.1, 31.2], [31.2, 30.4]],
    [[39.0, 39.0], [37.0, 38.0], [35.3, 40.1], [33.3, 43.8], [31.0, 46.2], [30.0, 48.0]],
    [[38.0, 40.2], [36.3, 43.1], [33.3, 44.4], [31.0, 47.4], [30.0, 48.0]],
    [[37.0, 67.0], [39.0, 63.5], [41.5, 60.5], [43.6, 59.5]],
    [[48.0, 8.5], [48.3, 14.3], [48.2, 16.4], [47.5, 19.0], [44.8, 20.5], [44.2, 26.0], [45.2, 29.7]],
    [[47.6, 7.6], [49.0, 8.4], [50.9, 7.0], [52.0, 4.3]]
  ];

  // Coğrafi Bölge ve Deniz Etiketleri
  const REGION_LABELS = [
    { text: 'AKDENİZ / MARE NOSTRUM', lat: 34.5, lng: 18.0, size: 18, sea: true },
    { text: 'KARADENİZ', lat: 43.3, lng: 34.5, size: 13, sea: true },
    { text: 'HAZAR DENİZİ', lat: 41.5, lng: 51.2, size: 12, sea: true },
    { text: 'İYONYA & EGE', lat: 38.5, lng: 25.2, size: 13, sea: false },
    { text: 'ENDÜLÜS & İBERYA', lat: 39.8, lng: -4.2, size: 14, sea: false },
    { text: 'MEZOPOTAMYA', lat: 34.2, lng: 43.2, size: 14, sea: false },
    { text: 'HORASAN & İPEK YOLU', lat: 37.5, lng: 58.5, size: 15, sea: false },
    { text: 'MAĞRİP & KUZEY AFRİKA', lat: 31.0, lng: 7.5, size: 14, sea: false },
    { text: 'BATI & ORTA AVRUPA', lat: 47.5, lng: 9.5, size: 15, sea: false },
    { text: 'ANADOLU', lat: 39.2, lng: 33.5, size: 14, sea: false }
  ];

  function tracePoly(ctx, poly, project, close) {
    if (poly.length < 2) return;
    ctx.beginPath();
    const first = project(poly[0][0], poly[0][1]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < poly.length; i++) {
      const pt = project(poly[i][0], poly[i][1]);
      ctx.lineTo(pt.x, pt.y);
    }
    if (close && typeof ctx.closePath === 'function') ctx.closePath();
  }

  function fillAndStrokePolygons(ctx, polygons, project, fillStyle, glowStyle, strokeStyle) {
    for (const poly of polygons) {
      tracePoly(ctx, poly, project, true);
      ctx.fillStyle = fillStyle;
      if (typeof ctx.fill === 'function') ctx.fill();
      if (glowStyle) {
        ctx.strokeStyle = glowStyle;
        ctx.lineWidth = 4.5;
        ctx.stroke();
      }
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx vis-network beforeDrawing bağlamı
   * @param {boolean} isDark
   * @param {function} project (lat, lng) → {x, y} — geo-coordinates'taki projeksiyon
   */
  function drawMap(ctx, isDark, project) {
    if (typeof project !== 'function') {
      console.error('[Atlas Error] Projeksiyon fonksiyonu enjekte edilmedi; atlas arka planı çizilemedi.');
      return;
    }

    ctx.save();

    const seaFill = isDark ? 'rgba(8, 15, 30, 0.86)' : 'rgba(214, 231, 245, 0.72)';
    const landFill = isDark ? 'rgba(30, 41, 59, 0.82)' : 'rgba(247, 242, 228, 0.94)';
    const coastGlow = isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(14, 116, 144, 0.14)';
    const coastStroke = isDark ? 'rgba(148, 163, 184, 0.58)' : 'rgba(71, 85, 105, 0.65)';

    // 0. Harita Deniz Zemini & Çift Çizgili Kartografik Çerçeve (Neatline)
    const nw = project(BOUNDS.maxLat, BOUNDS.minLng);
    const se = project(BOUNDS.minLat, BOUNDS.maxLng);
    const framePoly = [
      [BOUNDS.maxLat, BOUNDS.minLng], [BOUNDS.maxLat, BOUNDS.maxLng],
      [BOUNDS.minLat, BOUNDS.maxLng], [BOUNDS.minLat, BOUNDS.minLng]
    ];
    tracePoly(ctx, framePoly, project, true);
    ctx.fillStyle = seaFill;
    if (typeof ctx.fill === 'function') ctx.fill();

    // 1. Kara Parçaları ve Adalar (Dolgu + Kıyı Halosu + Kıyı Konturu)
    fillAndStrokePolygons(ctx, LANDMASSES, project, landFill, coastGlow, coastStroke);

    // 2. İç Denizler (Hazar Denizi & Aral Gölü)
    fillAndStrokePolygons(ctx, INLAND_SEAS, project, seaFill, coastGlow, coastStroke);

    // 3. Tarihsel Nehirler
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.42)';
    ctx.lineWidth = 1.4;
    for (const river of RIVERS) {
      tracePoly(ctx, river, project, false);
      ctx.stroke();
    }

    // 4. Koordinat Izgarası (Graticule: Paraleller ve Meridyenler)
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.20)' : 'rgba(71, 85, 105, 0.22)';
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.68)' : 'rgba(71, 85, 105, 0.75)';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.setLineDash([5, 7]);

    for (let lat = 25; lat <= 60; lat += 5) {
      const pStart = project(lat, BOUNDS.minLng);
      const pEnd = project(lat, BOUNDS.maxLng);
      const pLabel = project(lat, -11);
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.stroke();
      if (lat % 10 === 0) {
        ctx.textAlign = 'left';
        ctx.fillText(`${lat}° K`, pLabel.x + 6, pLabel.y - 5);
      }
    }

    for (let lng = -10; lng <= 70; lng += 10) {
      const pTop = project(BOUNDS.maxLat, lng);
      const pBottom = project(BOUNDS.minLat, lng);
      const pLabel = project(26, lng);
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pBottom.x, pBottom.y);
      ctx.stroke();
      const dir = lng < 0 ? 'B' : (lng > 0 ? 'D' : '');
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.abs(lng)}°${dir ? ' ' + dir : ''}`, pLabel.x, pLabel.y - 6);
    }

    ctx.setLineDash([]);

    // Çerçeve Kenarlığı
    tracePoly(ctx, framePoly, project, true);
    ctx.strokeStyle = coastStroke;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 5. Bölge & Deniz İsimleri
    ctx.textAlign = 'center';
    for (const r of REGION_LABELS) {
      const pos = project(r.lat, r.lng);
      ctx.fillStyle = r.sea
        ? (isDark ? 'rgba(125, 211, 252, 0.42)' : 'rgba(3, 105, 161, 0.48)')
        : (isDark ? 'rgba(226, 232, 240, 0.46)' : 'rgba(51, 65, 85, 0.52)');
      ctx.font = `${r.sea ? 'italic 600' : '700'} ${r.size}px Cinzel, serif`;
      ctx.fillText(r.text, pos.x, pos.y);
    }

    // 6. Kuzey Pusula Gülü (Compass Rose — Orta Akdeniz açıklarında görünür konumda)
    const compassPos = project(33.5, 15.5);
    ctx.save();
    ctx.translate(compassPos.x, compassPos.y);
    ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.65)' : 'rgba(180, 83, 9, 0.70)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(7, -6);
    ctx.lineTo(0, -12);
    ctx.lineTo(-7, -6);
    ctx.closePath();
    ctx.fill();

    ctx.font = '700 12px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('K', 0, -38);
    ctx.restore();

    ctx.restore();
  }

  return Object.freeze({ drawMap, LANDMASSES, INLAND_SEAS, RIVERS, REGION_LABELS, BOUNDS });
})();

if (typeof window !== 'undefined') {
  window.PhilosophyAtlas = PhilosophyAtlas;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhilosophyAtlas };
}
