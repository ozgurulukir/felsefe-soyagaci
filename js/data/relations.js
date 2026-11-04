const RAW_RELATIONS = Object.freeze([
  {
    "from": "thales",
    "to": "anaksimandros",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "anaksimandros",
    "to": "anaksimenes",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "thales",
    "to": "pythagoras",
    "type": "influence",
    "label": "Erken Etki"
  },
  {
    "from": "parmenides",
    "to": "zenon_elea",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "demokritos",
    "to": "epikuros",
    "type": "influence",
    "label": "Atomcu Gelenek"
  },
  {
    "from": "sokrates",
    "to": "platon",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "sokrates",
    "to": "antisthenes",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "sokrates",
    "to": "aristippos",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "pythagoras",
    "to": "platon",
    "type": "influence",
    "label": "Matematiksel Etki"
  },
  {
    "from": "parmenides",
    "to": "platon",
    "type": "influence",
    "label": "Varlık Kuramı"
  },
  {
    "from": "platon",
    "to": "aristoteles",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "aristoteles",
    "to": "theophrastos",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "antisthenes",
    "to": "diyojen",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "diyojen",
    "to": "krates",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "krates",
    "to": "zenon_kibris",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "zenon_kibris",
    "to": "hrisippos",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "hrisippos",
    "to": "seneca",
    "type": "influence",
    "label": "Stoa Mirası"
  },
  {
    "from": "epiktetos",
    "to": "aurelius",
    "type": "influence",
    "label": "Stoa Ahlakı"
  },
  {
    "from": "musonios",
    "to": "epiktetos",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "epikuros",
    "to": "lucretius",
    "type": "influence",
    "label": "Epikürizm"
  },
  {
    "from": "pyrrhon",
    "to": "sextus",
    "type": "influence",
    "label": "Septik Gelenek"
  },
  {
    "from": "platon",
    "to": "plotinos",
    "type": "influence",
    "label": "Yeni-Platonculuk"
  },
  {
    "from": "plotinos",
    "to": "augustinus",
    "type": "influence",
    "label": "Platoncu Teoloji"
  },
  {
    "from": "aristoteles",
    "to": "elkindi",
    "type": "influence",
    "label": "İlk Çeviri & Meşşailik"
  },
  {
    "from": "plotinos",
    "to": "elkindi",
    "type": "influence",
    "label": "Südur Etkisi"
  },
  {
    "from": "elkindi",
    "to": "elfarabi",
    "type": "influence",
    "label": "İslam Mantığı"
  },
  {
    "from": "aristoteles",
    "to": "elfarabi",
    "type": "influence",
    "label": "Muallim-i Sani"
  },
  {
    "from": "elfarabi",
    "to": "ibnisina",
    "type": "influence",
    "label": "Metafizik & Mantık"
  },
  {
    "from": "aristoteles",
    "to": "ibnisina",
    "type": "influence",
    "label": "Meşşai Sentez"
  },
  {
    "from": "ibnisina",
    "to": "gazali",
    "type": "influence",
    "label": "Tehafüt Eleştirisi"
  },
  {
    "from": "gazali",
    "to": "ibnrushd",
    "type": "influence",
    "label": "Tehafüt Yanıtı"
  },
  {
    "from": "aristoteles",
    "to": "ibnrushd",
    "type": "influence",
    "label": "Büyük Şerhler"
  },
  {
    "from": "ibnisina",
    "to": "ibnrushd",
    "type": "influence",
    "label": "Felsefi Miras"
  },
  {
    "from": "ibnisina",
    "to": "omer_hayyam",
    "type": "influence",
    "label": "Fikri Miras & Doğa Felsefesi"
  },
  {
    "from": "omer_hayyam",
    "to": "gazali",
    "type": "influence",
    "label": "Çağdaş Tartışma & Şüphe"
  },
  {
    "from": "omer_hayyam",
    "to": "tusi",
    "type": "influence",
    "label": "Matematik & Astronomi Mirası"
  },
  {
    "from": "ibnisina",
    "to": "tusi",
    "type": "influence",
    "label": "İşârât Şerhi & Savunma"
  },
  {
    "from": "ibnrushd",
    "to": "ibnhaldun",
    "type": "influence",
    "label": "Siyaset & Akılcılık Mirası"
  },
  {
    "from": "ibnhaldun",
    "to": "machiavelli",
    "type": "influence",
    "label": "Tarihsel & Siyasal Realizm"
  },
  {
    "from": "aristoteles",
    "to": "aquinas",
    "type": "influence",
    "label": "Aristotelesçi Sentez"
  },
  {
    "from": "ibnrushd",
    "to": "aquinas",
    "type": "influence",
    "label": "Averroizm & Şerhler"
  },
  {
    "from": "augustinus",
    "to": "aquinas",
    "type": "influence",
    "label": "Patristik Temel"
  },
  {
    "from": "ibnisina",
    "to": "aquinas",
    "type": "influence",
    "label": "Varlık-Öz Ayrımı"
  },
  {
    "from": "aquinas",
    "to": "ockham",
    "type": "influence",
    "label": "Nominalist Tepki"
  },
  {
    "from": "machiavelli",
    "to": "hobbes",
    "type": "influence",
    "label": "Siyasal Realizm"
  },
  {
    "from": "ockham",
    "to": "bacon",
    "type": "influence",
    "label": "Ampirik Metot"
  },
  {
    "from": "bacon",
    "to": "locke",
    "type": "influence",
    "label": "Deneysel Bilgi"
  },
  {
    "from": "bacon",
    "to": "hobbes",
    "type": "influence",
    "label": "Mekanik Maddecilik"
  },
  {
    "from": "augustinus",
    "to": "descartes",
    "type": "influence",
    "label": "İçsel Şüphe"
  },
  {
    "from": "descartes",
    "to": "spinoza",
    "type": "influence",
    "label": "Kartezyen Töz"
  },
  {
    "from": "hobbes",
    "to": "spinoza",
    "type": "influence",
    "label": "Politik Doğa"
  },
  {
    "from": "descartes",
    "to": "leibniz",
    "type": "influence",
    "label": "Rasyonalist Miras"
  },
  {
    "from": "spinoza",
    "to": "leibniz",
    "type": "influence",
    "label": "Töz Felsefesi"
  },
  {
    "from": "locke",
    "to": "berkeley",
    "type": "influence",
    "label": "Ampirizm Eleştirisi"
  },
  {
    "from": "berkeley",
    "to": "hume",
    "type": "influence",
    "label": "Kuşkucu Ampirizm"
  },
  {
    "from": "sextus",
    "to": "hume",
    "type": "influence",
    "label": "Radikal Kuşku"
  },
  {
    "from": "descartes",
    "to": "kant",
    "type": "influence",
    "label": "Rasyonalist Miras"
  },
  {
    "from": "leibniz",
    "to": "kant",
    "type": "influence",
    "label": "Alman Rasyonalizmi"
  },
  {
    "from": "hume",
    "to": "kant",
    "type": "influence",
    "label": "Sentetik Apriori Sentezi"
  },
  {
    "from": "rousseau",
    "to": "kant",
    "type": "influence",
    "label": "Ahlak & Özgürlük"
  },
  {
    "from": "kant",
    "to": "fichte",
    "type": "influence",
    "label": "Öznel İdealizm"
  },
  {
    "from": "fichte",
    "to": "schelling",
    "type": "master",
    "label": "Öğretmen-Öğrenci & Doğa İdealizmi"
  },
  {
    "from": "schelling",
    "to": "hegel",
    "type": "influence",
    "label": "Mutlak İdealizm"
  },
  {
    "from": "kant",
    "to": "hegel",
    "type": "influence",
    "label": "Diyalektik Akıl"
  },
  {
    "from": "herakleitos",
    "to": "hegel",
    "type": "influence",
    "label": "Oluş Diyalektiği"
  },
  {
    "from": "hegel",
    "to": "feuerbach",
    "type": "master",
    "label": "Öğretmen-Öğrenci & Genç Hegelcilik"
  },
  {
    "from": "feuerbach",
    "to": "marx",
    "type": "influence",
    "label": "Materyalist Çeviri"
  },
  {
    "from": "hegel",
    "to": "marx",
    "type": "influence",
    "label": "Tarihsel Materyalizm"
  },
  {
    "from": "rousseau",
    "to": "marx",
    "type": "influence",
    "label": "Eşitsizlik Eleştirisi"
  },
  {
    "from": "hegel",
    "to": "kierkegaard",
    "type": "influence",
    "label": "Sistem Karşıtlığı"
  },
  {
    "from": "sokrates",
    "to": "kierkegaard",
    "type": "influence",
    "label": "Varoluşsal İroni"
  },
  {
    "from": "kant",
    "to": "schopenhauer",
    "type": "influence",
    "label": "Numen & İrade"
  },
  {
    "from": "platon",
    "to": "schopenhauer",
    "type": "influence",
    "label": "İdealar Metafiziği"
  },
  {
    "from": "schopenhauer",
    "to": "nietzsche",
    "type": "influence",
    "label": "İsteme Felsefesi"
  },
  {
    "from": "herakleitos",
    "to": "nietzsche",
    "type": "influence",
    "label": "Sonsuz Oluş"
  },
  {
    "from": "locke",
    "to": "mill",
    "type": "influence",
    "label": "Liberal Gelenek"
  },
  {
    "from": "aristoteles",
    "to": "brentano",
    "type": "influence",
    "label": "Ruh & Zihin"
  },
  {
    "from": "brentano",
    "to": "husserl",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "husserl",
    "to": "heidegger",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "kierkegaard",
    "to": "heidegger",
    "type": "influence",
    "label": "Kaygı & Varoluş"
  },
  {
    "from": "nietzsche",
    "to": "heidegger",
    "type": "influence",
    "label": "Metafizik Eleştirisi"
  },
  {
    "from": "heidegger",
    "to": "sartre",
    "type": "influence",
    "label": "Varlık Analizi"
  },
  {
    "from": "husserl",
    "to": "sartre",
    "type": "influence",
    "label": "Fenomenolojik Bilinç"
  },
  {
    "from": "sartre",
    "to": "beauvoir",
    "type": "influence",
    "label": "Varoluşçu Diyalog"
  },
  {
    "from": "sartre",
    "to": "camus",
    "type": "influence",
    "label": "Absürt Diyaloğu"
  },
  {
    "from": "nietzsche",
    "to": "camus",
    "type": "influence",
    "label": "Başkaldırı & Yaşam"
  },
  {
    "from": "frege",
    "to": "russell",
    "type": "influence",
    "label": "Matematiksel Mantık"
  },
  {
    "from": "mill",
    "to": "russell",
    "type": "influence",
    "label": "Ampirist Mantık"
  },
  {
    "from": "russell",
    "to": "wittgenstein",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "frege",
    "to": "wittgenstein",
    "type": "influence",
    "label": "Mantık Felsefesi"
  },
  {
    "from": "schopenhauer",
    "to": "wittgenstein",
    "type": "influence",
    "label": "Sınırlar & Mistik"
  },
  {
    "from": "hume",
    "to": "popper",
    "type": "influence",
    "label": "Tümevarım Eleştirisi"
  },
  {
    "from": "wittgenstein",
    "to": "popper",
    "type": "influence",
    "label": "Bilim & Dil Tartışması"
  },
  {
    "from": "nietzsche",
    "to": "foucault",
    "type": "influence",
    "label": "Soykütük & Güç"
  },
  {
    "from": "heidegger",
    "to": "derrida",
    "type": "influence",
    "label": "Varlık Tarihi"
  },
  {
    "from": "husserl",
    "to": "derrida",
    "type": "influence",
    "label": "Ses ve Fenomen"
  },
  {
    "from": "nietzsche",
    "to": "derrida",
    "type": "influence",
    "label": "Perspektivizm"
  },
  {
    "from": "parmenides",
    "to": "leukippos",
    "type": "influence",
    "label": "Elea Ontolojisine Yanıt"
  },
  {
    "from": "leukippos",
    "to": "demokritos",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "ockham",
    "to": "locke",
    "type": "influence",
    "label": "Nominalist Empirizm"
  },
  {
    "from": "hobbes",
    "to": "locke",
    "type": "influence",
    "label": "Toplum Sözleşmesi"
  },
  {
    "from": "spinoza",
    "to": "hegel",
    "type": "influence",
    "label": "Töz ve Bütünlük"
  },
  {
    "from": "locke",
    "to": "hume",
    "type": "influence",
    "label": "Deneyci Gelenek"
  },
  {
    "from": "locke",
    "to": "kant",
    "type": "influence",
    "label": "Bilginin Sınırları"
  },
  {
    "from": "kant",
    "to": "schelling",
    "type": "influence",
    "label": "Transandantal Felsefe"
  },
  {
    "from": "fichte",
    "to": "hegel",
    "type": "influence",
    "label": "Tez-Antitez Diyalektiği"
  },
  {
    "from": "kierkegaard",
    "to": "sartre",
    "type": "influence",
    "label": "Varoluşsal Seçim"
  },
  {
    "from": "kierkegaard",
    "to": "camus",
    "type": "influence",
    "label": "Absürt ve İnanç"
  },
  {
    "from": "hegel",
    "to": "beauvoir",
    "type": "influence",
    "label": "Efendi-Köle & Öteki"
  },
  {
    "from": "russell",
    "to": "popper",
    "type": "influence",
    "label": "Analitik Eleştiri"
  },
  {
    "from": "schopenhauer",
    "to": "freud",
    "type": "influence",
    "label": "Bilinçdışı İrade"
  },
  {
    "from": "brentano",
    "to": "freud",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "frege",
    "to": "carnap",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "wittgenstein",
    "to": "carnap",
    "type": "influence",
    "label": "Tractatus & Mantık"
  },
  {
    "from": "russell",
    "to": "carnap",
    "type": "influence",
    "label": "Mantıksal Kuruluş"
  },
  {
    "from": "heidegger",
    "to": "gadamer",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "heidegger",
    "to": "arendt",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "kant",
    "to": "arendt",
    "type": "influence",
    "label": "Yargı Yetisi & Politik"
  },
  {
    "from": "husserl",
    "to": "merleauponty",
    "type": "influence",
    "label": "Yaşam-Dünyası & Algı"
  },
  {
    "from": "heidegger",
    "to": "merleauponty",
    "type": "influence",
    "label": "Dünyada-Varlık"
  },
  {
    "from": "sartre",
    "to": "merleauponty",
    "type": "influence",
    "label": "Fenomenolojik Diyalog"
  },
  {
    "from": "sartre",
    "to": "fanon",
    "type": "influence",
    "label": "Varoluşçu Özgürleşme"
  },
  {
    "from": "hegel",
    "to": "fanon",
    "type": "influence",
    "label": "Tanınma Diyalektiği"
  },
  {
    "from": "canguilhem",
    "to": "foucault",
    "type": "master",
    "label": "Öğretmen-Öğrenci"
  },
  {
    "from": "spinoza",
    "to": "deleuze",
    "type": "influence",
    "label": "İçkinlik ve Kudret"
  },
  {
    "from": "nietzsche",
    "to": "deleuze",
    "type": "influence",
    "label": "Fark ve Oluş"
  },
  {
    "from": "hume",
    "to": "deleuze",
    "type": "influence",
    "label": "Ampirizm ve Öznellik"
  },
  {
    "from": "demokritos",
    "to": "pyrrhon",
    "type": "influence",
    "label": "Duyuların Göreliliği & Kuşku"
  },
  {
    "from": "sokrates",
    "to": "pyrrhon",
    "type": "influence",
    "label": "Bilgisizlik Bilinci"
  },
  {
    "from": "aristoteles",
    "to": "machiavelli",
    "type": "influence",
    "label": "Politika & Rejim Analizi"
  },
  {
    "from": "hobbes",
    "to": "rousseau",
    "type": "influence",
    "label": "Doğa Durumu Tartışması"
  },
  {
    "from": "locke",
    "to": "rousseau",
    "type": "influence",
    "label": "Toplum Sözleşmesi Geleneği"
  },
  {
    "from": "leibniz",
    "to": "frege",
    "type": "influence",
    "label": "Sembolik Mantık & Evrensel Dil"
  },
  {
    "from": "kant",
    "to": "frege",
    "type": "influence",
    "label": "Aritmetiğin Temelleri Tartışması"
  },
  {
    "from": "descartes",
    "to": "canguilhem",
    "type": "influence",
    "label": "Mekanik Beden Eleştirisi"
  },
  {
    "from": "kant",
    "to": "canguilhem",
    "type": "influence",
    "label": "Organizma ve Normativite"
  }
]);

// Düğüm (global script) ve Node.js (test) ortamlarında aynı dosya çalışsın
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RAW_RELATIONS };
}
