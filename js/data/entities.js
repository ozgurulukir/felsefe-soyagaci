
/**
 * Filozoflar Soyağacı — Veri Kaynağı (Single Source of Truth)
 * Tüm varlıklar (RAW_ENTITIES) ve yönlü ilişkiler (RAW_RELATIONS) burada tanımlanır.
 */
const RAW_ENTITIES = Object.freeze({
  "thales": {
    "id": "thales",
    "name": "Thales",
    "dates": "MÖ 624 – 546",
    "era": "antik",
    "eraName": "Antik Çağ & İyonya",
    "school": "Milet Okulu (Doğa Felsefesi)",
    "city": "Miletos (Milet), İyonya",
    "quote": "Her şeyin ilkesi (arkhe) sudur. Evren canlıdır ve tanrılarla doludur.",
    "summary": "Batı felsefesinin ve biliminin kurucusu kabul edilir. Mitolojik açıklamalar yerine doğayı doğal nedenlerle açıklama geleneğini başlattı.",
    "concepts": [
      "Arkhe (İlk Neden)",
      "Su Tözü",
      "Doğa Araştırması",
      "Geometri & Astronomi"
    ],
    "works": [
      "Doğa Üzerine (Fragmanlar)"
    ]
  },
  "anaksimandros": {
    "id": "anaksimandros",
    "name": "Anaksimandros",
    "dates": "MÖ 610 – 546",
    "era": "antik",
    "eraName": "Antik Çağ & İyonya",
    "school": "Milet Okulu",
    "city": "Miletos, İyonya",
    "quote": "Varlıkların ilkesi apeirondur (sınırsız, sonsuz ve belirsiz olan).",
    "summary": "Thales'in öğrencisi. Evrenin ana maddesini somut bir element yerine soyut bir ilke olan 'Apeiron' (sınırsız olan) ile tanımlamıştır.",
    "concepts": [
      "Apeiron (Sınırsız)",
      "Evren Haritası",
      "Zıtların Dengesi",
      "Kozmoloji"
    ],
    "works": [
      "Doğa Üzerine"
    ]
  },
  "anaksimenes": {
    "id": "anaksimenes",
    "name": "Anaksimenes",
    "dates": "MÖ 585 – 528",
    "era": "antik",
    "eraName": "Antik Çağ & İyonya",
    "school": "Milet Okulu",
    "city": "Miletos, İyonya",
    "quote": "Ruhumuz olan hava bizi nasıl bir arada tutuyorsa, soluk ve hava da bütün dünyayı kuşatır.",
    "summary": "Milet okulunun üçüncü büyük düşünürüdür. Arkhe olarak 'hava'yı (aer) belirlemiş; seyrekleşme ve yoğunlaşma ile diğer maddelerin oluştuğunu öne sürmüştür.",
    "concepts": [
      "Hava (Aer)",
      "Yoğunlaşma & Seyrekleşme",
      "Canlı Kozmos"
    ],
    "works": [
      "Doğa Üzerine"
    ]
  },
  "pythagoras": {
    "id": "pythagoras",
    "name": "Pisagor (Pythagoras)",
    "dates": "MÖ 570 – 495",
    "era": "antik",
    "eraName": "Antik Çağ & Ön-Sokratik",
    "school": "Pisagorculuk",
    "city": "Sisam (Samos) / Kroton",
    "quote": "Her şey sayıdır. Evren matematiksel bir uyum ve müzikal bir ahenktir.",
    "summary": "Evrenin temel yapısının sayılar ve geometrik oranlar olduğunu savunan felsefi ve dini bir okul kurdu. Ruhgöçü ve armoni kavramlarını geliştirdi.",
    "concepts": [
      "Sayılar Metafiziği",
      "Kürelerin Müziği",
      "Ruhgöçü (Metempsikoz)",
      "Matematiksel Uyum"
    ],
    "works": [
      "Sözlü Gelenek & Altın Dizeler"
    ]
  },
  "herakleitos": {
    "id": "herakleitos",
    "name": "Herakleitos",
    "dates": "MÖ 535 – 475",
    "era": "antik",
    "eraName": "Antik Çağ & Ön-Sokratik",
    "school": "Efes Okulu / Oluş Felsefesi",
    "city": "Ephesos (Efes)",
    "quote": "Aynı nehirde iki kez yıkanamazsınız; çünkü sular hep değişir, nehir aynı nehir değildir.",
    "summary": "Karanlık Filozof olarak bilinir. Sürekli değişimi (oluş), zıtların birliğini ve evreni yöneten evrensel aklı (Logos) felsefesinin merkezine koymuştur.",
    "concepts": [
      "Logos (Akıl/Yasa)",
      "Panta Rhei (Her Şey Akar)",
      "Zıtların Birliği",
      "Ateş"
    ],
    "works": [
      "Doğa Üzerine (Fragmanlar)"
    ]
  },
  "parmenides": {
    "id": "parmenides",
    "name": "Parmenides",
    "dates": "MÖ 515 – 450",
    "era": "antik",
    "eraName": "Antik Çağ & Elea Okulu",
    "school": "Elea Okulu (Ontoloji)",
    "city": "Elea, Güney İtalya",
    "quote": "Varlık vardır, yokluk yoktur. Düşünmek ile var olmak aynı şeydir.",
    "summary": "Batı metafiziğinin ve ontolojisinin babasıdır. Değişimin ve çokluğun bir yanılsama olduğunu, hakiki Varlığın bir, bölünmez, ebedi ve hareketsiz olduğunu savunmuştur.",
    "concepts": [
      "Varlık Birdir",
      "Akıl ve Hakikat Yolu (Aletheia)",
      "Sanı Yolu (Doxa)",
      "Değişmezlik"
    ],
    "works": [
      "Doğa Üzerine Şiir"
    ]
  },
  "zenon_elea": {
    "id": "zenon_elea",
    "name": "Elealı Zenon",
    "dates": "MÖ 490 – 430",
    "era": "antik",
    "eraName": "Antik Çağ & Elea Okulu",
    "school": "Elea Okulu",
    "city": "Elea",
    "quote": "Harekette olan bir ok aslında havada hareketsiz durmaktadır.",
    "summary": "Parmenides'in biricik varlık öğretisini savunmak için hareket ve çokluğun imkansız olduğunu gösteren ünlü paradokslarını (Aşil ile Kaplumbağa, Uçan Ok) geliştirmiştir.",
    "concepts": [
      "Diyalektik Yöntem",
      "Aşil ve Kaplumbağa Paradoksu",
      "Ok Paradoksu",
      "Sonsuz Bölünebilirlik"
    ],
    "works": [
      "Paradokslar Kitabı"
    ]
  },
  "demokritos": {
    "id": "demokritos",
    "name": "Demokritos",
    "dates": "MÖ 460 – 370",
    "era": "antik",
    "eraName": "Antik Çağ & Atomculuk",
    "school": "Atomculuk (Materyalizm)",
    "city": "Abdera, Trakya",
    "quote": "Gerçekte var olan yalnızca atomlar ve boşluktur; geri kalan her şey yalnızca bir sanıdır.",
    "summary": "Evrenin bölünemez en küçük yapı taşları olan 'atomlar' ve aralarındaki boşluktan meydana geldiğini savunan ilk tutarlı materyalist sistemi kurmuştur.",
    "concepts": [
      "Atomlar (Bölünemez Parçacıklar)",
      "Boşluk (Kenon)",
      "Mekanik Determinizm",
      "Ölçülü Neşe (Euthymia)"
    ],
    "works": [
      "Büyük Evren Düzeni (Fragmanlar)"
    ]
  },
  "sokrates": {
    "id": "sokrates",
    "name": "Sokrates",
    "dates": "MÖ 470 – 399",
    "era": "antik",
    "eraName": "Klasik Yunan Felsefesi",
    "school": "Atina Klasik Felsefesi",
    "city": "Atina",
    "quote": "Sorgulanmamış bir hayat yaşanmaya değmez. Bildiğim tek şey, hiçbir şey bilmediğimdir.",
    "summary": "Felsefeyi gökyüzünden yeryüzüne, insana ve ahlaka indirmiştir. Yazılı eser bırakmamış; Atina sokaklarında diyalog ve doğurtma (maiötik) yöntemiyle hakikati aramıştır.",
    "concepts": [
      "Sokratik İroni & Maiötik (Doğurtma)",
      "Erdem Bilgidir",
      "Daimonion",
      "Ruhun Bakımı"
    ],
    "works": [
      "Yazılı eseri yoktur (Platon & Ksenophon aktarmıştır)"
    ]
  },
  "platon": {
    "id": "platon",
    "name": "Platon (Eflatun)",
    "dates": "MÖ 428 – 348",
    "era": "antik",
    "eraName": "Klasik Yunan Felsefesi",
    "school": "Platonculuk (Akademi)",
    "city": "Atina",
    "quote": "Görünenler dünyası yalnızca gölgelerden ibarettir; hakikat, akılla kavranan İdealar dünyasındadır.",
    "summary": "Batı düşüncesinin doruk noktalarından biridir. İdealar Kuramı, Devlet ütopyası ve kurduğu 'Akademi' ile felsefenin kurumsal temelini atmıştır.",
    "concepts": [
      "İdealar Dünyası",
      "Mağara Alegorisi",
      "Filozof-Kral",
      "Ruhun Üç Parçası",
      "Anamnezis (Hatırlama)"
    ],
    "works": [
      "Devlet",
      "Şölen",
      "Phaidon",
      "Timaios",
      "Sokrates'in Savunması"
    ]
  },
  "aristoteles": {
    "id": "aristoteles",
    "name": "Aristoteles",
    "dates": "MÖ 384 – 322",
    "era": "antik",
    "eraName": "Klasik Yunan Felsefesi",
    "school": "Peripatik Okul (Lykeion)",
    "city": "Stageira / Atina",
    "quote": "Platon'u severim ama hakikati daha çok severim. İnsan doğası gereği bilmek ister.",
    "summary": "İlk öğretmen (Muallim-i Evvel). Mantığın kurucusu, doğa bilimlerinin, metafiziğin, etiğin ve siyasetin sistemleştiricisidir. Lykeion'u (Lise) kurmuştur.",
    "concepts": [
      "Madde ve Form (Hilemorfizm)",
      "Dört Neden",
      "Altın Orta (Mesotes)",
      "Tasımsal Mantık",
      "Potansiyel-Aktüel"
    ],
    "works": [
      "Metafizik",
      "Nikomakhos'a Etik",
      "Politika",
      "Organon",
      "Poetika",
      "Ruh Üzerine"
    ]
  },
  "theophrastos": {
    "id": "theophrastos",
    "name": "Theophrastos",
    "dates": "MÖ 371 – 287",
    "era": "antik",
    "eraName": "Klasik / Erken Helenistik",
    "school": "Peripatik Okul",
    "city": "Midilli (Lesbos) / Atina",
    "quote": "Zaman, insanın harcayabileceği en değerli ve telafisi olmayan şeydir.",
    "summary": "Aristoteles'in Lykeion'daki halefi ve en yakın öğrencisidir. Botanik biliminin kurucusu kabul edilir, ahlaki karakter tipleri üzerine önemli eserler vermiştir.",
    "concepts": [
      "Botanik ve Doğa Tarihi",
      "Karakter Analizleri",
      "Peripatik Gözlem"
    ],
    "works": [
      "Karakterler",
      "Bitkilerin Tarihi"
    ]
  },
  "antisthenes": {
    "id": "antisthenes",
    "name": "Antisthenes",
    "dates": "MÖ 445 – 365",
    "era": "antik",
    "eraName": "Sokratik Okullar",
    "school": "Kinizm (Kinik Okul)",
    "city": "Atina",
    "quote": "Erdem eylemdir; sözlere ya da kitaplara ihtiyaç duymaz.",
    "summary": "Sokrates'in öğrencisi ve Kinizmin kurucusudur. Toplumsal ayrıcalıkları, mülkiyeti ve lüksü reddederek doğaya uygun, sade ve erdemli bir yaşamı savunmuştur.",
    "concepts": [
      "Erdemli Sadeliğin Yeterliliği",
      "Toplumsal Normların Reddi",
      "Doğaya Uygunluk"
    ],
    "works": [
      "Diyaloglar (Fragmanlar)"
    ]
  },
  "diyojen": {
    "id": "diyojen",
    "name": "Sinoplu Diyojen",
    "dates": "MÖ 412 – 323",
    "era": "antik",
    "eraName": "Sokratik Okullar",
    "school": "Kinizm",
    "city": "Sinope (Sinop) / Atina / Korinth",
    "quote": "Gölge etme başka ihsan istemem! İnsan arıyorum gündüz vakti elimde fenerle.",
    "summary": "Bir fıçıda yaşayarak mülkiyeti ve sahte kibirleri alaya alan kinik filozof. Büyük İskender'e verdiği tarihi yanıtla ve sade yaşam felsefesiyle efsaneleşmiştir.",
    "concepts": [
      "Kozmopolitizm (Dünya Yurttaşlığı)",
      "Otarşi (Kendi Kendine Yetme)",
      "Korkusuz Dürüstlük (Parrhesia)"
    ],
    "works": [
      "Yazılı eser bırakmamıştır (Anekdotlar & Sözler)"
    ]
  },
  "aristippos": {
    "id": "aristippos",
    "name": "Aristippos",
    "dates": "MÖ 435 – 356",
    "era": "antik",
    "eraName": "Sokratik Okullar",
    "school": "Kirene Okulu (Hedonizm)",
    "city": "Kirene, Kuzey Afrika",
    "quote": "Hazlara sahip olmak değil, hazlar tarafından sahiplenilmemek esastır.",
    "summary": "Sokrates'in öğrencisi. En yüksek iyinin anlık bedensel haz (hedone) olduğunu savunan Kirene okulunun kurucusudur.",
    "concepts": [
      "Hedonizm (Hazcılık)",
      "Şimdiki Zamanın Değeri",
      "Özdenetimli Haz"
    ],
    "works": [
      "Kirene İncelemeleri (Kayıp)"
    ]
  },
  "krates": {
    "id": "krates",
    "name": "Tebaili Krates",
    "dates": "MÖ 365 – 285",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Kinizm",
    "city": "Tebai / Atina",
    "quote": "Felsefe bana bir avuç bakla ve kaygısız bir hayat kazandırdı.",
    "summary": "Diyojen'in öğrencisi. Servetini halka dağıtarak gezgin bir filozof olarak yaşamış; Stoacılığın kurucusu Kıbrıslı Zenon'un hocalığını yapmıştır.",
    "concepts": [
      "Kinik Erdem",
      "Asketi Yaşam",
      "Stoa Öncesi Köprü"
    ],
    "works": [
      "Mektuplar & Şiirler"
    ]
  },
  "zenon_kibris": {
    "id": "zenon_kibris",
    "name": "Kıbrıslı Zenon",
    "dates": "MÖ 334 – 262",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Stoacılık (Stoa Poikile)",
    "city": "Kition, Kıbrıs / Atina",
    "quote": "Doğa bize bir dil, fakat iki kulak verdi; böylece söylediğimizden iki kat fazla dinleyelim.",
    "summary": "Atina'daki Resimli Sundurma'da (Stoa Poikile) dersler vererek Stoacılığı kurmuştur. Evrensel akla (Logos) ve doğaya uygun yaşamı erdemin temeli saydı.",
    "concepts": [
      "Stoacılık",
      "Doğaya Uygun Yaşamak",
      "Logos & Pneuma",
      "Apatheia (Tutkulardan Özgürleşme)"
    ],
    "works": [
      "Devlet Üzerine",
      "Doğaya Uygun Yaşam Üzerine"
    ]
  },
  "hrisippos": {
    "id": "hrisippos",
    "name": "Hrisippos",
    "dates": "MÖ 279 – 206",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Eski Stoa",
    "city": "Soli (Mersin) / Atina",
    "quote": "Eğer Hrisippos olmasaydı, Stoa da olmazdı.",
    "summary": "Stoacılığın ikinci kurucusu sayılır. Önermesel mantığı geliştirmiş, Stoa ahlakını ve kozmolojisini 700'den fazla eserle devasa bir sistem haline getirmiştir.",
    "concepts": [
      "Önermesel Mantık",
      "Evrensel Belirlenimcilik (Kader/Fatum)",
      "Kozmik Sentez"
    ],
    "works": [
      "Mantık Üzerine İncelemeler"
    ]
  },
  "seneca": {
    "id": "seneca",
    "name": "Seneca",
    "dates": "MÖ 4 – MS 65",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Roma Stoacılığı",
    "city": "Cordoba / Roma",
    "quote": "Hayat uzun mu kısa mı sorusunun cevabı onu nasıl yaşadığımızdadır. Yaşamayı öğrenmek bir ömür sürer.",
    "summary": "Roma döneminin en büyük Stoacı filozofu, devlet adamı ve hatibi. Ahlak mektupları ve trajedileriyle pratik felsefenin ve iç huzurun zirvesidir.",
    "concepts": [
      "Ruh Dinginliği (Tranquillitas)",
      "Ölüm Üzerine Meditasyon (Memento Mori)",
      "Öfke Denetimi",
      "Zamanın Değeri"
    ],
    "works": [
      "Ahlak Mektupları (Lucilius'a Mektuplar)",
      "Ruh Dinginliği Üzerine",
      "Yaşamın Kısalığı Üzerine",
      "Öfke Üzerine"
    ]
  },
  "musonios": {
    "id": "musonios",
    "name": "Musonius Rufus",
    "dates": "MS 30 – 101",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Roma Stoacılığı",
    "city": "Volsinii (Bolsena) / Roma",
    "quote": "İnsanlar iyi şeylerden hoşlanmayı öğrenirlerse, kötü şeylerden de nefret ederler.",
    "summary": "'Roma Sokrates'i' olarak anılır; Epiktetos'un hocasıdır. Felsefenin söz değil eylem olduğunu, ahlakın eğitimle ve alışkanlıkla kazanılan bir pratik olduğunu savundu. Nero ve Vespasian dönemlerinde sürgüne gönderildi.",
    "concepts": [
      "Felsefe Bir Pratiktir",
      "Ahlaki Eğitim",
      "Sıkıntıya Dayanıklılık",
      "Kadın Eğitimi Savunusu"
    ],
    "works": [
      "Sözlü Söylemler (Diatribai — öğrenci kayıtları)"
    ]
  },
  "epiktetos": {
    "id": "epiktetos",
    "name": "Epiktetos",
    "dates": "MS 50 – 135",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Roma Stoacılığı",
    "city": "Hierapolis (Pamukkale) / Roma / Nikopolis",
    "quote": "Bizi rahatsız eden şeyler olayların kendisi değil, onlar hakkında sahip olduğumuz yargılardır.",
    "summary": "Hierapolis'te doğmuş bir köleydi; özgürlüğünü kazandıktan sonra felsefe okulu kurdu. İnsanın kontrol edebileceği ve edemeyeceği şeyler arasındaki ayrımı temel ilke yaptı.",
    "concepts": [
      "Kontrol İkiliği",
      "İçsel Özgürlük",
      "Amor Fati (Kaderini Sev)",
      "Erdemli Karakter"
    ],
    "works": [
      "Söylevler (Diatribai)",
      "El Kitapçığı (Enkheiridion)"
    ]
  },
  "aurelius": {
    "id": "aurelius",
    "name": "Marcus Aurelius",
    "dates": "MS 121 – 180",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Roma Stoacılığı",
    "city": "Roma",
    "quote": "Sabah uyandığında kendine söyle: Bugün nankör, küstah, hilekâr insanlarla karşılaşacağım; fakat hiçbiri bana zarar veremez.",
    "summary": "Platon'un 'filozof-kral' idealinin tarihteki en somut örneği olan Roma İmparatoru. Savaş meydanlarında ve çadırında kendine yazdığı Stoacı günlükleriyle ölümsüzleşti.",
    "concepts": [
      "Kendime Düşünceler",
      "Kozmik Akıl",
      "Görev ve Hizmet Bilinci",
      "Fani Varlık Bilinci"
    ],
    "works": [
      "Kendime Düşünceler (Ta Eis Heauton)"
    ]
  },
  "epikuros": {
    "id": "epikuros",
    "name": "Epiküros",
    "dates": "MÖ 341 – 270",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Epikürizm (Bahçe Okulu)",
    "city": "Sisam (Samos) / Atina",
    "quote": "Ölüm varken biz yokuz, biz varken ölüm yok. Ruhun sükuneti ve dostluk en büyük zenginliktir.",
    "summary": "Atina'da kadınların ve kölelerin de kabul edildiği 'Bahçe' okulunu kurdu. Korkulardan (tanrılar ve ölüm korkusu) arınmış sade haz ve içsel huzuru (ataraksiya) savundu.",
    "concepts": [
      "Ataraksiya (Ruh Dinginliği)",
      "Tetrapharmakos (Dörtlü İlaç)",
      "Dostluk",
      "Akılcı Haz"
    ],
    "works": [
      "Menoikeus'a Mektup",
      "Başlıca Öğretiler"
    ]
  },
  "lucretius": {
    "id": "lucretius",
    "name": "Lucretius",
    "dates": "MÖ 99 – 55",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Epikürizm",
    "city": "Roma",
    "quote": "Hiçten hiçbir şey var olamaz; doğa asla yokluğa geri dönmez.",
    "summary": "Epiküros'un atomcu ve materyalist doğa felsefesini Latin edebiyatının başyapıtlarından biri olan felsefi destanında kusursuz bir şiir diliyle ölümsüzleştirmiştir.",
    "concepts": [
      "De Rerum Natura (Varlığın Yapısı)",
      "Materyalist Evren",
      "Dini Hurafelerin Reddi"
    ],
    "works": [
      "Evrenin Yapısı (De Rerum Natura)"
    ]
  },
  "pyrrhon": {
    "id": "pyrrhon",
    "name": "Pyrrhon",
    "dates": "MÖ 360 – 270",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Pürronculuk (Septisizm)",
    "city": "Elis, Yunanistan",
    "quote": "Hiçbir şey göründüğü gibi kesin değildir; yargıyı askıya al (epokhe), dinginliğe ulaş.",
    "summary": "Büyük İskender ile Hindistan'a kadar gitmiş ve kuşkuculuğun temellerini atmıştır. Nesnelerin gerçek yapısının bilinemeyeceğini savunup yargıyı askıya almayı öğretti.",
    "concepts": [
      "Epokhe (Yargıyı Askıya Alma)",
      "Ataraksiya",
      "Kuşkucu Metot"
    ],
    "works": [
      "Yazılı eser bırakmamıştır"
    ]
  },
  "sextus": {
    "id": "sextus",
    "name": "Sextus Empiricus",
    "dates": "MS 160 – 210",
    "era": "helenistik",
    "eraName": "Helenistik & Roma",
    "school": "Pürroncu Kuşkuculuk",
    "city": "İskenderiye / Atina / Roma",
    "quote": "Dogmatik iddiaların her birine eşit güçte karşı bir iddia getirilebilir.",
    "summary": "Antik Çağ kuşkuculuğunu ayrıntılı argümanlar ve 'tropos'lar (tutumlar) ile derleyen hekim-filozoftur. Modern çağda Montaigne ve Hume'u derinden etkilemiştir.",
    "concepts": [
      "Troposlar (Kuşku Yolları)",
      "Dogmatizm Eleştirisi",
      "Ampirik Tıp ve Felsefe"
    ],
    "works": [
      "Pürronculuğun Esasları",
      "Matematikçilere Karşı"
    ]
  },
  "plotinos": {
    "id": "plotinos",
    "name": "Plotinos",
    "dates": "MS 204 – 270",
    "era": "helenistik",
    "eraName": "Geç Antik & Yeni-Platonculuk",
    "school": "Yeni-Platonculuk (Neoplatonism)",
    "city": "Lykopolis, Mısır / Roma",
    "quote": "Kendi içine dön ve bak. Eğer kendini henüz güzel görmüyorsan, heykeltıraş gibi fazlalıkları yont.",
    "summary": "Platon'un felsefesini mistik ve metafiziksel bir zirveye taşıyan Yeni-Platonculuğun kurucusudur. 'Bir'den taşma (südur) teorisi İslam ve Hristiyan teolojisini şekillendirmiştir.",
    "concepts": [
      "Bir (To Hen)",
      "Taşma / Südur (Emanation)",
      "Nous (Kozmik Akıl)",
      "Ruhun Yükselişi"
    ],
    "works": [
      "Enneadlar (Dokuzluklar)"
    ]
  },
  "augustinus": {
    "id": "augustinus",
    "name": "Augustinus",
    "dates": "354 – 430",
    "era": "ortacag",
    "eraName": "Orta Çağ Felsefesi",
    "school": "Patristik Felsefe / Hristiyan Platonculuğu",
    "city": "Thagaste / Hippo (Cezayir)",
    "quote": "Anlamak için inanıyorum. Zaman nedir? Hiç kimse sormazsa biliyorum, anlatmaya kalkarsam bilmiyorum.",
    "summary": "Platon ve Plotinos düşüncesini Hristiyan teolojisiyle sentezleyen Batı Kilisesi'nin en etkili babasıdır. Zaman, özgür irade, kötülük ve lütuf teorilerini geliştirmiştir.",
    "concepts": [
      "İlahi Aydınlanma (İlluminasyon)",
      "İki Şehir (Tanrı Devleti & Yeryüzü Devleti)",
      "Zamanın İçselliği",
      "Kötülüğün İyiliğin Yokluğu Oluşu"
    ],
    "works": [
      "İtiraflar (Confessiones)",
      "Tanrı Devleti (De Civitate Dei)",
      "Üçlü Birlik Üzerine"
    ]
  },
  "elkindi": {
    "id": "elkindi",
    "name": "El-Kindî",
    "dates": "801 – 873",
    "era": "ortacag",
    "eraName": "İslam Felsefesi (Meşşailik)",
    "school": "İlk İslam Filozofu (Feylesofü'l-Arab)",
    "city": "Kufe / Bağdat (Beytülhikme)",
    "quote": "Hakikatin nereden geldiği önemli değildir; hakikat kimden gelirse gelsin onu yüceltmeli ve benimsemeliyiz.",
    "summary": "Bağdat Beytülhikme'sinde Antik Yunan felsefesini İslam dünyasına taşıyan çeviri hareketinin öncüsü ve İslam düşüncesinin ilk Meşşai filozofudur.",
    "concepts": [
      "Felsefe-Din Uyumu",
      "İlk Felsefe (Metafizik)",
      "Hudûs (Evrenin Sonralığı)",
      "Akıl Teorisi"
    ],
    "works": [
      "İlk Felsefe Üzerine (Kitab fi'l-Felsefeti'l-Ula)",
      "Kederden Kurtulma Yolları"
    ]
  },
  "elfarabi": {
    "id": "elfarabi",
    "name": "El-Fârâbî",
    "dates": "872 – 950",
    "era": "ortacag",
    "eraName": "İslam Felsefesi (Meşşailik)",
    "school": "Meşşailik & Siyaset Felsefesi",
    "city": "Farab / Bağdat / Şam",
    "quote": "Erdemli bir şehir sağlıklı bir bedene benzer; bütün organları hayatı sürdürmek için yardımlaşır.",
    "summary": "Muallim-i Sânî (İkinci Öğretmen - Aristoteles'ten sonra) unvanını almıştır. Mantık, epistemoloji ve ideal toplum/devlet felsefesinin temellerini atmıştır.",
    "concepts": [
      "Erdemli Şehir (El-Medinetü'l-Fazıla)",
      "Faal Akıl",
      "Mantık Sınıflandırması",
      "Nübüvvet Felsefesi"
    ],
    "works": [
      "Erdemli Şehir Halkının Görüşleri",
      "İlimlerin Sayımı (İhsa'ül-Ulum)",
      "Mutluluğun Kazanılması"
    ]
  },
  "ibnisina": {
    "id": "ibnisina",
    "name": "İbn Sînâ (Avicenna)",
    "dates": "980 – 1037",
    "era": "ortacag",
    "eraName": "İslam Felsefesi & Tıp",
    "school": "Meşşailik Zirvesi (Eş-Şeyhü'r-Reis)",
    "city": "Buhara / Hemedan / İsfahan",
    "quote": "Aklın ışığı her karanlığı aydınlatır; düşünmek, varlığın farkına varmaktır.",
    "summary": "İslam felsefesinin en büyük filozofu ve tıp dehasıdır. 'Uçan Adam' deneyi ile saf ben bilincini, 'Zorunlu Varlık' (Vacibü'l-Vücud) kanıtı ile varlık felsefesini inşa etmiştir.",
    "concepts": [
      "Vacibü'l-Vücud (Zorunlu Varlık)",
      "Uçan Adam Argümanı",
      "Nefs-Beden Ayrımı",
      "Südur Teorisi"
    ],
    "works": [
      "Kitabü'ş-Şifa (İyileşme Kitabı)",
      "El-Kanun fi't-Tıbb (Tıbbın Kanunu)",
      "En-Necat",
      "İşarat ve't-Tenbihat"
    ]
  },
  "gazali": {
    "id": "gazali",
    "name": "Gazzâlî",
    "dates": "1058 – 1111",
    "era": "ortacag",
    "eraName": "İslam Düşüncesi & Tasavvuf",
    "school": "Hüccetü'l-İslam (Kelam & Tasavvuf)",
    "city": "Tus / Bağdat (Nizamiye Medresesi)",
    "quote": "Şüphe etmeyen hakikati bulamaz. Kalbin gözü açılmadıkça aklın ışığı yetersiz kalır.",
    "summary": "İslam dünyasında felsefi akılcılığı derin bir metodik şüpheyle eleştirmiş, metafizikçilerin 20 meselesini çürüttüğü eseriyle felsefe tarihinde çığır açmıştır.",
    "concepts": [
      "Tehafüt Eleştirisi",
      "Nedensellik Eleştirisi (İlk Occasionalism)",
      "Manevi Sezgi (Zevk)",
      "Metodik Şüphe"
    ],
    "works": [
      "Tehafütü'l-Felasife (Filozofların Tutarsızlığı)",
      "İhyau Ulumi'd-Din",
      "El-Münkız mine'd-Dalal (Dalaletten Kurtuluş)"
    ]
  },
  "omer_hayyam": {
    "id": "omer_hayyam",
    "name": "Ömer Hayyam",
    "dates": "1048 – 1131",
    "era": "ortacag",
    "eraName": "Horasan Felsefesi & Matematik",
    "school": "İbn Sînâ Ekolü / Rasyonalizm & Varoluşsal Şüphecilik",
    "city": "Nişabur, Horasan",
    "quote": "Beni özene bezene yaratan kim? Sen! Günah yolunu bana açan kim? Sen! Beni sen yaratırsın da günahkâr dersin, öyleyse günahı yaratan kim?",
    "summary": "Matematikçi, astronom ve filozoftur. Kendisini İbn Sînâ'nın öğrencisi saymış; rubailerinde ve risalelerinde determinizm, varoluş, zaman ve insan yazgısını derin bir rasyonel şüphecilikle irdelemiştir.",
    "concepts": [
      "Varoluşsal Şüphecilik",
      "Zaman & Determinizm",
      "İbn Sînâ Doğa Felsefesi",
      "Öklid Dışı Geometrinin Öncüsü"
    ],
    "works": [
      "Rubaiyat",
      "Risale fi'l-Kevn ve't-Teklif (Oluş ve Ödev Risalesi)",
      "Cebir Risalesi"
    ]
  },
  "ibnrushd": {
    "id": "ibnrushd",
    "name": "İbn Rüşd (Averroes)",
    "dates": "1126 – 1198",
    "era": "ortacag",
    "eraName": "Endülüs Felsefesi",
    "school": "Büyük Şarih (Latin Averroism)",
    "city": "Kurtuba (Cordoba), Endülüs / Marakeş",
    "quote": "Felsefe hakikati araştırır, din de hakikati bildirir. Hakikat hakikatle çelişmez; akıl ile nakil kardeştir.",
    "summary": "Avrupa'da 'The Commentator' (Büyük Şarih) olarak anılır. Aristoteles'in özgün metinlerini şerh etmiş, Gazzali'ye yazdığı yanıtla aklı savunmuş ve Rönesans'ı tetiklemiştir.",
    "concepts": [
      "Akıl-Vahiy Uyumu",
      "Çift Hakikat Algısı Reddi",
      "Büyük Aristo Şerhleri",
      "Nedenselliğin Savunusu"
    ],
    "works": [
      "Tehafütü't-Tehafüt (Tutarsızlığın Tutarsızlığı)",
      "Faslü'l-Makal (Felsefe-Din İlişkisi)",
      "Büyük Metafizik Şerhi"
    ]
  },
  "aquinas": {
    "id": "aquinas",
    "name": "Thomas Aquinas",
    "dates": "1225 – 1274",
    "era": "ortacag",
    "eraName": "Orta Çağ Skolastiği",
    "school": "Tomizm / Hristiyan Aristotelesçiliği",
    "city": "Roccasecca / Paris / Napoli",
    "quote": "Zarafet doğayı yok etmez, onu mükemmelleştirir. Akıl imanı destekler.",
    "summary": "Katolik Kilisesi'nin baş felsefecisi (Doctor Angelicus). Aristoteles felsefesi ile Hristiyan inancını muazzam bir mantıksal mimariyle (Summa Theologiae) birleştirmiştir.",
    "concepts": [
      "Quinque Viae (Tanrı'nın Beş Kanıtı)",
      "Doğal Hukuk",
      "Varlık ve Öz Ayrımı",
      "İman ve Akıl Bütünlüğü"
    ],
    "works": [
      "Summa Theologiae",
      "Summa contra Gentiles"
    ]
  },
  "tusi": {
    "id": "tusi",
    "name": "Nasîrüddin Tûsî",
    "dates": "1201 – 1274",
    "era": "ortacag",
    "eraName": "İslam Felsefesi & Meraga Okulu",
    "school": "Yeni İbn Sînâcılık / Kelam & Astronomi",
    "city": "Tus, Horasan / Meraga Rasathanesi",
    "quote": "İlim, aklın gıdasıdır; adalet ise toplumun ruhudur.",
    "summary": "İbn Sînâ felsefesini Gazzâlî ve Fahreddin Râzî eleştirilerine karşı savunan en büyük şarihtir. Meraga Rasathanesi'ni kurmuş, Ömer Hayyam'ın matematiksel mirasını geliştirerek geliştirdiği 'Tûsî Çifti' ile Kopernik devrimine ilham vermiştir.",
    "concepts": [
      "İbn Sînâ Felsefesinin Savunusu",
      "Ahlak-ı Nâsırî (Pratik Felsefe)",
      "Tûsî Çifti (Astronomi Modeli)",
      "Kelamın Felsefileşmesi"
    ],
    "works": [
      "Şerhu'l-İşârât ve't-Tenbîhât",
      "Ahlâk-ı Nâsırî",
      "Tezkire fi İlmi'l-Hey'e"
    ]
  },
  "ockham": {
    "id": "ockham",
    "name": "Ockhamlı William",
    "dates": "1287 – 1347",
    "era": "ortacag",
    "eraName": "Geç Skolastik",
    "school": "Nominalizm (Adcılık)",
    "city": "Ockham, İngiltere / Münih",
    "quote": "Zorunlu olmadıkça varlıkları çoğaltmamak gerekir (Ockham'ın Usturası).",
    "summary": "Tümellerin sadece birer isimden ibaret olduğunu savunan 'Nominalizm' ile Skolastik metafiziği sarstı. En yalın açıklamanın en doğru olduğunu belirten usturasıyla ünlüdür.",
    "concepts": [
      "Ockham'ın Usturası (Tasarruf İlkesi)",
      "Nominalizm (Adcılık)",
      "Kilise-Devlet Ayrımı",
      "Empirizmin Tohumları"
    ],
    "works": [
      "Tüm Mantığın Toplamı (Summa Logicae)"
    ]
  },
  "ibnhaldun": {
    "id": "ibnhaldun",
    "name": "İbn Haldun",
    "dates": "1332 – 1406",
    "era": "ortacag",
    "eraName": "Tarih Felsefesi & Sosyoloji",
    "school": "Ümran İlmi (Tarih ve Toplum Felsefesi)",
    "city": "Tunus / Fas / Kahire",
    "quote": "Geçmiş geleceğe, suyun suya benzediğinden daha çok benzer. Coğrafya kaderdir.",
    "summary": "Tarih felsefesinin, sosyolojinin ve toplum bilimlerinin kurucusudur. 'Mukaddime'sinde medeniyetlerin doğuş, yükseliş ve çöküş yasalarını; kabile dayanışması (Asabiyyet) ve ekonomik döngüler üzerinden materyalist bir gerçekçilikle açıklamıştır.",
    "concepts": [
      "İlm-i Ümran (Medeniyet Bilimi)",
      "Asabiyyet (Grup Dayanışması)",
      "Devletlerin Doğal Yaşam Döngüsü",
      "Tarihsel Determinizm"
    ],
    "works": [
      "Mukaddime",
      "Kitâbü'l-İber",
      "Et-Ta'rif bi İbni Haldun"
    ]
  },
  "machiavelli": {
    "id": "machiavelli",
    "name": "Niccolò Machiavelli",
    "dates": "1469 – 1527",
    "era": "aydinlanma",
    "eraName": "Rönesans & Aydınlanma",
    "school": "Siyasal Realizm",
    "city": "Floransa, İtalya",
    "quote": "Korkulan bir hükümdar olmak, sevilen bir hükümdar olmaktan çok daha güvenlidir.",
    "summary": "Modern siyaset biliminin kurucusudur. Siyaseti ahlak ve teolojiden ayırarak iktidarın korunması, güç ve devlet bekası üzerine gerçekçi analizler yapmıştır.",
    "concepts": [
      "Virtù & Fortuna (Erdem ve Talih)",
      "Devlet Aklı (Raison d'État)",
      "Politik Realizm"
    ],
    "works": [
      "Prens (Il Principe)",
      "Titus Livius'un İlk On Kitabı Üzerine Söylevler"
    ]
  },
  "bacon": {
    "id": "bacon",
    "name": "Francis Bacon",
    "dates": "1561 – 1626",
    "era": "aydinlanma",
    "eraName": "Rönesans & Bilimsel Devrim",
    "school": "Deneysel Yöntem & Empirizm",
    "city": "Londra, İngiltere",
    "quote": "Bilgi güçtür. Doğaya ancak ona boyun eğerek hükmedilebilir.",
    "summary": "Modern bilimsel devrimin düşünsel öncüsü. Skolastik tümdengelime karşı tümevarım yöntemini ve deneyciliği savunmuş, zihni yanıltan 'İdoller' teorisini kurmuştur.",
    "concepts": [
      "Tümevarım (İndüksiyon)",
      "Dört Zihin İdolü (Kabile, Mağara, Çarşı, Tiyatro)",
      "Bilimsel Keşif Yöntemi"
    ],
    "works": [
      "Novum Organum",
      "Yeni Atlantis (New Atlantis)"
    ]
  },
  "hobbes": {
    "id": "hobbes",
    "name": "Thomas Hobbes",
    "dates": "1588 – 1679",
    "era": "aydinlanma",
    "eraName": "Erken Modern Dönem",
    "school": "Mekanik Materyalizm & Toplum Sözleşmesi",
    "city": "Malmesbury / Londra",
    "quote": "Doğa durumunda insanın hayatı yalnız, yoksul, iğrenç, vahşi ve kısadır. İnsan insanın kurdudur (Homo homini lupus).",
    "summary": "Toplum sözleşmesi teorisinin en katı kuramcısı. İnsanların mutlak kaostan kurtulmak için egemen bir güce (Leviathan) boyun eğmeyi kabul ettiğini savunmuştur.",
    "concepts": [
      "Leviathan (Mutlak Egemenlik)",
      "Doğa Durumu",
      "Toplum Sözleşmesi",
      "Mekanist İnsan Doğası"
    ],
    "works": [
      "Leviathan",
      "De Cive (Yurttaş Üzerine)"
    ]
  },
  "descartes": {
    "id": "descartes",
    "name": "René Descartes",
    "dates": "1596 – 1650",
    "era": "aydinlanma",
    "eraName": "Rasyonalizm & Modern Felsefe",
    "school": "Kartezyen Rasyonalizm",
    "city": "La Haye en Touraine, Fransa / Stockholm",
    "quote": "Düşünüyorum, öyleyse varım (Cogito, ergo sum).",
    "summary": "Modern felsefenin babası. Her şeyden kuşkulanarak başladığı metodik şüphenin sonunda 'düşünen ben'in kesinliğine ulaşmış, zihin-beden düalizmini kurmuştur.",
    "concepts": [
      "Cogito (Ben Bilinci)",
      "Metodik Şüphe",
      "Kartezyen Düalizm (Res Cogitans & Res Extensa)",
      "Açık ve Seçik Fikirler"
    ],
    "works": [
      "Metot Üzerine Konuşma",
      "Meditasyonlar (İlk Felsefe Üzerine)"
    ]
  },
  "spinoza": {
    "id": "spinoza",
    "name": "Baruch Spinoza",
    "dates": "1632 – 1677",
    "era": "aydinlanma",
    "eraName": "Rasyonalizm",
    "school": "Panteizm / Tek Tözcülük",
    "city": "Amsterdam / Lahey, Hollanda",
    "quote": "Tanrı ya da Doğa (Deus sive Natura). İnsan eylemlerine gülmemeli, ağlamamalı; onları sadece anlamaya çalışmalıdır.",
    "summary": "Felsefe tarihinin en radikal ve tutarlı metafizikçisi. Evrende Tanrı ve Doğa'nın tek bir sonsuz Töz olduğunu kanıtlayan geometrik yöntemiyle Ethica'yı kaleme aldı.",
    "concepts": [
      "Deus sive Natura (Tanrı veya Doğa)",
      "Tek Töz (Monizm)",
      "Conatus (Varlığını Koruma Arzusu)",
      "Amor Dei Intellectualis (Tanrı'nın Entelektüel Sevgisi)"
    ],
    "works": [
      "Ethica (Geometrik Yöntemle Kanıtlanmış Ahlak)",
      "Teolojik-Politik İnceleme"
    ]
  },
  "leibniz": {
    "id": "leibniz",
    "name": "Gottfried Wilhelm Leibniz",
    "dates": "1646 – 1716",
    "era": "aydinlanma",
    "eraName": "Rasyonalizm",
    "school": "Monadoloji / Akılcılık",
    "city": "Leipzig / Hannover, Almanya",
    "quote": "Yaşadığımız dünya, mümkün dünyaların en iyisidir. Hiçbir şey nedensiz değildir.",
    "summary": "Evreni bölünemez, pencereleri olmayan ruhsal enerji merkezleri olan 'Monad'lar ile açıklayan polimat dahi. Diferansiyel hesabı Newton'dan bağımsız bulmuştur.",
    "concepts": [
      "Monad Teorisi",
      "Önceden Kurulmuş Uyum",
      "Yeter-Sebep İlkesi",
      "Teodise & En İyi Mümkün Dünya"
    ],
    "works": [
      "Monadoloji",
      "Teodise",
      "İnsan Anlığı Üzerine Yeni Denemeler"
    ]
  },
  "locke": {
    "id": "locke",
    "name": "John Locke",
    "dates": "1632 – 1704",
    "era": "aydinlanma",
    "eraName": "İngiliz Deneyciliği & Liberalizm",
    "school": "Ampirizm (Deneycilik)",
    "city": "Wrington / Oates, İngiltere",
    "quote": "Zihin boş bir levhadır (Tabula rasa); üzerinde deneyimin yazmadığı hiçbir şey yoktur.",
    "summary": "Doğuştan gelen fikirleri reddederek tüm bilginin duyumlardan geldiğini savunan ampirizmin babası. Yaşam, özgürlük ve mülkiyet haklarını savunan liberalizmin kurucusudur.",
    "concepts": [
      "Tabula Rasa (Boş Levha)",
      "Birincil ve İkincil Nitelikler",
      "Kuvvetler Ayrılığı",
      "Doğal Haklar & Hoşgörü"
    ],
    "works": [
      "İnsan Anlığı Üzerine Bir Deneme",
      "Hükümet Üzerine İki İnceleme",
      "Hoşgörü Üzerine Bir Mektup"
    ]
  },
  "berkeley": {
    "id": "berkeley",
    "name": "George Berkeley",
    "dates": "1685 – 1753",
    "era": "aydinlanma",
    "eraName": "İngiliz Deneyciliği",
    "school": "İdealist Empirizm (İmmateryalizm)",
    "city": "Dysart Castle, İrlanda / Oxford",
    "quote": "Var olmak algılanmış olmaktır (Esse est percipi).",
    "summary": "Maddenin zihinden bağımsız bir gerçekliği olmadığını, fiziksel nesnelerin yalnızca zihinlerdeki duyum ve algı kümeleri olduğunu savunan radikal idealist.",
    "concepts": [
      "Esse est Percipi",
      "Maddenin Reddi (İmmateryalizm)",
      "Tanrı'nın Zihninde Evren"
    ],
    "works": [
      "İnsan Bilgisinin İlkeleri Üzerine İnceleme",
      "Hylas ile Philonous Arasında Üç Diyalog"
    ]
  },
  "hume": {
    "id": "hume",
    "name": "David Hume",
    "dates": "1711 – 1776",
    "era": "aydinlanma",
    "eraName": "İskoç Aydınlanması & Kuşkuculuk",
    "school": "Radikal Empirizm & Şüphecilik",
    "city": "Edinburgh, İskoçya",
    "quote": "Akıl tutkuların kölesidir ve ancak öyle olmalıdır. Alışkanlık, insan hayatının en büyük kılavuzudur.",
    "summary": "Nedenselliğin nesnel bir zorunluluk değil, zihnin bir alışkanlığı olduğunu göstererek doğa yasalarının kesinliğini sarstı. Kant'ı dogmatik uykusundan uyandıran düşünürdür.",
    "concepts": [
      "Nedensellik Eleştirisi (Alışkanlık)",
      "İzlenimler ve Fikirler Ayrımı",
      "Benlik Yanılsaması (Bohça Teorisi)",
      "Olan-Olması Gereken Ayrımı (Hume'un Giyotini)"
    ],
    "works": [
      "İnsan Doğası Üzerine Bir İnceleme",
      "İnsanın Anlama Yetisi Üzerine Bir Soruşturma"
    ]
  },
  "rousseau": {
    "id": "rousseau",
    "name": "Jean-Jacques Rousseau",
    "dates": "1712 – 1778",
    "era": "aydinlanma",
    "eraName": "Fransız Aydınlanması & Romantizm",
    "school": "Toplum Sözleşmesi & Doğa Felsefesi",
    "city": "Cenevre / Paris",
    "quote": "İnsan özgür doğar, oysa her yerde zincire vurulmuştur.",
    "summary": "Uygarlığın ve özel mülkiyetin insanı yozlaştırdığını, doğal insanın saf iyiliğe sahip olduğunu savundu. 'Genel İrade' kavramıyla modern demokrasiyi ve Fransız Devrimi'ni etkiledi.",
    "concepts": [
      "Genel İrade (Volonté Générale)",
      "Soylu Vahşi (Doğal İnsan)",
      "Toplum Sözleşmesi",
      "Doğal Eğitim"
    ],
    "works": [
      "Toplum Sözleşmesi",
      "Emile veya Eğitim Üzerine",
      "İtiraflar",
      "İnsanlar Arasındaki Eşitsizliğin Kaynağı"
    ]
  },
  "kant": {
    "id": "kant",
    "name": "Immanuel Kant",
    "dates": "1724 – 1804",
    "era": "aydinlanma",
    "eraName": "Aydınlanma Zirvesi & Eleştirel Felsefe",
    "school": "Transandantal İdealizm",
    "city": "Königsberg, Prusya",
    "quote": "İki şey zihnimi doldurur: Üzerimdeki yıldızlı gökyüzü ve içimdeki ahlak yasası.",
    "summary": "Felsefe tarihinin dönüm noktasıdır. Rasyonalizm ile Empirisizmi sentezleyerek 'Kopernik Devrimi' yapmış; aklın sınırlarını çizip ödev ahlakını (Kategorik Buyruk) kurmuştur.",
    "concepts": [
      "Transandantal İdealizm",
      "Fenomen ve Numen (Kendinde Şey)",
      "Sentetik A Priori Bilgi",
      "Kategorik Buyruk (Ödev Ahlakı)",
      "Sapere Aude (Aklını Kullanmaya Cesaret Et)"
    ],
    "works": [
      "Saf Aklın Eleştirisi",
      "Pratik Aklın Eleştirisi",
      "Yargı Yetisinin Eleştirisi",
      "Ahlak Metafiziğinin Temellendirilmesi"
    ]
  },
  "fichte": {
    "id": "fichte",
    "name": "Johann Gottlieb Fichte",
    "dates": "1762 – 1814",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Öznel Alman İdealizmi",
    "city": "Rammenau / Berlin",
    "quote": "Ben, kendisini kendi eylemiyle var eden saf bilinçtir.",
    "summary": "Kant'ın 'kendinde şey' kavramını reddederek tüm gerçekliğin 'Ben'in etkin eyleminden türediğini savundu. Tez-Antitez-Sentez diyalektiğinin erken biçimini geliştirdi.",
    "concepts": [
      "Mutlak Ben",
      "Eyleyen Akıl",
      "Tez-Antitez Diyalektiği"
    ],
    "works": [
      "Tüm Bilim Öğretisinin Temeli",
      "Alman Ulusuna Söylevler"
    ]
  },
  "schelling": {
    "id": "schelling",
    "name": "Friedrich Schelling",
    "dates": "1775 – 1854",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Nesnel İdealizm & Doğa Felsefesi",
    "city": "Leonberg / Münih / Berlin",
    "quote": "Doğa görünür tin, tin ise görünmez doğadır.",
    "summary": "Doğa ile zihnin, özne ile nesnenin 'Mutlak'ta özdeş olduğunu savunan Özdeşlik Felsefesi'ni geliştirdi. Romantizm akımını ve Hegel'i derinlemesine etkiledi.",
    "concepts": [
      "Özdeşlik Felsefesi",
      "Organik Doğa Felsefesi",
      "Sanatın Zirve Konumu"
    ],
    "works": [
      "Doğa Felsefesi Üzerine Fikirler",
      "Transandantal İdealizm Sistemi"
    ]
  },
  "hegel": {
    "id": "hegel",
    "name": "G.W.F. Hegel",
    "dates": "1770 – 1831",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Mutlak İdealizm & Diyalektik",
    "city": "Stuttgart / Jena / Berlin",
    "quote": "Akla uygun olan gerçektir, gerçek olan da akla uygundur. Hakikat bütündür.",
    "summary": "Tinin (Geist) tarihte kendini gerçekleştirmesini açıklayan devasa bir diyalektik sistem kurdu. Efendi-Köle diyalektiği ve tarih felsefesi modern düşüncenin mihveridir.",
    "concepts": [
      "Diyalektik Yöntem (Tez-Antitez-Sentez)",
      "Geist (Dünya Tini)",
      "Efendi-Köle Diyalektiği",
      "Tarihin Sonu ve Özgürlüğün Gelişimi"
    ],
    "works": [
      "Tinin Fenomenolojisi",
      "Mantık Bilimi",
      "Hukuk Felsefesinin İlkeleri",
      "Tarih Felsefesi"
    ]
  },
  "feuerbach": {
    "id": "feuerbach",
    "name": "Ludwig Feuerbach",
    "dates": "1804 – 1872",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Genç Hegelcilik & Antropolojik Materyalizm",
    "city": "Landshut / Nürnberg",
    "quote": "İnsan Tanrı'yı kendi suretinde yarattı. İnsan ne yiyorsa odur.",
    "summary": "Hegel'in idealizmini baş aşağı çevirerek teolojiyi antropolojiye indirgedi. Tanrı'nın, insanın kendi yüce niteliklerini yabancılaştırarak göğe yansıtması olduğunu savundu.",
    "concepts": [
      "Dini Yabancılaşma",
      "Hümanist Materyalizm",
      "İnsanın Özü"
    ],
    "works": [
      "Hristiyanlığın Özü",
      "Geleceğin Felsefesinin İlkeleri"
    ]
  },
  "marx": {
    "id": "marx",
    "name": "Karl Marx",
    "dates": "1818 – 1883",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Diyalektik ve Tarihsel Materyalizm",
    "city": "Trier, Almanya / Londra",
    "quote": "Filozoflar dünyayı yalnızca çeşitli biçimlerde yorumladılar; oysa sorun onu değiştirmektir.",
    "summary": "Hegel diyalektiğini materyalist temele oturttu. Tarihin itici gücünün sınıf mücadeleleri olduğunu, ekonomik altyapının üstyapıyı belirlediğini ve kapitalizmin krizlerini ortaya koydu.",
    "concepts": [
      "Tarihsel Materyalizm",
      "Artı-Değer & Sömürü",
      "Emek Yabancılaşması",
      "Sınıf Mücadelesi",
      "Altyapı-Üstyapı"
    ],
    "works": [
      "Kapital (Das Kapital)",
      "Komünist Manifesto",
      "1844 İktisadi ve Felsefi El Yazmaları",
      "Feuerbach Üzerine Tezler"
    ]
  },
  "kierkegaard": {
    "id": "kierkegaard",
    "name": "Søren Kierkegaard",
    "dates": "1813 – 1855",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Varoluşçuluğun Babası (Hristiyan Egzistansiyalizmi)",
    "city": "Kopenhag, Danimarka",
    "quote": "Kaygı, özgürlüğün baş dönmesidir. Hayat geriye doğru anlaşılır, ama ileriye doğru yaşanmak zorundadır.",
    "summary": "Hegel'in soyut sistemine isyan ederek somut tekil bireyi, kaygıyı, özgür seçimi ve inanç sıçramasını merkeze aldı. Modern Varoluşçuluğun ilk kurucusudur.",
    "concepts": [
      "Varoluşsal Kaygı (Angst)",
      "İnanç Sıçraması",
      "Üç Yaşam Evresi (Estetik, Etik, Dini)",
      "Tekil Birey (Der Enkelte)"
    ],
    "works": [
      "Korku ve Titreme",
      "Ya / Ya Da (Enten-Eller)",
      "Kaygı Kavramı",
      "Ölümcül Hastalık Umutsuzluk"
    ]
  },
  "schopenhauer": {
    "id": "schopenhauer",
    "name": "Arthur Schopenhauer",
    "dates": "1788 – 1860",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Kötümserlik (Pesimizm) & İrade Metafiziği",
    "city": "Danzig / Frankfurt",
    "quote": "Hayat, bir sarkaç gibi acı ile can sıkıntısı arasında gidip gelir. Dünya benim tasarımımdır.",
    "summary": "Kant'ın numenini doyumsuz ve kör 'Yaşama İradesi' olarak tanımladı. Doğu felsefesi (Upanişadlar) ve sanatsal temaşa ile acıdan kurtuluş yollarını araştırdı.",
    "concepts": [
      "Kör Yaşama İradesi (Wille)",
      "Tasarım Olarak Dünya",
      "Müzik ve Estetik Arınma",
      "Merhamet Etiği"
    ],
    "works": [
      "İsteme ve Tasarım Olarak Dünya",
      "Yaşam Bilgeliği Üzerine Aforizmalar"
    ]
  },
  "nietzsche": {
    "id": "nietzsche",
    "name": "Friedrich Nietzsche",
    "dates": "1844 – 1900",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Güç İstenci, Perspektivizm & Ahlak Soykütüğü",
    "city": "Röcken, Almanya / Sils Maria / Weimar",
    "quote": "Beni öldürmeyen şey beni güçlendirir. Tanrı öldü; insan aşılması gereken bir şeydir.",
    "summary": "Batı metafiziğini ve Hristiyan ahlakını kökten yıkan düşünce şimşeği. Üstinsan, Güç İstenci, Bengi Dönüş ve Hınç Ahlakı kavramlarıyla 20. yüzyılı baştan yarattı.",
    "concepts": [
      "Güç İstenci (Wille zur Macht)",
      "Üstinsan (Übermensch)",
      "Bengi Dönüş (Amor Fati)",
      "Efendi ve Köle Ahlakı",
      "Nihilizm"
    ],
    "works": [
      "Böyle Buyurdu Zerdüşt",
      "İyinin ve Kötünün Ötesinde",
      "Ahlakın Soykütüğü",
      "Şen Bilim",
      "Ecce Homo"
    ]
  },
  "mill": {
    "id": "mill",
    "name": "John Stuart Mill",
    "dates": "1806 – 1873",
    "era": "19yy",
    "eraName": "19. Yüzyıl Felsefesi",
    "school": "Faydacılık (Utilitarianism) & Liberalizm",
    "city": "Londra / Avignon",
    "quote": "Tatmin olmuş bir domuz olmaktansa, tatmin olmamış bir Sokrates olmak yeğdir.",
    "summary": "Bentham'ın faydacılığını zihinsel ve ahlaki niteliksel hazlarla derinleştirdi. Bireysel ifade özgürlüğünü ve kadın haklarını savunan öncü eserler yazdı.",
    "concepts": [
      "Niteliksel Faydacılık",
      "Zarar İlkesi (Harm Principle)",
      "Düşünce ve İfade Özgürlüğü",
      "Kadınların Boyun Eğmişliği"
    ],
    "works": [
      "Özgürlük Üzerine (On Liberty)",
      "Faydacılık (Utilitarianism)",
      "Kadınların Bağımlılığı"
    ]
  },
  "brentano": {
    "id": "brentano",
    "name": "Franz Brentano",
    "dates": "1838 – 1917",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Yönelimsellik (Intentionality)",
    "city": "Marienberg / Viyana / Zürih",
    "quote": "Her zihinsel fenomen, nesnesine yönelmiş olmakla karakterize edilir.",
    "summary": "Ortaçağ kavramı olan 'yönelimsellik'i (nesneye yönelme) modern psikoloji ve felsefeye kazandırarak Fenomenoloji akımının kapısını araladı.",
    "concepts": [
      "Yönelimsellik (İntentionality)",
      "Bilinç Edimleri",
      "Betimsel Psikoloji"
    ],
    "works": [
      "Ampirik Açıdan Psikoloji"
    ]
  },
  "husserl": {
    "id": "husserl",
    "name": "Edmund Husserl",
    "dates": "1859 – 1938",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Fenomenoloji",
    "city": "Prossnitz / Göttingen / Freiburg",
    "quote": "Şeylerin kendilerine dönün! Bilinç, her zaman bir şeyin bilincidir.",
    "summary": "Fenomenolojinin kurucusudur. Dünyayı paranteze alarak (epokhe) şeylerin saf özlerini doğrudan bilincin dolaysız deneyiminde yakalama yöntemini kurdu.",
    "concepts": [
      "Fenomenolojik Epokhe (Paranteze Alma)",
      "Şeylerin Kendisine Dönüş",
      "Noesis ve Noema",
      "Yaşam-Dünyası (Lebenswelt)"
    ],
    "works": [
      "Mantık Araştırmaları",
      "Saf Bir Fenomenoloji ve Fenomenolojik Felsefe İçin Fikirler"
    ]
  },
  "heidegger": {
    "id": "heidegger",
    "name": "Martin Heidegger",
    "dates": "1889 – 1976",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Temel Ontoloji & Fenomenolojik Varoluşçuluk",
    "city": "Messkirch / Freiburg",
    "quote": "Dasein, kendi varlığı kendisi için bir mesele olan varlıktır. Dil, varlığın evidir.",
    "summary": "2500 yıllık varlık sorusunu yeniden canlandırdı. İnsanı dünyada-olan-varlık (Dasein) ve ölüme-doğru-varlık olarak analiz eden başyapıtıyla 20. yüzyılı sarstı.",
    "concepts": [
      "Dasein (Orada-Varlık)",
      "Ontolojik Fark",
      "Dünyada-Varlık",
      "Ölüme-Doğru-Varlık",
      "Sahicilik (Eigentlichkeit)"
    ],
    "works": [
      "Varlık ve Zaman (Sein und Zeit)",
      "Hümanizm Üzerine Mektup",
      "Teknik ve Dönüş"
    ]
  },
  "sartre": {
    "id": "sartre",
    "name": "Jean-Paul Sartre",
    "dates": "1905 – 1980",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Ateist Varoluşçuluk (Egzistansiyalizm)",
    "city": "Paris, Fransa",
    "quote": "Varoluş özden önce gelir. İnsan özgürlüğe mahkumdur. Cehennem başkalarıdır.",
    "summary": "Varoluşçuluğun dünya çapındaki sözcüsü, Nobel Edebiyat Ödülü'nü reddeden aydın. İnsanın önceden belirlenmiş bir özü olmadığını, kendi seçimleriyle kendini yarattığını savundu.",
    "concepts": [
      "Varoluş Özden Önce Gelir",
      "Özgürlüğe Mahkûmiyet",
      "Kötü Niyet (Mauvaise Foi)",
      "Kendinde-Varlık ve Kendisi-İçin-Varlık"
    ],
    "works": [
      "Varlık ve Hiçlik",
      "Bulantı (La Nausée)",
      "Varoluşçuluk Bir İnsancıllıktır",
      "Diyalektik Aklın Eleştirisi"
    ]
  },
  "beauvoir": {
    "id": "beauvoir",
    "name": "Simone de Beauvoir",
    "dates": "1908 – 1986",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Feminist Varoluşçuluk",
    "city": "Paris, Fransa",
    "quote": "Kadın doğulmaz, kadın olunur. Biri diğerini özgürleştirmeden hiç kimse tam anlamıyla özgür olamaz.",
    "summary": "Modern feminist teorinin ve varoluşçu ahlakın kurucu düşünürüdür. Toplumsal cinsiyet inşasını ve kadının 'Öteki' olarak konumlandırılışını felsefi olarak yıktı.",
    "concepts": [
      "Kadın Doğulmaz, Kadın Olunur",
      "Öteki Olarak Kadın",
      "Belirsizlik Etiği",
      "Özgür Eylemlilik"
    ],
    "works": [
      "İkinci Cins (Le Deuxième Sexe)",
      "Belirsizlik Ahlakı"
    ]
  },
  "camus": {
    "id": "camus",
    "name": "Albert Camus",
    "dates": "1913 – 1960",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Absürdizm (Uyumsuzluk Felsefesi)",
    "city": "Mondovi, Cezayir / Paris",
    "quote": "Gerçekten önemli olan tek bir felsefe sorunu vardır: İntihar. Sisifos'u mutlu hayal etmek gerekir.",
    "summary": "İnsanın anlam arayışı ile evrenin dilsiz sessizliği arasındaki uçurumu 'Absürt' (uyumsuz) olarak adlandırdı. Pes etmek yerine başkaldırıyı ve yaşamı kucaklamayı öğretti.",
    "concepts": [
      "Absürt (Uyumsuzluk)",
      "Sisifos Miti",
      "Başkaldıran İnsan",
      "Akdeniz Güneşi ve Yaşam Tutkusu"
    ],
    "works": [
      "Sisifos Söyleni",
      "Yabancı",
      "Başkaldıran İnsan",
      "Veba"
    ]
  },
  "frege": {
    "id": "frege",
    "name": "Gottlob Frege",
    "dates": "1848 – 1925",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Analitik Felsefe & Matematiksel Mantık",
    "city": "Wismar / Jena, Almanya",
    "quote": "Kavramları psikolojik durumlardan kesinlikle ayırmalıyız; mantık nesneldir.",
    "summary": "Modern matematiksel mantığın ve analitik dil felsefesinin kurucusudur. 'Anlam' (Sinn) ve 'Gönderge' (Bedeutung) ayrımıyla semantiğe yön vermiştir.",
    "concepts": [
      "Anlam ve Gönderge (Sinn und Bedeutung)",
      "Kavram Yazısı (Begriffsschrift)",
      "Mantıkçılık (Logicism)"
    ],
    "works": [
      "Aritmetiğin Temelleri",
      "Kavram Yazısı",
      "Anlam ve Gönderge Üzerine"
    ]
  },
  "russell": {
    "id": "russell",
    "name": "Bertrand Russell",
    "dates": "1872 – 1970",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Mantıksal Atomizm & Analitik Gelenek",
    "city": "Trellech, Galler / Londra",
    "quote": "Dünyanın sorunu, akıllılar şüpheyle doluyken aptalların küstahça kendinden emin olmasıdır.",
    "summary": "Matematik ile mantığın özdeşliğini kanıtlamaya çalışan 'Principia Mathematica'nın yazarı, Nobel Edebiyat Ödülü sahibi barış savunucusu ve analitik filozof.",
    "concepts": [
      "Belirli Betimlemeler Teorisi",
      "Russell Paradoksu",
      "Mantıksal Atomizm",
      "Epistemik Realizm"
    ],
    "works": [
      "Principia Mathematica",
      "Batı Felsefesi Tarihi",
      "Felsefenin Sorunları"
    ]
  },
  "wittgenstein": {
    "id": "wittgenstein",
    "name": "Ludwig Wittgenstein",
    "dates": "1889 – 1951",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Mantıksal Atomizm & Dil Oyunları",
    "city": "Viyana, Avusturya / Cambridge",
    "quote": "Dilimin sınırları dünyamın sınırlarıdır. Üzerine konuşulamayan konusunda susulmalıdır.",
    "summary": "Felsefede iki ayrı devrim yapan dahi. Erken döneminde dilin resim teorisini, geç döneminde ise gündelik dildeki 'Dil Oyunları'nı ve felsefi yanılsamaları aydınlattı.",
    "concepts": [
      "Dilimin Sınırları Dünyamın Sınırlarıdır",
      "Dil Oyunları (Sprachspiele)",
      "Resim Teorisi",
      "Aile Benzerliği",
      "Felsefi Terapötik Çözüm"
    ],
    "works": [
      "Tractatus Logico-Philosophicus",
      "Felsefi Soruşturmalar (Philosophical Investigations)"
    ]
  },
  "popper": {
    "id": "popper",
    "name": "Karl Popper",
    "dates": "1902 – 1994",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Çağdaş Felsefe",
    "school": "Eleştirel Akılcılık & Bilim Felsefesi",
    "city": "Viyana / Londra",
    "quote": "Bir teorinin bilimsel olabilmesi için yanlışlanabilir olması gerekir. Sonsuz hoşgörü, hoşgörüyü yok eder.",
    "summary": "Tümevarımı reddederek bilimin temel ölçütünün 'Yanlışlanabilirlik' olduğunu gösterdi. Totaliter rejimlere karşı 'Açık Toplum' felsefesini savundu.",
    "concepts": [
      "Yanlışlanabilirlik İlkesi",
      "Eleştirel Akılcılık",
      "Açık Toplum ve Düşmanları",
      "Hoşgörü Paradoksu"
    ],
    "works": [
      "Bilimsel Araştırmanın Mantığı",
      "Açık Toplum ve Düşmanları",
      "Tarihselciliğin Sefaleti"
    ]
  },
  "foucault": {
    "id": "foucault",
    "name": "Michel Foucault",
    "dates": "1926 – 1984",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Post-Yapısalcılık",
    "school": "Post-Yapısalcılık & İktidar Arkeolojisi",
    "city": "Poitiers / Paris",
    "quote": "İktidar yalnızca yasaklayan bir şey değildir; o üretir, haz üretir, bilgi biçimleri oluşturur.",
    "summary": "Delilik, klinik, hapishane ve cinsellik kurumlarını inceleyerek modern bilginin iktidarla nasıl iç içe geçtiğini (Biyo-iktidar, Panoptikon) ortaya koydu.",
    "concepts": [
      "Biyo-İktidar",
      "Panoptikon (Gözetim Toplumu)",
      "Bilgi/İktidar Sarmalı",
      "Söylem ve Episteme",
      "Deliliğin Arkeolojisi"
    ],
    "works": [
      "Hapishanenin Doğuşu",
      "Deliliğin Tarihi",
      "Kelimeler ve Şeyler",
      "Cinselliğin Tarihi"
    ]
  },
  "derrida": {
    "id": "derrida",
    "name": "Jacques Derrida",
    "dates": "1930 – 2004",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Post-Yapısalcılık",
    "school": "Yapısöküm (Deconstruction)",
    "city": "El-Biar, Cezayir / Paris",
    "quote": "Metnin dışarısı yoktur (Il n'y a pas de hors-texte). Anlam sürekli ertelenir.",
    "summary": "Batı'nın sözmerkezci (logosantrik) metafiziğini metinleri içsel çelişkileri üzerinden çözen 'Yapısöküm' yöntemiyle sarstı. 'Différance' kavramını geliştirdi.",
    "concepts": [
      "Yapısöküm (Deconstruction)",
      "Différance (Fark ve Erteleme)",
      "Sözmerkezcilik Eleştirisi (Logocentrism)",
      "Metinsellik"
    ],
    "works": [
      "Gramatolojiye Dair (De la grammatologie)",
      "Yazı ve Fark",
      "Ses ve Fenomen"
    ]
  },
  "leukippos": {
    "id": "leukippos",
    "name": "Leukippos",
    "dates": "MÖ 5. Yüzyıl (y. 480 – y. 420)",
    "era": "antik",
    "eraName": "Antik Çağ & Atomculuk",
    "school": "Erken Atomculuk",
    "city": "Miletos / Abdera",
    "quote": "Hiçbir şey rastlantı sonucu meydana gelmez; her şey bir nedenden ve zorunluluktan doğar.",
    "summary": "Atomcu felsefenin ilk kurucusudur. Parmenides ve Zeno'nun hareketi reddeden monizmine karşı 'bölünemez parçacıklar' (atomlar) ve 'boşluk' kavramını ilk kez ortaya atarak materyalizmin temelini atmıştır.",
    "concepts": [
      "Atom (Bölünemez)",
      "Boşluk (Kenon)",
      "Mekanik Zorunluluk",
      "Elea Karşıtlığı"
    ],
    "works": [
      "Büyük Evren Düzeni (Megas Diakosmos - Kayıp)"
    ]
  },
  "freud": {
    "id": "freud",
    "name": "Sigmund Freud",
    "dates": "1856 – 1939",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Psikanaliz",
    "school": "Psikanaliz & Derinlik Psikolojisi",
    "city": "Freiberg / Viyana / Londra",
    "quote": "Bilinçdışı, ruhsal yaşamın asıl gerçekliğidir; bilinç ise onun yalnızca küçük bir yüzeyidir.",
    "summary": "Psikanalizin kurucusu. İnsan davranışlarının rasyonel bilinçten ziyade bastırılmış arzular, dürtüler ve bilinçdışı süreçlerle şekillendiğini göstererek modern özne anlayışını sarstı.",
    "concepts": [
      "Bilinçdışı (Unconscious)",
      "İd, Ego ve Süperego",
      "Bastırma ve Savunma Mekanizmaları",
      "Yaşam (Eros) ve Ölüm (Thanatos) Dürtüleri"
    ],
    "works": [
      "Düşlerin Yorumu",
      "Uygarlığın Huzursuzluğu",
      "Totem ve Tabu",
      "Haz İlkesinin Ötesinde"
    ]
  },
  "carnap": {
    "id": "carnap",
    "name": "Rudolf Carnap",
    "dates": "1891 – 1970",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Analitik Felsefe",
    "school": "Mantıksal Pozitivizm (Viyana Çevresi)",
    "city": "Ronsdorf, Almanya / Viyana / Chicago",
    "quote": "Metafizikçiler müzik yeteneği olmayan müzisyenlerdir; bilgi üretmez, yalnızca yaşam duygusunu dışavururlar.",
    "summary": "Viyana Çevresi'nin önde gelen düşünürü. Bilimsel dilin mantıksal analizi yoluyla geleneksel metafiziğin anlamsızlığını göstermeye çalışmış, doğrulanabilirlik ve mantıksal sözdizimini geliştirmiştir.",
    "concepts": [
      "Doğrulanabilirlik İlkesi",
      "Mantıksal Sözdizimi",
      "Metafiziğin Aşılması",
      "Hoşgörü İlkesi"
    ],
    "works": [
      "Dünyanın Mantıksal Kuruluşu (Der logische Aufbau der Welt)",
      "Dilin Mantıksal Sözdizimi",
      "Anlam ve Zorunluluk"
    ]
  },
  "gadamer": {
    "id": "gadamer",
    "name": "Hans-Georg Gadamer",
    "dates": "1900 – 2002",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Kıta Felsefesi",
    "school": "Felsefi Hermeneutik (Yorumbilim)",
    "city": "Marburg / Heidelberg, Almanya",
    "quote": "Anlaşılabilecek olan varlık, dildir. Anlama her zaman ufukların kaynaşmasıdır.",
    "summary": "Modern felsefi hermeneutiğin kurucusudur. Anlamanın nesnel bir yöntemden ibaret olmadığını, tarihsel önyargılarımız ve geleneğimizle kurulan diyalog ('ufukların kaynaşması') olduğunu savunmuştur.",
    "concepts": [
      "Ufukların Kaynaşması (Horizontverschmelzung)",
      "Tarihsel Etkili Bilinç",
      "Önyargıların Rehabilitasyonu",
      "Oyun ve Diyalog Olarak Sanat"
    ],
    "works": [
      "Hakikat ve Yöntem (Wahrheit und Methode)",
      "Güzelin Güncelliği"
    ]
  },
  "arendt": {
    "id": "arendt",
    "name": "Hannah Arendt",
    "dates": "1906 – 1975",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Siyaset Felsefesi",
    "school": "Cumhuriyetçi Siyaset Teorisi & Fenomenoloji",
    "city": "Hannover / Marburg / New York",
    "quote": "Kötülüğün en büyük trajedisi fanatiklerden değil, düşünmeyi bırakan sıradan insanlardan doğmasıdır.",
    "summary": "20. yüzyılın en etkili siyaset düşünürlerinden biri. Totalitarizmin kökenlerini, kamusal alanda eylem özgürlüğünü (Vita Activa) ve 'Kötülüğün Sıradanlığı' kavramını derinlemesine analiz etmiştir.",
    "concepts": [
      "Kötülüğün Sıradanlığı (Banality of Evil)",
      "Vita Activa (Emek, İş, Eylem)",
      "Totalitarizm Analizi",
      "Doğumsallık (Natality) ve Kamusal Alan"
    ],
    "works": [
      "Totalitarizmin Kaynakları",
      "İnsanlık Durumu (The Human Condition)",
      "Kötülüğün Sıradanlığı: Eichmann Kudüs'te",
      "Zihnin Yaşamı"
    ]
  },
  "merleauponty": {
    "id": "merleauponty",
    "name": "Maurice Merleau-Ponty",
    "dates": "1908 – 1961",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Kıta Felsefesi",
    "school": "Beden Fenomenolojisi & Varoluşçuluk",
    "city": "Rochefort-sur-Mer / Paris, Fransa",
    "quote": "Bedenimiz dünyada olma aracımızdır; algı, zihinsel bir yargı değil bedensel bir yönelimdir.",
    "summary": "Kartezyen zihin-beden ayrımını aşarak algının merkezine 'yaşayan bedeni' (corps propre) yerleştiren Fransız fenomenolog. Görünür ile görünmez arasındaki ten (chair) ontolojisini kurmuştur.",
    "concepts": [
      "Bedensel Özne (Corps Propre)",
      "Algının Önceliği",
      "Ten (Chair) Ontolojisi",
      "Dünyada-Var-Olma"
    ],
    "works": [
      "Algının Fenomenolojisi",
      "Görünür ve Görünmez",
      "Göz ve Tin"
    ]
  },
  "fanon": {
    "id": "fanon",
    "name": "Frantz Fanon",
    "dates": "1925 – 1961",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Post-Kolonyal Düşünce",
    "school": "Post-Kolonyal Teori & Varoluşçu Hümanizm",
    "city": "Fort-de-France, Martinik / Cezayir",
    "quote": "Ey bedenim, beni her zaman soru soran bir insan yap!",
    "summary": "Psikiyatrist ve devrimci düşünür. Hegelci tanınma diyalektiğini, psikanalizi ve Sartre varoluşçuluğunu kullanarak sömürgeciliğin ezilen halklar üzerindeki ruhsal ve siyasal yıkımını çözümlemiştir.",
    "concepts": [
      "Sömürgesizleşme (Dekolonizasyon)",
      "Sömürgeci Yabancılaşma",
      "Tanınma Mücadelesi",
      "Yeni Hümanizm"
    ],
    "works": [
      "Yeryüzünün Lanetlileri",
      "Siyah Deri, Beyaz Maskeler"
    ]
  },
  "canguilhem": {
    "id": "canguilhem",
    "name": "Georges Canguilhem",
    "dates": "1904 – 1995",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Bilim Felsefesi",
    "school": "Fransız Tarihsel Epistemolojisi",
    "city": "Castelnaudary / Paris, Fransa",
    "quote": "Normal ile patolojik arasındaki sınır istatistiksel bir ortalama değil, canlının yeni normlar yaratabilme gücüdür.",
    "summary": "Biyoloji ve tıp felsefesinin öncüsü, Foucault'nun hocası. Sağlık ve hastalık kavramlarının salt mekanik-istatistiksel değil, normatif ve tarihsel süreçler olduğunu kanıtlamıştır.",
    "concepts": [
      "Biyolojik Normativite",
      "Normal ve Patolojik Ayrımı",
      "Tarihsel Epistemoloji",
      "Yaşam Bilimleri Tarihi"
    ],
    "works": [
      "Normal ve Patolojik",
      "Yaşam Bilgisi"
    ]
  },
  "deleuze": {
    "id": "deleuze",
    "name": "Gilles Deleuze",
    "dates": "1925 – 1995",
    "era": "20yy",
    "eraName": "20. Yüzyıl & Post-Yapısalcılık",
    "school": "Fark Felsefesi & İçkinlik Metafiziği",
    "city": "Paris, Fransa",
    "quote": "Felsefe, kavramlar icat etme, yaratma sanatıdır.",
    "summary": "Spinoza, Nietzsche ve Bergson'dan beslenerek özdeşlik yerine saf 'Fark'ı ve 'Oluş'u merkeze alan çağdaş filozof. Köksap (rizom), göçebe düşünce ve arzu üretimi kavramlarıyla çığır açmıştır.",
    "concepts": [
      "Fark ve Tekrar",
      "Köksap (Rhizome)",
      "Saf İçkinlik Düzlemi",
      "Organsız Beden & Arzu Makinesi"
    ],
    "works": [
      "Fark ve Tekrar",
      "Kapitalizm ve Şizofreni (Anti-Ödipus & Bin Yayla)",
      "Felsefe Nedir?",
      "Anlamın Mantığı"
    ]
  }
});
