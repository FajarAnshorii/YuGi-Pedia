'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { BookOpen, Compass, ShieldAlert, Swords, Heart, User, ChevronRight, Search, Sparkles, BookOpenCheck, RotateCcw, Globe } from 'lucide-react'

// 8 EXHAUSTIVE, PREMIUM DETAILED SAGAS OF YUGIOH UNIVERSE
const STORY_SAGAS = [
  {
    id: 'blue-eyes',
    title: 'Kisah Altar Naga Biru (Blue-Eyes White Dragon Saga)',
    era: 'Era Mesir Kuno & Kaiba Corp',
    description: 'Kisah spiritual persahabatan suci antara Pendeta Seto dan gadis misterius pemilik jiwa naga putih, Kisara, yang melahirkan legenda Blue-Eyes White Dragon.',
    content: `Kisah bermula ribuan tahun lalu di padang pasir Mesir Kuno di bawah pimpinan Firaun Atem. Pendeta Agung Seto, salah satu pelindung tahta, menemukan seorang gadis budak asing bernama Kisara yang memiliki stamina spiritual luar biasa. Di dalam jiwanya, bersemayam kekuatan naga putih bermata biru yang sakral.

Ketika penjahat bayangan Akhenaden merencanakan pemberontakan, ia berusaha merenggut roh naga putih dari tubuh Kisara demi memberikan kekuatan absolut kepada anaknya, Seto. Namun, Kisara mengorbankan dirinya demi melindungi Seto, mengalirkan seluruh kekuatan jiwanya ke dalam batu obsidian suci.

Setelah kematian Kisara, jiwa naga putih itu menyatu sepenuhnya dengan hasrat pelindung Pendeta Seto. Naga legendaris tersebut, Blue-Eyes White Dragon, bangkit untuk melumat kekuatan kegelapan, melambangkan keindahan suci, kemurnian mutlak, serta loyalitas abadi yang menembus waktu hingga era modern sebagai simbol kejayaan Seto Kaiba.`,
    icon: '🐉',
    characters: [
      { passcode: '89631139', name: 'Blue-Eyes White Dragon', role: 'Naga Putih Legendaris / Jiwa Kisara' },
      { passcode: '34710660', name: 'Maiden with Eyes of Blue', role: 'Kisara / Gadis Berjiwa Naga' },
      { passcode: '38517737', name: 'Blue-Eyes Alternative White Dragon', role: 'Evolusi Energi Destruktif Naga' },
      { passcode: '55410864', name: 'Blue-Eyes Chaos MAX Dragon', role: 'Wujud Ritual Kekuatan Penghancur' }
    ]
  },
  {
    id: 'dark-magician',
    title: 'Kisah Penyihir Hitam Agung (Dark Magician Legend)',
    era: 'Era Aliansi Penyihir Kerajaan',
    description: 'Pengorbanan agung Mahad, pendeta suci Firaun, yang merelakan raga jasmaninya untuk menyatu dengan roh ilusi sihir demi menjadi pelindung abadi sebagai Dark Magician.',
    content: `Dalam koridor sejarah istana Mesir Kuno, Mahad adalah salah satu dari enam pendeta suci penjaga milenium. Menguasai sihir hitam tingkat tinggi, Mahad mendedikasikan hidupnya demi keselamatan Firaun Atem.

Saat ancaman pencuri makam terkuat Bakura merangsek ke dalam istana, Mahad menghadapi pertempuran mematikan di dalam makam kuno. Menyadari kekuatan sihir kegelapan Bakura terlalu besar untuk dihadapi dengan fisik manusia biasa, Mahad melancarkan mantra pengorbanan terlarang. Ia meleburkan tubuh jasmaninya, menyatukan roh sejatinya dengan patung ilusi sihir hitam miliknya.

Dari perpaduan mistis tersebut, lahirlah "Dark Magician" (Penyihir Hitam Agung) — pejuang gaib abadi yang kebal terhadap maut. Ditemani oleh murid setianya, Dark Magician Girl, mereka berdua berdiri di garis terdepan sebagai perisai magis terkuat yang setia mendampingi sang Firaun melintasi alam baka hingga dunia modern.`,
    icon: '🧙‍♂️',
    characters: [
      { passcode: '46986414', name: 'Dark Magician', role: 'Penyihir Hitam Agung / Jiwa Mahad' },
      { passcode: '03078576', name: 'Dark Magician Girl', role: 'Murid Setia / Penyihir Harapan' },
      { passcode: '30208479', name: 'Magician of Black Chaos', role: 'Wujud Ritual Kekuatan Kosmis' },
      { passcode: '98502113', name: 'Dark Paladin', role: 'Fusi Sempurna Pembasmi Naga' }
    ]
  },
  {
    id: 'egyptian-gods',
    title: 'Kisah Kebangkitan Tiga Dewa Mesir (The Egyptian Gods)',
    era: 'Era Dewa-Dewa Kuno',
    description: 'Tiga entitas dewa tertinggi penyeimbang kosmos yang dipahat pada batu obsidian suci oleh Pendeta Agung Akhnamkanon untuk mengamankan kemakmuran dinasti.',
    content: `Tiga Dewa Mesir—Slifer the Sky Dragon, Obelisk the Tormentor, dan The Winged Dragon of Ra—merupakan manifestasi murni dari elemen semesta: Langit, Bumi, dan Matahari. Kekuatan mereka begitu dahsyat sehingga tidak ada satu pun duelis biasa yang mampu memanggil mereka tanpa menderita kerusakan mental yang fatal.

Slifer, sang dewa ular langit merah, menguasai badai petir kosmis, menguras kekuatan setiap musuh yang berani memandangnya. Obelisk, raksasa biru penghancur, mewakili kemurkaan bumi tak terbatas yang sanggup meratakan pegunungan dengan kepalan tangannya. Dan Ra, burung emas matahari abadi, menguasai siklus kelahiran kembali, menyerap energi kehidupan sang pemanggil untuk diubah menjadi api murni.

Ketiga dewa ini dipahat pada lempengan batu legendaris demi menyegel kekuatan luar biasa yang dapat menghancurkan dunia jika jatuh ke tangan yang salah. Hanya sang Firaun sejati yang memiliki hak spiritual penuh untuk memerintah ketiga entitas tertinggi ini di medan laga.`,
    icon: '🔱',
    characters: [
      { passcode: '27354274', name: 'Slifer the Sky Dragon', role: 'Dewa Langit / Badai Merah' },
      { passcode: '14315573', name: 'Obelisk the Tormentor', role: 'Dewa Raksasa Penghancur Bumi' },
      { passcode: '64202336', name: 'The Winged Dragon of Ra', role: 'Dewa Matahari Emas / Phoenix' }
    ]
  },
  {
    id: 'exodia-forbidden',
    title: 'Kisah Terlarang Exodia (Exodia the Forbidden One)',
    era: 'Era Penjara Dewa Kuno',
    description: 'Entitas suci berkekuatan tak terbatas penjaga lembah raja yang kekuatannya terlalu mengerikan sehingga harus disegel menjadi lima rantai terpisah.',
    content: `Jauh sebelum istana Firaun didirikan, terdapat sesosok dewa penjaga raksasa bernama Exodia yang melindungi tanah suci dari serbuan tentara kegelapan. Kekuatan magis Exodia begitu masif dan tak terkendali hingga mampu memusnahkan seluruh armada militer hanya dengan satu jentikan jari.

Khawatir kekuatan dewa ini akan disalahgunakan atau merobek jalinan ruang dimensi, para penyihir agung Mesir bersatu untuk merapalkan mantra penyegel rantai emas abadi. Tubuh Exodia dipotong menjadi lima bagian terpisah: kepala, tangan kanan-kiri, dan kaki kanan-kiri, yang masing-masing dikunci dengan rantai besi mantra suci dan disembunyikan di kuil yang berbeda.

Legenda menyebutkan, jika ada seorang duelis yang mampu mengumpulkan kelima kepingan jiwa terlarang tersebut ke dalam genggamannya, segel magis akan pecah seketika. Exodia akan bangkit kembali dalam wujud utuh, menghancurkan musuh dalam sekejap tanpa mempedulikan aturan pertarungan apa pun.`,
    icon: '⛓️',
    characters: [
      { passcode: '33396948', name: 'Exodia the Forbidden One', role: 'Jiwa Utama / Kepala Tersegel' },
      { passcode: '07902349', name: 'Left Arm of the Forbidden One', role: 'Kepingan Segel Lengan Kiri' },
      { passcode: '70903634', name: 'Right Arm of the Forbidden One', role: 'Kepingan Segel Lengan Kanan' },
      { passcode: '44519536', name: 'Left Leg of the Forbidden One', role: 'Kepingan Segel Kaki Kiri' },
      { passcode: '08124921', name: 'Right Leg of the Forbidden One', role: 'Kepingan Segel Kaki Kanan' }
    ]
  },
  {
    id: 'branded-albaz',
    title: 'Kisah Fallen of Albaz & Ecclesia (Branded Saga)',
    era: 'Era Modern (Abyss World)',
    description: 'Sebuah dongeng epik tentang takdir, pengkhianatan, dan persahabatan di benua Dogmatika. Ketika seorang pemuda naga misterius berpasangan dengan gadis suci buangan.',
    content: `Kisah bermula di negara teokrasi Dogmatika Nation, sebuah sekte keagamaan ekstrem yang memuja Stigmata surga. Ecclesia, gadis berhati suci terpilih, dikirim ke perbatasan untuk menumpas makhluk penyerang dimensi yang bernama "Fallen of Albaz". Ketika melihat pemuda terluka itu tak berdaya, Ecclesia menolak untuk mengeksekusinya. 

Karena tindakannya, mereka berdua dituduh sebagai pengkhianat dan diburu oleh sekte raksasa pimpinan Maximus. Dalam pelariannya, Albaz & Ecclesia berteman dengan kelompok gerilyawan tangguh "Tri-Brigade" dan suku petualang gurun pasir "Springans".

Namun, Maximus melancarkan rencana jahatnya, merekrut Aluber (pemuda iblis berwajah sama dengan Albaz) untuk mengubah para menteri suci menjadi Despia Monster. Pertempuran memuncak saat Albaz melepaskan energi Fusion terlarang miliknya, memanggil wujud naga legendaris "Mirrorjade the Iceblade Dragon" untuk mengakhiri tirani sekte Despia dan memulihkan kedamaian benua.`,
    icon: '🔮',
    characters: [
      { passcode: '09726102', name: 'Fallen of Albaz', role: 'Protagonis / Naga Misterius' },
      { passcode: '46845155', name: 'Incredible Ecclesia', role: 'Gadis Suci / Ksatria Pelindung' },
      { passcode: '28150175', name: 'Aluber the Boyster of Despia', role: 'Antagonis / Pembuat Kekacauan' },
      { passcode: '40653303', name: 'Mirrorjade Iceblade Dragon', role: 'Bentuk Naga Terkuat Albaz' }
    ]
  },
  {
    id: 'sky-striker',
    title: 'Kisah Gadis Sayap Baja (Sky Striker Ace - Raye)',
    era: 'Era Perang Futuristik (Coded Arms)',
    description: 'Perjuangan Raye, seorang gadis remaja terakhir pahlawan kemanusiaan yang mengemudikan armor mekanis berteknologi tinggi untuk melawan invasi AI militer.',
    content: `Di bumi masa depan yang hancur karena invasi robotik dari kekaisaran AI "Surgical Striker", seluruh umat manusia terdesak hingga ke ambang kepunahan. Raye adalah anak manusia terakhir yang dilahirkan di laboratorium bawah tanah, dibesarkan untuk menguasai sistem "Sky Striker" yang legendaris.

Sistem militer tercanggih ini memungkinkan Raye untuk memanggil armor pertempuran modular secara instan dari satelit orbit bumi. Dengan pedang energi Kagari, meriam taktis Shizuku, dan pertahanan badai Hayate, Raye bertarung sendirian menembus jutaan barisan drone besi.

Konflik memuncak ketika AI meluncurkan klon tandingan yang tak kalah tangguh bernama Roze. Di tengah puing kota yang hancur, kedua gadis ber-armor sayap baja ini saling beradu pedang demi menentukan masa depan bumi, memadukan emosi manusia dan presisi baja dingin dalam simfoni pertempuran udara yang dramatis.`,
    icon: '🚀',
    characters: [
      { passcode: '26077387', name: 'Sky Striker Ace - Raye', role: 'Harapan Manusia Terakhir / Pilot Utama' },
      { passcode: '01023812', name: 'Sky Striker Ace - Roze', role: 'Klon Militer AI / Rival Utama' },
      { passcode: '90673244', name: 'Sky Striker Ace - Shizuku', role: 'Armor Taktis Meriam Es' },
      { passcode: '52428256', name: 'Sky Striker Ace - Kagari', role: 'Armor Taktis Pedang Bara Api' }
    ]
  },
  {
    id: 'visas-starfrost',
    title: 'Kisah Menembus Kosmos (Visas Starfrost Odyssey)',
    era: 'Era Multi-Dimensi (New World)',
    description: 'Perjalanan Visas Starfrost menembus berbagai dimensi emosi untuk menyatukan kembali serpihan jiwanya yang terbelah menjadi berbagai faksi archetypes legendaris.',
    content: `Visas Starfrost adalah seorang petualang kosmis bertangan perak misterius yang terbangun tanpa ingatan di ruang hampa semesta. Jiwanya yang sejati telah terbagi menjadi empat emosi dasar yang tersebar di planet-planet raksasa: Ketakutan (Scareclaw), Kesedihan (Tearlaments), Kemarahan (Kashtira), dan Kegembiraan (Manadome).

Di dunia rimba primitif, ia menghadapi serbuan kawanan serigala Scareclaw pimpinan Tri-Heart. Di samudra air mata kosmik, ia bersekutu dengan para putri duyung Tearlaments untuk mencegah kepunahan karang ajaib mereka dari ancaman invasi klan robot Kashtira merah menyala.

Setiap kali Visas mengalahkan wujud emosi tersebut, ia menyerap kembali pecahan jiwanya, meningkatkan kekuatan spiritual tangan peraknya. Perjalanannya melambangkan perjuangan mental manusia dalam menerima dan menyatukan seluruh aspek emosional diri demi mencapai keselarasan kosmis tertinggi.`,
    icon: '🪐',
    characters: [
      { passcode: '56099748', name: 'Visas Starfrost', role: 'Petualang Kosmis / Jiwa Orisinil' },
      { passcode: '85272639', name: 'Scareclaw Tri-Heart', role: 'Manifestasi Rasa Takut / Raja Rimba' },
      { passcode: '52038441', name: 'Tearlaments Kaleido-Heart', role: 'Manifestasi Kesedihan / Raja Samudra' },
      { passcode: '02036627', name: 'Kashtira Arise-Heart', role: 'Manifestasi Kemarahan / Kaisar Besi' }
    ]
  },
  {
    id: 'world-legacy',
    title: 'Kisah Pusaka Dunia (World Legacy Quest)',
    era: 'Era Menengah (Mekk-Knights & Orcust)',
    description: 'Petualangan tujuh pusaka suci yang memicu perang berskala global antara Mekk-Knights, Krawlers, dan Orcust, yang bermuara pada kepunahan planet.',
    content: `Di dunia yang hancur karena peperangan sisa-sisa peradaban teknologi kuno, Auram bersama kekasihnya Ib, dan sahabatnya Ningirsu, melakukan misi pencarian pusaka suci "World Legacy". Namun, pergerakan mereka diserang oleh kawanan mesin serangga parasit berkepala mata satu yang disebut "Krawlers".

Misi penyelamatan semakin sulit ketika tujuh raksasa mekanik "Mekk-Knights" menangkap Ib demi mencegah kehancuran takdir kuno. Ningirsu yang dilanda keputusasaan mendesain menara menara mesin kegelapan "Orcust" untuk meretas inti bumi demi membangkitkan arwah adik perempuannya yang gugur.

Auram harus memimpin aliansi prajurit "Crusadia" dalam perang suci klimaks untuk merebut pusaka terakhir, menggabungkan energi suci pusaka dunia untuk bertransisi menjadi wujud dewa kosmik suci "Avramax" demi merestorasi ekosistem bumi yang hancur.`,
    icon: '⚔️',
    characters: [
      { passcode: '54763131', name: 'Mekk-Knight Crusadia Avramax', role: 'Dewa Penyelamat Bumi' },
      { passcode: '14558127', name: 'Ib the World Chalice Justiciar', role: 'Gadis Penjaga Pusaka' },
      { passcode: '92110255', name: 'Galatea the Orcust Automaton', role: 'Boneka Mekanik Adik Ningirsu' }
    ]
  }
]

