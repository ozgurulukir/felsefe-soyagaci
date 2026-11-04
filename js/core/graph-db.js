/**
 * =========================================================================
 * 3. GRAPH DATABASE / TREE DATABASE MOTORU (GRAPHOLOGY ENTEGRASYONU)
 * =========================================================================
 */
class PhilosophyGraphDatabase {
  constructor(entities, relations) {
    const GraphCtor = window.graphology && (window.graphology.Graph || window.graphology);
    if (typeof GraphCtor !== 'function') {
      throw new Error('[Graph Error] Graphology kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.');
    }

    // Graphology: düğüm, kenar ve komşuluk için tek doğruluk kaynağı (SSOT)
    this._graph = new GraphCtor({ type: 'directed', multi: true });
    this._eraIndex = new Map();

    this._loadAndIndex(entities, relations);
    this._computeChronologicalLevels();
  }

  _loadAndIndex(entities, relations) {
    for (const [id, entity] of Object.entries(entities)) {
      if (entity.id !== id) {
        throw new Error(`[Schema Error] Anahtar ile id alanı eşleşmiyor: anahtar "${id}" ≠ id "${entity.id}"`);
      }
      PhilosophySchema.validateEntity(entity);
      this._graph.addNode(id, Object.freeze({ ...entity }));

      if (!this._eraIndex.has(entity.era)) {
        this._eraIndex.set(entity.era, new Set());
      }
      this._eraIndex.get(entity.era).add(id);
    }

    relations.forEach((rel, idx) => {
      PhilosophySchema.validateRelation(rel);
      // Kopuk kenarı sessizce düşürmek yerine şema katmanıyla tutarlı şekilde durdur
      if (!this._graph.hasNode(rel.from) || !this._graph.hasNode(rel.to)) {
        throw new Error(`[Graph Error] İlişki bilinmeyen düşünüre işaret ediyor: "${rel.from}" ➔ "${rel.to}"`);
      }
      this._graph.addEdgeWithKey('edge_' + idx, rel.from, rel.to, {
        type: rel.type,
        label: rel.label
      });
    });
  }

  getEntity(id) {
    return this._graph.hasNode(id) ? this._graph.getNodeAttributes(id) : null;
  }

  getAllEntities() {
    return this._graph.mapNodes((id, attrs) => attrs);
  }

  getAllRelations() {
    return this._graph.mapEdges((edgeId, attrs, from, to) => ({
      id: edgeId,
      from,
      to,
      type: attrs.type,
      label: attrs.label
    }));
  }

  getByEra(era) {
    if (era === 'all') return this.getAllEntities();
    const ids = this._eraIndex.get(era) || new Set();
    return Array.from(ids).map(id => this.getEntity(id));
  }

  getEraCount(era) {
    if (era === 'all') return this._graph.order;
    const ids = this._eraIndex.get(era);
    return ids ? ids.size : 0;
  }

  // Doğrudan Hocaları / Öncülleri (In-degree komşular + ilişki detayı)
  getTeachers(id) {
    if (!this._graph.hasNode(id)) return [];
    return this._graph.mapInEdges(id, (edgeId, attrs, source) => ({
      ...this.getEntity(source),
      relationType: attrs.type,
      relationLabel: attrs.label
    }));
  }

  // Doğrudan Öğrencileri / Ardılları (Out-degree komşular + ilişki detayı)
  getStudents(id) {
    if (!this._graph.hasNode(id)) return [];
    return this._graph.mapOutEdges(id, (edgeId, attrs, source, target) => ({
      ...this.getEntity(target),
      relationType: attrs.type,
      relationLabel: attrs.label
    }));
  }
  // Bir filozofun doğrudan komşuluk kümesini döndürür (Kendisi + Hocaları + Öğrencileri)
  getNeighborhoodSet(id) {
    const set = new Set([id]);
    for (const t of this.getTeachers(id)) set.add(t.id);
    for (const s of this.getStudents(id)) set.add(s.id);
    return set;
  }

  // Dönem tabanlarını ve yönlü bağlantıları dikkate alan kronolojik katman (level) hesabı
  _computeChronologicalLevels() {
    // Dönem tabanları schema.js'deki ERAS listesinden türetilir (SSOT).
    const eraBaseLevel = new Map(
      PhilosophySchema.ERAS.map(function(e) { return [e.id, e.baseLevel]; })
    );

    this._levels = new Map();
    for (const entity of this.getAllEntities()) {
      if (!eraBaseLevel.has(entity.era)) {
        throw new Error(`[Graph Error] Bilinmeyen dönem tabanı: ${entity.era} (id: ${entity.id})`);
      }
      this._levels.set(entity.id, eraBaseLevel.get(entity.era));
    }

    // Döngüsel ilişki durumunda sonsuz döngüyü önlemek için üst sınır (düğüm sayısı kadar geçiş yeter)
    let changed = true;
    let passes = 0;
    const relations = this.getAllRelations();
    const maxPasses = this._graph.order + 1;
    while (changed && passes++ < maxPasses) {
      changed = false;
      for (const rel of relations) {
        const uLvl = this._levels.get(rel.from);
        const vLvl = this._levels.get(rel.to);
        if (vLvl <= uLvl) {
          this._levels.set(rel.to, uLvl + 1);
          changed = true;
        }
      }
    }
  }

  getLevel(id) {
    return this._levels.get(id) ?? 0;
  }

  // İki Filozof Arasında Entelektüel Yol Bulma (Önce yönlü, sonra ters-yönlü, bulunamazsa yönsüz BFS)
  findPath(startId, endId) {
    if (!this._graph.hasNode(startId) || !this._graph.hasNode(endId)) return null;
    if (startId === endId) return [startId];

    // 1. Önce kronolojik / yönlü yol ara (start ➔ end)
    const forwardPath = this._bfsDirected(startId, endId);
    if (forwardPath) return forwardPath;

    // 2. Ters kronolojik seçim yapıldıysa (end ➔ start yönlü yolun tersi)
    const reversePath = this._bfsDirected(endId, startId);
    if (reversePath) return reversePath.reverse();

    // 3. Doğrudan yönlü akış yoksa genel soykütük bağlantısını bul (yönsüz BFS)
    const queue = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      const neighbors = [
        ...this.getStudents(current).map(p => p.id),
        ...this.getTeachers(current).map(p => p.id)
      ];

      for (const neighbor of neighbors) {
        if (neighbor === endId) return [...path, neighbor];
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }
    return null;
  }

  _bfsDirected(startId, endId) {
    const queue = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      for (const student of this.getStudents(current)) {
        if (student.id === endId) return [...path, student.id];
        if (!visited.has(student.id)) {
          visited.add(student.id);
          queue.push([...path, student.id]);
        }
      }
    }
    return null;
  }
}

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhilosophyGraphDatabase };
}
