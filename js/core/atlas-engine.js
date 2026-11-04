/**
 * =========================================================================
 * ATLAS ENGINE — VIS.JS CANVAS ÜZERİNE HARİTA ÇİZİMİ (beforeDrawing Hook)
 * =========================================================================
 * Kıyı şeritleri, ızgara, bölge etiketleri ve pusula gülü. Veri dosyasından
 * (geo-coordinates.js) buraya taşındı: bu bir renderer'dır, veri değil.
 * Projeksiyon (projectRaw) enjekte edilir — atlas arka planı ile düğüm
 * konumlarının tek projeksiyonu paylaşması garanti edilir (SSOT).
 */

const PhilosophyAtlas = (function () {

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

    // 1. Koordinat Izgarası (Graticule)
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(100, 116, 139, 0.12)';
    ctx.setLineDash([4, 6]);

    // Paraleller (Enlemler: 20°N - 60°N)
    for (let lat = 20; lat <= 60; lat += 10) {
      const pStart = project(lat, -15);
      const pEnd = project(lat, 75);
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
      const pTop = project(62, lng);
      const pBottom = project(22, lng);
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
      const first = project(poly[0][0], poly[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.length; i++) {
        const pt = project(poly[i][0], poly[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }

    // 3. Bölge & Deniz İsimleri
    ctx.fillStyle = isDark ? 'rgba(226, 232, 240, 0.32)' : 'rgba(71, 85, 105, 0.35)';
    ctx.textAlign = 'center';
    for (const r of REGION_LABELS) {
      const pos = project(r.lat, r.lng);
      ctx.font = `600 ${r.size}px Cinzel, serif`;
      ctx.fillText(r.text, pos.x, pos.y);
    }

    // 4. Kuzey Pusula Gülü (Compass Rose)
    const compassPos = project(59, -10);
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

  return Object.freeze({ drawMap });
})();

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof window !== 'undefined') {
  window.PhilosophyAtlas = PhilosophyAtlas;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhilosophyAtlas };
}