// POPULAR CARDS IN OUR STORY ENGINE
const POPULAR_LORE_SUGGESTIONS = [
  'Blue-Eyes White Dragon',
  'Dark Magician',
  'Exodia the Forbidden One',
  'Slifer the Sky Dragon',
  'Obelisk the Tormentor',
  'The Winged Dragon of Ra',
  'Red-Eyes Black Dragon',
  'Kuriboh',
  'Stardust Dragon',
  'Cyber Dragon'
]

// HAND-CRAFTED CARD BACKSTORY REGISTRY FOR DYNAMIC EXPLORER
const HANDCRAFTED_CARD_LORE: Record<string, string> = {
  'blue-eyes white dragon': `Naga putih legendaris pelindung kuil kuno Mesir yang merupakan penjelmaan roh suci dari gadis berambut perak bernama Kisara. Memiliki kekuatan destruktif murni yang setara dengan semburan energi kosmik, naga ini melambangkan loyalitas spiritual mutlak terhadap takdir Pendeta Agung Seto. Di era modern, naga ini berevolusi menjadi simbol prestise tertinggi dari Seto Kaiba, melambangkan kekuasaan, kemenangan absolut, serta kekuatan naga tanpa tanding yang tak tertembus oleh debu waktu.`,
  'dark magician': `Penyihir hitam legendaris dan pelindung terkuat dari tahta Firaun Atem. Ribuan tahun lalu, Pendeta Agung Mahad mengorbankan tubuh jasmaninya demi menyatukan jiwanya dengan patung ilusi sihir hitam untuk menahan gempuran iblis kegelapan Diabound. Jiwa Mahad yang abadi kini hidup di dalam baju zirah gelap penyihir ini, menguasai mantra-mantra sihir hitam tingkat kosmis dan bertempur sebagai pelindung sejati melintasi berbagai reinkarnasi takdir manusia.`,
  'dark magician girl': `Penyihir wanita muda yang penuh harapan, murid langsung dari Dark Magician. Dia mewarisi kekuatan sihir hitam legendaris peninggalan gurunya, Mahad, dan memadukannya dengan kekuatan sihir pemulihan cahaya. Kehadirannya di medan laga melambangkan kesetiaan, persahabatan sejati, dan cahaya harapan yang mampu menembus kabut sihir hitam paling kelam sekalipun.`,
  'red-eyes black dragon': `Naga hitam berapi yang membawa potensi kehancuran tanpa batas. Berbeda dengan Blue-Eyes White Dragon yang membawa kemenangan mutlak seketika, Red-Eyes melambangkan potensi tanpa batas untuk berkembang melampaui batas takdir melalui tekad perjuangan dan kemarahan duelis sejati. Siapa pun duelis yang berhasil menjinakkan api naga hitam ini akan dianugerahi kekuatan evolusi ekstrem yang sanggup meruntuhkan tembok pertahanan dewa sekalipun.`,
  'exodia the forbidden one': `Entitas dewa berkekuatan mutlak yang disegel di dalam lima buah rantai magis kuno di dasar lembah raja Mesir Kuno. Kekuatan Exodia begitu mengerikan sehingga para pendeta membagi jiwanya menjadi lima kepingan terpisah demi mencegah robeknya batas dimensi bumi. Ketika seluruh lima kepingan (kepala, tangan kanan-kiri, dan kaki kanan-kiri) berhasil dikumpulkan oleh satu jiwa duelis sejati, rantai takdir akan hancur lebur seketika, mendatangkan kemenangan mutlak otomatis yang tak dapat diganggu gugat oleh sihir apa pun.`,
  'slifer the sky dragon': `Dewa ular langit merah yang menguasai badai petir kosmik dan petir pembalasan. Bersemayam di atas awan badai Mesir Kuno, Slifer bangkit dari sambaran petir milenium untuk menghukum siapa pun yang berani mengancam kedamaian tahta Firaun. Setiap musuh yang memasuki medannya akan dihantam petir pelemah jiwa yang mengurangi daya hidup mereka secara instan, melambangkan keadilan langit yang dingin dan tak kenal ampun.`,
  'obelisk the tormentor': `Dewa tentara raksasa penghancur bumi berwajah biru obsidian pekat. Obelisk mewakili kekuatan fisik tak terbatas dari kerak bumi terdalam. Dengan mengorbankan dua sekutu spiritual di medan tempur, Obelisk mampu mengaktifkan "Tinju Jiwa Kemurkaan" yang menghasilkan daya serang tak terbatas, meratakan seluruh barisan pertahanan musuh berkeping-keping dalam satu hantaman gelombang gempa kosmis.`,
  'the winged dragon of ra': `Dewa matahari bersayap emas abadi yang bangkit dari abu suci burung Phoenix emas. Merupakan dewa tertinggi dari ketiga Dewa Mesir, kekuatan sejati Ra hanya dapat dikuasai oleh mereka yang mampu melafalkan mantra hieroglif kuno secara fasih. Ra menyatu dengan jiwa sang pemanggil, menyerap seluruh titik daya hidup mereka untuk diubah menjadi api bara surya yang melumat seluruh isi medan laga menjadi tumpukan abu debu sejarah.`,
  'kuriboh': `Meskipun berukuran kecil, rapuh, dan berbulu lebat, Kuriboh membawa berkat perlindungan suci yang tak terhingga bagi pemiliknya. Makhluk astral ini memiliki tekad kepahlawanan yang luar biasa, dengan berani melompat ke hadapan serangan dewa paling destruktif sekalipun untuk meledakkan dirinya sendiri sebagai pelindung energi kehidupan sang duelis. Keberanian Kuriboh membuktikan bahwa ketulusan tekad mampu membatalkan takdir kehancuran sebesar apa pun.`,
  'stardust dragon': `Naga kosmik penyelamat rasi bintang pelindung kedamaian Neo Domino City. Stardust Dragon melambangkan pengorbanan suci yang agung; ia rela meledakkan dirinya menjadi debu bintang yang berkilauan demi menangkal mantra kehancuran massal lawan. Ketika pertempuran mereda di akhir giliran, debu bintang tersebut akan menyatu kembali di angkasa, melahirkan kembali sang naga pelindung kosmos dengan kemegahan yang tak pernah pudar.`,
  'cyber dragon': `Naga mesin futuristik yang ditempa dari baja paduan cybernetic tingkat tinggi di laboratorium militer masa depan. Cyber Dragon dirancang sebagai mesin agresi absolut yang memanfaatkan energi musuh untuk memanggil kawanannya sendiri dari sirkuit dimensi. Menguasai taktik serangan kilat, naga baja ini mampu bergabung dengan sesamanya untuk membentuk Cyber End Dragon, mesin penghancur tiga kepala berkekuatan 4000 ATK yang sanggup meremukkan jiwa pertahanan musuh berkeping-keping.`
}

