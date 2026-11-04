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
npm run build  # css/tailwind.css'i minify ederek üretir
```

Statik dosyalar olduğu gibi yayınlanır; `css/tailwind.css` commitlidir, bu yüzden GitHub Pages build adımı gerektirmez (Deploy from a branch: `main` / root).

## Veri

Filozof verileri `js/data/` altındaki modüllerde tutulur: `entities.js`, `relations.js`, `era-themes.js`, `geo-coordinates.js`.
