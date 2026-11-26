# Felsefe Soyağacı

Filozofları tekil biyografi kutucuklarından çıkarıp aralarındaki öğretmen–öğrenci ve etki bağlarını haritalandıran interaktif düşünce ağı uygulaması.

**Canlı:** https://ozgurulukir.github.io/felsefe-soyagaci/

## Teknoloji

- [vis-network](https://visjs.github.io/vis-network/) — kronolojik graf görünümü
- [Leaflet](https://leafletjs.com/) — coğrafi (harita) görünümü
- [Tailwind CSS](https://tailwindcss.com/) — yalnızca bu sayfaya özel derleme

## Geliştirme

```bash
npm install
npm run dev    # Tailwind watch modu
npm run build  # css/tailwind.css'i minify ederek üretir + index.html sayaçlarını veriyle senkronlar
npm test       # node --test ile tüm modül ve veri bütünlüğü testleri
```

`npm run build` sonrası `css/tailwind.css` ve `index.html` değişmişse bu değişiklikleri commit edin. CI her push'ta testleri çalıştırır, `scripts/sync-stats.js --check` ile sayaç uyumunu doğrular ve derleme çıktısı commitlenmemişse hatayı raporlar.

Statik dosyalar olduğu gibi yayınlanır; `css/tailwind.css` commitlidir, bu yüzden GitHub Pages build adımı gerektirmez (Deploy from a branch: `main` / root).

## Mimari

- `js/core/` — tek doğruluk kaynağı (SSOT) modülleri: şema, graf veritabanı, düzen seçenekleri, düzen tercihi (`layout-pref`), kamera davranışı (`viewport`), kenar stili, tema, görünüm filtresi
- `js/ui/` — arama, yol bulucu, geo mod gibi arayüz işleyicileri; bağlantılar `js/app.js`'te
- `js/data/` — filozof verileri: `entities.js`, `relations.js`, `era-themes.js`, `geo-coordinates.js`
- `test/` — Node.js test paketi; `js/core` ve `js/ui` modülleri DOM'a bağımlı olmadan (bağımlılık enjeksiyonuyla) test edilir