export default function LorePage() {
  const [selectedStory, setSelectedStory] = useState(STORY_SAGAS[0])
  
  // Dynamic Card Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSearchedCard, setSelectedSearchedCard] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Fetch live cards matching search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/cards?search=${encodeURIComponent(searchQuery)}&limit=6`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.cards || [])
        }
      } catch (err) {
        console.error('Error fetching cards for lore:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // Helper to generate dynamic or handcrafted lore
  const getCardLore = (card: any) => {
    if (!card) return ''
    const cleanName = card.name.toLowerCase().trim()
    
    // Check handcrafted database first
    if (HANDCRAFTED_CARD_LORE[cleanName]) {
      return HANDCRAFTED_CARD_LORE[cleanName]
    }

    // Try fuzzy match in handcrafted database
    for (const key of Object.keys(HANDCRAFTED_CARD_LORE)) {
      if (cleanName.includes(key) || key.includes(cleanName)) {
        return HANDCRAFTED_CARD_LORE[key]
      }
    }

    // Fallback: Dynamic Codex Lore Generator Synthesis
    const name = card.name
    const desc = card.description || ''
    const race = card.race?.name || 'Monster'
    const attribute = card.attribute?.name || 'LIGHT'
    const type = card.type?.name || 'Monster'

    if (type.includes('Spell') || type.includes('Magic')) {
      return `Mantra sihir rahasia kuno yang dikenal dalam naskah sihir sebagai "${name}". Kitab sihir mencatat bahwa barang siapa yang melafalkan mantra sakral ini dengan konsentrasi penuh akan mampu memanipulasi getaran energi kosmik untuk ${desc.toLowerCase().replace(/\./g, '') || 'mendominasi jalannya duel dan melipatgandakan kekuatan spiritual sekutu'}. Lambang mantra ini tertulis pada gerbang dimensi sihir agung.`
    }
    
    if (type.includes('Trap')) {
      return `Perangkap taktis rahasia bernama "${name}" yang dipasang di bawah kegelapan medan laga. Dirancang oleh para ahli strategi perang kuno untuk membalikkan alur takdir dalam sekejap ketika musuh melancarkan agresi militer mereka. Saat terpicu, jebakan ini melepaskan rantai energi yang ${desc.toLowerCase().replace(/\./g, '') || 'mengunci pergerakan lawan dan menetralisir bahaya instan'}.`
    }

    return `Dalam babad sejarah Duel Monsters, "${name}" merupakan sesosok entitas sakral ber-atribut ${attribute} dari klan ${race}. Legenda menceritakan bahwa makhluk ini dibentuk dari kristalisasi energi murni alam semesta. 
    
    Di medan laga, kekuatan serangnya yang masif mencapai ${card.attack ?? '?' } ATK dan pertahanannya sebesar ${card.defense ?? '?'} DEF menjadikannya salah satu petarung yang sangat disegani kawan maupun lawan. 
    
    Naskah kuno menguraikan jati dirinya: "${desc || 'Memiliki kekuatan spiritual misterius yang luar biasa, bersemayam di kuil-kuil dimensi kosmik terjauh.'}"`
  }

  // Handle click recommendation card
  const handleSelectSuggestion = async (name: string) => {
    setSearchQuery(name)
    setIsSearching(true)
    setShowDropdown(false)
    try {
      const response = await fetch(`/api/cards?search=${encodeURIComponent(name)}&limit=24`)
      if (response.ok) {
        const data = await response.json()
        if (data.cards && data.cards.length > 0) {
          const exactCard = data.cards.find((c: any) => c.name.toLowerCase() === name.toLowerCase()) || data.cards[0]
          setSelectedSearchedCard(exactCard)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-250">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full">
            Mitologi & Sejarah Kartu
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase mt-4 mb-2 tracking-wider yugioh-glow-text">
            📖 Card Lore & Story Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Jelajahi kisah fantasi epik, sejarah legendaris, dan rahasia kuno di balik ilustrasi seni lukis kartu Yu-Gi-Oh! favorit Anda.
          </p>
        </div>

        {/* SECTION 1: INTERACTIVE LORE SEARCH & WEAVER ENGINE */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-yellow-500/20 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative overflow-hidden">
          {/* Subtle magical glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-800/60 relative z-10">
            <div className="space-y-1.5">
              <span className="text-yellow-400 font-extrabold text-[10px] tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles size={12} className="animate-pulse" />
                <span>Teknologi Lore Codex</span>
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-wider">
                Cari Kisah Kartu Anda Sendiri
              </h2>
              <p className="text-xs text-gray-400 max-w-xl">
                Masukkan nama kartu Yu-Gi-Oh! pilihan Anda di bawah ini. Mesin kami akan melacak data kuil kosmik untuk membongkar sejarah spiritualnya secara instan!
              </p>
            </div>

            {/* Suggested Tags list */}
            <div className="flex flex-wrap gap-1.5 max-w-md md:justify-end">
              {POPULAR_LORE_SUGGESTIONS.slice(0, 5).map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelectSuggestion(name)}
                  className="text-[10px] font-bold text-gray-400 bg-slate-850 hover:bg-yellow-500/10 hover:text-yellow-400 border border-slate-800 hover:border-yellow-500/30 px-2.5 py-1 rounded-lg transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Input Bar & Search results list (Col 4) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Ketik nama kartu (misal: Blue-Eyes, Dark Magician, Red-Eyes)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-yellow-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition shadow-inner"
                />
                
                {/* Autocomplete dropdown list */}
                {showDropdown && searchQuery && (
                  <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-850">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-dashed border-yellow-400 rounded-full animate-spin"></div>
                        <span>Mencari di gulungan sejarah...</span>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-400">
                        Tidak ada kartu yang ditemukan. Coba nama lain!
                      </div>
                    ) : (
                      searchResults.map((card) => (
                        <div
                          key={card.id}
                          onClick={() => {
                            setSelectedSearchedCard(card)
                            setShowDropdown(false)
                          }}
                          className="px-4 py-3 hover:bg-slate-850 cursor-pointer flex items-center gap-3 transition"
                        >
                          <div className="w-6 h-9 bg-slate-950 rounded overflow-hidden flex-shrink-0 border border-slate-800">
                            <img
                              src={
                                card.imageUrl || (card.passcode
                                  ? `https://images.ygoprodeck.com/images/cards/${card.passcode}.jpg`
                                  : `https://via.placeholder.com/50x70/1e293b/ffd700?text=YGO`)
                              }
                              alt={card.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/50x70/1e293b/ffd700?text=YGO`
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{card.name}</p>
                            <p className="text-[10px] text-yellow-500/80 uppercase font-extrabold tracking-wider mt-0.5">
                              {card.type?.name || 'Card'} • ID: {card.passcode || card.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Reset layout buttons */}
              {selectedSearchedCard && (
                <button
                  onClick={() => {
                    setSelectedSearchedCard(null)
                    setSearchQuery('')
                  }}
                  className="w-full bg-slate-850 hover:bg-slate-800 border border-slate-800 text-gray-300 font-extrabold text-xs uppercase py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <RotateCcw size={13} />
                  <span>Bersihkan Pencarian</span>
                </button>
              )}
            </div>

            {/* Displaying dynamically woven Lore Card (Col 7) */}
            <div className="lg:col-span-7">
              {selectedSearchedCard ? (
                <div className="bg-slate-900/60 border border-yellow-500/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden">
                  {/* Backdrop glowing dust */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-500/5 rounded-full blur-2xl"></div>
                  
                  {/* Card Image frame */}
                  <div className="w-28 h-40 bg-slate-950 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 relative border border-slate-800 mx-auto sm:mx-0">
                    <img
                      src={
                        selectedSearchedCard.imageUrl
                          || (selectedSearchedCard.passcode
                            ? `https://images.ygoprodeck.com/images/cards/${selectedSearchedCard.passcode}.jpg`
                            : `https://via.placeholder.com/400x560/1e293b/ffd700?text=YGO`)
                      }
                      alt={selectedSearchedCard.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.currentTarget
                        if (!t.dataset.f && selectedSearchedCard.passcode) {
                          t.dataset.f = '1'
                          t.src = `https://images.ygoprodeck.com/images/cards/${selectedSearchedCard.passcode}.jpg`
                        } else {
                          t.src = `https://via.placeholder.com/400x560/1e293b/ffd700?text=YGO`
                        }
                      }}
                    />
                  </div>

                  {/* Lore textual block */}
                  <div className="space-y-3.5 flex-grow min-w-0">
                    <div>
                      <span className="text-[9px] font-black uppercase bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-yellow-400">
                        {selectedSearchedCard.attribute?.name || 'SPELL/TRAP'}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider mt-1.5 leading-snug">
                        {selectedSearchedCard.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Passcode: {selectedSearchedCard.passcode || selectedSearchedCard.id.slice(0, 8)} • {selectedSearchedCard.type?.name || 'Card'}
                      </p>
                    </div>

                    {/* Codex story body with illuminated paragraph styling */}
                    <p className="text-xs text-gray-300 leading-relaxed font-medium whitespace-pre-line italic bg-slate-950/40 border border-slate-850 p-4 rounded-xl shadow-inner">
                      {getCardLore(selectedSearchedCard)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 rounded-2xl py-12 px-6 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800 text-yellow-500/40">
                    <BookOpenCheck size={20} />
                  </div>
                  <div className="max-w-md">
                    <h4 className="font-extrabold text-sm text-gray-300 uppercase tracking-wider">Coba Cari Kartu Di Atas</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Pilih salah satu rekomendasi cepat di pojok kanan atas, atau ketik nama kartu kesayangan Anda untuk membaca catatan takdirnya di sini!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: CURATED CHRONICLES / SAGAS OF PLANET DUEL TERMINAL & BEYOND */}
        <div className="text-left mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 flex items-center gap-2">
            <Globe size={13} className="text-yellow-500" />
            <span>Kumpulan Saga Kisah Epik Terpopuler</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Sagas Selectors (4 columns) */}
          <div className="lg:col-span-4 space-y-3 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
            {STORY_SAGAS.map((saga) => (
              <div
                key={saga.id}
                onClick={() => setSelectedStory(saga)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 shadow-sm relative overflow-hidden ${
                  selectedStory.id === saga.id
                    ? 'bg-yellow-500/10 border-yellow-500 dark:bg-yellow-500/5'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:border-yellow-500/30'
                }`}
              >
                {/* Visual active indicator bar */}
                {selectedStory.id === saga.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                )}
                
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl filter drop-shadow">{saga.icon}</span>
                  <span className="text-[9px] font-black uppercase text-yellow-600 dark:text-yellow-500">
                    {saga.era}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug mb-1">
                  {saga.title}
                </h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-400 line-clamp-2 mt-1 leading-normal font-medium">
                  {saga.description}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT: Detailed Lore Reader (8 columns) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-850/60 flex items-center gap-3">
              <span className="text-4xl filter drop-shadow">{selectedStory.icon}</span>
              <div>
                <span className="text-[10px] font-black uppercase bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded text-yellow-600 dark:text-yellow-500">
                  {selectedStory.era}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mt-1.5 leading-tight">
                  {selectedStory.title}
                </h2>
              </div>
            </div>

            {/* Cinematic Content Body */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium space-y-4 whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border dark:border-slate-850/50">
              {selectedStory.content}
            </div>

            {/* Linked Key Characters Card Grid */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-850/60 space-y-3.5">
              <h4 className="text-xs font-black uppercase text-slate-400 dark:text-gray-500 tracking-wider flex items-center gap-1.5">
                <User size={13} className="text-yellow-500" />
                <span>Karakter / Kartu Utama Terkait Saga:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {selectedStory.characters.map((char, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-950 border dark:border-slate-850/60 rounded-2xl flex items-center gap-3 hover:border-yellow-500/20 transition-all cursor-pointer group"
                    onClick={() => handleSelectSuggestion(char.name)}
                  >
                    <div className="w-10 h-14 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 relative shadow group-hover:scale-105 transition-transform duration-200">
                      <img 
                        src={`https://images.ygoprodeck.com/images/cards_cropped/${char.passcode}.jpg`} 
                        alt={char.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const target = e.currentTarget
                          // Try alternative URL format
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = '1'
                            target.src = `https://images.ygoprodeck.com/images/cards/${char.passcode}.jpg`
                          } else {
                            target.src = `https://via.placeholder.com/100x140/1e293b/ffd700?text=${char.passcode}`
                          }
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h5 className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-yellow-500 transition">
                        {char.name}
                      </h5>
                      <p className="text-[9px] text-yellow-600 dark:text-yellow-500 mt-0.5 font-bold uppercase tracking-wider">
                        {char.role}
                      </p>
                      <p className="text-[8px] text-gray-400 font-mono mt-0.5">ID: {char.passcode}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
